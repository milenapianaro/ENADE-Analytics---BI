// ============================================================
// ARQUIVO: code.gs
// DESCRIÇÃO: Back-end do Web App ENADE Analytics.
//            Gerencia a leitura de questões da planilha,
//            a inclusão de arquivos HTML e o salvamento de respostas.
// AUTOR: Milena Pianaro
// DATA: 06/09/2026
// ============================================================

// ============================================================
// MÓDULO 1: CONFIGURAÇÕES GLOBAIS
// ============================================================

/**
 * ID da planilha que contém as questões.
 * Obtido a partir da URL: https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit
 */
var QUESTOES = '1SEWaEnt-_sa0m6MJP4cujWenr9GdWQCcTL1DS8Qw0ew';

/**
 * ID da planilha onde serão registradas as respostas.
 */
var RESPOSTAS = '1JBPgo8hrJ9agKMONjiPjx7tVwrC5uYLi4xXfqz-1bms';

// ============================================================
// MÓDULO 2: PONTO DE ENTRADA DO WEB APP
// ============================================================

/**
 * Função chamada quando o Web App é acessado.
 * Carrega o template principal 'index' e configura metadados.
 * @returns {HtmlOutput} Página HTML renderizada.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Questionário ENADE')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// MÓDULO 3: INCLUSÃO DE ARQUIVOS HTML (CSS/JS)
// ============================================================

/**
 * Inclui o conteúdo de um arquivo HTML (como CSS ou JS) no template principal.
 * Usado no index.html com a sintaxe: <?!= include('nome_do_arquivo'); ?>
 * @param {string} filename - Nome do arquivo (sem extensão) armazenado no projeto.
 * @returns {string} Conteúdo do arquivo.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// MÓDULO 4: LEITURA DE DADOS DA PLANILHA
// ============================================================

/**
 * Retorna todas as questões disponíveis na planilha, na ordem em que aparecem.
 * @returns {Array<Object>} Lista de objetos com os dados de cada questão.
 * @throws {Error} Se nenhuma questão for encontrada.
 */
function getAllQuestions() {
  try {
    var allQuestions = loadQuestionsFromSheet();
    if (!allQuestions || allQuestions.length === 0) {
      throw new Error('Nenhuma questão encontrada.');
    }
    return allQuestions;
  } catch (e) {
    console.error('Erro em getAllQuestions:', e);
    throw new Error('Erro ao carregar questões: ' + e.message);
  }
}

/**
 * Retorna uma quantidade específica de questões, embaralhadas aleatoriamente.
 * @param {number} quantidade - Número máximo de questões a retornar.
 * @returns {Array<Object>} Lista com 'quantidade' questões aleatórias.
 * @throws {Error} Se nenhuma questão for encontrada.
 */
function getRandomQuestions(quantidade) {
  try {
    var allQuestions = loadQuestionsFromSheet();
    if (!allQuestions || allQuestions.length === 0) {
      throw new Error('Nenhuma questão encontrada.');
    }
    
    // Embaralha o array (Fisher-Yates)
    for (var i = allQuestions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = allQuestions[i];
      allQuestions[i] = allQuestions[j];
      allQuestions[j] = temp;
    }
    
    // Retorna as primeiras 'quantidade' (ou todas se quantidade > total)
    return allQuestions.slice(0, Math.min(quantidade, allQuestions.length));
  } catch (e) {
    console.error('Erro em getRandomQuestions:', e);
    throw new Error('Erro ao carregar questões: ' + e.message);
  }
}

/**
 * Função principal de leitura da aba "Questões".
 * Converte as linhas da planilha em um array de objetos estruturados.
 * @returns {Array<Object>} Lista de questões.
 * @throws {Error} Se a aba não for encontrada, se estiver vazia ou se faltar colunas obrigatórias.
 */
function loadQuestionsFromSheet() {
  // Acessa a planilha pelo ID e obtém a aba de questões
  var spreadsheet = SpreadsheetApp.openById(QUESTOES);
  var sheet = spreadsheet.getSheetByName('Questões');
  if (!sheet) {
    throw new Error('Aba "Questões" não encontrada.');
  }

  // Obtém todos os dados da aba
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    throw new Error('Aba com menos de 2 linhas (cabeçalho + dados).');
  }

  // Cabeçalho da planilha (primeira linha)
  var headers = data[0];

  // Mapeia o índice de cada coluna com base no cabeçalho
  var colIndex = {
    id:       headers.indexOf('ID'),
    parte:    headers.indexOf('Parte'),
    tema:     headers.indexOf('Tema'),
    tipo:     headers.indexOf('Tipo'),
    textos:   headers.indexOf('Textos'),
    comando:  headers.indexOf('Comando'),
    altA:     headers.indexOf('Alternativa A'),
    altB:     headers.indexOf('Alternativa B'),
    altC:     headers.indexOf('Alternativa C'),
    altD:     headers.indexOf('Alternativa D'),
    altE:     headers.indexOf('Alternativa E'),
    gabarito: headers.indexOf('Gabarito')
  };

  // Verifica se todas as colunas necessárias foram encontradas
  for (var key in colIndex) {
    if (colIndex[key] === -1) {
      throw new Error('Coluna "' + key + '" não encontrada na aba "Questões".');
    }
  }

  // Itera pelas linhas de dados (começando da segunda linha)
  var questions = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Ignora linhas com ID vazio (considera como linha sem questão)
    if (!row[colIndex.id]) continue;

    // Converte o ID para string (pode vir como número ou data)
    var idValue = row[colIndex.id];
    if (idValue instanceof Date) {
      idValue = Utilities.formatDate(idValue, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } else {
      idValue = idValue.toString().trim();
    }

    // Monta o objeto da questão no formato esperado pelo front-end
    var question = {
      id: idValue,
      parte: row[colIndex.parte] ? row[colIndex.parte].toString().trim() : '',
      subtipo: row[colIndex.tipo] ? row[colIndex.tipo].toString().trim() : '',
      tema: row[colIndex.tema] ? row[colIndex.tema].toString().trim() : '',
      conteudo: {
        textos_apoio: [
          { 
            tipo: "texto", 
            conteudo: row[colIndex.textos] || '', 
            referencia: ''
          }
        ],
        comando: row[colIndex.comando] || '',
        alternativas: {
          A: row[colIndex.altA] || '',
          B: row[colIndex.altB] || '',
          C: row[colIndex.altC] || '',
          D: row[colIndex.altD] || '',
          E: row[colIndex.altE] || ''
        }
      },
      gabarito: row[colIndex.gabarito] ? row[colIndex.gabarito].toString().trim() : ''
    };
    questions.push(question);
  }

  return questions;
}

// ============================================================
// MÓDULO 5: PERSISTÊNCIA (SALVAMENTO DE RESPOSTAS)
// ============================================================

/**
 * Salva cada resposta em uma linha separada, alinhado com a ordem atual da planilha.
 * @param {Object} dados - Objeto com { respostas: Array, tempoTotal: number, periodo: string, idAluno: string }
 * @returns {string} "OK" se bem-sucedido.
 */
function saveResponses(dados) {
  try {
    var respostasArray = dados.respostas || [];
    var tempoTotal = dados.tempoTotal || 0;
    var periodo = dados.periodo || '';
    var idAluno = dados.idAluno || '';
    var dataSimulado = dados.data || '';    // <-- NOVO

    // Carrega todas as questões (para gabarito e tema)
    var questoesMap = {};
    var allQuestions = loadQuestionsFromSheet();
    allQuestions.forEach(function(q) {
      questoesMap[q.id] = { gabarito: q.gabarito, tema: q.tema || '' };
    });

    var spreadsheet = SpreadsheetApp.openById(RESPOSTAS);
    var sheet = spreadsheet.getSheetByName('Respostas');

    // Se a aba não existir, cria com a ordem correta (incluindo Data no final)
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Respostas');
      sheet.appendRow([
        'ID Aluno', 'Período', 'ID Pergunta', 'Tema',
        'Tempo Início', 'Tempo Final', 'Tempo de Resposta',
        'Resposta', 'Acertou', 'Gabarito', 'Tempo Total',
        'Data'    // <-- NOVO
      ]);
    } else {
      // Se a aba já existe, verifica se a coluna "Data" está presente
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      if (headers.indexOf('Data') === -1) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Data'); // <-- NOVO
      }
    }

    // Itera sobre as respostas e insere cada uma
    for (var i = 0; i < respostasArray.length; i++) {
      var r = respostasArray[i];
      var qInfo = questoesMap[r.idPergunta] || {};
      var gabarito = qInfo.gabarito || '';
      var tema = qInfo.tema || '';
      var acertou = (r.resposta === gabarito) ? 1 : 0;
      var tempoSegundos = Math.round((r.tempoFinal - r.tempoInicio) / 1000);

      sheet.appendRow([
        r.idAluno || idAluno,          // ID Aluno
        r.periodo || periodo,          // Período
        r.idPergunta || '',            // ID Pergunta
        tema,                          // Tema
        r.tempoInicio || '',           // Tempo Início
        r.tempoFinal || '',            // Tempo Final
        tempoSegundos,                 // Tempo de Resposta
        r.resposta || '',              // Resposta
        acertou,                       // Acertou
        gabarito,                      // Gabarito
        tempoTotal,                    // Tempo Total
        dataSimulado                   // Data          <-- NOVO
      ]);
    }

    return 'OK';
  } catch (e) {
    console.error('Erro ao salvar respostas:', e);
    throw new Error('Erro ao salvar respostas: ' + e.message);
  }
}