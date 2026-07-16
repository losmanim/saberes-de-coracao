const contentHandlers = {
    definicao: (v) => `<h3>Definição</h3><p>${v}</p>`,
    analogia: (v) => `<h3>📝 Analogia</h3><p>${v}</p>`,
    insight: (v) => `<h3>💡 Insight</h3><p>${v}</p>`,
    ascensao: (v) => `<h3>A Ascensão da Kundalini</h3><p>${v}</p>`,
    ruido_moderno: (v) => `<h3>O Ruído Moderno</h3><p>${v}</p>`,
    instrucoes_passos: (v) => `<h3>Passo a Passo</h3><p>${v.replace(/\n/g, '<br>')}</p>`,

    conceitos: (v) => `<h3>Conceitos</h3><ul>${v.map(i => `<li><strong>${i.termo}:</strong> ${i.def}</li>`).join('')}</ul>`,
    principios: (v) => `<h3>Os Sete Princípios</h3><ul>${v.map(p => `<li><strong>${p.num}. ${p.nome}</strong> — "${p.frase}"<br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${p.desc}</span></li>`).join('')}</ul>`,
    mundos: (v) => `<h3>Os Três Mundos</h3><ul>${v.map(m => `<li><strong>${m.simbolo} ${m.nome}</strong><br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${m.desc}</span></li>`).join('')}</ul>`,
    textos: (v) => `<h3>Textos da Biblioteca de Nag Hammadi</h3><ul>${v.map(t => `<li><strong>${t.nome}</strong>: ${t.desc}</li>`).join('')}</ul>`,
    fatores: (v) => `<h3>Fatores que Influenciam</h3><ul>${v.map(f => `<li><strong>${f.icone} ${f.nome}</strong>: ${f.desc}</li>`).join('')}</ul>`,
    mecanismos: (v) => `<h3>Os Três Mecanismos Epigenéticos</h3><ul>${v.map(m => `<li><strong>${m.icone} ${m.nome}</strong>: ${m.desc}</li>`).join('')}</ul>`,
    personagens: (v) => `<h3>Personagens do Drama Cósmico</h3><ul>${v.map(p => `<li><strong>${p.nome}:</strong> ${p.descricao}</li>`).join('')}</ul>`,
    misterios: (v) => `<h3>Os Mistérios</h3><ul>${v.map(m => `<li><strong>${m.nome}:</strong> ${m.desc}</li>`).join('')}</ul>`,
    caracteristicas: (v) => `<h3>Características das Primeiras Comunidades</h3><ul>${v.map(c => `<li><strong>${c.nome}:</strong> ${c.desc}</li>`).join('')}</ul>`,
    desafios: (v) => `<h3>Desafios e Expansão</h3><ul>${v.map(d => `<li><strong>${d.nome}:</strong> ${d.desc}</li>`).join('')}</ul>`,
    controversias: (v) => `<h3>Controvérsias e Legado</h3><ul>${v.map(ct => `<li><strong>${ct.tema}:</strong> ${ct.desc}</li>`).join('')}</ul>`,
    mitos_desmistificados: (v) => `<h3>Mitos Desmistificados</h3><ul>${v.map(m => `<li><strong>${m.mito}</strong> → ${m.verdade}</li>`).join('')}</ul>`,
    tres_fatores: (v) => `<h3>Os 3 Fatores da Revolução da Consciência</h3><ul>${v.map(f => `<li><strong>${f.fator}:</strong> ${f.descricao}</li>`).join('')}</ul>`,
    dimensoes: (v) => `<h3>As Dimensões do Pneuma</h3><ul>${v.map(d => `<li><strong>${d.nome}:</strong> ${d.desc}</li>`).join('')}</ul>`,
    praticas_diarias: (v) => `<h3>Práticas Diárias</h3><ul>${v.map(pd => `<li><strong>${pd.nome}:</strong> ${pd.desc}</li>`).join('')}</ul>`,
    tres_filtros: (v) => `<h3>Os 3 Filtros da Percepção</h3><ul>${v.map(f => `<li><strong>${f.nome}:</strong> ${f.desc}</li>`).join('')}</ul>`,

    aplicacoes: (v) => `<h3>Lei da Correspondência</h3><table style="width:100%;border-collapse:collapse;margin-top:0.5rem;">${v.map(a => `<tr><td style="padding:6px 8px;border:1px solid var(--cor-borda);font-weight:600">${a.maior}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${a.menor}</td></tr>`).join('')}</table>`,

    citacoes: (v) => `<h3>Citações</h3><blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0;">${v.join('<br>')}</blockquote>`,

    parabolas: (v) => `<h3>Parábolas</h3>${v.map(p => `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)"><h4 style="color:var(--cor-destaque);margin-bottom:0.3rem">${p.nome}</h4><p><em>"${p.texto}"</em></p><p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Sentido:</strong> ${p.sentido}</p></div>`).join('')}`,
    ensinamentos_chave: (v) => `<h3>Ensinamentos Chave</h3>${v.map(e => `<div class="pratica-box"><h4>${e.tema}</h4><p>${e.ensino}</p></div>`).join('')}`,
    ciencia_moderna: (v) => `<h3>Ciência Moderna e o Éter</h3>${v.map(cm => `<div class="pratica-box"><h4>${cm.topico}</h4><p>${cm.desc}</p></div>`).join('')}`,
    correntes: (v) => `<h3>As Grandes Correntes Filosóficas</h3>${v.map(cr => `<div class="pratica-box"><h4>${cr.nome}</h4><p>${cr.desc}</p></div>`).join('')}`,
    perspectivas: (v) => `<h3>Perspectivas sobre o Sentido</h3>${v.map(p => `<div class="pratica-box"><h4>${p.nome}</h4><p>${p.desc}</p></div>`).join('')}`,
    ferramentas_praticas: (v) => `<h3>Ferramentas Práticas</h3>${v.map(fp => `<div class="pratica-box"><h4>${fp.nome}</h4><p>${fp.desc}</p></div>`).join('')}`,
    praticas_acesso: (v) => `<h3>Práticas de Acesso ao Éter</h3><ul>${v.map(pa => `<li><strong>${pa.nome}</strong>${pa.proporcao ? ' (' + pa.proporcao + ')' : ''}: ${pa.desc}</li>`).join('')}</ul>`,

    estrutura_cosmica: (v) => `<h3>Estrutura Cósmica</h3>${Object.entries(v).map(([key, val]) => `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</p>`).join('')}`,
    nag_hammadi: (v) => `<h3>Nag Hammadi (1945)</h3><p>${v.descricao}</p>${v.textos ? `<ul>${v.textos.map(t => `<li><strong>${t.nome}:</strong> ${t.desc}</li>`).join('')}</ul>` : ''}`,
    alquimia_interior: (v) => `<h3>${v.nome}</h3>${v.operacoes ? `<ul>${v.operacoes.map(op => `<li><strong>${op.etapa}:</strong> ${op.desc}</li>`).join('')}</ul>` : ''}`,
    mapa_exoterico_esoterico: (v) => `<h3>Exotérico vs. Esotérico</h3><div class="pratica-box"><h4>Exotérico (Público)</h4><p>${v.exoterico}</p></div><div class="pratica-box"><h4>Esotérico (Reservado)</h4><p>${v.esoterico}</p></div>`,
    ponte_ciencia_teosofia: (v) => `<h3>Ponte entre Ciência e Teosofia</h3><div class="pratica-box"><h4>Ciência</h4><p>${v.ciencia}</p></div><div class="pratica-box"><h4>Teosofia</h4><p>${v.teosofia}</p></div><div class="pratica-box"><h4>Ponte</h4><p>${v.ponte}</p></div>`,
    conexao_heartmath: (v) => `<h3>Conexão com HeartMath/GCI</h3><p>${v.descricao}</p><p style="margin-top:0.5rem;font-style:italic;color:var(--cor-texto-sec)">${v.pratica}</p>`,

    if_no_meaning: (v) => `<h3>${v.titulo}</h3><p>${v.reflexao}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${v.citacao}</blockquote>` : ''}`,
    tool_musica: (v) => `<h3>Pneuma na Música (Tool)</h3><p>${v.analise}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0;color:var(--cor-texto-sec)">${v.citacao}</blockquote>` : ''}`,
    felicidade_como_verbo: (v) => `<h3>Felicidade como Verbo</h3><p>${v.tese}</p><p style="margin-top:0.5rem">${v.mecanica}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${v.citacao}</blockquote>` : ''}`,

    quatro_mapas: (v) => `<h3>Os 4 Mapas de Sabedoria</h3>${v.map(m => `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)"><h4 style="color:var(--cor-destaque)">${m.nome}</h4><p>${m.ensinamento}</p><p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Prática:</strong> ${m.pratica}</p></div>`).join('')}`,

    dicotomia: (v) => `<h3>Ser vs. Ter</h3>${v.map(d => `<div class="pratica-box"><h4>${d.polo === 'SER' ? '🜁' : '🜂'} ${d.polo}</h4><ul>${d.caracteristicas.map(car => `<li>${car}</li>`).join('')}</ul></div>`).join('')}`,
    filtros_da_percepcao: (v) => `<h3>Filtros da Percepção</h3>${v.map(fp => `<div class="pratica-box"><h4>${fp.nome}</h4><p><strong>Mecanismo:</strong> ${fp.mecanismo}</p><p style="margin-top:0.3rem"><strong>Transcendência:</strong> ${fp.transcendencia}</p></div>`).join('')}`,
    integracao_pratica: (v) => `<h3>Integração Prática no Dia a Dia</h3>${Object.entries(v).map(([periodo, passos]) => `<div class="pratica-box"><h4>${periodo.charAt(0).toUpperCase() + periodo.slice(1)}</h4>${passos.map(p => `<p>${p}</p>`).join('')}</div>`).join('')}`,

    chakras(v) {
        if (!v[0] || !v[0].ordem) return '';
        return `<h3>Os 8 Chakras da Meditação</h3><table style="width:100%;border-collapse:collapse;margin:0.8rem 0"><tr><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">#</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Chakra</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Sílaba</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Função</th></tr>${v.map(ch => `<tr><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.ordem}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.nome}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.silaba}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.funcao}</td></tr>`).join('')}</table>`;
    },

    texto_integral: (v) => `<h3>📜 Texto Integral</h3><div class="texto-integral">${v.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</div>`,
    mantras: (v) => `<h3>🔮 Mantras</h3>${v.map(m => `<div class="pratica-box"><h4>${m.nome}</h4><p><strong>Origem:</strong> ${m.origem}</p><p>${m.desc}</p>${m.quando ? `<p style="margin-top:0.3rem;font-size:0.85rem;color:var(--cor-texto-sec)"><em>🕐 ${m.quando}</em></p>` : ''}</div>`).join('')}`,
    beneficios: (v) => `<h3>✅ Benefícios</h3><ul>${v.map(b => `<li>${b}</li>`).join('')}</ul>`,
    sintese: (v) => `<h3>📋 Síntese</h3><ul>${v.map(s => `<li>${s}</li>`).join('')}</ul>`,
    obras: (v) => `<h3>📚 Obras</h3>${v.map(o => `<div class="content-card"><h4>${o.titulo}</h4><p>${o.desc}</p></div>`).join('')}`,
    visoes: (v) => `<h3>👁️ Visões da Jornada</h3>${v.map(vis => `<div class="pratica-box"><h4>${vis.nome}</h4><p>${vis.desc}</p></div>`).join('')}`,
    aviso: (v) => `<div class="pratica-box" style="border-left-color:var(--cor-jornada)"><h4 style="color:var(--cor-jornada)">⚠️ Aviso</h4><p>${v}</p></div>`,
    tecnica: (v) => `<h3>🔬 Técnica</h3><div class="pratica-box"><p>${v}</p></div>`,
    dado: (v) => `<div class="pratica-box" style="border-left-color:var(--cor-ciencia);text-align:center"><p style="font-size:1.1rem;font-weight:600;color:var(--cor-ciencia);margin:0">${v}</p></div>`,
    desc: (v) => `<p style="color:var(--cor-texto-sec);font-style:italic">${v}</p>`,
};

window.contentHandlers = contentHandlers;
