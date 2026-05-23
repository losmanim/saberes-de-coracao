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
    // TEMA (Dark/Light)
    // ==========================================
    const Tema = {
        init: function() {
            const temaSalvo = localStorage.getItem('tema');
            if (temaSalvo === 'claro') {
                document.body.classList.add('modo-claro');
            }
            window.MudarTema = function(modo) {
                if (modo === 'claro') {
                    document.body.classList.add('modo-claro');
                    localStorage.setItem('tema', 'claro');
                } else {
                    document.body.classList.remove('modo-claro');
                    localStorage.setItem('tema', 'escuro');
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
    // QUIZ INTERATIVO
    // ==========================================
    const Quiz = {
        container: null,
        perguntas: [],
        indice: 0,
        pontos: 0,
        init: function(config) {
            this.container = document.getElementById(config.containerId);
            if (!this.container) return;
            this.perguntas = config.perguntas || [];
            this.indice = 0;
            this.pontos = 0;
            this.renderizar();
        },
        renderizar: function() {
            if (!this.container) return;
            if (this.indice >= this.perguntas.length) {
                this.mostrarResultado();
                return;
            }
            var pergunta = this.perguntas[this.indice];
            var opcoesHTML = '';
            pergunta.opcoes.forEach(function(op, i) {
                opcoesHTML += '<button class="quiz-opcao" data-indice="' + i + '">' + op + '</button>';
            });
            this.container.innerHTML =
                '<div class="quiz-container">' +
                '<div class="quiz-progresso">' +
                '<span>Pergunta ' + (this.indice + 1) + ' de ' + this.perguntas.length + '</span>' +
                '<span>Pontos: ' + this.pontos + '</span>' +
                '</div>' +
                '<div class="quiz-pergunta">' + pergunta.pergunta + '</div>' +
                '<div class="quiz-opcoes">' + opcoesHTML + '</div>' +
                '<div class="quiz-feedback"></div>' +
                '</div>';
            var self = this;
            var botoes = this.container.querySelectorAll('.quiz-opcao');
            botoes.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    self.responder(parseInt(e.target.dataset.indice));
                });
            });
        },
        responder: function(indice) {
            if (!this.container) return;
            var pergunta = this.perguntas[this.indice];
            var opcoes = this.container.querySelectorAll('.quiz-opcao');
            var feedback = this.container.querySelector('.quiz-feedback');
            opcoes.forEach(function(op) {
                op.disabled = true;
            });
            if (indice === pergunta.correta) {
                opcoes[indice].classList.add('correto');
                this.pontos++;
                feedback.innerHTML = '<div class="quiz-feedback correto">✓ Correto!</div>';
            } else {
                opcoes[indice].classList.add('incorreto');
                opcoes[pergunta.correta].classList.add('correto');
                feedback.innerHTML = '<div class="quiz-feedback incorreto">✗ Incorreto. A resposta correta é: ' + pergunta.opcoes[pergunta.correta] + '</div>';
            }
            var self = this;
            setTimeout(function() {
                self.indice++;
                self.renderizar();
            }, 2000);
        },
        mostrarResultado: function() {
            if (!this.container) return;
            var total = this.perguntas.length;
            var percentual = (this.pontos / total) * 100;
            var mensagem = '';
            if (percentual >= 80) {
                mensagem = '🌟 Excelente! Você compreendeu muito bem o conteúdo.';
            } else if (percentual >= 50) {
                mensagem = '⚡ Bom trabalho! Mas pode melhorar estudando mais.';
            } else {
                mensagem = '📚 Revise o conteúdo e tente novamente.';
            }
            this.container.innerHTML =
                '<div class="quiz-resultado">' +
                '<h3>' + mensagem + '</h3>' +
                '<div class="quiz-pontos">' + this.pontos + '/' + total + '</div>' +
                '<button class="quiz-botao-reiniciar" onclick="location.reload()">Tentar Novamente</button>' +
                '</div>';
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
        Timeline: Timeline
    };

    // Expor funções comuns globalmente para onclick
    window.Aprendizado = Aprendizado;
    window.CalculadoraEpigenetica = CalculadoraEpigenetica;

})();