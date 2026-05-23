const divMostraConteudo = document.getElementById('content-interativo');
const botaoContexto = document.getElementById('contex-hist');
const botaoPrincipios = document.getElementById('tres-p-fundam');
const botaoObras = document.getElementById('obras-fundam');
const botaoControv = document.getElementById('controv');
const botaoLegado = document.getElementById('legado');

const botoes = [
    { elemento: botaoContexto, tipo: 'contexto' },
    { elemento: botaoPrincipios, tipo: 'principios' },
    { elemento: botaoObras, tipo: 'obras' },
    { elemento: botaoControv, tipo: 'controv' },
    { elemento: botaoLegado, tipo: 'legado' }
];

botoes.forEach(btn => {
    btn.elemento.addEventListener('click', () => {
        botoes.forEach(b => {
            b.elemento.classList.remove('ativo');
            b.elemento.setAttribute('aria-expanded', 'false');
        });
        btn.elemento.classList.add('ativo');
        btn.elemento.setAttribute('aria-expanded', 'true');

        let conteudo = '';

        switch(btn.tipo) {
            case 'contexto':
                conteudo = `
                    <h2>O Contexto Histórico: Por que surgiu?</h2>
                    <p>A Necessidade do Século XIX</p>
                    <ul>
                        <li><strong>Avanço científico materialista:</strong>
                        <p>A publicação de A Origem das Espécies (1859) de Darwin e o positivismo científico estavam desacreditando as religiões tradicionais</p></li>
                        <li><strong>Fracasso do Cristianismo institucional:</strong>
                        <p>Não conseguia fornecer explicações satisfatórias para questões fundamentais</p></li>
                        <li><strong>Busca por espiritualidade não-dogmática:</strong>
                        <p>Movimentos espiritualistas cresciam (irmãs Fox em 1848, Espiritismo de Allan Kardec em 1856)</p></li>
                    </ul>
                    <p>Blavatsky positioningou-se como mediadora entre Ocidente e Oriente, propondo uma "Filosofia Esotérica" que resgataria sabedoria ancestral.</p>
                `;
                break;

            case 'principios':
                conteudo = `
                    <h2>Princípios Fundamentais da Teosofia</h2>
                    <ul>
                        <li><strong>1. Unidade Universal:</strong>
                        <p>Existe uma realidade divina única que permeia tudo. Não há separação real entre divino e material.</p></li>
                        <li><strong>2. Reencarnação e Karma:</strong>
                        <p>As almas renascem múltiplas vezes para evoluir. Cada ação gera consequências que moldam vidas futuras.</p></li>
                        <li><strong>3. Evolução Espiritual:</strong>
                        <p>O objetivo é alcançar a iluminação ou união com o divino através de diferentes níveis de consciência.</p></li>
                        <li><strong>4. Sabedoria Antiga:</strong>
                        <p>Grandes mestres e civilizações antigas possuíam conhecimento profundo que teria sido perdido ou ocultado.</p></li>
                    </ul>
                `;
                break;

            case 'obras':
                conteudo = `
                    <h2>Obras Fundamentais</h2>
                    <ul>
                        <li><strong>A Doutrina Secreta (1888):</strong>
                        <p>Obra principal de Blavatsky, em 2 volumes. Apresenta a síntese de religiões, ciências e filosofias.</p></li>
                        <li><strong>Ísis Sem Véu (1877):</strong>
                        <p>Primeiro livro publicado. Defende a existência de uma "filosofia natural" por trás de todas as religiões.</p></li>
                        <li><strong>A Voz do Silêncio (1889):</strong>
                        <p>Texto mais curto, de caráter mais místico. Fragmentos de um livro Tibetano chamado "O Livro dos Preceitos de Ouro".</p></li>
                    </ul>
                `;
                break;

            case 'controv':
                conteudo = `
                    <h2>Controvérsias</h2>
                    <ul>
                        <li><strong>Acusações de fraude:</strong>
                        <p>Blavatsky foi criticada por fazer afirmações não verificáveis sobre sua "conexão com os Mestres".</p></li>
                        <li><strong>Plágio e imprecisões:</strong>
                        <p>Alguns trechos de "A Doutrina Secreta" teriam sido copiados de outras fontes sem crédito.</p>
                        <li><strong>Racismo estrutural:</strong>
                        <p>A teoria das "raças-raízes" de Blavatsky foi considerada racista e elitista.</p></li>
                        <li><strong>Relação com o Nazismo:</strong>
                        <p>Alguns elementos da teosofia foram reinterpretados por movimentos nazistas later.</p></li>
                    </ul>
                `;
                break;

            case 'legado':
                conteudo = `
                    <h2>O Legado da Teosofia</h2>
                    <p>A teosofia influenciou diversos movimentos:</p>
                    <ul>
                        <li><strong>Movimento Nova Era:</strong>
                        <p>Muitos conceitos teosóficos foram incorporados à Nova Era.</p></li>
                        <li><strong>Esoterismo Ocidental:</strong>
                        <p>Influenciou ordens como a Golden Dawn e a Martinista.</p></li>
                        <li><strong>Psicologia:</strong>
                        <p>Jung teve correspondência com Krishnamurti e estudou teosofia.</p></li>
                        <li><strong>Antroposofia:</strong>
                        <p>Rudolf Steiner, ex-membro, criou a Antroposofia baseada em princípios teosóficos.</p></li>
                    </ul>
                `;
                break;
        }

        divMostraConteudo.innerHTML = conteudo;
    });
});

const chakraButtons = document.querySelectorAll('#chakra-buttons button');
const chakraContent = document.getElementById('chakra-content');

const chakrasData = {
    1: {
        nome: 'Múládhara (Raiz)',
        sílaba: 'LAM',
        cor: 'Vermelho',
        localização: 'Base da coluna, entre o cóccix e o osso sacro',
        função: 'Estabilidade, segurança, conexão com a terra, sobrevivência',
        mantra: 'Eu sou seguro. Eu existo. Estou conectado com a terra.',
        exercício: 'Sente-se confortavelmente. Inspire profundamente pelo nariz, expire pela boca. Repita "LAM" gentilmente por 3-5 minutos, focando na base da coluna.'
    },
    2: {
        nome: 'Svadhisthána (Sacro)',
        sílaba: 'VAM',
        cor: 'Laranja',
        localização: 'Logo abaixo do umbigo',
        função: 'Criatividade, sexualidade, emoção, fluir da vida',
        mantra: 'Eu fluo. Eu crio. Eu sinto.',
        exercício: 'Coloque as mãos sobre o umbigo. Inspire e expire lentamente, repetindo "VAM" com som suave. Sinta o calor nas mãos.'
    },
    3: {
        nome: 'Manipura (Plexo Solar)',
        sílaba: 'RAM',
        cor: 'Amarelo',
        lokalização: 'Área do estômago, abaixo do esterno',
        função: 'Poder pessoal, confiança, vontade, autodisciplina',
        mantra: 'Eu tenho poder. Eu sou capaz. Eu manifesto.',
        exercício: 'Respire profundamenteexpanda o abdômen. Ao expirar, diga "RAM" com força. Sinta o poder emanando do plexo solar.'
    },
    4: {
        nome: 'Anahata (Coração)',
        sílaba: 'YAM',
        cor: 'Verde',
        localização: 'Centro do peito, onde está o coração',
        função: 'Amor, compaixão, perdão, conexão, equilíbrio',
        mantra: 'Eu amo. Eu sou amado. Eu perdoo.',
        exercício: 'Coloque a mão sobre o coração. Inspire amor, expire compaixão. Repita "YAM" suavemente, permitindo que o peito se abra.'
    },
    5: {
        nome: 'Vishuddha (Garganta)',
        sílaba: 'HAM',
        cor: 'Azul',
        localização: 'Garganta, na Base do pescoço',
        função: 'Comunicação, expressão, verdade, autoexpressão',
        mantra: 'Eu expresso. Eu comunico. Eu falo minha verdade.',
        exercício: 'Abra a boca suavemente. Emit o som "HAM" como se fosse um suspiro suave. Sinta a garganta vibrar.'
    },
    6: {
        nome: 'Ajña (Terceiro Olho)',
        sílaba: 'OM ou AUM',
        cor: 'Índigo/Roxo',
        localização: 'Testa, entre as sobrancelhas',
        função: 'Intuição, percepção, sabedoria interior, visão',
        mantra: 'Eu vejo. Eu intuí. Eu compreendo.',
        exercício: 'Feche os olhos. Foque no ponto entre as sobrancelhas. Repita "OM" suavemente, permitindo que a visão interior se abra.'
    },
    7: {
        nome: 'Sahasrara (Coronário)',
        sílaba: 'OM ou NG',
        cor: 'Violeta/Branco',
        localização: 'Topo da cabeça',
        função: 'Iluminação, consciência cósmica, transcendência',
        mantra: 'Eu sou. Eu sou parte do todo.',
        exercício: 'Imagine uma luz branca acima de você, descendo como uma chuva suave. Permita que ela precha toda a sua cabeça.'
    }
};

chakraButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        chakraButtons.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        
        const chakraNum = btn.dataset.chakra;
        const chakra = chakrasData[chakraNum];
        
        chakraContent.innerHTML = `
            <div class="chakra-detail">
                <h3>${chakra.nome}</h3>
                <div class="chakra-info">
                    <p><strong>Sílaba:</strong> ${chakra.sílaba}</p>
                    <p><strong>Cor:</strong> ${chakra.cor}</p>
                    <p><strong>Localização:</strong> ${chakra.localização}</p>
                    <p><strong>Função:</strong> ${chakra.função}</p>
                </div>
                <div class="chakra-mantra">
                    <h4>Mantra</h4>
                    <p>${chakra.mantra}</p>
                </div>
                <div class="chakra-exercicio">
                    <h4>Exercício</h4>
                    <p>${chakra.exercício}</p>
                </div>
            </div>
        `;
    });
});