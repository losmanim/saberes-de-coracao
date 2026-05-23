const botaoRock = document.getElementById('btnRock');
const divMostra = document.getElementById('mostrar');

botaoRock.addEventListener('click', () => {
    divMostra.classList.toggle('ativo');

    if (divMostra.classList.contains('ativo')) {
        divMostra.classList.add('ativo');
        botaoRock.className = 'btn btn-danger'
        botaoRock.textContent = 'Fechar';
        const conteudo1 = `
			<ul class="list-group">
				<li class="list-group-item">
					<strong>Legião Urbana</strong>:
					Liderada por Renato Russo, é talvez a banda mais emblemática, com letras que misturavam política e sentimentos juvenis ("Tempo Perdido", "Eduardo e Mônica"...)</li>				
				<li class="list-group-item">
					<strong>Rita Lee & Os Mutantes</strong>:
					Rita é a "Rainha do Rock" brasileiro, trazendo desde o psicodelismo dos anos 60 até o pop-rock irreverente da sua carreira solo ("Ovelha Negra", "Caso Sério")</li>
				<li class="list-group-item">
					<strong>Raul Seixas</strong>:
					O "Maluco Beleza", uniu o rock'n'roll clássico a elementos místicos e ritmos brasileiros ("Metamorfose Ambulante")</li>
				<li class="list-group-item">
					<strong>Cazuza & Barão Vermelho</strong>: Representantes da explosão do rock nos anos 80, com letras viscerais sobre liberdade e cotidiano</li>
				<li class="list-group-item">
					<strong>Charlie Brown Jr.</strong>:
					Revolucionou os anos 90 e 2000 ao misturar rock, skate e rap, tornando-se a voz de uma nova geração ("Proibida Pra Mim", "Dias de Luta, Dias de Glória"...)</li>
				<li class="list-group-item">
					<strong>Sepultura</strong>
					Tornaram-se referência mundial no thrash e groove metal, com álbuns como Chaos A.D. e Roots
				</li>
				<li class="list-group-item">
					<strong>Angra</strong>
					Power metal com influências clássicas e folclóricas, destaque para Holy Land
				</li>
				<li class="list-group-item">
					<strong>Mamonas Assassinas</strong>
					Fenômeno de humor e música, com sucessos como “Pelados em Santos” e “Robocop gay”
				</li>
				<li class="list-group-item">
					<strong>Skank</strong>
					Misturaram rock, reggae e pop, com hits como “Garota Nacional” e “Jackie Tequila”
				</li>
				<li class="list-group-item">
					<strong>Raimundos</strong>
					Trouxeram o forró punk e se tornaram um fenômeno de massa com “Mulher de Fases”
				</li>
				<li class="list-group-item">
					<strong>Planet Hemp</strong>
					Rock com temáticas sobre maconha e crítica social, liderado por Marcelo D2
				</li>
				<li class="list-group-item">
					<strong>O Rappa</strong>
					Misturaram reggae, rap e rock com letras engajadas, como “O Que Sobrou do Céu”
				</li>
				<li class="list-group-item">
					<strong>Nação Zumbi e Chico Science</strong>
					Líderes do manguebeat, com “Mestre Voadora” e “Maracatu Atômico
				</li>				
			</ul>
		`;
        divMostra.innerHTML = conteudo1;
    } else {
        divMostra.classList.remove('ativo');
        botaoRock.className = 'btn btn-warning'
        botaoRock.textContent = 'Abrir Novamente';
        divMostra.innerHTML = '';
    }
});

const botaoMusicasIndisp = document.getElementById('btnIndisp');
const divMostra1 = document.getElementById('mostrar1');

botaoMusicasIndisp.addEventListener('click', () => {
    divMostra1.classList.toggle('ativo');
    if (divMostra1.classList.contains('ativo')) {
        divMostra1.classList.add('ativo');
        botaoMusicasIndisp.className = 'btn btn-danger';
        botaoMusicasIndisp.textContent = 'Fechar';

        const conteudo2 = `
			<ul class="list-group">
				<li class="list-group-item">
					<strong>Meu Erro</strong>
					<p>Os Paralamas do Sucesso</p>
				</li>
				<li class="list-group-item">
					<strong>Anna Júlia</strong>
					<p>Los Hermanos</p>
				</li>
				<li class="list-group-item">
					<strong>Epitáfio</strong>
					<p>Titãs</p>
				</li>
				<li class="list-group-item">
					<strong>À sua Maneira</strong>
					<p>Capital Inicial</p>
				</li>
				<li class="list-group-item">
					<strong>Minha Alma (A paz que eu não quero)</strong>
					<p>O Rappa</p>
				</li>
			</ul>
			<h4>Movimentos e Épocas</h4>
			<p>Anos 80 (O "BRock"): Período de ouro com bandas como Titãs, Paralamas do Sucesso, RPM e Engenheiros do Hawaii, que ocuparam estádios em todo o país</p>
			<p>Anos 90 e 2000: Surgimento de vertentes mais pesadas ou misturadas ao pop e ska, como Sepultura (metal), Raimundos, Skank e Jota Quest</p>
		`;
        divMostra1.innerHTML = conteudo2;
    } else {
        divMostra1.classList.remove('ativo')
        botaoMusicasIndisp.textContent = 'Abrir Novamente';
        botaoMusicasIndisp.className = 'btn btn-warning';
        divMostra1.innerHTML = '';
    }
});

const botaoSelecao = document.getElementById('btnSelecao');
const divMostra2 = document.getElementById('mostra2');

botaoSelecao.addEventListener('click', () => {
	divMostra2.classList.toggle('ativar');

	if (divMostra2.classList.contains('ativar')) {
		divMostra2.classList.add('ativar');
		botaoSelecao.textContent = 'Fechar';
		botaoSelecao.className = 'btn btn-danger';

		const conteudo3 = `
			<ol>
				<li>
					<strong>O Pai do Rock (Raul Seixas)</strong>
					<p>Metamorfose Ambulante</p>
					<p>Outo de Tolo</p>
					<p>Maluco Beleza</p>
					<p>Krig-Ha, Bandolo</p>
					<p>Gita</p>
				</li>
				<li>
					<strong>A Explosão dos 80 (Legião Urbana & Barão Vermelho)</strong>
					<p>Tempo Perdido</p>
					<p>Eduardo e Mônica</p>
					<p>Faroeste Caboclo</p>
					<p>Pro dia nascer Feliz (Cazuza & Barão Vermelho)</p>
					<p>O Tempo Não Para (Barão Vermelho feat. Cazuza)</p>
					<p>Puro Êxtase (Barão Vermelho)</p>
					<p>Exagerado (Cazuza)</p>
				</li>
				<li>
					<strong>A Fusão dos 90/00 (Charlie Brown Jr.)</strong>
					<p>Proibida Pra Mim</p>
			        </p>>Dias de luta, Dias de Glória</p>
					<p>Zóio de Lula</p>
					<p>Cem mil lições</p>
				</li>
				<li>
					<strong>Bônus (Os Clássicos Indispensáveis)</strong>
					<p>Pais e Filhos (Legião Urbana)</p>
					<p>Rock'n'Roll (Raul Seixas)</p>
					<p>Ideologia (Cazuza)</p>
					<p>A Culpa é da Favela (Charlie Brown Jr.)</p>
				</li>	
			</ol>
		`;
		divMostra2.innerHTML = conteudo3;
	} else {
		divMostra2.classList.remove('ativar');
		botaoSelecao.textContent = 'Abrir Novamente';
		botaoSelecao.className = 'btn btn-warning';
		divMostra2.innerHTML = '';
	}
})