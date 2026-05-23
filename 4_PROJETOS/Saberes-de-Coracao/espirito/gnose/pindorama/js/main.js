const botaoOLivro = document.getElementById('btn-o-livro');
const divOLivro = document.getElementById('oLivro');

botaoOLivro.addEventListener('click', () => {
    divOLivro.style.display = 'block';
});
// Hipotética
const divMostraFuturoPositivo = document.getElementById('mostra-todos-juntos');
const botaoMostraFuturoPoitivo = document.getElementById('btn-todos-juntos');

botaoMostraFuturoPoitivo.addEventListener('click', () => {
    divMostraFuturoPositivo.classList.toggle('visivel');
    // Se não tem conteúdo, adiciona
    if (!divMostraFuturoPositivo.innerHTML) {
        const agaQuatro = document.createElement('h4');
        const paragrafo = document.createElement('p');
        
        agaQuatro.textContent = 'Se não tivesse rolado a invasão europeia em 1500 (ou "descoberta", como quiser chamar), os povos originários de Pindorama (principalmente tupis-guaranis e outros grupos da Amazônia, litoral e interior) teriam evoluido (tecnologicamente, socialmente, demograficamente) ou continuariam "errando"/estagnados pra sempre?';
        paragrafo.textContent = 'Baseada no que a arqueologia, antropologia e história mais recente mostram (incluindo descobertas de 2024-2025 com LiDAR e escavações): eles já estavam evoluindo, de forma própria e sofisticada, mas bem mais devagar do que a Europa/Eurásia. Não estavam “errando” nem parados no tempo — estavam adaptados pra caralho ao ambiente deles. Mas sem o choque externo, o “progresso” material (no sentido de metalurgia avançada, escrita, estados grandes, ciência, indústria) teria demorado séculos ou milênios a mais, talvez nunca chegando no mesmo ritmo';

        divMostraFuturoPositivo.append(agaQuatro, paragrafo);
    }
});

// Pindorama é 'Outros Quinhentos'
const divMostraPindoramaOutrosQ = document.getElementById('mostraPindrm-outros-qunlhnts');
const botaoMostraPindoramaOutrosQ = document.getElementById('btn-pindrm-outros-qunlhnts');

botaoMostraPindoramaOutrosQ.addEventListener('click', () => {
    divMostraPindoramaOutrosQ.classList.toggle('visivel');
    // se não tem conteúdo adiciona
    if (!divMostraPindoramaOutrosQ.innerHTML) {
        const agaTres = document.createElement('h3');
        const agaQuatro = document.createElement('h4');

        //const div = document.createElement('div');
        //div.className = 'bg-dark text-white h-auto m-1';
        
        agaTres.style.fontFamily = 'var(--titulo)';
        agaTres.style.color = 'lightyellow';
        agaTres.style.textAlign = 'center';
        agaQuatro.style.fontFamily = 'var(--titulos)';
        agaQuatro.style.color = 'lightskyblue';
        agaQuatro.style.textAlign = 'center';

        agaTres.textContent = "Pindorama são 'Outros Quinhentos'";
        agaQuatro.textContent = "Cinco verdades provocativas que mudam nossa visão sobre o Brasil";

        const conteudo = `
            <h3>O Despertar de uma Nova Consciência Histórica</h3>
            <p>Muitos de nós, ao chegarmos neste marco de 2026, compartilhamos uma "estranha certeza". É um sentimento profundo, quase pré-verbal, de que algo extraordinariamente distinto está se desenrolando em nossa percepção coletiva. Esse despertar não é apenas uma intuição mística; é a necessidade urgente de revisitar nossas origens para entender por que a "história oficial" nos soa, cada vez mais, como um ruído de fundo mal sintonizado</p>
            <p>A narrativa que nos foi ensinada — centrada no ano de 1500 — funciona como um mecanismo de exclusão deliberada. Ela silencia as vozes que construíram esta terra milênios antes das caravelas apontarem no horizonte. Para construir um presente íntegro e um futuro que faça sentido, precisamos desmaterializar o peso desse passado mal contado, desmistificar o "descobrimento" e encarar as sombras e luzes do que realmente fomos</p>
            <h3>O Mito do "Descobrimento" como Ferramenta de Poder</h3>
            <p>A ideia de que o Brasil foi "descoberto" em 1500 carece de qualquer sustentação empírica séria. Como bem argumenta a antropóloga Celene Fonseca, o evento fundador da nossa história escrita é um equívoco informacional. Se olharmos sob a ótica europeia, Colombo já havia chegado às Antilhas em 1492 e ao continente em 1498. Por que a insistência em uma primazia portuguesa se o território é contíguo? A verdade é que a "descoberta" tem camadas muito mais antigas: dos Vikings por volta do ano 1000, até a verdadeira descoberta humana, de matriz asiática, que ocorreu há 30 ou 40 mil anos via Estreito de Bering</p>
            <p>A manutenção do "mito de 1500" não é ingênua; é uma construção simbólica para reforçar a hegemonia da raça branca como a única "heroína e soberana", mantendo um sistema de exclusão que desqualifica quem não descende do conquistador. Aqui reside a hipocrisia dos "dois pesos e duas medidas": Portugal orgulha-se imensamente dos Lusitanos, seus antepassados que resistiram ferozmente à conquista romana, mas espera que os brasileiros celebrem, com pompa e circunstância, justamente os seus conquistadores</p>
            <p>"A formulação simbólica do evento basilar da história escrita deste país não é inocente e nem é um detalhe! [...] essa formulação simbólica está diretamente ligada ao racismo, visando uma insidiosa desumanização e desqualificação daqueles que não reivindicarem essa origem."</p>
            <h3>Nem Paraíso Hippie, Nem Selva Primitiva</h3>
            <p>O nome Pindorama, "região das palmeiras" em tupi-guarani, é frequentemente usado como um slogan romântico de um paraíso perdido. Mas a realidade era muito mais complexa e, por isso mesmo, mais fascinante</p>
            <p>Para humanizarmos os povos originários, precisamos aceitar suas "sombras". Pindorama não era um Éden pacífico; era palco de guerras tribais crônicas, escravidão de prisioneiros e canibalismo ritual (antropofagia). Reconhecer essa violência real não diminui esses povos; pelo contrário, retira-os da caricatura de "vítimas puras" e os devolve à categoria de sujeitos da história</p>
            <p>Paralelamente a essa dureza, existia uma engenharia de sofisticação assombrosa. Arqueologia recente e tecnologias como o LiDAR revelam que a Amazônia não era uma selva virgem, mas uma "paisagem humanizada". Estima-se a existência de até 24 mil geoglifos (estruturas monumentais de terra) escondidos sob a mata. Metrópoles como Monte Alegre, no Pará, podem ter abrigado 300 mil pessoas há 11 mil anos. Esses povos criaram a "terra preta", um solo fértil via compostagem orgânica que é usado até hoje, provando uma evolução própria que não precisava do modelo europeu para ser grandiosa</p>
            <h3>A Primazia do Saber Africano e o Apagamento Deliberado</h3>
            <p>A história convencional reduz o papel africano à força bruta, mas o apagamento tecnológico e científico da África é um dos maiores crimes intelectuais da humanidade. O colonialismo criou o conceito de "Negro" — e termos pejorativos como "kaffirs" — para desarticular grupos humanos de suas identidades específicas (Yorubá, Banto, Fon), transformando-os em meras "peças" de comércio desvinculadas de sua terra e história</p>
            <p>O tráfico negreiro não foi uma substituição de "mão de obra fraca"; foi uma engrenagem de lucro absurdo que alimentou o nascimento do capitalismo industrial. E o que esse sistema tentou apagar foi uma ciência milenar:</p>
            <ul>
                <li>
                    <strong>Medicina</strong>:
                    Milênios antes de Hipócrates, Imhotep já praticava técnicas básicas de assepsia e vacinação
                </li>
                <li>
                    <strong>metalurgia</strong>:
                    O povo Haya, na Tanzânia, dominava fornos de alta temperatura para produzir aço há mais de 2 mil anos — um nível de excelência que a Europa só alcançaria no século XIX
                </li>
                <li>
                    <strong>Astronomia</strong>:
                    Os Dogon, no Mali, conheciam o sistema da estrela Sírio e seu pequeno satélite Sírio B (que chamavam de Potolo) séculos antes da invenção do telescópio
                </li>                
            </ul>
            <p>"O conhecimento dos dogon — que sabiam que um bilhão de mundos espiralavam no espaço como a circulação do sangue no corpo de Deus — efetivamente ultrapassa em muito aquilo que o mundo ocidental seria capaz de creditar a uma 'tribo primitiva'."</p>
            <h3>A Resistência como o Verdadeiro Alicerce da Democracia</h3>
            <p>Um país que se orgulha apenas de seus opressores não consegue construir um futuro digno. A verdadeira base da nossa democracia não está nas leis outorgadas pelas elites, mas nas trincheiras anti-racistas e indígenas de resistência</p>
            <p>Devemos nos orgulhar da saga de resistência que se estende desde a invasão. Figuras como Abdias Nascimento e a historiadora Mundinha Araújo são os guardiões dessa memória. A resistência manifestou-se na formação de centenas de Quilombos, que propunham sociedades alternativas comunitárias e multirraciais. O Quilombo de Turiaçu, no Maranhão, é citado por Perdigão Malheiro como um dos que mais resistiram após Palmares. Essa "rebeldia negra" e indígena, que enfrentou a guerra de extermínio e a escravidão, é o único alicerce ético possível para uma nação que deseja ser soberana</p>
            <h2 class="text-warning">2026: A Síntese Elevada e o Despertar Coletivo</h2>
            <p>Ao olharmos para 2026, a "estranha certeza" que sentimos é a percepção de que a história não precisa ser uma disputa eterna entre "vítima" e "opressor". Estamos vivendo o que podemos chamar de uma "identidade híbrida madura"</p>
            <p>A Parábola da Terra das Palmeiras nos ensina que toda a dor, o sangue e o conflito dos últimos quinhentos anos funcionaram, de forma trágica, como "adubo" (fertilizante). Desmaterializar o passado não significa esquecê-lo, mas transmutar esse ressentimento em matéria-prima para uma síntese elevada: onde a sabedoria ancestral da regeneração ecológica se funde com a ciência moderna consciente</p>
            <p>Não somos mais apenas o Pindorama tupi, nem apenas o Brasil europeu. Somos o rio que mudou de curso e tornou-se mais largo ao encontrar novas águas. O despertar coletivo nos convida a honrar todas as nossas raízes — a força técnica africana, a resistência lusitana ao império, a engenharia ecológica indígena — para materializar um presente onde o trauma dá lugar à integração</p>
            <p>E se o nome verdadeiro desta terra não fosse mais apenas Pindorama, nem apenas Brasil, mas algo que o seu coração já reconhece como "casa de todos"?</p>
            <button id="btn-fecha" class="btn btn-danger m-2">Fechar</button>

        `;
        
        divMostraPindoramaOutrosQ.append(agaTres, agaQuatro);
        divMostraPindoramaOutrosQ.innerHTML = conteudo;
        
        const botaoFechar = document.getElementById('btn-fecha');

        botaoFechar.addEventListener('click', () => {
            divMostraPindoramaOutrosQ.innerHTML = '';
        })

    }
});