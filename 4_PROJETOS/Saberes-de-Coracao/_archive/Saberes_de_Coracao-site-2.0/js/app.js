/* ========================================
   JavaScript - O CAMINHO (v2.0)
   Funções completas e testadas
   ======================================== */

(function() {
    'use strict';

    // ==========================================
    // DADOS UNIFICADOS
    // ==========================================
    const DADOS = {
        categorias: [
            { id: 1, nome: "ESPÍRITO", slug: "espirito", descricao: "Conhecimento Gnóstico", cor: "#9b59b6" },
            { id: 2, nome: "PRÁTICAS", slug: "praticas", descricao: "Trabalho Interior", cor: "#3498db" },
            { id: 3, nome: "CIÊNCIA", slug: "ciencia", descricao: "Baseado em Evidências", cor: "#2ecc71" },
            { id: 4, nome: "JORNADA", slug: "jornada", descricao: "Transformação", cor: "#e67e22" },
            { id: 5, nome: "VIDA VERDADEIRA", slug: "vida-verdadeira", descricao: "Integração", cor: "#e74c3c" }
        ],
        saberes: [
            { id: "gnose-1", titulo: "O Que é Gnose?", slug: "gnose-o-que-e", categoria_id: 1, nivel: "iniciante", duracao: 15 },
            { id: "gnose-2", titulo: "Os Três Mundos", slug: "gnose-tres-mundos", categoria_id: 1, nivel: "intermediario", duracao: 20 },
            { id: "gnose-3", titulo: "Textos Gnósticos", slug: "gnose-textos", categoria_id: 1, nivel: "intermediario", duracao: 30 },
            { id: "gnose-4", titulo: "Prática: Autoobservação", slug: "gnose-pratica", categoria_id: 1, nivel: "iniciante", duracao: 10 },
            { id: "hermetismo-1", titulo: "Os 7 Princípios", slug: "hermetismo-principios", categoria_id: 1, nivel: "iniciante", duracao: 30 },
            { id: "correspondencia-1", titulo: "Lei da Correspondência", slug: "lei-correspondencia", categoria_id: 1, nivel: "iniciante", duracao: 20 },
            { id: "epigenetica-1", titulo: "O Que é Epigenética?", slug: "epigenetica-o-que-e", categoria_id: 3, nivel: "iniciante", duracao: 20 },
            { id: "epigenetica-2", titulo: "Os 3 Mecanismos", slug: "epigenetica-mecanismos", categoria_id: 3, nivel: "intermediario", duracao: 25 },
            { id: "epigenetica-3", titulo: "O Que Influencia?", slug: "epigenetica-influencias", categoria_id: 3, nivel: "iniciante", duracao: 20 },
            { id: "kundalini-1", titulo: "O Que é Kundalini?", slug: "kundalini-o-que-e", categoria_id: 1, nivel: "intermediario", duracao: 25 },
            { id: "teosofia-1", titulo: "O Que é Teosofia?", slug: "teosofia-o-que-e", categoria_id: 1, nivel: "iniciante", duracao: 20 },
            { id: "coracao-1", titulo: "Campo Eletromagnético", slug: "coracao-campo", categoria_id: 3, nivel: "iniciante", duracao: 15 },
            { id: "coracao-2", titulo: "Coerência Cardíaca", slug: "coracao-coerencia", categoria_id: 3, nivel: "iniciante", duracao: 15 },
            { id: "respiracao-1", titulo: "Respiração Quadrada", slug: "respiracao-quadrada", categoria_id: 2, nivel: "iniciante", duracao: 10 },
            { id: "meditacao-1", titulo: "Técnica de Meditação", slug: "tecnica-meditacao", categoria_id: 2, nivel: "iniciante", duracao: 20 },
            { id: "mantras-1", titulo: "Mantras de Poder", slug: "mantras-poder", categoria_id: 2, nivel: "iniciante", duracao: 15 },
            { id: "jornada-1", titulo: "A Jornada da Consciência", slug: "jornada-consciencia", categoria_id: 4, nivel: "avancado", duracao: 30 }
        ],
        praticas: [
            { nome: "Respiração 4x4", duracao: 4, frequencia: "diaria" },
            { nome: "Meditação Chakras", duracao: 15, frequencia: "diaria" },
            { nome: "Autoobservação", duracao: 10, frequencia: "diaria" },
            { nome: "Respiração Coerente", duracao: 5, frequencia: "diaria" }
        ]
    };

    // ==========================================
    // BARRA DE PROGRESSO
    // ==========================================
    const BarraProgresso = {
        init: function() {
            if (document.getElementById('barra-progresso')) return;
            const barra = document.createElement('div');
            barra.id = 'barra-progresso';
            barra.innerHTML = '<div id="barra-progresso-fill"></div>';
            document.body.appendChild(barra);
            window.addEventListener('scroll', function() {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progresso = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                const fill = document.getElementById('barra-progresso-fill');
                if (fill) fill.style.width = Math.min(progresso, 100) + '%';
            });
        }
    };

    // ==========================================
    // TEMA (Dark/Light) - Toggle Único
    // ==========================================
    const Tema = {
        init: function() {
            const temaSalvo = localStorage.getItem('tema');
            const toggleBtn = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');

            if (temaSalvo === 'claro') {
                document.body.classList.add('modo-claro');
                if (themeIcon) themeIcon.className = 'bi bi-sun';
            }

            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    const isClaro = document.body.classList.contains('modo-claro');
                    if (isClaro) {
                        document.body.classList.remove('modo-claro');
                        localStorage.setItem('tema', 'escuro');
                        if (themeIcon) themeIcon.className = 'bi bi-moon-stars';
                    } else {
                        document.body.classList.add('modo-claro');
                        localStorage.setItem('tema', 'claro');
                        if (themeIcon) themeIcon.className = 'bi bi-sun';
                    }
                });
            }

            window.MudarTema = function(modo) {
                if (modo === 'claro') {
                    document.body.classList.add('modo-claro');
                    localStorage.setItem('tema', 'claro');
                    if (themeIcon) themeIcon.className = 'bi bi-sun';
                } else {
                    document.body.classList.remove('modo-claro');
                    localStorage.setItem('tema', 'escuro');
                    if (themeIcon) themeIcon.className = 'bi bi-moon-stars';
                }
            };
        }
    };

    // ==========================================
    // ACCORDION
    // ==========================================
    const Accordion = {
        init: function(selector) {
            const items = document.querySelectorAll(selector);
            if (!items.length) return;
            items.forEach(function(item) {
                const header = item.querySelector('.accordion-header');
                if (header) {
                    header.addEventListener('click', function() {
                        const isActive = item.classList.contains('active');
                        items.forEach(function(i) {
                            i.classList.remove('active');
                        });
                        if (!isActive) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }
    };

    // ==========================================
    // TABS
    // ==========================================
    const Tabs = {
        init: function(containerSelector) {
            const containers = document.querySelectorAll(containerSelector);
            if (!containers.length) return;
            containers.forEach(function(container) {
                const botoes = container.querySelectorAll('.tab-btn');
                const contents = container.querySelectorAll('.tab-content');
                botoes.forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        const tabTarget = btn.dataset.tabTarget;
                        botoes.forEach(function(b) {
                            b.classList.remove('active');
                        });
                        contents.forEach(function(c) {
                            c.classList.remove('active');
                        });
                        btn.classList.add('active');
                        const content = container.querySelector('[data-tab="' + tabTarget + '"]');
                        if (content) {
                            content.classList.add('active');
                        }
                    });
                });
            });
        }
    };

    // ==========================================
    // TIMELINE ANIMADO
    // ==========================================
    const Timeline = {
        init: function() {
            const items = document.querySelectorAll('.timeline-item');
            if (!items.length) return;
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry, index) {
                    if (entry.isIntersecting) {
                        setTimeout(function() {
                            entry.target.classList.add('visible');
                        }, index * 200);
                    }
                });
            }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
            items.forEach(function(item) {
                observer.observe(item);
            });
        }
    };

    // ==========================================
    // ANIMAÇÕES DE SCROLL
    // ==========================================
    const AnimaçõesScroll = {
        init: function() {
            const elementos = document.querySelectorAll('.animacao-entrada');
            if (!elementos.length) return;
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            elementos.forEach(function(el) {
                observer.observe(el);
            });
        }
    };

    // ==========================================
    // QUIZ INTERATIVO (SIMPLIFICADO E CORRIGIDO)
    // ==========================================
    const Quiz = {
        container: null,
        perguntas: [],
        indice: 0,
        pontuacao: 0,
        acertos: 0,
        respostas: [],

        init: function(config) {
            this.container = document.getElementById(config.containerId);
            if (!this.container) {
                console.error('Container do quiz não encontrado:', config.containerId);
                return;
            }
            this.perguntas = Array.isArray(config.perguntas) ? config.perguntas : [];
            this.indice = 0;
            this.pontuacao = 0;
            this.acertos = 0;
            this.respostas = [];
            this.renderizar();
        },

        renderizar: function() {
            if (!this.container) return;

            if (this.indice >= this.perguntas.length) {
                this.mostrarResultadoFinal();
                return;
            }

            const pergunta = this.perguntas[this.indice];
            const progresso = ((this.indice) / this.perguntas.length) * 100;

            this.container.innerHTML = `
                <div class="quiz-wrapper">
                    <div class="quiz-progresso">
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${progresso}%"></div>
                        </div>
                        <div class="quiz-info">
                            <span>Pergunta ${this.indice + 1} de ${this.perguntas.length}</span>
                            <span>Pontos: ${this.pontuacao}</span>
                        </div>
                    </div>
                    
                    <div class="quiz-pergunta">${pergunta.pergunta}</div>
                    
                    <div class="quiz-opcoes">
                        ${pergunta.opcoes.map((opcao, i) => `
                            <button class="quiz-opcao" data-indice="${i}">
                                <span class="opcao-letra">${String.fromCharCode(65 + i)}</span>
                                ${opcao}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="quiz-feedback"></div>
                    
                    ${this.indice < this.perguntas.length - 1 ? 
                        '<button class="quiz-proximo">Próxima Pergunta</button>' : ''}
                </div>
            `;

            this.adicionarEventos();
        },

        adicionarEventos: function() {
            const self = this;

            // Eventos das opções
            this.container.querySelectorAll('.quiz-opcao').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indice = parseInt(e.currentTarget.dataset.indice);
                    self.responder(indice);
                });
            });

            // Evento do botão próximo
            const btnProximo = this.container.querySelector('.quiz-proximo');
            if (btnProximo) {
                btnProximo.addEventListener('click', () => {
                    this.indice++;
                    this.renderizar();
                });
            }
        },

        responder: function(indiceEscolhido) {
            const pergunta = this.perguntas[this.indice];
            const opcoes = this.container.querySelectorAll('.quiz-opcao');
            const feedback = this.container.querySelector('.quiz-feedback');

            // Desabilitar todas as opções
            opcoes.forEach(op => op.disabled = true);

            // Verificar resposta
            const correto = indiceEscolhido === pergunta.correta;
            if (correto) {
                this.pontuacao += 10;
                this.acertos++;
                opcoes[indiceEscolhido].classList.add('correto');
                feedback.innerHTML = '<div class="quiz-feedback correto"><i class="bi bi-check-circle-fill"></i> Correto! +10 pontos</div>';
            } else {
                opcoes[indiceEscolhido].classList.add('incorreto');
                opcoes[pergunta.correta].classList.add('correto');
                feedback.innerHTML = `<div class="quiz-feedback incorreto"><i class="bi bi-x-circle-fill"></i> Errado. Resposta correta: ${pergunta.opcoes[pergunta.correta]}</div>`;
            }

            this.respostas.push({
                pergunta: pergunta.pergunta,
                escolhida: pergunta.opcoes[indiceEscolhido],
                correta: pergunta.opcoes[pergunta.correta],
                acertou: correto
            });

            // Mostrar botão próximo (exceto na última pergunta)
            if (this.indice < this.perguntas.length - 1) {
                const btnProximo = this.container.querySelector('.quiz-proximo');
                if (btnProximo) btnProximo.style.display = 'block';
            }
        },

        mostrarResultadoFinal: function() {
            const total = this.perguntas.length;
            const percentual = (this.acertos / total) * 100;

            let mensagem = '';
            let emoji = '';

            if (percentual >= 80) {
                emoji = '🌟';
                mensagem = 'Excelente! Você dominou o conteúdo!';
            } else if (percentual >= 60) {
                emoji = '👍';
                mensagem = 'Bom trabalho! Continue estudando.';
            } else if (percentual >= 40) {
                emoji = '📖';
                mensagem = 'Você está no caminho certo! Revise o conteúdo.';
            } else {
                emoji = '💪';
                mensagem = 'Não desanime! A prática leva à perfeição.';
            }

            this.container.innerHTML = `
                <div class="quiz-resultado">
                    <div class="resultado-emoji">${emoji}</div>
                    <h3>${mensagem}</h3>
                    <div class="resultado-estatisticas">
                        <div class="stat-item">
                            <span class="stat-num">${this.acertos}</span>
                            <span class="stat-label">Acertos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-num">${total - this.acertos}</span>
                            <span class="stat-label">Erros</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-num">${this.pontuacao}</span>
                            <span class="stat-label">Pontos</span>
                        </div>
                    </div>
                    <div class="resultado-botoes">
                        <button class="quiz-botao-reiniciar">Tentar Novamente</button>
                        <button class="quiz-botao-revisar">Ver Respostas</button>
                    </div>
                </div>
            `;

            // Eventos dos botões de resultado
            this.container.querySelector('.quiz-botao-reiniciar').addEventListener('click', () => {
                this.reiniciar();
            });

            this.container.querySelector('.quiz-botao-revisar').addEventListener('click', () => {
                this.mostrarDetalhes();
            });
        },

        reiniciar: function() {
            this.indice = 0;
            this.pontuacao = 0;
            this.acertos = 0;
            this.respostas = [];
            this.renderizar();
        },

        mostrarDetalhes: function() {
            const detalhesHtml = this.respostas.map((resp, i) => `
                <div class="detalhe-item ${resp.acertou ? 'correto' : 'incorreto'}">
                    <div class="detalhe-numero">${i + 1}</div>
                    <div class="detalhe-conteudo">
                        <p class="detalhe-pergunta">${resp.pergunta}</p>
                        <p class="detalhe-resposta"><strong>Sua resposta:</strong> ${resp.escolhida}</p>
                        <p class="detalhe-correta"><strong>Correta:</strong> ${resp.correta}</p>
                    </div>
                </div>
            `).join('');

            this.container.innerHTML = `
                <div class="quiz-resultado">
                    <h3>Detalhes das Respostas</h3>
                    <div class="resultado-detalhes">
                        ${detalhesHtml}
                    </div>
                    <button class="quiz-botao-reiniciar">Voltar ao Quiz</button>
                </div>
            `;

            this.container.querySelector('.quiz-botao-reiniciar').addEventListener('click', () => {
                this.reiniciar();
            });
        }
    };

    // ==========================================
    // CALCULADORA EPIGENÉTICA
    // ==========================================
    const CalculadoraEpigenetica = {
        init: function() {
            var container = document.getElementById('calc-epigenetica');
            if (!container) return;
            var self = this;
            container.innerHTML =
                '<div class="calc-container">' +
                '<h3>🧬 Calculadora Epigenética</h3>' +
                '<p>Descubra seu impacto epigenético:</p>' +
                '<div class="calc-perguntas">' +
                self.gerarPerguntas() +
                '</div>' +
                '<div class="calc-resultado"></div>' +
                '<button class="calc-botao" onclick="CalculadoraEpigenetica.calcular()">Calcular</button>' +
                '</div>';
        },
        gerarPerguntas: function() {
            var perguntas = [
                { id: 'alimentacao', texto: 'Como é sua alimentação?', opcoes: ['Predominemente processada', 'Balanceada', 'Majoritariamente natural'] },
                { id: 'exercicio', texto: 'Você se exercita?', opcoes: ['Raramente', 'Às vezes', 'Regularmente'] },
                { id: 'sono', texto: 'Você dorme bem?', opcoes: ['Mal', 'Regular', 'Bem'] },
                { id: 'stress', texto: 'Seu nível de estresse?', opcoes: ['Alto', 'Moderado', 'Baixo'] },
                { id: 'social', texto: 'Você tem conexões sociais?', opcoes: ['Solitário', 'Algumas', 'Muito conectado'] }
            ];
            var html = '';
            perguntas.forEach(function(p, i) {
                html += '<div class="calc-pergunta"><p>' + p.texto + '</p>';
                p.opcoes.forEach(function(op, j) {
                    html += '<label class="calc-option"><input type="radio" name="' + p.id + '" value="' + (2 - j) + '"> ' + op + '</label>';
                });
                html += '</div>';
            });
            return html;
        },
        calcular: function() {
            var perguntas = ['alimentacao', 'exercicio', 'sono', 'stress', 'social'];
            var pontos = 0;
            perguntas.forEach(function(id) {
                var input = document.querySelector('input[name="' + id + '"]:checked');
                if (input) pontos += parseInt(input.value);
            });
            var total = perguntas.length * 2;
            var percentual = (pontos / total) * 100;
            var mensagem = '';
            if (percentual >= 80) {
                mensagem = '🌟Excelente! Sua epigenética está emottima forma.';
            } else if (percentual >= 50) {
                mensagem = '⚡Bom! Mastem espaço para melhorar.';
            } else {
                mensagem = '📚 Considere adotar hábitos mais saudáveis.';
            }
            var resultado = document.querySelector('.calc-resultado');
            if (resultado) {
                resultado.innerHTML = '<p>' + mensagem + '</p><p>Pontuação: ' + Math.round(percentual) + '%</p>';
            }
        }
    };

    // ==========================================
    // SISTEMA DE PROGRESSO
    // ==========================================
    const Aprendizado = {
        init: function() {
            this.inicializarBotoes();
            this.atualizarProgresso();
        },
        inicializarBotoes: function() {
            var botoes = document.querySelectorAll('.btn-marcar');
            var self = this;
            botoes.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    var lesson = e.currentTarget.dataset.lesson;
                    if (lesson) {
                        self.marcarConcluido(lesson, e.currentTarget);
                    }
                });
            });
        },
        marcarConcluido: function(lesson, btn) {
            // Change icon
            var icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-check2-square');
                icon.classList.add('bi-check-circle-fill');
            }
            // Change button text
            btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Concluído';
            btn.disabled = true;
            // Save to localStorage
            var progressoSalvo = localStorage.getItem('progressoSaberes');
            var progresso = progressoSalvo ? JSON.parse(progressoSalvo) : {};
            if (!progresso[lesson]) {
                progresso[lesson] = { concluido: true, data: new Date().toISOString() };
                localStorage.setItem('progressoSaberes', JSON.stringify(progresso));
            }
            this.atualizarProgresso();
        },
        atualizarProgresso: function() {
            var progressosalvo = localStorage.getItem('progressoSaberes');
            var progresso = progressosalvo ? JSON.parse(progressosalvo) : {};
            var concluir = Object.keys(progresso).filter(function(k) {
                return progresso[k].concluido;
            }).length;
            var total = document.querySelectorAll('.accordion-item').length;
            var percentual = total > 0 ? Math.round((concluir / total) * 100) : 0;
            var indicators = document.querySelectorAll('.lesson-indicator');
            indicators.forEach(function(ind) {
                var item = ind.closest('.accordion-item');
                if (item && item.classList.contains('concluido')) {
                    ind.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
                }
            });
            var bars = document.querySelectorAll('.tab-status');
            bars.forEach(function(bar) {
                bar.textContent = percentual + '%';
            });
        }
    };

    // ==========================================
    // BUSCA
    // ==========================================
    const Search = {
        data: [
            { title: 'Gnose', desc: 'Conhecimento direto e experiencial da natureza divina', link: '#conhecimento' },
            { title: 'O Que é Gnose?', desc: 'Conhecimento direto e experiencial da natureza divina — não crença, mas experiência.', link: '#conhecimento' },
            { title: 'Os Três Mundos', desc: 'Plerooma, Kenoma e Sarak — os mundos da tradição gnóstica', link: '#conhecimento' },
            { title: 'Epigenética', desc: 'A ciência que prova: você não é vítima dos seus genes', link: '#conhecimento' },
            { title: 'O Que é Epigenética?', desc: 'Estudo das mudanças na atividade dos genes sem alterações no DNA', link: '#conhecimento' },
            { title: 'Hermetismo', desc: 'Filosofia que une ciência, misticismo e sabedoria prática', link: '#conhecimento' },
            { title: 'Os Sete Princípios do Kybalion', desc: 'Mentalismo, Correspondência, Vibração, Polaridade, Ritmo, Causa e Efeito, Gênero', link: '#conhecimento' },
            { title: 'Kundalini', desc: 'A energia serpentina que ascende pela coluna vertebral', link: '#conhecimento' },
            { title: 'O Que é Kundalini?', desc: 'Energia espiritual latente na base da coluna', link: '#conhecimento' },
            { title: 'Os 33 Vértebras', desc: 'O canal central Sushumna passa por 33 vértebras', link: '#conhecimento' },
            { title: 'Teosofia', desc: 'Sabedoria Divina — síntese de todas as tradições', link: '#conhecimento' },
            { title: 'O Que é Teosofia?', desc: 'Sophia = sabedoria, Theos = Deus', link: '#conhecimento' },
            { title: 'Coração', desc: 'O coração como centro de inteligência', link: '#conhecimento' },
            { title: 'Campo Eletromagnético', desc: 'O coração gera campo 60x maior que o cérebro', link: '#conhecimento' },
            { title: 'Coerência Cardíaca', desc: 'Estado de harmonia entre coração, mente e emoção', link: '#conhecimento' },
            { title: 'Práticas', desc: 'O caminho prático da transformação', link: '#praticas' },
            { title: 'Autoconhecimento', desc: 'Conhecer a si mesmo é o primeiro passo', link: '#praticas' },
            { title: 'Meditação', desc: 'Técnicas de meditação e respiração', link: '#meditacao' },
            { title: 'Respiração Quadrada', desc: 'Respire por 4 segundos, segure, exale, segure', link: '#meditacao' },
            { title: 'Mantras', desc: 'Sons sagrados para purificação da consciência', link: '#meditacao' },
            { title: 'OM (AUM)', desc: 'O som primordial que contém todos os outros sons', link: '#meditacao' },
            { title: 'Jornada da Consciência', desc: 'A consciência humana e sua ligação com o Todo', link: '#jornada' },
            { title: 'Impacto na Vida', desc: 'Como integrar saberes ancestrais no cotidiano', link: '#impacto' }
        ],
        init: function() {
            const searchToggle = document.getElementById('search-toggle');
            const searchModal = document.getElementById('search-modal');
            const searchInput = document.getElementById('search-input');
            const searchResults = document.getElementById('search-results');
            const modalClose = searchModal ? searchModal.querySelector('.modal-close') : null;

            if (!searchToggle || !searchModal) return;

            searchToggle.addEventListener('click', function() {
                searchModal.classList.add('open');
                searchModal.setAttribute('aria-hidden', 'false');
                setTimeout(() => searchInput.focus(), 100);
            });

            if (modalClose) {
                modalClose.addEventListener('click', function() {
                    searchModal.classList.remove('open');
                    searchModal.setAttribute('aria-hidden', 'true');
                });
            }

            searchModal.addEventListener('click', function(e) {
                if (e.target === searchModal) {
                    searchModal.classList.remove('open');
                    searchModal.setAttribute('aria-hidden', 'true');
                }
            });

            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    return;
                }

                const results = Search.data.filter(function(item) {
                    return item.title.toLowerCase().includes(query) ||
                        item.desc.toLowerCase().includes(query);
                });

                if (results.length === 0) {
                    searchResults.innerHTML = '<p style="text-align:center;opacity:0.6;">Nenhum resultado encontrado</p>';
                } else {
                    searchResults.innerHTML = results.map(function(item) {
                        return '<div class="search-result-item" onclick="window.location.hash=\'' + item.link + '\';Search.close()">' +
                            '<h4>' + item.title + '</h4>' +
                            '<p>' + item.desc + '</p></div>';
                    }).join('');
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchModal.classList.contains('open')) {
                    searchModal.classList.remove('open');
                    searchModal.setAttribute('aria-hidden', 'true');
                }
            });
        },
        close: function() {
            const searchModal = document.getElementById('search-modal');
            if (searchModal) {
                searchModal.classList.remove('open');
                searchModal.setAttribute('aria-hidden', 'true');
            }
        }
    };

    // ==========================================
    // FAVORITOS
    // ==========================================
    const Favoritos = {
        init: function() {
            const favToggle = document.getElementById('favorites-toggle');
            const favPanel = document.getElementById('favorites-panel');
            const panelClose = favPanel ? favPanel.querySelector('.panel-close') : null;
            const exportBtn = document.getElementById('export-favorites');

            if (!favToggle || !favPanel) return;

            favToggle.addEventListener('click', function() {
                favPanel.classList.add('open');
                favPanel.setAttribute('aria-hidden', 'false');
                Favoritos.render();
            });

            if (panelClose) {
                panelClose.addEventListener('click', function() {
                    favPanel.classList.remove('open');
                    favPanel.setAttribute('aria-hidden', 'true');
                });
            }

            favPanel.addEventListener('click', function(e) {
                if (e.target === favPanel) {
                    favPanel.classList.remove('open');
                    favPanel.setAttribute('aria-hidden', 'true');
                }
            });

            if (exportBtn) {
                exportBtn.addEventListener('click', function() {
                    Favoritos.export();
                });
            }
        },

        add: function(titulo, link) {
            const favoritos = JSON.parse(localStorage.getItem('favoritosSaberes') || '[]');
            const existe = favoritos.some(function(f) { return f.link === link; });
            if (!existe) {
                favoritos.push({ titulo: titulo, link: link, data: new Date().toISOString() });
                localStorage.setItem('favoritosSaberes', JSON.stringify(favoritos));
            }
        },

        remove: function(link) {
            let favoritos = JSON.parse(localStorage.getItem('favoritosSaberes') || '[]');
            favoritos = favoritos.filter(function(f) { return f.link !== link; });
            localStorage.setItem('favoritosSaberes', JSON.stringify(favoritos));
            Favoritos.render();
        },

        render: function() {
            const list = document.getElementById('favorites-list');
            if (!list) return;

            const favoritos = JSON.parse(localStorage.getItem('favoritosSaberes') || '[]');

            if (favoritos.length === 0) {
                list.innerHTML = '<p class="empty-message">Nenhum favorito salvo ainda.</p>';
            } else {
                list.innerHTML = favoritos.map(function(fav) {
                    return '<div class="favorite-item">' +
                        '<a href="' + fav.link + '" class="favorite-title">' + fav.titulo + '</a>' +
                        '<button class="favorite-remove" onclick="Favoritos.remove(\'' + fav.link + '\')" aria-label="Remover">' +
                        '<i class="bi bi-x-lg"></i></button></div>';
                }).join('');
            }
        },

        export: function() {
            const favoritos = JSON.parse(localStorage.getItem('favoritosSaberes') || '[]');
            const blob = new Blob([JSON.stringify(favoritos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'favoritos-saberes-ancestrais.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // ==========================================
    // BREADCRUMB
    // ==========================================
    const Breadcrumb = {
        init: function() {
            const links = document.querySelectorAll('.nav-link');
            const currentBreadcrumb = document.getElementById('breadcrumb-current');

            links.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        const sectionId = href.substring(1);
                        if (currentBreadcrumb) {
                            const section = document.getElementById(sectionId);
                            if (section) {
                                const h2 = section.querySelector('h2');
                                if (h2) {
                                    currentBreadcrumb.textContent = h2.textContent.trim();
                                }
                            }
                        }
                    }
                });
            });
        }
    };

    // ==========================================
    // BOTÃO VOLTAR AO TOPO
    // ==========================================
    const BackToTop = {
        init: function() {
            const btn = document.getElementById('back-to-top');
            if (!btn) return;

            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            });

            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // ==========================================
    // MAPA UNIVERSO - ESTRELAS DINÂMICAS
    // ==========================================
    const UniverseStars = {
        init: function() {
            const container = document.getElementById('starsContainer');
            if (!container) return;

            const numStars = 150;

            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';

                const size = Math.random() * 2 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
                star.style.setProperty('--delay', (Math.random() * 5) + 's');
                star.style.opacity = Math.random() * 0.7 + 0.3;

                container.appendChild(star);
            }

            // Adicionar nebulosas
            const nebula1 = document.createElement('div');
            nebula1.className = 'nebula nebula-1';
            container.appendChild(nebula1);

            const nebula2 = document.createElement('div');
            nebula2.className = 'nebula nebula-2';
            container.appendChild(nebula2);

            // Interação dos planetas
            this.initPlanetInteraction();

            // Verificar se veio de um clique no planeta
            this.checkHashNavigation();
        },

        initPlanetInteraction: function() {
            const self = this;
            const planets = document.querySelectorAll('.planet');

            planets.forEach(function(planet) {
                // Ao clicar, abrir a tab correspondente
                planet.addEventListener('click', function(e) {
                    const href = planet.getAttribute('href');
                    const tabTarget = self.getTabFromPlanet(planet);
                    if (href && tabTarget) {
                        setTimeout(function() {
                            self.activateTab(tabTarget);
                        }, 100);
                    }
                });
            });
        },

        getTabFromPlanet: function(planet) {
            const classList = planet.classList;
            if (classList.contains('planet-1')) return 'gnose';
            if (classList.contains('planet-2')) return 'epigenetica';
            if (classList.contains('planet-3')) return 'hermetismo';
            if (classList.contains('planet-4')) return 'kundalini';
            if (classList.contains('planet-5')) return 'teosofia';
            if (classList.contains('planet-6')) return 'coracao';
            if (classList.contains('planet-7')) return 'respiracao';
            if (classList.contains('planet-8')) return 'materialista';
            return null;
        },

        activateTab: function(tabId) {
            const tabsContainer = document.querySelector('#conhecimento .tabs-container');
            if (!tabsContainer) return;

            const buttons = tabsContainer.querySelectorAll('.tab-btn');
            const contents = tabsContainer.querySelectorAll('.tab-content');

            buttons.forEach(function(btn) {
                btn.classList.remove('active');
                if (btn.dataset.tabTarget === tabId) {
                    btn.classList.add('active');
                }
            });

            contents.forEach(function(content) {
                content.classList.remove('active');
                if (content.dataset.tab === tabId) {
                    content.classList.add('active');
                }
            });
        },

        checkHashNavigation: function() {
            const hash = window.location.hash;
            if (hash) {
                const planet = document.querySelector('.planet[href="' + hash + '"]');
                if (planet) {
                    const tabTarget = this.getTabFromPlanet(planet);
                    if (tabTarget) {
                        setTimeout(function() {
                            document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
                            setTimeout(function() {
                                window.UniverseStars.activateTab(tabTarget);
                            }, 500);
                        }, 100);
                    }
                }
            }
        }
    };

    // ==========================================
    // NAV HIDE/SHOW NO SCROLL
    // ==========================================
    const NavHideShow = {
        lastScroll: 0,
        init: function() {
            const nav = document.querySelector('nav');
            if (!nav) return;

            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset;

                if (currentScroll <= 0) {
                    nav.classList.remove('hide');
                    return;
                }

                if (currentScroll > this.lastScroll && currentScroll > 100) {
                    nav.classList.add('hide');
                } else {
                    nav.classList.remove('hide');
                }

                this.lastScroll = currentScroll;
            });
        }
    };

    // ==========================================
    // NEWSLETTER
    // ==========================================
    const Newsletter = {
        init: function() {
            const form = document.getElementById('newsletter-form');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('newsletter-email').value;
                const messageEl = document.getElementById('newsletter-message');

                if (email && email.includes('@')) {
                    const subscribers = JSON.parse(localStorage.getItem('newsletterSubs') || '[]');
                    if (!subscribers.includes(email)) {
                        subscribers.push(email);
                        localStorage.setItem('newsletterSubs', JSON.stringify(subscribers));
                    }

                    messageEl.textContent = 'Obrigado! Você foi inscrito com sucesso.';
                    messageEl.className = 'newsletter-message success';
                    form.reset();
                } else {
                    messageEl.textContent = 'Por favor, insira um e-mail válido.';
                    messageEl.className = 'newsletter-message error';
                }

                setTimeout(function() {
                    messageEl.textContent = '';
                    messageEl.className = 'newsletter-message';
                }, 5000);
            });
        }
    };

    // ==========================================
    // INICIALIZAÇÃO GLOBAL
    // ==========================================
    function inicializar() {
        BarraProgresso.init();
        Tema.init();
        Accordion.init('.accordion-item');
        Tabs.init('.tabs-container');
        Timeline.init();
        AnimaçõesScroll.init();
        CalculadoraEpigenetica.init();
        Aprendizado.init();
        Search.init();
        Favoritos.init();
        Breadcrumb.init();
        BackToTop.init();
        NavHideShow.init();
        UniverseStars.init();
        Newsletter.init();
        ScrollSpy.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // ==========================================
    // EXPORTAÇÃO GLOBAL
    // ==========================================
    window.App = {
        Dados: DADOS,
        Quiz: Quiz,
        CalculadoraEpigenetica: CalculadoraEpigenetica,
        Aprendizado: Aprendizado,
        BarraProgresso: BarraProgresso,
        Tema: Tema,
        Accordion: Accordion,
        Tabs: Tabs,
        Timeline: Timeline,
        Search: Search,
        Favoritos: Favoritos,
        Newsletter: Newsletter
    };

    window.Aprendizado = Aprendizado;
    window.CalculadoraEpigenetica = CalculadoraEpigenetica;
    window.Search = Search;
    window.Favoritos = Favoritos;

})();