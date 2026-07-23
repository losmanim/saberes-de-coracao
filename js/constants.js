(function () {
'use strict';

const CAT_APOCRIFOS = 6;

const CATEGORIA_IDS = {
  gnose: 1, praticas: 2, ciencia: 3, jornada: 4, vida: 5, apocrifos: CAT_APOCRIFOS,
};

const ITENS_POR_PAGINA = 24;

window.Const = {
  CAT_APOCRIFOS,
  CATEGORIA_IDS,
  ITENS_POR_PAGINA,
  DADOS_CACHE_KEY: 'saberes_cache',
  DADOS_CACHE_VERSAO_KEY: 'saberes_cache_versao',
  FAVORITOS_KEY: 'saberes_favoritos',
  SABER_DIA_KEY: 'saberes_saber_dia',
  CONTINUE_KEY: 'saberes_continue',
  ABERTOS_KEY: 'saberes_abertos',
};

})();
