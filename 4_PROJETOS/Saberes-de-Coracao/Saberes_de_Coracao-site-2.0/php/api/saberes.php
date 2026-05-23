<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'slug' && isset($_GET['slug'])) {
            buscarPorSlug($_GET['slug']);
        } elseif ($action === 'categoria' && isset($_GET['categoria_id'])) {
            buscarPorCategoria($_GET['categoria_id']);
        } else {
            listarSaberes();
        }
        break;
    case 'POST':
        criarSabere();
        break;
    case 'PUT':
        atualizarSabere();
        break;
    case 'DELETE':
        excluirSabere();
        break;
    default:
        response(['erro' => 'Método não permitido'], 405);
}

function listarSaberes() {
    try {
        $sql = "SELECT s.*, c.nome as categoria_nome, c.cor as categoria_cor 
                FROM saberes s 
                JOIN categorias c ON s.categoria_id = c.id 
                WHERE s.ativo = TRUE 
                ORDER BY c.id, s.id";
        $saberes = db()->fetchAll($sql);
        
        foreach ($saberes as &$saber) {
            if ($saber['tags']) {
                $saber['tags'] = json_decode($saber['tags'], true);
            }
        }
        
        response([
            'sucesso' => true,
            'dados' => $saberes
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar saberes: ' . $e->getMessage()], 500);
    }
}

function buscarPorSlug($slug) {
    try {
        $sql = "SELECT s.*, c.nome as categoria_nome, c.cor as categoria_cor 
                FROM saberes s 
                JOIN categorias c ON s.categoria_id = c.id 
                WHERE s.slug = ? AND s.ativo = TRUE";
        $saber = db()->fetchOne($sql, [$slug]);
        
        if (!$saber) {
            response(['erro' => 'Saber não encontrado'], 404);
        }
        
        if ($saber['tags']) {
            $saber['tags'] = json_decode($saber['tags'], true);
        }
        
        response([
            'sucesso' => true,
            'dados' => $saber
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar saber: ' . $e->getMessage()], 500);
    }
}

function buscarPorCategoria($categoria_id) {
    try {
        $sql = "SELECT s.*, c.nome as categoria_nome, c.cor as categoria_cor 
                FROM saberes s 
                JOIN categorias c ON s.categoria_id = c.id 
                WHERE s.categoria_id = ? AND s.ativo = TRUE 
                ORDER BY s.id";
        $saberes = db()->fetchAll($sql, [$categoria_id]);
        
        foreach ($saberes as &$saber) {
            if ($saber['tags']) {
                $saber['tags'] = json_decode($saber['tags'], true);
            }
        }
        
        response([
            'sucesso' => true,
            'dados' => $saberes
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar saberes: ' . $e->getMessage()], 500);
    }
}

function criarSabere() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['titulo']) || !isset($data['categoria_id'])) {
            response(['erro' => 'Dados obrigatórios não fornecidos'], 400);
        }
        
        $slug = criarSlug($data['titulo']);
        
        $saber = [
            'titulo' => $data['titulo'],
            'slug' => $slug,
            'categoria_id' => $data['categoria_id'],
            'descricao' => $data['descricao'] ?? '',
            'conteudo' => $data['conteudo'] ?? '',
            'tags' => json_encode($data['tags'] ?? []),
            'fonte' => $data['fonte'] ?? '',
            'nivel' => $data['nivel'] ?? 'iniciante',
            'duracao_minutos' => $data['duracao_minutos'] ?? null
        ];
        
        $id = db()->insert('saberes', $saber);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Saber criado com sucesso',
            'id' => $id
        ], 201);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao criar saber: ' . $e->getMessage()], 500);
    }
}

function atualizarSabere() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['id'])) {
            response(['erro' => 'ID do saber não fornecido'], 400);
        }
        
        $updateData = [
            'titulo' => $data['titulo'] ?? '',
            'descricao' => $data['descricao'] ?? '',
            'conteudo' => $data['conteudo'] ?? '',
            'tags' => json_encode($data['tags'] ?? []),
            'fonte' => $data['fonte'] ?? '',
            'nivel' => $data['nivel'] ?? 'iniciante',
            'duracao_minutos' => $data['duracao_minutos'] ?? null
        ];
        
        db()->update('saberes', $updateData, 'id = :id', ['id' => $data['id']]);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Saber atualizado com sucesso'
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao atualizar saber: ' . $e->getMessage()], 500);
    }
}

function excluirSabere() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['id'])) {
            response(['erro' => 'ID do saber não fornecido'], 400);
        }
        
        db()->delete('saberes', 'id = :id', ['id' => $data['id']]);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Saber excluído com sucesso'
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao excluir saber: ' . $e->getMessage()], 500);
    }
}

function criarSlug($texto) {
    $texto = strtolower($texto);
    $texto = preg_replace('/[^a-z0-9\s-]/', '', $texto);
    $texto = preg_replace('/[\s-]+/', '-', $texto);
    return trim($texto, '-');
}