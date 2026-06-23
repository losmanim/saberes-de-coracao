<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'saber' && isset($_GET['saber_id'])) {
            buscarPorSaber($_GET['saber_id']);
        } elseif ($action === 'tipo' && isset($_GET['tipo'])) {
            buscarPorTipo($_GET['tipo']);
        } else {
            listarPraticas();
        }
        break;
    case 'POST':
        criarPratica();
        break;
    case 'PUT':
        atualizarPratica();
        break;
    case 'DELETE':
        excluirPratica();
        break;
    default:
        response(['erro' => 'Método não permitido'], 405);
}

function listarPraticas() {
    try {
        $sql = "SELECT p.*, s.titulo as saber_titulo 
                FROM praticas p 
                JOIN saberes s ON p.saber_id = s.id 
                ORDER BY p.tipo, p.id";
        $praticas = db()->fetchAll($sql);
        
        response([
            'sucesso' => true,
            'dados' => $praticas
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar práticas: ' . $e->getMessage()], 500);
    }
}

function buscarPorSaber($saber_id) {
    try {
        $sql = "SELECT p.*, s.titulo as saber_titulo 
                FROM praticas p 
                JOIN saberes s ON p.saber_id = s.id 
                WHERE p.saber_id = ?
                ORDER BY p.id";
        $praticas = db()->fetchAll($sql, [$saber_id]);
        
        response([
            'sucesso' => true,
            'dados' => $praticas
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar práticas: ' . $e->getMessage()], 500);
    }
}

function buscarPorTipo($tipo) {
    try {
        $sql = "SELECT p.*, s.titulo as saber_titulo 
                FROM praticas p 
                JOIN saberes s ON p.saber_id = s.id 
                WHERE p.tipo = ?
                ORDER BY p.id";
        $praticas = db()->fetchAll($sql, [$tipo]);
        
        response([
            'sucesso' => true,
            'dados' => $praticas
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar práticas: ' . $e->getMessage()], 500);
    }
}

function criarPratica() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['saber_id']) || !isset($data['titulo']) || !isset($data['tipo'])) {
            response(['erro' => 'Dados obrigatórios não fornecidos'], 400);
        }
        
        $pratica = [
            'saber_id' => $data['saber_id'],
            'titulo' => $data['titulo'],
            'tipo' => $data['tipo'],
            'instrucoes' => $data['instrucoes'] ?? '',
            'duracao_minutos' => $data['duracao_minutos'] ?? null,
            'frequencia' => $data['frequencia'] ?? 'sob-demanda'
        ];
        
        $id = db()->insert('praticas', $pratica);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Prática criada com sucesso',
            'id' => $id
        ], 201);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao criar prática: ' . $e->getMessage()], 500);
    }
}

function atualizarPratica() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['id'])) {
            response(['erro' => 'ID da prática não fornecido'], 400);
        }
        
        $updateData = [
            'titulo' => $data['titulo'] ?? '',
            'tipo' => $data['tipo'] ?? '',
            'instrucoes' => $data['instrucoes'] ?? '',
            'duracao_minutos' => $data['duracao_minutos'] ?? null,
            'frequencia' => $data['frequencia'] ?? 'sob-demanda'
        ];
        
        db()->update('praticas', $updateData, 'id = :id', ['id' => $data['id']]);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Prática atualizada com sucesso'
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao atualizar prática: ' . $e->getMessage()], 500);
    }
}

function excluirPratica() {
    try {
        $data = getJsonInput();
        
        if (!isset($data['id'])) {
            response(['erro' => 'ID da prática não fornecido'], 400);
        }
        
        db()->delete('praticas', 'id = :id', ['id' => $data['id']]);
        
        response([
            'sucesso' => true,
            'mensagem' => 'Prática excluída com sucesso'
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao excluir prática: ' . $e->getMessage()], 500);
    }
}