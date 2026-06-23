let progresso = 0;
const totalModulos = 6;

const elementos = {
    pagina: document.getElementById('pagina'),
    progressoBarra: document.getElementById('progressBar'),
    progressoTexto: document.getElementById('progressText'),
    botaoIniciar: document.getElementById('btnIniciar'),
    btnMod1: document.getElementById('btnMod1'),
    divMod1: document.getElementById('mostraMod1'),
    btnMod2: document.getElementById('btnMod2'),
    divMod2: document.getElementById('mostraMod2'),
    btnMod3: document.getElementById('btnMod3'),
    divMod3: document.getElementById('mostraMod3'),
    btnMod4: document.getElementById('btnMod4'),
    divMod4: document.getElementById('mostraMod4'),
    btnMod5: document.getElementById('btnMod5'),
    divMod5: document.getElementById('mostraMod5'),
    btnMod6: document.getElementById('btnMod6'),
    divMod6: document.getElementById('mostraMod6'),
    botaoVerificar: document.getElementById('btnVerificar'),
    resultado: document.getElementById('resultado'),
    certificado: document.getElementById('certificado'),
    dataCertificado: document.getElementById('dataCertificado')
};

const Conteudo = {
    Mod1: `
        <div class="card bg-dark text-white border-danger">
            <div class="card-body">
                <h4 class="text-danger"><i class="bi bi-exclamation-triangle"></i> A VERDADE SOBRE CONSCIÊNCIA</h4>
                <p class="fs-5">Consciência é a capacidade de ter <strong>experiência subjetiva</strong>. Ponto.</p>
                
                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5 class="text-warning">O que sabemos (pouco):</h5>
                        <ul class="list-unstyled">
                            <li>✓ Correlaciona com atividade cerebral</li>
                            <li>✓ Afetada por drogas, lesões, emoções</li>
                            <li>✓ Existe em diferentes níveis (coma, sonho, vigília)</li>
                            <li>✓ Parece ser um processo, não uma coisa</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-danger">O que NÃO sabemos (quase tudo):</h5>
                        <ul class="list-unstyled">
                            <li>❌ Como matéria gera experiência</li>
                            <li>❌ Por que existe "algo" ao invés de "nada"</li>
                            <li>❌ Se é universal ou exclusivamente humana</li>
                            <li>❌ Se continua após a morte</li>
                        </ul>
                    </div>
                </div>
                
                <div class="alert alert-danger mt-4 border-0">
                    <h5 class="alert-heading"><i class="bi bi-lightbulb"></i> PROBLEMA DURO DA CONSCIÊNCIA</h5>
                    <p class="mb-0">Como neurônios disparando (matéria) criam a <strong>sensação de ver vermelho</strong> (experiência)?</p>
                    <p class="mb-0">Esta é a maior lacuna da ciência. Ninguém resolveu. Nunca.</p>
                </div>
                
                <div class="alert alert-warning mt-3">
                    <strong>REALIDADE BRUTAL:</strong> Qualquer um que disser que "sabe" o que é consciência está mentindo ou enganado.
                </div>
            </div>
        </div>
    `,
    Mod2: `
        <div class="card bg-light border-info">
            <div class="card-body">
                <h4 class="text-info"><i class="bi bi-eye"></i> PERCEPÇÃO: A PORTA DA REALIDADE</h4>
                <p class="fs-5">Sua percepção não é uma câmera. É um <strong>filtro ativo</strong> que distói tudo.</p>
                
                <div class="alert alert-danger mt-3">
                    <h5 class="alert-heading"><i class="bi bi-bug"></i> O PROBLEMA: SEU CÉREBRO MENTE PARA VOCÊ</h5>
                    <p>95% da sua "realidade" é construída, não percebida. Seu cérebro preenche as lacunas com mentiras convincentes.</p>
                </div>
                
                <h5 class="text-danger mt-4">OS 7 FILTROS QUE DESTROEM A VERDADE:</h5>
                <div class="row">
                    <div class="col-md-6">
                        <ol class="small">
                            <li><strong>Viés de confirmação:</strong> Você busca evidências do que já acredita</li>
                            <li><strong>Cegueira da atenção:</strong> Você só vê o que está procurando</li>
                            <li><strong>Filtro emocional:</strong> Raiva/medo mudam completamente sua percepção</li>
                            <li><strong>Bolha social:</strong> Você acredita no que seu grupo acredita</li>
                        </ol>
                    </div>
                    <div class="col-md-6">
                        <ol class="small" start="5">
                            <li><strong>Ego identidade:</strong> Você defende sua imagem, não a verdade</li>
                            <li><strong>Memória falsa:</strong> Você lembra de coisas que nunca aconteceram</li>
                            <li><strong>Racionalização:</strong> Você cria lógica para decisões emocionais</li>
                        </ol>
                    </div>
                </div>
                
                <div class="alert alert-success mt-4">
                    <h5 class="alert-heading"><i class="bi bi-shield-check"></i> O CAMINHO DA PERCEPÇÃO REAL</h5>
                    <p class="mb-2"><strong>1. Atenção plena:</strong> Observe sem interpretar</p>
                    <p class="mb-2"><strong>2. Dúvida radical:</strong> Questione TUDO, especialmente suas certezas</p>
                    <p class="mb-2"><strong>3. Evidências brutais:</strong> Apenas fatos verificáveis</p>
                    <p class="mb-0"><strong>4. Humildade intelectual:</strong> Admita: "eu posso estar errado"</p>
                </div>
                
                <div class="alert alert-dark mt-3">
                    <strong>EXERCÍCIO BRUTAL:</strong> Tente observar 1 minuto sem julgar. Impossível. Seu cérebro não consegue.
                </div>
            </div>
        </div>
    `,
    Mod3: `
        <div class="card bg-light border-success">
            <div class="card-body">
                <h4 class="text-success"><i class="bi bi-yin-yang"></i> AS TRÊS VERDADES INCOMPLETAS</h4>
                <p class="fs-5">Cada visão explica parte. Nenhuma explica tudo. A verdade está nas contradições.</p>
                
                <div class="accordion" id="visoesAccordion">
                    <div class="accordion-item border-warning">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#materialismo">
                                <i class="bi bi-cpu text-warning me-2"></i> <strong>MATERIALISMO: A realidade é só matéria</strong>
                            </button>
                        </h2>
                        <div id="materialismo" class="accordion-collapse collapse show" data-bs-parent="#visoesAccordion">
                            <div class="accordion-body">
                                <p><strong>TESSE:</strong> Consciência = processo cerebral complexo</p>
                                <p class="text-muted">Como software emerge do hardware.</p>
                                
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6 class="text-success">✓ EVIDÊNCIAS A FAVOR:</h6>
                                        <ul class="small">
                                            <li>Lesões cerebrais alteram consciência</li>
                                            <li>Drogas afetam percepção</li>
                                            <li>EEG correlaciona com estados mentais</li>
                                            <li>Evolução mostra complexidade crescente</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-danger">❌ PROBLEMAS FATAIS:</h6>
                                        <ul class="small">
                                            <li>Não explica experiência subjetiva</li>
                                            <li>Não explica por que existe "algo"</li>
                                            <li>Reducionismo extremo</li>
                                            <li>Ignora qualia (sensação de ver vermelho)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item border-info">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panpsiquismo">
                                <i class="bi bi-infinity text-info me-2"></i> <strong>PANPSIQUISMO: Consciência está em tudo</strong>
                            </button>
                        </h2>
                        <div id="panpsiquismo" class="accordion-collapse collapse" data-bs-parent="#visoesAccordion">
                            <div class="accordion-body">
                                <p><strong>TESSE:</strong> Consciência é propriedade fundamental do universo</p>
                                <p class="text-muted">Como massa ou energia. Existe em diferentes níveis.</p>
                                
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6 class="text-success">✓ EVIDÊNCIAS A FAVOR:</h6>
                                        <ul class="small">
                                            <li>Evita problema duro da consciência</li>
                                            <li>Explica por que experiência existe</li>
                                            <li>Compatível com física quântica?</li>
                                            <li>Unifica mental e físico</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-danger">❌ PROBLEMAS FATAIS:</h6>
                                        <ul class="small">
                                            <li>Não é testável cientificamente</li>
                                            <li>Como pedra tem "consciência"?</li>
                                            <li>Explicação vazia (panpsiquismo patológico)</li>
                                            <li>Não explica diferentes níveis</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item border-danger">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#experiencia">
                                <i class="bi bi-eye text-danger me-2"></i> <strong>EXPERIÊNCIA DIRETA: Além do mental</strong>
                            </button>
                        </h2>
                        <div id="experiencia" class="accordion-collapse collapse" data-bs-parent="#visoesAccordion">
                            <div class="accordion-body">
                                <p><strong>TESSE:</strong> Estados alterados revelam outra realidade</p>
                                <p class="text-muted">Meditação, psicodélicos, experiências místicas.</p>
                                
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6 class="text-success">✓ EVIDÊNCIAS A FAVOR:</h6>
                                        <ul class="small">
                                            <li>Experiências místicas universais</li>
                                            <li>Psicodélicos mudam percepção radicalmente</li>
                                            <li>Relatos de unidade com o Todo</li>
                                            <li>Experiência near-death consistentes</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-danger">❌ PROBLEMAS FATAIS:</h6>
                                        <ul class="small">
                                            <li>Não é replicável</li>
                                            <li>Não é verbalizável</li>
                                            <li>Pode ser alucinação cerebral</li>
                                            <li>Falta evidência objetiva</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-dark mt-4">
                    <h5 class="alert-heading"><i class="bi bi-lightbulb-fill"></i> A VERDADE INCONFORTÁVEL</h5>
                    <p class="mb-2">Nenhuma das três explicações funciona sozinha.</p>
                    <p class="mb-0">A resposta provavelmente é: <strong>"nós não temos capacidade de compreender ainda"</strong>.</p>
                </div>
                
                <div class="alert alert-warning mt-3">
                    <strong>CONCLUSÃO BRUTAL:</strong> Quem tem certeza sobre consciência não entendeu o problema.
                </div>
            </div>
        </div>
    `,
    Mod4: `
        <div class="card bg-dark text-white border-warning">
            <div class="card-body">
                <h4 class="text-warning"><i class="bi bi-activity"></i> NEUROCIÊNCIA SEM FILTROS</h4>
                <p class="fs-5">O que seu cérebro REALMENTE faz quando você \"pensa\" que está consciente.</p>
                
                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5 class="text-danger">OS NÚMEROS BRUTAIS:</h5>
                        <ul class="list-unstyled">
                            <li>🧠 <strong>86 bilhões</strong> de neurônios</li>
                            <li>🔌 <strong>100 trilhões</strong> de sinapses</li>
                            <li>⚡ <strong>200 mph</strong> velocidade dos sinais</li>
                            <li>🔋 <strong>20%</strong> da energia corporal</li>
                            <li>💾 <strong>2.5 petabytes</strong> capacidade estimada</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-info">A VERDADE SOBRE PROCESSAMENTO:</h5>
                        <ul class="list-unstyled">
                            <li>📊 <strong>11 milhões</strong> bits/segundo processados</li>
                            <li>🎯 <strong>50 bits</strong> chegam à consciência</li>
                            <li>🤖 <strong>95%</strong> das decisões são inconscientes</li>
                            <li>⏰ <strong>0.5 segundos</strong> antes de você \"decidir\"</li>
                            <li>🔄 <strong>60.000</strong> pensamentos/dia (95% repetidos)</li>
                        </ul>
                    </div>
                </div>
                
                <div class="alert alert-danger mt-4">
                    <h5 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> SEU EU CONSCIENTE É UMA ILUSÃO</h5>
                    <p class="mb-2"><strong>Readiness Potential:</strong> Seu cérebro decide 0.5 segundos ANTES de você tomar consciência.</p>
                    <p class="mb-0"><strong>Libet's Experiment:</strong> Você apenas racionaliza decisões já tomadas.</p>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-4">
                        <div class="card border-info">
                            <div class="card-header bg-info text-white">
                                <h6 class="mb-0">CORTEX PRÉ-FRONTAL</h6>
                            </div>
                            <div class="card-body">
                                <p class="small"><strong>Função:</strong> Planejamento, decisões</p>
                                <p class="small"><strong>Problema:</strong> Desliga no flow state</p>
                                <p class="small"><strong>Verdade:</strong> Você pensa melhor sem ele</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-warning">
                            <div class="card-header bg-warning text-dark">
                                <h6 class="mb-0">SISTEMA LÍMBICO</h6>
                            </div>
                            <div class="card-body">
                                <p class="small"><strong>Função:</strong> Emoções, memória</p>
                                <p class="small"><strong>Problema:</strong> Sequestra a razão</p>
                                <p class="small"><strong>Verdade:</strong> 90% das suas decisões</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-success">
                            <div class="card-header bg-success text-white">
                                <h6 class="mb-0">CEREBELO</h6>
                            </div>
                            <div class="card-body">
                                <p class="small"><strong>Função:</strong> Movimento, timing</p>
                                <p class="small"><strong>Problema:</strong> Subestimado</p>
                                <p class="small"><strong>Verdade:</strong> 50% dos neurônios</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-dark mt-4">
                    <h5 class="alert-heading"><i class="bi bi-lightbulb"></i> CONCLUSÃO NEUROLÓGICA</h5>
                    <p class="mb-0">Você não controla seu cérebro. Seu cérebro controla você e <strong>cria a ilusão</strong> que você controla.</p>
                </div>
            </div>
        </div>
    `,
    Mod5: `
        <div class="card bg-light border-info">
            <div class="card-body">
                <h4 class="text-info"><i class="bi bi-droplet"></i> ESTADOS ALTERADOS: CIÊNCIA PURA</h4>
                <p class="fs-5">O que REALMENTE acontece quando sua consciência muda de estado.</p>
                
                <div class="accordion" id="estadosAccordion">
                    <div class="accordion-item border-warning">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#sono-rem">
                                <i class="bi bi-moon-stars text-warning me-2"></i> <strong>SONHO REM: O CÉREBRO ACORDADO DORMINDO</strong>
                            </button>
                        </h2>
                        <div id="sono-rem" class="accordion-collapse collapse show" data-bs-parent="#estadosAccordion">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-warning">O QUE ACONTECE:</h6>
                                        <ul class="small">
                                            <li>🛡️ <strong>Atonia muscular:</strong> Paralisia total</li>
                                            <li>🧠 <strong>Cérebro ativo:</strong> Mesmo nível que vigília</li>
                                            <li>👁️ <strong>Parietal desligado:</strong> Sem noção de corpo</li>
                                            <li>🎭 <strong>Amígdala hiperativa:</strong> Emoções intensas</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-info">VERDADES CIENTÍFICAS:</h6>
                                        <ul class="small">
                                            <li>✅ 25% do sono em REM</li>
                                            <li>✅ 4-5 ciclos por noite</li>
                                            <li>✅ Essencial para memória</li>
                                            <li>✅ Privação causa psicose</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="alert alert-warning mt-3">
                                    <strong>REALIDADE:</strong> Seu cérebro cria realidades completas sem input sensorial. Como isso é possível?
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item border-info">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#psicodelicos">
                                <i class="bi bi-droplet text-info me-2"></i> <strong>PSICODÉLICOS: RESET NEURAL</strong>
                            </button>
                        </h2>
                        <div id="psicodelicos" class="accordion-collapse collapse" data-bs-parent="#estadosAccordion">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-info">O QUE LSD/PSILOCIBINA FAZ:</h6>
                                        <ul class="small">
                                            <li>🔄 <strong>DMN desliga:</strong> Default Mode Network</li>
                                            <li>🌐 <strong>Conexões novas:</strong> Cérebro se reconecta</li>
                                            <li>👥 <strong>Ego dissolve:</strong> Frontal desliga</li>
                                            <li>🎨 <strong>Sinestesia:</strong> Sentidos misturam</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-success">EVIDÊNCIAS CLÍNICAS:</h6>
                                        <ul class="small">
                                            <li>✅ 80% remissão depressão</li>
                                            <li>✅ Cura para dependências</li>
                                            <li>✅ Experiências místicas universais</li>
                                            <li>✅ Mudanças permanentes de personalidade</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="alert alert-info mt-3">
                                    <strong>PERGUNTA:</strong> Se uma molécula pode dissolver o ego, o ego era real pra começar?
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item border-success">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#meditacao">
                                <i class="bi bi-yin-yang text-success me-2"></i> <strong>MEDITAÇÃO: NEUROPLASTICIDADE REAL</strong>
                            </button>
                        </h2>
                        <div id="meditacao" class="accordion-collapse collapse" data-bs-parent="#estadosAccordion">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-success">MUDANÇAS CEREBRAIS COMPROVADAS:</h6>
                                        <ul class="small">
                                            <li>📈 <strong>Ondas gama:</strong> 40Hz aumentam</li>
                                            <li>🧘 <strong>Córtex engrossa:</strong> +0.5mm</li>
                                            <li>🧠 <strong>Amígdala encolhe:</strong> -15%</li>
                                            <li>🔗 <strong>Conexões fortes:</strong> Mais mielinização</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-warning">ESTADOS DE CONSCIÊNCIA:</h6>
                                        <ul class="small">
                                            <li>🎯 <strong>Foco:</strong> Atenção sustentada</li>
                                            <li>🌊 <strong>Flow:</strong> Desligamento do eu</li>
                                            <li>🕳️ <strong>Vazio:</strong> Sem pensamentos</li>
                                            <li>☀️ <strong>Unidade:</strong> Fusão com ambiente</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="alert alert-success mt-3">
                                    <strong>VERDADE:</strong> 10.000 horas de meditação mudam fisicamente seu cérebro. Não é placebo.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item border-danger">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flow">
                                <i class="bi bi-lightning text-danger me-2"></i> <strong>FLOW STATE: PERFORMANCE MÁXIMA</strong>
                            </button>
                        </h2>
                        <div id="flow" class="accordion-collapse collapse" data-bs-parent="#estadosAccordion">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-danger">O QUE ACONTECE NO FLOW:</h6>
                                        <ul class="small">
                                            <li>🧠 <strong>Pré-frontal desliga:</strong> Sem crítica</li>
                                            <li>⚡ <strong>Dopamina alta:</strong> 500% normal</li>
                                            <li>🎯 <strong>Foco total:</strong> 100% atenção</li>
                                            <li>⏰ <strong>Distorsão temporal:</strong> Tempo para</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-info">CARACTERÍSTICAS:</h6>
                                        <ul class="small">
                                            <li>✅ Desafio = habilidade</li>
                                            <li>✅ Feedback imediato</li>
                                            <li>✅ Objetivo claro</li>
                                            <li>✅ Controle total</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="alert alert-danger mt-3">
                                    <strong>IRONIA:</strong> Você performa melhor quando seu \"eu consciente\" desliga.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-dark mt-4">
                    <h5 class="alert-heading"><i class="bi bi-lightbulb-fill"></i> PADRÃO UNIVERSAL</h5>
                    <p class="mb-0">Todos os estados alterados têm uma coisa em comum: <strong>redução da atividade do córtex pré-frontal</strong>.</p>
                    <p class="mb-0">Seu \"eu\" é o problema, não a solução.</p>
                </div>
            </div>
        </div>
    `,
    Mod6: `
        <div class="card bg-light border-success">
            <div class="card-body">
                <h4 class="text-success"><i class="bi bi-eye"></i> LABORATÓRIO DA PERCEPÇÃO</h4>
                <p class="fs-5">Experimentos práticos para PROVAR que sua percepção é falha e limitada.</p>
                
                <div class="alert alert-warning mt-3">
                    <h5 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> AVISO IMPORTANTE</h5>
                    <p class="mb-0">Se você acha que vai \"conseguir\" perfeitamente, você já falhou. A verdade está no fracasso.</p>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-6 mb-3">
                        <div class="card border-primary">
                            <div class="card-header bg-primary text-white">
                                <h6 class="mb-0">EXPERIMENTO 1: CEGUEIRA ATENCIONAL</h6>
                            </div>
                            <div class="card-body">
                                <h6 class="text-primary">O PROCEDIMENTO:</h6>
                                <ol class="small">
                                    <li>Assista ao video <strong>"The Invisible Gorilla"</strong></li>
                                    <li>Conte quantos passes da equipe branca</li>
                                    <li>Não olhe para nada além das passes</li>
                                    <li>Depois, responda: o que mais você viu?</li>
                                </ol>
                                
                                <h6 class="text-danger mt-3">RESULTADO ESPERADO:</h6>
                                <p class="small">Você <strong>não viu o gorila</strong>. Seu cérebro filtrou 50% da realidade.</p>
                                
                                <div class="alert alert-info small py-2">
                                    <strong>Conclusão:</strong> Você só vê o que procura. O resto não existe para você.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card border-warning">
                            <div class="card-header bg-warning text-dark">
                                <h6 class="mb-0">EXPERIMENTO 2: PRESENTE SUBJETIVO</h6>
                            </div>
                            <div class="card-body">
                                <h6 class="text-warning">O PROCEDIMENTO:</h6>
                                <ol class="small">
                                    <li>Sente-se em silêncio absoluto</li>
                                    <li>Foque apenas no \"agora\" presente</li>
                                    <li>Tente manter atenção por 60 segundos</li>
                                    <li>Conte quantas vezes sua mente viaja</li>
                                </ol>
                                
                                <h6 class="text-danger mt-3">RESULTADO ESPERADO:</h6>
                                <p class="small">Sua mente viajou <strong>10-20 vezes</strong>. Você não consegue ficar no presente.</p>
                                
                                <div class="alert alert-warning small py-2">
                                    <strong>Conclusão:</strong> \"Agora\" é uma ilusão. Sua mente vive no passado/futuro.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-6 mb-3">
                        <div class="card border-info">
                            <div class="card-header bg-info text-white">
                                <h6 class="mb-0">EXPERIMENTO 3: MEMÓRIA FALSA</h6>
                            </div>
                            <div class="card-body">
                                <h6 class="text-info">O PROCEDIMENTO:</h6>
                                <ol class="small">
                                    <li>Pense em uma memória da infância</li>
                                    <li>Descreva todos os detalhes</li>
                                    <li>Agora: quantos detalhes você adicionou?</li>
                                    <li>Peça para alguém que estava lá confirmar</li>
                                </ol>
                                
                                <h6 class="text-danger mt-3">RESULTADO ESPERADO:</h6>
                                <p class="small">Pelo menos <strong>30% é falso</strong>. Você inventou detalhes.</p>
                                
                                <div class="alert alert-info small py-2">
                                    <strong>Conclusão:</strong> Sua memória não é gravação. É reconstrução criativa.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card border-danger">
                            <div class="card-header bg-danger text-white">
                                <h6 class="mb-0">EXPERIMENTO 4: VIÉS DE CONFIRMAÇÃO</h6>
                            </div>
                            <div class="card-body">
                                <h6 class="text-danger">O PROCEDIMENTO:</h6>
                                <ol class="small">
                                    <li>Escolha uma crença forte sua</li>
                                    <li>Procure 5 evidências CONTRA ela</li>
                                    <li>Sinceramente: isso foi difícil?</li>
                                    <li>Sua mente resistiu às evidências?</li>
                                </ol>
                                
                                <h6 class="text-danger mt-3">RESULTADO ESPERADO:</h6>
                                <p class="small">Foi <strong>extremamente difícil</strong>. Sua mente rejeitou evidências.</p>
                                
                                <div class="alert alert-danger small py-2">
                                    <strong>Conclusão:</strong> Você não busca verdade. Busca confirmação.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-dark mt-4">
                    <h5 class="alert-heading"><i class="bi bi-bug"></i> DIAGNÓSTICO FINAL</h5>
                    <p class="mb-2">Se você falhou em todos os experimentos: <strong>PARABÉNS!</strong> Você é humano normal.</p>
                    <p class="mb-2">Se você \"conseguiu\" em todos: <strong>CUIDADO!</strong> Você está mentindo para si mesmo.</p>
                    <p class="mb-0"><strong>A REALIDADE:</strong> Sua percepção é um filtro falho. Aceitar isso é o primeiro passo para a verdade.</p>
                </div>
                
                <div class="alert alert-success mt-3">
                    <h5 class="alert-heading"><i class="bi bi-trophy"></i> PRÓXIMO NÍVEL</h5>
                    <p class="mb-0">Agora que você sabe que sua percepção é falha, tente:</p>
                    <ul class="mb-0">
                        <li>Observar sem julgar (quase impossível)</li>
                        <li>Questionar suas certezas (doloroso)</li>
                        <li>Aceitar que você pode estar errado (humilhante)</li>
                        <li>Viver com incerteza (libertador)</li>
                    </ul>
                </div>
            </div>
        </div>
    `
};

function alternarElemento(botao, div, conteudo, textoAberto, textoFechado, classeBotaoAberto) {
    const aberto = div.classList.contains('ativar');

    if (aberto) {
        div.classList.remove('ativar');
        div.innerHTML = '';
        botao.innerHTML = textoFechado + (textoFechado.includes('Explorar') || textoFechado.includes('Mergulhar') || textoFechado.includes('Ocultar') ? ' <i class="bi bi-arrow-right-circle"></i>' : '');
        botao.className = botao.className.replace(' btn-warning', '').replace(' btn-danger', '');
        div.setAttribute('aria-hidden', 'true');
    } else {
        div.classList.add('ativar');
        div.innerHTML = conteudo;
        botao.innerHTML = textoAberto + (textoAberto.includes('Explorar') || textoAberto.includes('Mergulhar') || textoAberto.includes('Ocultar') ? ' <i class="bi bi-arrow-up-circle"></i>' : '');
        botao.className += ' btn-warning';
        div.setAttribute('aria-hidden', 'false');
        
        // Inicializa accordion se necessário
        if (conteudo.includes('accordion')) {
            const accordionButtons = div.querySelectorAll('.accordion-button');
            accordionButtons.forEach(btn => {
                if (btn.classList.contains('collapsed')) {
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    }
}

function atualizarProgresso() {
    progresso = Math.min(progresso + (100 / totalModulos), 100);
    elementos.progressoBarra.style.width = progresso + '%';
    elementos.progressoTexto.textContent = Math.round(progresso) + '%';
}

function temaEscuro() {
    elementos.pagina.className = 'bg-dark text-white';
    localStorage.setItem('tema', 'escuro');
    document.documentElement.setAttribute('data-theme', 'dark');
}

function temaClaro() {
    elementos.pagina.className = 'bg-light text-black';
    localStorage.setItem('tema', 'claro');
    document.documentElement.setAttribute('data-theme', 'light');
}

function verificarRespostas() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    
    let acertos = 0;
    let feedback = [];
    
    // Verificação pergunta 1
    if (q1 && q1.value === 'certo') {
        acertos++;
        feedback.push('✅ Você entendeu: ninguém sabe o que é consciência');
    } else if (q1) {
        feedback.push('❌ ERRO: A ciência NÃO explicou consciência. Este é o maior mistério.');
    } else {
        feedback.push('⚠️ Você não respondeu a pergunta 1');
    }
    
    // Verificação pergunta 2
    if (q2 && q2.value === 'certo') {
        acertos++;
        feedback.push('✅ Correto: panpsiquismo = consciência em tudo');
    } else if (q2) {
        feedback.push('❌ ERRO: Materialismo diz que consciência vem do cérebro');
    } else {
        feedback.push('⚠️ Você não respondeu a pergunta 2');
    }
    
    // Verificação pergunta 3
    if (q3 && q3.value === 'certo') {
        acertos++;
        feedback.push('✅ Exato: vieses emocionais e crenças destroem percepção');
    } else if (q3) {
        feedback.push('❌ ERRO: Inteligência e educação não garantem percepção real');
    } else {
        feedback.push('⚠️ Você não respondeu a pergunta 3');
    }
    
    const resultadoDiv = elementos.resultado;
    resultadoDiv.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
    
    if (acertos === 3) {
        resultadoDiv.className = 'alert alert-success mt-3';
        resultadoDiv.innerHTML = `
            <h5 class="alert-heading"><i class="bi bi-trophy"></i> EXCELENTE!</h5>
            <p>Você realmente entendeu a brutalidade da realidade.</p>
            <hr>
            <ul class="mb-0">
                ${feedback.map(f => `<li>${f}</li>`).join('')}
            </ul>
        `;
        
        setTimeout(() => {
            elementos.certificado.classList.remove('d-none');
            elementos.dataCertificado.textContent = new Date().toLocaleDateString('pt-BR');
            window.scrollTo({ top: document.getElementById('certificado').offsetTop, behavior: 'smooth' });
        }, 2000);
    } else if (acertos >= 2) {
        resultadoDiv.className = 'alert alert-warning mt-3';
        resultadoDiv.innerHTML = `
            <h5 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> QUASE LÁ...</h5>
            <p>Você está no caminho, mas ainda há filtros a remover.</p>
            <hr>
            <ul class="mb-0">
                ${feedback.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <p class="mb-0 mt-2"><strong>Acertos:</strong> ${acertos}/3</p>
        `;
    } else {
        resultadoDiv.className = 'alert alert-danger mt-3';
        resultadoDiv.innerHTML = `
            <h5 class="alert-heading"><i class="bi bi-x-circle"></i> PRECISA ESTUDAR MAIS</h5>
            <p>Você ainda está operando com filtros e conceitos errados.</p>
            <hr>
            <ul class="mb-0">
                ${feedback.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <p class="mb-0 mt-2"><strong>Acertos:</strong> ${acertos}/3 - Volte e estude com mais atenção</p>
        `;
    }
    
    // Atualiza aria-expanded nos botões
    document.querySelectorAll('#quiz input[type="radio"]').forEach(radio => {
        radio.setAttribute('aria-checked', radio.checked ? 'true' : 'false');
    });
}

function inicializarEventListeners() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'escuro') {
        elementos.pagina.className = 'bg-dark text-white';
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (temaSalvo === 'claro') {
        elementos.pagina.className = 'bg-light text-black';
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Adiciona animação de scroll para revelar módulos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.modulo').forEach(modulo => {
        observer.observe(modulo);
    });
    
    // Adiciona feedback visual ao quiz
    document.querySelectorAll('#quiz input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const parent = this.closest('.mb-4');
            parent.querySelectorAll('.form-check-label').forEach(label => {
                label.classList.remove('fw-bold', 'text-success', 'text-danger');
            });
            
            if (this.value === 'certo') {
                this.nextElementSibling.classList.add('fw-bold', 'text-success');
            } else {
                this.nextElementSibling.classList.add('fw-bold', 'text-danger');
            }
        });
    });

    elementos.botaoIniciar.addEventListener('click', () => {
        window.scrollTo({ top: document.getElementById('modulo1').offsetTop, behavior: 'smooth' });
    });

    elementos.btnMod1.addEventListener('click', () => {
        const isExpanded = elementos.btnMod1.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod1, elementos.divMod1, Conteudo.Mod1, 'Ocultar Realidade', 'Explorar a Realidade', '');
        elementos.btnMod1.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        // Scroll suave para o conteúdo expandido
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.btnMod2.addEventListener('click', () => {
        const isExpanded = elementos.btnMod2.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod2, elementos.divMod2, Conteudo.Mod2, 'Ocultar Percepção', 'Mergulhar Fundo', '');
        elementos.btnMod2.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.btnMod3.addEventListener('click', () => {
        const isExpanded = elementos.btnMod3.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod3, elementos.divMod3, Conteudo.Mod3, 'Ocultar Contradições', 'Explorar as Contradições', '');
        elementos.btnMod3.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.btnMod4.addEventListener('click', () => {
        const isExpanded = elementos.btnMod4.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod4, elementos.divMod4, Conteudo.Mod4, 'Ocultar Neurociência', 'Mergulhar na Neurociência', '');
        elementos.btnMod4.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod4.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.btnMod5.addEventListener('click', () => {
        const isExpanded = elementos.btnMod5.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod5, elementos.divMod5, Conteudo.Mod5, 'Ocultar Estados', 'Explorar Estados Alterados', '');
        elementos.btnMod5.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod5.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.btnMod6.addEventListener('click', () => {
        const isExpanded = elementos.btnMod6.getAttribute('aria-expanded') === 'true';
        alternarElemento(elementos.btnMod6, elementos.divMod6, Conteudo.Mod6, 'Ocultar Experimentos', 'Fazer os Experimentos', '');
        elementos.btnMod6.setAttribute('aria-expanded', !isExpanded);
        atualizarProgresso();
        
        if (!isExpanded) {
            setTimeout(() => {
                elementos.divMod6.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    elementos.botaoVerificar.addEventListener('click', verificarRespostas);
}

document.addEventListener('DOMContentLoaded', inicializarEventListeners);