<?php
/**
 * Configuração do Banco de Dados usando MySQLi
 * Saberes de Coração
 */

class Database {
    private static $instance = null;
    private $mysqli;

    private $db_config = [
        'host' => 'localhost',
        'dbname' => 'saberes_de_coracao',
        'user' => 'root',
        'pass' => 'novasenha',
        'charset' => 'utf8mb4'
    ];

    private function __construct() {
        try {
            $this->mysqli = new mysqli(
                $this->db_config['host'],
                $this->db_config['user'],
                $this->db_config['pass'],
                $this->db_config['dbname']
            );

            if ($this->mysqli->connect_error) {
                throw new Exception("Erro na conexão: " . $this->mysqli->connect_error);
            }

            $this->mysqli->set_charset($this->db_config['charset']);
        } catch (Exception $e) {
            error_log("Erro na conexão: " . $e->getMessage());
            throw new Exception("Erro ao conectar ao banco de dados");
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->mysqli;
    }

    public function query($sql, $params = []) {
        // Preparar a declaração
        if ($stmt = $this->mysqli->prepare($sql)) {
            // Vincular parâmetros se existirem
            if (!empty($params)) {
                $types = str_repeat('s', count($params)); // Todos como string por simplicidade
                $stmt->bind_param($types, ...$params);
            }
            
            // Executar a consulta
            $stmt->execute();
            
            // Obter resultado
            $result = $stmt->get_result();
            $stmt->close();
            
            return $result;
        } else {
            throw new Exception("Erro na preparação da consulta: " . $this->mysqli->error);
        }
    }

    public function fetchAll($sql, $params = []) {
        $result = $this->query($sql, $params);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $result->free();
        return $data;
    }

    public function fetchOne($sql, $params = []) {
        $result = $this->query($sql, $params);
        $data = $result->fetch_assoc();
        $result->free();
        return $data;
    }

    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        
        // Converter placeholders nomeados para ?
        $paramNames = array_keys($data);
        $paramPlaceholders = implode(', ', array_fill(0, count($paramNames), '?'));
        $sql = "INSERT INTO $table ($columns) VALUES ($paramPlaceholders)";
        
        if ($stmt = $this->mysqli->prepare($sql)) {
            $types = str_repeat('s', count($data)); // Todos como string por simplicidade
            $values = array_values($data);
            $stmt->bind_param($types, ...$values);
            
            if ($stmt->execute()) {
                $id = $this->mysqli->insert_id;
                $stmt->close();
                return $id;
            } else {
                throw new Exception("Erro na inserção: " . $stmt->error);
            }
        } else {
            throw new Exception("Erro na preparação da inserção: " . $this->mysqli->error);
        }
    }

    public function update($table, $data, $where, $whereParams = []) {
        $set = [];
        $params = [];
        
        foreach (array_keys($data) as $key) {
            $set[] = "$key = ?";
            $params[] = $data[$key];
        }
        
        foreach ($whereParams as $param) {
            $params[] = $param;
        }
        
        $sql = "UPDATE $table SET " . implode(', ', $set) . " WHERE $where";
        
        if ($stmt = $this->mysqli->prepare($sql)) {
            $types = str_repeat('s', count($params)); // Todos como string por simplicidade
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                $affected = $stmt->affected_rows;
                $stmt->close();
                return $affected;
            } else {
                throw new Exception("Erro na atualização: " . $stmt->error);
            }
        } else {
            throw new Exception("Erro na preparação da atualização: " . $this->mysqli->error);
        }
    }

    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM $table WHERE $where";
        
        if ($stmt = $this->mysqli->prepare($sql)) {
            if (!empty($params)) {
                $types = str_repeat('s', count($params)); // Todos como string por simplicidade
                $stmt->bind_param($types, ...$params);
            }
            
            if ($stmt->execute()) {
                $affected = $stmt->affected_rows;
                $stmt->close();
                return $affected;
            } else {
                throw new Exception("Erro na exclusão: " . $stmt->error);
            }
        } else {
            throw new Exception("Erro na preparação da exclusão: " . $this->mysqli->error);
        }
    }
}

function db() {
    return Database::getInstance();
}

function response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}