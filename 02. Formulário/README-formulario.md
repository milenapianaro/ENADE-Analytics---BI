# 📝 Formulário ENADE Analytics — Guia de Deploy

> Este guia descreve o passo a passo para publicar e manter o **Web App do simulado ENADE Analytics** no Google Apps Script, integrado às planilhas do Google Sheets.

---

## 📖 Sobre o formulário

O formulário é um **Web App** desenvolvido em Google Apps Script que:

- Exibe o **Termo de Consentimento Livre e Esclarecido (TCLE)** antes do simulado;
- Coleta o **período** do aluno (1º a 6º);
- Apresenta as questões **uma por vez**, com navegação Anterior/Próxima;
- Permite **revisão** das respostas antes do envio;
- Exibe **feedback** com total de acertos e correção visual (cores);
- Registra **tempo por pergunta** e **tempo total** de prova;
- Salva as respostas em uma planilha do Google Sheets, em conformidade com a LGPD.

---

## ✅ Pré-requisitos

Antes de começar, você precisará de:

- Uma conta Google (Gmail ou institucional);
- Acesso ao [Google Apps Script](https://script.google.com);
- Duas planilhas no Google Sheets:
  - **Planilha de Questões** — contém a aba `Questões` com todas as perguntas;
  - **Planilha de Respostas** — onde as respostas dos alunos serão salvas.
- Os arquivos desta pasta (`code.gs`, `index.html`, `style.html`, `javascript.html`).

---

## 🚀 Passo a passo para o deploy

### 1. Criar o projeto no Apps Script

1. Acesse [script.google.com](https://script.google.com) e clique em **Novo projeto**.
2. Renomeie o projeto para algo como `ENADE Analytics — Formulário`.

### 2. Adicionar os arquivos ao projeto

No editor do Apps Script, crie os seguintes arquivos:

| Arquivo no editor | Conteúdo a colar |
|-------------------|------------------|
| `Código.gs` (já existe) | Conteúdo de `backend/code.gs` |
| `index.html` | Conteúdo de `frontend/index.html` |
| `style.html` | Conteúdo de `frontend/style.html` |
| `javascript.html` | Conteúdo de `frontend/javascript.html` |

> ⚠️ **Atenção:** o nome do arquivo HTML no editor deve ser **exatamente** `index`, `style` e `javascript`, sem a extensão `.html`. O Apps Script adiciona a extensão automaticamente.

### 3. Configurar os IDs das planilhas

No arquivo `Código.gs`, localize as variáveis globais:

```javascript
var QUESTOES = 'ID_DA_PLANILHA_DE_QUESTOES';
var RESPOSTAS = 'ID_DA_PLANILHA_DE_RESPOSTAS';
```

Substitua pelos IDs reais das suas planilhas. O ID é a parte da URL entre `/d/` e `/edit`:

```
https://docs.google.com/spreadsheets/d/1SEWaEnt-_sa0m6MJP4cujWenr9GdWQCcTL1DS8Qw0ew/edit
                                      └────────────── ID ──────────────┘
```

### 4. Verificar os nomes das abas

Certifique-se de que as abas nas planilhas têm exatamente estes nomes:

- Na planilha de questões: **`Questões`**
- Na planilha de respostas: **`Respostas`**

Se a aba `Respostas` não existir, o script a criará automaticamente na primeira execução.

### 5. Compartilhar as planilhas

Como o Web App será acessado por pessoas anônimas (sem login), as planilhas precisam estar compartilhadas:

1. Abra cada planilha no Google Sheets.
2. Clique em **Compartilhar**.
3. Em **Acesso geral**, selecione **"Qualquer pessoa com o link"**.
4. Defina a permissão como **Leitor** (para a planilha de questões) e **Editor** (para a de respostas).
5. Clique em **Concluído**.

### 6. Publicar o Web App

1. No editor do Apps Script, clique em **Implantar** → **Nova implantação**.
2. Clique no ícone de engrenagem → **Aplicativo da web**.
3. Preencha:
   - **Descrição:** `Versão inicial do formulário`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa`
4. Clique em **Implantar**.
5. Autorize o script (o Google pedirá permissão para acessar as planilhas).
6. **Copie a URL do Web App** gerada.

> 🔗 Essa URL é o link que os alunos usarão para acessar o simulado.

---

## 🔄 Como atualizar o Web App (sem mudar o link)

Sempre que você alterar o código e quiser publicar as mudanças:

1. Salve o projeto (Ctrl+S).
2. Vá em **Implantar** → **Gerenciar implantações**.
3. Clique no **ícone de lápis** (editar) da implantação existente.
4. Em **Versão**, selecione **Nova versão**.
5. Digite uma descrição (ex: `Adiciona coluna Data`).
6. Clique em **Implantar**.

✅ **A URL permanece a mesma.** Os alunos não precisam de um novo link.

> ⚠️ **Não clique em "Nova implantação"** — isso gera uma URL diferente.

---

## 🧪 Como testar o formulário

1. Acesse a URL do Web App em uma **janela anônima** do navegador.
2. Aceite o TCLE, selecione o período e inicie o simulado.
3. Responda as questões, revise e envie.
4. Verifique se:
   - O feedback de acertos aparece;
   - As respostas foram salvas na planilha `Respostas` com as colunas corretas.

---

## ⚠️ Problemas comuns e soluções

### 1. Erro "Cannot read properties of null (reading 'getSheetByName')"

**Causa:** o script não está conseguindo acessar a planilha.
**Solução:** verifique se o `ID_PLANILHA` está correto e se as planilhas estão compartilhadas como "Qualquer pessoa com o link".

### 2. Erro de acesso para usuários logados em múltiplas contas Google

**Causa:** o Google Apps Script **não suporta múltiplas contas logadas simultaneamente** no mesmo navegador.
**Solução:** oriente o usuário a:
- Usar uma **janela anônima**; ou
- Fazer **logout de todas as contas** e logar apenas na conta desejada; ou
- Criar um **perfil separado** no navegador.

### 3. As respostas não estão sendo salvas na planilha

**Causa:** a planilha de respostas não está compartilhada com permissão de **edição**.
**Solução:** abra a planilha, vá em **Compartilhar** e altere o acesso para **Editor** (para "Qualquer pessoa com o link").

### 4. O link do Web App parou de funcionar

**Causa:** uma nova implantação foi criada (em vez de atualizar a existente), gerando uma nova URL.
**Solução:** acesse **Implantar** → **Gerenciar implantações** e copie a URL atual. Envie o novo link para os usuários.

---

## 📚 Referências

- [Documentação oficial do Apps Script](https://developers.google.com/apps-script)
- [Guia de Web Apps](https://developers.google.com/apps-script/guides/web)
