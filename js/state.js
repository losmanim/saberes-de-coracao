const $ = window.Utils.$;
const CAT_EMOJIS = window.Utils.CAT_EMOJIS;
const normalizarSaber = window.Utils.normalizarSaber;
const normalizarTags = window.Utils.normalizarTags;
const mostrarToast = window.Utils.mostrarToast;
const tratarErro = window.Utils.tratarErro;

const CAT_APOCRIFOS = window.Const.CAT_APOCRIFOS;
const DADOS_CACHE_KEY = window.Const.DADOS_CACHE_KEY;
const DADOS_CACHE_VERSAO_KEY = window.Const.DADOS_CACHE_VERSAO_KEY;
const FAVORITOS_KEY = window.Const.FAVORITOS_KEY;
const SABER_DIA_KEY = window.Const.SABER_DIA_KEY;
const CONTINUE_KEY = window.Const.CONTINUE_KEY;
const ABERTOS_KEY = window.Const.ABERTOS_KEY;
const ITENS_POR_PAGINA = window.Const.ITENS_POR_PAGINA;

let dados = null;
window.dados = dados;
let categoriaAtual = 'all';
let ultimoElementoFocado = null;
let continueSaberId = null;
let paginaAtual = 1;
let totalPaginas = 1;
let todosSaberes = [];
