# Pedido de Reposição — Loja Móvel

Aplicativo web para o pedido diário de reposição da Loja Móvel (Canção Alimentos).
Funciona no computador e no celular, pode ser instalado na tela inicial e continua
funcionando sem internet.

---

## Como publicar no GitHub

### 1. Criar o repositório

1. No GitHub, clique em **New repository**.
2. Nome sugerido: `pedido-loja-movel`.
3. Deixe **Public** (o GitHub Pages gratuito exige repositório público).
4. Não marque "Add a README file" — o README já está aqui.
5. Clique em **Create repository**.

### 2. Subir os arquivos

Na página do repositório recém-criado, clique em **uploading an existing file**
e arraste **todos** os arquivos e a pasta `icons` inteira. Depois clique em
**Commit changes**.

> A pasta `icons` precisa subir como pasta, com esse nome exato. Se você arrastar os
> PNGs soltos, os ícones do app não vão aparecer. Arrastar a pasta pelo Finder ou
> Explorer já resolve — o GitHub mantém a estrutura.

> O arquivo `.nojekyll` é opcional neste projeto (serve para o GitHub não ignorar
> arquivos com nomes especiais, o que aqui não acontece). Por começar com ponto, ele
> fica oculto no Finder/Explorer. Se não conseguir arrastá-lo, pode deixar de fora
> sem problema, ou criá-lo direto no GitHub: **Add file → Create new file**, nomeie
> `.nojekyll`, deixe vazio e salve.

### 3. Ligar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
4. Aguarde 1–2 minutos. O endereço aparece no topo da página, no formato:

```
https://SEU-USUARIO.github.io/pedido-loja-movel/
```

Pronto — esse é o link para mandar para a equipe.

---

## Como instalar no celular e no computador

O app precisa ser aberto pelo endereço `https://...github.io/...` (não pelo arquivo
salvo no computador) para que a instalação e o modo offline funcionem.

**Android (Chrome)**
Abra o link → toque no botão **Instalar app** no topo da página, ou no menu `⋮` →
**Instalar aplicativo** / **Adicionar à tela inicial**.

**iPhone / iPad (Safari)**
Abra o link no **Safari** → toque no ícone de compartilhar (quadrado com seta para
cima) → **Adicionar à Tela de Início** → **Adicionar**.
*O iOS só instala pelo Safari; pelo Chrome do iPhone não aparece a opção.*

**Computador (Chrome ou Edge)**
Abra o link → clique no ícone de instalar na barra de endereço (um monitor com seta),
ou use o botão **Instalar app** na própria página.

Depois de instalado, o app abre pelo ícone como qualquer outro aplicativo, em janela
própria, sem a barra do navegador.

---

## O que o app faz

- **40 produtos em 6 categorias**, cada um com código e peso padrão por caixa já preenchido
- **Busca rápida** por nome ou código — digite "tilápia", "IQF" ou "COMPRO0000" para filtrar
- **Cálculo automático** de total por item, total de caixas e total em quilos
- **Rascunho salvo sozinho** no aparelho: se fechar sem querer, o pedido está lá ao reabrir
- **Limpar pedido** para começar do zero
- **WhatsApp** gera a planilha `.xlsx` do pedido e abre o WhatsApp para encaminhá-la
- **Enviar** também por e-mail ou copiando o texto pronto
- **Funciona offline** depois da primeira abertura
- **Tema claro e escuro** conforme a configuração do aparelho

O rascunho fica salvo apenas no aparelho de quem digitou. Nada é enviado para servidor
nenhum — o pedido só sai quando a pessoa aperta WhatsApp, E-mail ou Copiar.

### Como funciona o botão WhatsApp

Ele monta a planilha `.xlsx` na hora, dentro do próprio aparelho, e então:

- **No celular** abre a folha de compartilhamento do sistema com o arquivo já anexado.
  Basta escolher WhatsApp e o contato — a planilha vai junto, em um toque.
- **No computador** baixa a planilha e abre o WhatsApp Web com um recado curto
  (data, solicitante e os totais). Aí é só arrastar o arquivo baixado para a conversa.

A planilha traz só os itens pedidos, com categoria, código, produto, caixas, peso por
caixa e total em quilos, mais a linha de totais no fim. Os números vão como número de
verdade, não como texto — dá para somar e filtrar direto no Excel.

Os botões **Copiar** e **E-mail** continuam mandando o pedido em texto, como antes.

A planilha é gerada por código escrito dentro do próprio `index.html`, sem biblioteca
externa — por isso funciona offline também.

---

## Arquivos do projeto

```
.
├── index.html              → o app inteiro (layout, produtos e lógica)
├── manifest.webmanifest    → nome, cores e ícones do app instalado
├── sw.js                   → service worker: faz funcionar offline
├── .nojekyll               → evita que o GitHub Pages ignore arquivos
├── README.md               → este arquivo
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png   → ícone Android (com margem de segurança)
    ├── apple-touch-icon.png    → ícone iPhone/iPad
    └── favicon-32.png          → ícone da aba do navegador
```

---

## Como alterar a lista de produtos

Os produtos ficam no próprio `index.html`, dentro da lista `CATEGORIAS`
(procure por `const CATEGORIAS = [`). Cada item segue este formato:

```js
{cod:"COMPRO000009", nome:"Anéis de Cebola 1,1 Kg", cx:11},
```

- `cod` — código do produto
- `nome` — como aparece na tela
- `cx`  — peso padrão de uma caixa, em kg (já vem preenchido no campo)

Para adicionar um item, copie uma linha dessas e ajuste os três valores.
Para remover, apague a linha inteira.

### Importante ao atualizar

Sempre que publicar uma alteração, abra o `sw.js` e mude a linha:

```js
const VERSAO = 'v1';
```

para `'v2'`, `'v3'` e assim por diante. Sem isso, os celulares que já instalaram o app
continuam mostrando a versão antiga guardada no cache.

---

## Alterar os contatos de envio

No `index.html`, procure por:

```js
const DEST_EMAIL = "geovana.nadal@gtf.com.br";
const DEST_PHONE = "5544998580612";
```

O telefone usa o formato internacional, sem espaços ou símbolos: `55` (Brasil) +
DDD + número. Há também um bloco de contatos no rodapé da página, com os mesmos
dados, que deve ser alterado junto.
