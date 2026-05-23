#!/usr/bin/env python3
"""
Gerador de relatório de conteúdo para Saberes de Coração
Cria um resumo em Markdown sobre o estado atual do projeto.
"""

import json
from pathlib import Path
from datetime import datetime
from collections import Counter

def load_data(filepath):
    """Carrega o arquivo JSON principal."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar {filepath}: {e}")
        return None

def generate_report(data):
    """Gera um relatório em Markdown sobre o conteúdo."""
    
    lines = []
    
    # Cabeçalho
    lines.append("# Relatório de Conteúdo - Saberes de Coração")
    lines.append(f"\n**Data:** {datetime.now().strftime('%d de %B de %Y')}")
    lines.append(f"**Versão de dados:** {data.get('meta', {}).get('versao', 'desconhecida')}")
    lines.append("")
    
    # Resumo executivo
    saberes = data.get('saberes', [])
    categorias = {c['id']: c['nome'] for c in data.get('categorias', [])}
    praticas = data.get('praticas', [])
    midia = data.get('midia', {})
    
    total_saberes = len(saberes)
    total_praticas = len(praticas)
    total_audios = len(midia.get('audios', []))
    total_videos = len(midia.get('videos', []))
    total_midia = total_audios + total_videos
    
    lines.append("## 📊 Estatísticas Gerais")
    lines.append("")
    lines.append(f"- **Saberes:** {total_saberes}")
    lines.append(f"- **Práticas:** {total_praticas}")
    lines.append(f"- **Áudios:** {total_audios}")
    lines.append(f"- **Vídeos:** {total_videos}")
    lines.append(f"- **Total multimídia:** {total_midia}")
    lines.append("")
    
    # Conteúdo por categoria
    lines.append("## 🏗️ Conteúdo por Pilar")
    lines.append("")
    
    by_category = {}
    for saber in saberes:
        cat_id = saber.get('categoria_id')
        if cat_id not in by_category:
            by_category[cat_id] = []
        by_category[cat_id].append(saber)
    
    for cat_id in sorted(by_category.keys()):
        cat_name = categorias.get(cat_id, f"Categoria {cat_id}")
        count = len(by_category[cat_id])
        lines.append(f"### {cat_name}")
        lines.append(f"**{count} saber{'es' if count != 1 else ''}**")
        lines.append("")
        for saber in sorted(by_category[cat_id], key=lambda x: x['titulo']):
            lines.append(f"- [{saber['titulo']}](#{saber['slug']}) — {saber['descricao']}")
        lines.append("")
    
    # Análise de tags
    lines.append("## 🏷️ Tags Mais Usadas")
    lines.append("")
    
    all_tags = []
    for saber in saberes:
        all_tags.extend(saber.get('tags', []))
    
    tag_counts = Counter(all_tags)
    top_tags = tag_counts.most_common(10)
    
    for tag, count in top_tags:
        lines.append(f"- `{tag}` ({count} saber{'es' if count != 1 else ''})")
    lines.append("")
    
    # Análise de níveis
    lines.append("## 📚 Conteúdo por Nível")
    lines.append("")
    
    by_level = {}
    for saber in saberes:
        level = saber.get('nivel', 'desconhecido')
        if level not in by_level:
            by_level[level] = 0
        by_level[level] += 1
    
    for level in ['iniciante', 'intermediario', 'avancado']:
        count = by_level.get(level, 0)
        if count > 0:
            lines.append(f"- **{level.capitalize()}:** {count}")
    lines.append("")
    
    # Tempo de aprendizado
    lines.append("## ⏱️ Tempo Total de Aprendizado")
    lines.append("")
    
    total_duracao = sum(s.get('duracao', 0) for s in saberes)
    total_praticas_duracao = sum(p.get('duracao', 0) for p in praticas)
    
    lines.append(f"- **Saberes:** ~{total_duracao} minutos")
    lines.append(f"- **Práticas:** ~{total_praticas_duracao} minutos")
    lines.append(f"- **Total:** ~{total_duracao + total_praticas_duracao} minutos ({(total_duracao + total_praticas_duracao) / 60:.1f} horas)")
    lines.append("")
    
    # Conexões
    lines.append("## 🔗 Análise de Conexões")
    lines.append("")
    
    total_conexoes = sum(len(s.get('conexoes', [])) for s in saberes)
    saberes_com_conexoes = sum(1 for s in saberes if s.get('conexoes'))
    
    lines.append(f"- **Total de conexões:** {total_conexoes}")
    lines.append(f"- **Saberes com conexões:** {saberes_com_conexoes}/{total_saberes}")
    lines.append(f"- **Taxa de conectividade:** {(saberes_com_conexoes/total_saberes)*100:.1f}%")
    lines.append("")
    
    # Saberes com práticas
    lines.append("## 🧘 Saberes com Práticas Incluídas")
    lines.append("")
    
    com_praticas = [s for s in saberes if s.get('praticas')]
    sem_praticas = [s for s in saberes if not s.get('praticas')]
    
    lines.append(f"- **Com práticas:** {len(com_praticas)}")
    lines.append(f"- **Sem práticas:** {len(sem_praticas)}")
    lines.append("")
    
    if com_praticas:
        lines.append("### Saberes com Práticas")
        for saber in com_praticas:
            num_praticas = len(saber.get('praticas', []))
            lines.append(f"- {saber['titulo']} ({num_praticas} prática{'s' if num_praticas != 1 else ''})")
        lines.append("")
    
    # Recomendações
    lines.append("## 💡 Recomendações")
    lines.append("")
    
    recomendacoes = []
    
    if len(sem_praticas) > 3:
        recomendacoes.append(f"- {len(sem_praticas)} saberes ainda não têm práticas associadas. Considere adicionar.")
    
    if total_audios + total_videos == 0:
        recomendacoes.append("- Nenhuma multimídia adicionada ainda. Considere criar áudios ou vídeos dos saberes principais.")
    
    if saberes_com_conexoes < total_saberes * 0.8:
        recomendacoes.append("- Muitos saberes não estão conectados. Revise as relações entre conteúdos.")
    
    if recomendacoes:
        for rec in recomendacoes:
            lines.append(rec)
    else:
        lines.append("✓ Projeto em bom estado de conectividade e cobertura!")
    
    lines.append("")
    
    return "\n".join(lines)

def main():
    """Executa a geração do relatório."""
    
    # Encontrar o arquivo JSON no diretório raiz
    filepath = Path(__file__).parent.parent / 'database' / 'dados-unificados.json'
    
    print(f"Carregando dados de {filepath}...")
    
    data = load_data(str(filepath))
    if not data:
        return
    
    print("Gerando relatório...")
    report = generate_report(data)
    
    # Salvar relatório
    output_file = Path(__file__).parent.parent / 'docs' / 'CONTENT_REPORT.md'
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✓ Relatório salvo em: {output_file}")
    
    # Exibir no terminal também
    print("\n" + "="*60)
    print(report)

if __name__ == '__main__':
    main()
