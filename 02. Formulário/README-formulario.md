# ENADE Analytics — Formulário (Web App)

**Guia de implantação e manutenção do simulado no Google Apps Script.**

Este documento descreve como publicar, atualizar e testar o Web App do simulado ENADE Analytics, integrado às planilhas do Google Sheets.

---

## Sumário

- [Visão geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Implantação](#implantação)
- [Atualização do Web App](#atualização-do-web-app)
- [Testes](#testes)
- [Solução de problemas](#solução-de-problemas)
- [Referências](#referências)

---

## Visão geral

O formulário é um Web App desenvolvido em Google Apps Script que:

- exibe o **Termo de Consentimento Livre e Esclarecido (TCLE)** antes do início do simulado;
- coleta o **período** do aluno (1º ao 6º);
- apresenta as questões **uma por vez**, com navegação Anterior/Próxima;
- permite a **revisão** das respostas antes do envio;
- exibe o **feedback** com o total de acertos e a correção visual por cores;
- registra o **tempo por questão** e o **tempo total** de prova;
- grava as respostas em uma planilha do Google Sheets, seguindo os princípios da LGPD.

---

## Pré-requisitos

- Uma conta Google (pessoal ou institucional).
- Acesso ao [Google Apps Script](https://script.google.com).
- Duas planilhas no Google Sheets:
  - **Planilha de Questões:** contém a aba `Questões` com todas as perguntas.
  - **Planilha de Respostas:** onde as respostas dos alunos serão gravadas.
- Os arquivos do projeto, disponíveis nesta pasta:

| Arquivo | Local |
|---------|-------|
| `code.gs` | `backend/` |
| `index.html` | `frontend/` |
| `style.html` | `frontend/` |
| `javascript.html` | `frontend/` |

---

## Implantação

### 1. Criar o projeto no Apps Script

1. Acesse [script.google.com](https://script.google.com) e clique em **Novo projeto**.
2. Renomeie o projeto, por exemplo, para `ENADE Analytics — Formulário`.

### 2. Adicionar os arquivos ao projeto

No editor, crie os arquivos abaixo e cole o conteúdo correspondente:

| Arquivo no editor | Conteúdo |
|-------------------|----------|
| `Código.gs` (já existe) | `backend/code.gs` |
| `index` | `frontend/index.html` |
| `style` | `frontend/style.html` |
| `javascript` | `frontend/javascript.html` |

> [!IMPORTANT]
> Os arquivos HTML devem se chamar exatamente `index`, `style` e `javascript`, **sem** a extensão `.html`. O Apps Script a adiciona automaticamente.

### 3. Configurar os IDs das planilhas

No arquivo `Código.gs`, localize as variáveis globais e substitua os valores pelos IDs das suas planilhas:

```javascript
var QUESTOES  = 'ID_DA_PLANILHA_DE_QUESTOES';
var RESPOSTAS = 'ID_DA_PLANILHA_DE_RESPOSTAS';
```

O ID é o trecho da URL da planilha entre `/d/` e `/edit`:

```text
https://docs.google.com/spreadsheets/d/<ID_DA_PLANILHA>/edit
```

### 4. Verificar os nomes das abas

Confirme que as abas têm exatamente os nomes abaixo (o script diferencia maiúsculas, minúsculas e acentos):

| Planilha | Aba |
|----------|-----|
| Questões | `Questões` |
| Respostas | `Respostas` |

Caso a aba `Respostas` não exista, o script a cria automaticamente na primeira execução.

### 5. Definir o acesso às planilhas

Como a implantação será configurada com **Executar como: Eu**, o script acessa as planilhas com as permissões do proprietário do projeto. Por isso, **os alunos não precisam de acesso direto às planilhas** e elas devem permanecer **restritas**.

Basta garantir que a conta que implanta o Web App seja proprietária (ou editora) das duas planilhas.

> [!WARNING]
> Evite compartilhar a planilha de respostas como "Qualquer pessoa com o link". Isso permitiria que qualquer pessoa com o endereço visse ou alterasse os registros, o que enfraquece a proteção dos dados prevista no projeto.

### 6. Publicar o Web App

1. No editor, clique em **Implantar** → **Nova implantação**.
2. Clique no ícone de engrenagem e escolha **Aplicativo da web**.
3. Preencha os campos:
   - **Descrição:** `Versão inicial do formulário`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa`
4. Clique em **Implantar**.
5. Autorize o script quando o Google solicitar acesso às planilhas.
6. Copie a **URL do Web App**. Ela é o link que será distribuído aos alunos.

---

## Atualização do Web App

Para publicar alterações de código **mantendo o mesmo link**:

1. Salve o projeto (`Ctrl+S`).
2. Acesse **Implantar** → **Gerenciar implantações**.
3. Clique no ícone de **lápis** da implantação existente.
4. Em **Versão**, selecione **Nova versão**.
5. Adicione uma descrição (por exemplo, `Adiciona coluna Data`).
6. Clique em **Implantar**.

A URL permanece a mesma, e os alunos não precisam de um novo link.

> [!CAUTION]
> Não use **Nova implantação** para atualizar o código. Essa opção gera uma URL diferente e deixa o link anterior desatualizado.

---

## Testes

1. Abra a URL do Web App em uma **janela anônima** do navegador.
2. Aceite o TCLE, selecione o período e inicie o simulado.
3. Responda às questões, revise e envie.
4. Verifique se:
   - o feedback de acertos é exibido;
   - as respostas foram gravadas na aba `Respostas` com as colunas corretas.

---

## Solução de problemas

### Erro `Cannot read properties of null (reading 'getSheetByName')`

- **Causa:** o script não conseguiu abrir a planilha.
- **Solução:** confira se os IDs em `QUESTOES` e `RESPOSTAS` estão corretos e se a conta que implantou o Web App tem acesso às duas planilhas.

### Erro de acesso para usuários com várias contas Google

- **Causa:** o Apps Script não funciona de forma confiável com várias contas Google logadas ao mesmo tempo no navegador.
- **Solução:** oriente o usuário a:
  - usar uma **janela anônima**; ou
  - sair de todas as contas e entrar apenas em uma; ou
  - criar um **perfil separado** no navegador.

### Respostas não são gravadas na planilha

- **Causa provável:** a conta que implantou o Web App não tem permissão de edição na planilha de respostas, ou o nome da aba está diferente de `Respostas`.
- **Solução:** verifique a permissão do proprietário da implantação e o nome da aba. Se o código foi alterado recentemente, confirme que uma **nova versão** foi implantada (ver [Atualização do Web App](#atualização-do-web-app)).

### O link do Web App parou de funcionar

- **Causa:** foi criada uma nova implantação em vez de atualizar a existente, o que gerou uma nova URL.
- **Solução:** acesse **Implantar** → **Gerenciar implantações**, copie a URL vigente e redistribua o link aos usuários.

---

## Referências

- [Documentação oficial do Google Apps Script](https://developers.google.com/apps-script)
- [Guia de Web Apps](https://developers.google.com/apps-script/guides/web)
