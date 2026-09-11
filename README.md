# 📊 ENADE Analytics

> Plataforma de simulado e business intelligence para apoio à preparação ao ENADE 2026, desenvolvida como requisito parcial para obtenção de nota na disciplina de Business Intelligence do curso de Gestão da Tecnologia da Informação do Instituto Federal do Paraná — Campus Pinhais.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licen%C3%A7a-acad%C3%AAmica-blue)
![Feito com](https://img.shields.io/badge/feito%20com-Google%20Apps%20Script-green)
![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?logo=powerbi&logoColor=black)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?logo=googlesheets&logoColor=white)
![LGPD](https://img.shields.io/badge/LGPD-conforme-blueviolet)

---

## 📖 Sobre o projeto

O **ENADE Analytics** é uma solução completa que integra:

- Um **simulado interativo** (Web App) que coleta respostas de alunos de forma anônima e em conformidade com a LGPD;
- Uma **base de dados** estruturada no Google Sheets;
- Um **dashboard em Power BI** que ajuda a coordenação do curso a identificar os eixos temáticos com maior dificuldade, comparar o desempenho entre turmas e acompanhar a evolução ao longo do semestre.

O projeto surgiu da necessidade de direcionar ações pedagógicas de reforço antes da prova oficial do INEP, usando dados reais coletados em simulados-piloto.

---

## 🎯 Objetivos

- 📌 Identificar os **eixos temáticos** com pior desempenho médio entre os concluintes.
- 📌 Comparar o desempenho entre **turmas e períodos**.
- 📌 Verificar se as lacunas de conhecimento estão **concentradas em poucos alunos** ou **distribuídas pela turma**.
- 📌 Avaliar se o desempenho **melhora ao longo do semestre** conforme mais simulados são aplicados.
- 📌 Correlacionar **tempo de resposta** com **taxa de acertos**.

---

## 🧩 Arquitetura da solução

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│   Web App            │      │   Google Sheets      │      │   Power BI           │
│   (Apps Script +     │────▶│   (Questões +        │─────▶│   (Dashboard)        │
│   HTML/CSS/JS)       │      │   Respostas)         │      │   Esquema estrela    │
│   Simulado interativo│      │   Base de dados      │      │   Análise e insights │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### 🔧 Tecnologias utilizadas

| Camada | Ferramenta |
|--------|------------|
| Front-end do simulado | HTML, CSS, JavaScript |
| Back-end do simulado | Google Apps Script |
| Banco de dados | Google Sheets |
| ETL / Modelagem | Power BI Desktop |
| Versionamento | Git + GitHub |

---

## 🗂️ Estrutura do repositório

```
ENADE-Analytics---BI/
│
├── 01. Documentação/           # Documentação do projeto
│   ├── Marco 0 - Termo de Abertura.pdf
│   ├── Marco 1 - Matriz de Requisitos.pdf
│   ├── Marco 1 - Termo de Consentimento LGPD.pdf
│   └── Marco 2 - Modelo de Dados DW.pdf
│
├── 02. Formulário/             # Código do Web App
│   │   ├── backend/
│   │   └── code.gs
│   ├── frontend/
│   │   ├── index.html
│   │   ├── style.html
│   │   └── javascript.html
│   └── README-formulario.md    # Instruções específicas de deploy (a ser incluído)
│
├── 03. Dados e DW/             # Planilhas e Modelo de Dados DW
│   ├── ENADE Analytics - Banco de Questões.xlsx
│   ├── ENADE Analytics - Registro de Respostas.xlsx
│   └── Diagrama DER.png
│
├── 04. Dashboard/              # Arquivo do dashboard
│   └── ENADE Analytics - Fogo e Dados.pbix (a ser incluído)
│
└── README.md
```

---

## 🔐 Conformidade com a LGPD

Este projeto foi desenvolvido com atenção aos princípios da **Lei Geral de Proteção de Dados (LGPD)**:

- ✅ Nenhum dado pessoal identificável é coletado (sem nome, CPF ou e-mail).
- ✅ Cada aluno recebe um **ID anônimo** gerado automaticamente.
- ✅ O **Termo de Consentimento Livre e Esclarecido (TCLE)** é apresentado antes do início do simulado.
- ✅ Os dados são analisados **apenas de forma agregada**, nunca individualmente.
- ✅ Os resultados não substituem o ENADE oficial do INEP.

---

## 👩‍💻 Equipe

| Nome | Função |
|------|--------|
| **Ava Moreira de Lima** | Desenvolvimento e análise |
| **Milena Pianaro Caetano** | Desenvolvimento e análise |
| **Vinícius Andrade Henrique** | Desenvolvimento e análise |

**Orientadora:** Prof.ª Lauriana Paludo  
**Instituição:** Instituto Federal do Paraná — Campus Pinhais

---

## 📚 Documentação do projeto

Os entregáveis do Projeto Integrador estão disponíveis na pasta `01. Documentação/`:

- 📄 Marco 0 — Termo de Abertura do Projeto
- 📄 Marco 1 — Matriz de Requisitos
- 📄 Marco 2 — Modelo de Dados (DW)

---

## 🛣️ Roadmap

- [x] Estruturação do banco de questões
- [x] Desenvolvimento do Web App de simulado
- [x] Coleta de dados em conformidade com a LGPD
- [x] Modelagem dimensional (esquema estrela)
- [ ] Dashboard interativo no Power BI
- [ ] Testes de usabilidade com a coordenação
- [ ] Apresentação final

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais. Uso restrito ao contexto do Projeto Integrador do curso de Gestão da Tecnologia da Informação do IFPR — Campus Pinhais.

---

> 💡 *"O que não é medido, não é gerenciado."* — Peter Drucker
