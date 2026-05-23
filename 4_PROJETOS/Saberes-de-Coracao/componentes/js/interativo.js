/**
 * Biblioteca de Componentes Interativos
 * Para usar em todos os sites do projeto Monetizar
 */

const Interativo = {
    /**
     * TEMA: Dark/Light Mode
     */
    tema: {
        init() {
            const btnEscuro = document.getElementById('btnEscuro');
            const btnClaro = document.getElementById('btnClaro');
            
            if (btnEscuro) btnEscuro.addEventListener('click', () => this.setDark());
            if (btnClaro) btnClaro.addEventListener('click', () => this.setLight());
            
            if (localStorage.getItem('tema') === 'dark') this.setDark();
        },
        
        setDark() {
            document.body.classList.add('dark-mode');
            localStorage.setItem('tema', 'dark');
        },
        
        setLight() {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('tema', 'light');
        }
    },

    /**
     * ACCORDION MODERNO
     * Melhor visibilidade e animações
     */
    accordion: {
        init(selector = '.accordion-item') {
            document.querySelectorAll(selector).forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                
                if (header && content) {
                    header.addEventListener('click', () => {
                        const isOpen = item.classList.contains('open');
                        
                        // Fechar todos
                        document.querySelectorAll(selector).forEach(i => {
                            i.classList.remove('open');
                            i.querySelector('.accordion-content')?.classList.remove('show');
                        });
                        
                        // Abrir o clicado se estava fechado
                        if (!isOpen) {
                            item.classList.add('open');
                            content.classList.add('show');
                        }
                    });
                }
            });
        }
    },

    /**
     * PROGRESSO DE LEITURA
     * Barra que mostra quanto foi lido
     */
    progresso: {
        init() {
            this.barra = document.createElement('div');
            this.barra.id = 'progresso-leitura';
            this.barra.innerHTML = `
                <div class="progresso-container">
                    <div class="progresso-bar" id="progressoBar"></div>
                </div>
                <div class="progresso-texto"><span id="progressoPorcentagem">0%</span> lido</div>
            `;
            document.body.appendChild(this.barra);
            
            window.addEventListener('scroll', () => this.atualizar());
            
            // Adicionar estilos
            if (!document.getElementById('progresso-estilos')) {
                const estilos = document.createElement('style');
                estilos.id = 'progresso-estilos';
                estilos.textContent = `
                    #progresso-leitura {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        z-index: 9999;
                        background: rgba(0,0,0,0.8);
                        padding: 5px;
                    }
                    .progresso-container {
                        width: 100%;
                        height: 4px;
                        background: #333;
                        border-radius: 2px;
                    }
                    .progresso-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #00ff88, #00ccff);
                        width: 0%;
                        transition: width 0.1s;
                        border-radius: 2px;
                    }
                    .progresso-texto {
                        text-align: center;
                        font-size: 10px;
                        color: #fff;
                        margin-top: 2px;
                    }
                `;
                document.head.appendChild(estilos);
            }
        },
        
        atualizar() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progresso = (scrollTop / docHeight) * 100;
            
            const bar = document.getElementById('progressoBar');
            const texto = document.getElementById('progressoPorcentagem');
            
            if (bar && texto) {
                bar.style.width = progresso + '%';
                texto.textContent = Math.round(progresso) + '%';
            }
        }
    },

    /**
     * QUIZ INTERATIVO
     * Testa o conhecimento do usuário
     */
    quiz: {
        init(config) {
            this.config = config;
            this.container = document.getElementById(config.containerId);
            this.indice = 0;
            this.pontos = 0;
            
            this.render();
        },
        
        render() {
            const pergunta = this.config.perguntas[this.indice];
            
            this.container.innerHTML = `
                <div class="quiz-container">
                    <div class="quiz-progresso">Pergunta ${this.indice + 1}/${this.config.perguntas.length}</div>
                    <h3 class="quiz-pergunta">${pergunta.pergunta}</h3>
                    <div class="quiz-opcoes">
                        ${pergunta.opcoes.map((op, i) => `
                            <button class="quiz-opcao" data-indice="${i}">${op}</button>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                </div>
            `;
            
            this.container.querySelectorAll('.quiz-opcao').forEach(btn => {
                btn.addEventListener('click', (e) => this.responder(parseInt(e.target.dataset.indice)));
            });
        },
        
        responder(indice) {
            const pergunta = this.config.perguntas[this.indice];
            const feedback = this.container.querySelector('.quiz-feedback');
            const botoes = this.container.querySelectorAll('.quiz-opcao');
            
            botoes.forEach(b => b.disabled = true);
            
            if (indice === pergunta.correta) {
                this.pontos++;
                feedback.innerHTML = '<div class="quiz-correto">✓ Correto!</div>';
            } else {
                feedback.innerHTML = `<div class="quiz-incorreto">✗ Errado. A resposta era: ${pergunta.opcoes[pergunta.correta]}</div>`;
            }
            
            setTimeout(() => {
                this.indice++;
                if (this.indice < this.config.perguntas.length) {
                    this.render();
                } else {
                    this.finalizar();
                }
            }, 1500);
        },
        
        finalizar() {
            const total = this.config.perguntas.length;
            const percentual = (this.pontos / total) * 100;
            
            let mensagem = '';
            if (percentual >= 80) {
                mensagem = 'Excelente! Você entendeu bem o conteúdo.';
            } else if (percentual >= 50) {
                mensagem = 'Bom trabalho! Mas pode melhorar.';
            } else {
                mensagem = 'Revise o conteúdo e tente novamente.';
            }
            
            this.container.innerHTML = `
                <div class="quiz-resultado">
                    <h3>Resultado</h3>
                    <div class="quiz-pontos">${this.pontos}/${total}</div>
                    <p>${mensagem}</p>
                    <button class="btn-reiniciar" onclick="location.reload()">Refazer Quiz</button>
                </div>
            `;
        }
    },

    /**
     * CALCULADORA EPIGENÉTICA
     * Calcula impacto dos hábitos
     */
    calculadoraEpigenetica: {
        init() {
            this.container = document.getElementById('calculadora-epigenetica');
            if (!this.container) return;
            
            this.render();
        },
        
        render() {
            this.container.innerHTML = `
                <div class="calc-epigenetica">
                    <h3>Calculadora de Impacto Epigenético</h3>
                    <p>Descubra como seus hábitos afetam sua expressão gênica</p>
                    
                    <div class="calc-perguntas">
                        ${this.perguntas.map((p, i) => `
                            <div class="calc-pergunta">
                                <label>${p.pergunta}</label>
                                <select id="calc-${i}">
                                    <option value="0">${p.opcoes[0]}</option>
                                    <option value="${p.valorPositivo}">${p.opcoes[1]}</option>
                                    <option value="${p.valorNegativo}">${p.opcoes[2]}</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="btn-calcular" onclick="Interativo.calculadoraEpigenetica.calcular()">Calcular Impacto</button>
                    <div id="resultado-calc"></div>
                </div>
            `;
            
            // Adicionar estilos
            this.adicionarEstilos();
        },
        
        calcular() {
            let pontuacao = 0;
            this.perguntas.forEach((_, i) => {
                const select = document.getElementById(`calc-${i}`);
                pontuacao += parseInt(select.value);
            });
            
            let resultado = '';
            if (pontuacao > 10) {
                resultado = '<div class="resultado-bom">🌟 Excelente! Seus hábitos estão promovendo expressão gênica saudável.</div>';
            } else if (pontuacao > 0) {
                resultado = '<div class="resultado-medio">⚡ Há space for improvement. small mudanças podem fazer grande diferença.</div>';
            } else {
                resultado = '<div class="resultado-ruim">⚠️ Seus hábitos podem estar afetando negativamente sua epigenética. Considere mudanças.</div>';
            }
            
            document.getElementById('resultado-calc').innerHTML = resultado;
        },
        
        adicionarEstilos() {
            if (document.getElementById('calc-epigenetica-estilos')) return;
            
            const estilos = document.createElement('style');
            estilos.id = 'calc-epigenetica-estilos';
            estilos.textContent = `
                .calc-epigenetica {
                    background: rgba(0,0,0,0.5);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .calc-pergunta {
                    margin: 15px 0;
                }
                .calc-pergunta label {
                    display: block;
                    margin-bottom: 5px;
                    color: #00ccff;
                }
                .calc-pergunta select {
                    width: 100%;
                    padding: 10px;
                    border-radius: 5px;
                    background: #1a1a2e;
                    color: #fff;
                    border: 1px solid #00ff88;
                }
                .btn-calcular {
                    background: linear-gradient(45deg, #00ff88, #00ccff);
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    color: #000;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 15px;
                }
                .resultado-bom, .resultado-medio, .resultado-ruim {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                .resultado-bom { background: rgba(0,255,136,0.2); border: 1px solid #00ff88; }
                .resultado-medio { background: rgba(255,200,0,0.2); border: 1px solid #ffc800; }
                .resultado-ruim { background: rgba(255,50,50,0.2); border: 1px solid #ff3232; }
            `;
            document.head.appendChild(estilos);
        },
        
        perguntas: [
            { pergunta: "Como é sua alimentação?", opcoes: ["Processada", "Balanceada", "Orgânica/Integral"], valorPositivo: 5, valorNegativo: -5 },
            { pergunta: "Nível de estresse?", opcoes: ["Alto", "Moderado", "Baixo"], valorPositivo: 5, valorNegativo: -5 },
            { pergunta: "Exercício físico?", opcoes: ["Sedentário", "Ocasional", "Regular"], valorPositivo: 5, valorNegativo: -5 },
            { pergunta: "Qualidade do sono?", opcoes: ["Ruim", "Regular", "Bom"], valorPositivo: 5, valorNegativo: -5 }
        ]
    },

    /**
     * TABS / NAVEGAÇÃO POR ABAS
     */
    tabs: {
        init(grupoId) {
            const grupos = document.querySelectorAll(`[data-tab-group="${grupoId}"]`);
            
            grupos.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.tabTarget;
                    
                    // Remove active de todos
                    document.querySelectorAll(`[data-tab-group="${grupoId}"]`)
                        .forEach(t => t.classList.remove('active'));
                    document.querySelectorAll(`[data-tab-content="${grupoId}"]`)
                        .forEach(c => c.classList.remove('active'));
                    
                    // Adiciona active ao clicado
                    tab.classList.add('active');
                    document.querySelector(`[data-tab-content="${grupoId}"][data-tab="${target}"]`)
                        ?.classList.add('active');
                });
            });
        }
    },

    /**
     * TIMELINE ANIMADO
     * Para linhas do tempo
     */
    timeline: {
        init() {
            const items = document.querySelectorAll('.timeline-item');
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.2 });
            
            items.forEach(item => observer.observe(item));
        }
    },

    /**
     * ANIMAÇÕES DE ENTRADA
     */
    animacoes: {
        init() {
            const elementos = document.querySelectorAll('[data-animar]');
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animacao = entry.target.dataset.animar;
                        entry.target.classList.add(animacao);
                    }
                });
            }, { threshold: 0.1 });
            
            elementos.forEach(el => observer.observe(el));
        }
    }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    // Verifica qual componente inicializar baseado na página
    if (document.getElementById('btnEscuro') || document.getElementById('btnClaro')) {
        Interativo.tema.init();
    }
    
    if (document.querySelector('.accordion-item')) {
        Interativo.accordion.init();
    }
    
    if (document.getElementById('calculadora-epigenetica')) {
        Interativo.calculadoraEpigenetica.init();
    }
    
    if (document.querySelector('.timeline-item')) {
        Interativo.timeline.init();
    }
    
    if (document.querySelector('[data-animar]')) {
        Interativo.animacoes.init();
    }
});

console.log('Interativo.js carregado ✓');