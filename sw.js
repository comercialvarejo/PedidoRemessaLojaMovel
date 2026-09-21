/* Service worker — Pedido de Reposição / Loja Móvel
   Estratégia:
     · navegação (abrir o app) → rede primeiro, cache como reserva (offline)
     · arquivos do próprio app → cache primeiro, atualizando em segundo plano
     · fontes do Google       → cache com revalidação silenciosa

   Ao publicar uma versão nova do painel, altere VERSAO abaixo
   (ex.: "v2", "v3"...) para que os celulares baixem a atualização.
*/

const VERSAO = 'v2';
const CACHE_APP = `pedido-loja-movel-${VERSAO}`;
const CACHE_RUNTIME = `pedido-loja-movel-runtime-${VERSAO}`;

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

// ---------- instalação: guarda os arquivos do app ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_APP)
      .then((cache) => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

// ---------- ativação: remove caches de versões antigas ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(
        nomes
          .filter((n) => n !== CACHE_APP && n !== CACHE_RUNTIME)
          .map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// ---------- requisições ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const mesmaOrigem = url.origin === self.location.origin;
  const ehFonte = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (!mesmaOrigem && !ehFonte) return;

  // Abrir o app: tenta a rede (pega versão nova), cai para o cache se estiver offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE_APP).then((c) => c.put('./index.html', copia));
          return resp;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true })
          .then((r) => r || caches.match('./')))
    );
    return;
  }

  // Fontes do Google: devolve do cache e atualiza por trás.
  if (ehFonte) {
    event.respondWith(
      caches.open(CACHE_RUNTIME).then((cache) =>
        cache.match(req).then((cacheado) => {
          const rede = fetch(req)
            .then((resp) => {
              if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
              return resp;
            })
            .catch(() => cacheado);
          return cacheado || rede;
        })
      )
    );
    return;
  }

  // Demais arquivos do app: cache primeiro.
  event.respondWith(
    caches.match(req).then((cacheado) => {
      if (cacheado) return cacheado;
      return fetch(req).then((resp) => {
        if (resp && resp.ok && resp.type === 'basic') {
          const copia = resp.clone();
          caches.open(CACHE_APP).then((c) => c.put(req, copia));
        }
        return resp;
      });
    })
  );
});
