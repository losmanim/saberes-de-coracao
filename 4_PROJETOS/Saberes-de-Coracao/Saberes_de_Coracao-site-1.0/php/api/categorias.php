<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        listarCategorias();
        break;
    default:
        response(['erro' => 'Método não permitido'], 405);
}

function listarCategorias() {
    try {
        $sql = "SELECT id, nome, descricao, cor, icone FROM categorias ORDER BY id";
        $categorias = db()->fetchAll($sql);
        
        if (empty($categorias)) {
            response([
                'sucesso' => true,
                'mensagem' => 'Nenhuma categoria encontrada',
                'dados' => []
            ]);
        }
        
        response([
            'sucesso' => true,
            'dados' => $categorias
        ]);
    } catch (Exception $e) {
        response(['erro' => 'Erro ao buscar categorias: ' . $e->getMessage()], 500);
    }
}