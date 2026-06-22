<?php
/**
 * Script para importar dados do dados-unificados.json para o banco de dados
 * Saberes de Coração
 * Versão usando MySQLi
 */

require_once 'php/config_mysqli.php';

$db = db();

// Ler o arquivo JSON
$jsonData = file_get_contents('database/dados-unificados.json');
$data = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("Erro ao decodificar JSON: " . json_last_error_msg());
}

echo "Iniciando importação de dados...\n";

// Importar categorias (já existem, mas vamos garantir)
echo "Importando categorias...\n";
foreach ($data['categorias'] as $categoria) {
    $existing = $db->fetchOne("SELECT id FROM categorias WHERE nome = ?", [$categoria['nome']]);
    if (!$existing) {
        $db->insert('categorias', [
            'nome' => $categoria['nome'],
            'descricao' => $categoria['descricao'],
            'cor' => $categoria['cor'],
            'icone' => $categoria['icone']
        ]);
        echo "  - Categoria '{$categoria['nome']}' inserida\n";
    } else {
        echo "  - Categoria '{$categoria['nome']}' já existe\n";
    }
}

// Importar saberes
echo "\nImportando saberes...\n";
foreach ($data['saberes'] as $saber) {
    // Verificar se já existe
    $existing = $db->fetchOne("SELECT id FROM saberes WHERE slug = ?", [$saber['slug']]);
    if ($existing) {
        echo "  - Saber '{$saber['titulo']}' já existe (slug: {$saber['slug']})\n";
        continue;
    }
    
    // Preparar dados para inserção
    $saberData = [
        'titulo' => $saber['titulo'],
        'slug' => $saber['slug'],
        'categoria_id' => $saber['categoria_id'],
        'descricao' => $saber['descricao'],
        'conteudo' => json_encode($saber['conteudo'], JSON_UNESCAPED_UNICODE),
        'tags' => json_encode($saber['tags'], JSON_UNESCAPED_UNICODE),
        'fonte' => $saber['fonte'] ?? null,
        'nivel' => $saber['nivel'],
        'duracao_minutos' => $saber['duracao'],
        'ativo' => true
    ];
    
    // Adicionar fonte se existir
    if (isset($saber['fonte'])) {
        $saberData['fonte'] = $saber['fonte'];
    }
    
    $saberId = $db->insert('saberes', $saberData);
    echo "  - Saber '{$saber['titulo']}' inserido (ID: {$saberId})\n";
    
    // Importar práticas associadas a este saber
    if (isset($saber['praticas']) && is_array($saber['praticas'])) {
        foreach ($saber['praticas'] as $pratica) {
            $praticaData = [
                'saber_id' => $saberId,
                'titulo' => $pratica['titulo'],
                'tipo' => 'outro', // Tipo padrão, pode ser ajustado conforme necessário
                'instrucoes' => $pratica['instrucoes'],
                'duracao_minutos' => $pratica['duracao'] ?? null,
                'frequencia' => $pratica['frequencia'] ?? 'sob-demanda'
            ];
            
            $db->insert('praticas', $praticaData);
            echo "    - Prática '{$pratica['titulo']}' inserida\n";
        }
    }
    
    // Importar conexões
    if (isset($saber['conexoes']) && is_array($saber['conexoes'])) {
        foreach ($saber['conexoes'] as $conexaoSlug) {
            // Buscar o ID do saber conectado pelo slug
            $conexaoSaber = $db->fetchOne("SELECT id FROM saberes WHERE slug = ?", [$conexaoSlug]);
            if ($conexaoSaber) {
                // Evitar duplicatas e auto-referências
                if ($conexaoSaber['id'] != $saberId) {
                    $existing = $db->fetchOne("SELECT id FROM conexoes WHERE saber_de_id = ? AND saber_para_id = ?", 
                        [$saberId, $conexaoSaber['id']]);
                    if (!$existing) {
                        $db->insert('conexoes', [
                            'saber_de_id' => $saberId,
                            'saber_para_id' => $conexaoSaber['id'],
                            'tipo_conexao' => 'relacionado' // Tipo padrão
                        ]);
                        echo "    - Conexão com '{$conexaoSlug}' inserida\n";
                    }
                }
            } else {
                echo "    - AVISO: Saber conectado '{$conexaoSlug}' não encontrado\n";
            }
        }
    }
}

// Importar práticas globais (se houver)
if (isset($data['praticas']) && is_array($data['praticas'])) {
    echo "\nImportando práticas globais...\n";
    foreach ($data['praticas'] as $pratica) {
        // Note: estas práticas já foram associadas aos saberes acima
        // Esta seção é para práticas que não estão associadas a nenhum saber específico
        echo "  - Prática global '{$pratica['nome']}' (já processada com saberes associados)\n";
    }
}

echo "\nImportação concluída!\n";

// Estatísticas finais
$saberesResult = $db->fetchOne("SELECT COUNT(*) as total FROM saberes");
$countSaberes = $saberesResult['total'];

$categoriasResult = $db->fetchOne("SELECT COUNT(*) as total FROM categorias");
$countCategorias = $categoriasResult['total'];

$praticasResult = $db->fetchOne("SELECT COUNT(*) as total FROM praticas");
$countPraticas = $praticasResult['total'];

$conexoesResult = $db->fetchOne("SELECT COUNT(*) as total FROM conexoes");
$countConexoes = $conexoesResult['total'];

echo "Estatísticas:\n";
echo "  - Categorias: {$countCategorias}\n";
echo "  - Saberes: {$countSaberes}\n";
echo "  - Práticas: {$countPraticas}\n";
echo "  - Conexões: {$countConexoes}\n";
?>