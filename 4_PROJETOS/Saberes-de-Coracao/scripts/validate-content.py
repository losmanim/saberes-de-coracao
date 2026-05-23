#!/usr/bin/env python3
"""
Script de validação para database/dados-unificados.json
Verifica:
- Sintaxe JSON
- IDs únicos
- Tags sem espaços extras
- Campos obrigatórios
- Referências válidas (conexões, categoria_id)
"""

import json
import sys
from pathlib import Path

def validate_json_file(filepath):
    """Carrega e valida o arquivo JSON."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ JSON sintaxe válida ({filepath})")
        return data
    except json.JSONDecodeError as e:
        print(f"✗ Erro de sintaxe JSON: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"✗ Arquivo não encontrado: {filepath}")
        sys.exit(1)

def validate_unique_ids(data):
    """Verifica IDs únicos em saberes."""
    ids = [s['id'] for s in data.get('saberes', [])]
    duplicates = [id for id in set(ids) if ids.count(id) > 1]
    
    if duplicates:
        print(f"✗ IDs duplicados encontrados: {duplicates}")
        return False
    else:
        print(f"✓ Todos {len(set(ids))} IDs são únicos")
        return True

def validate_tags(data):
    """Verifica tags sem espaços extras."""
    bad_tags = []
    for s in data.get('saberes', []):
        for tag in s.get('tags', []):
            if tag != tag.strip():
                bad_tags.append((s['id'], tag))
    
    if bad_tags:
        print(f"✗ Tags com espaço encontradas:")
        for saber_id, tag in bad_tags:
            print(f"  - {saber_id}: '{tag}'")
        return False
    else:
        print(f"✓ Nenhuma tag com espaço extra")
        return True

def validate_required_fields(data):
    """Verifica campos obrigatórios."""
    required = ['id', 'categoria_id', 'titulo', 'slug', 'descricao', 'nivel', 'duracao', 'tags']
    missing_list = []
    
    for s in data.get('saberes', []):
        missing = [f for f in required if f not in s or s[f] is None]
        if missing:
            missing_list.append((s['id'], missing))
    
    if missing_list:
        print(f"✗ Campos obrigatórios ausentes:")
        for saber_id, fields in missing_list:
            print(f"  - {saber_id}: {fields}")
        return False
    else:
        print(f"✓ Todos os campos obrigatórios presentes")
        return True

def validate_references(data):
    """Verifica referências válidas."""
    errors = []
    
    # Mapear IDs de saberes e categorias
    saber_ids = {s['id'] for s in data.get('saberes', [])}
    category_ids = {c['id'] for c in data.get('categorias', [])}
    
    # Verificar categoria_id
    for s in data.get('saberes', []):
        if s.get('categoria_id') not in category_ids:
            errors.append(f"  - {s['id']}: categoria_id {s.get('categoria_id')} não existe")
    
    # Verificar conexões
    for s in data.get('saberes', []):
        for conn_id in s.get('conexoes', []):
            if conn_id not in saber_ids:
                errors.append(f"  - {s['id']}: conexão '{conn_id}' não existe")
    
    if errors:
        print(f"✗ Referências inválidas encontradas:")
        for err in errors:
            print(err)
        return False
    else:
        print(f"✓ Todas as referências são válidas")
        return True

def main():
    """Executa validação completa."""
    # Procurar no diretório raiz do projeto
    filepath = Path(__file__).parent.parent / 'database' / 'dados-unificados.json'
    
    print(f"Validando {filepath}...\n")
    
    data = validate_json_file(str(filepath))
    
    checks = [
        validate_unique_ids(data),
        validate_tags(data),
        validate_required_fields(data),
        validate_references(data)
    ]
    
    print()
    if all(checks):
        print("✓ Todas as validações passaram!")
        sys.exit(0)
    else:
        print("✗ Algumas validações falharam")
        sys.exit(1)

if __name__ == '__main__':
    main()
