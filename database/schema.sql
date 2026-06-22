-- =============================================
-- Banco de Dados: Saberes de Coração
-- Finalidade: Plataforma educativa pessoal
-- Criado: 2026-05-05
-- =============================================

-- -----------------------------------------------------
-- Tabela: categorias
-- Categorias principais dos saberes (Espírito, Prática, Ciência, Jornada, Vida Verdadeira)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(20), -- HEX da cor para interface
    icone VARCHAR(50),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categorias (nome, descricao, cor, icone) VALUES
('ESPÍRITO', 'Conhecimento Gnóstico - Gnose, Hermetismo, Teosofia', '#9b59b6', 'fa-solid fa-heart'),
('PRÁTICAS', 'Trabalho Interior - Meditação, Kundalini', '#3498db', 'fa-solid fa-brain'),
('CIÊNCIA', 'Conhecimento Baseado em Evidências - Epigenética', '#2ecc71', 'fa-solid fa-flask'),
('JORNADA', 'Transformação - Jornada da Consciência', '#e67e22', 'fa-solid fa-compass'),
('VIDA VERDADEIRA', 'Integração - Tao, Pneuma, Hermetismo', '#e74c3c', 'fa-solid fa-infinity');

-- -----------------------------------------------------
-- Tabela: saberes (conteúdos)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS saberes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    categoria_id INT NOT NULL,
    descricao TEXT,
    conteudo MEDIUMTEXT, -- Markdown/HTML
    tags JSON, -- Array de tags
    fonte VARCHAR(255), -- Fonte original se houver
    nivel ENUM('iniciante', 'intermediario', 'avancado') DEFAULT 'iniciante',
    duracao_minutos INT, -- Tempo estimado
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabela: praticas (exercícios, técnicas)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS praticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saber_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    tipo ENUM('respiracao', 'meditacao', 'contemplacao', 'chakra', 'outro') NOT NULL,
    instrucoes TEXT NOT NULL,
    duracao_minutos INT,
    frequencia ENUM('diaria', 'semanal', 'sob-demanda') DEFAULT 'sob-demanda',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (saber_id) REFERENCES saberes(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabela: progresso (jornada do usuário)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS progresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saber_id INT NOT NULL,
    status ENUM('nao-iniciado', 'em-progresso', 'concluido') DEFAULT 'nao-iniciado',
    nota TEXT, -- Anotações pessoais
    concluido_em DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (saber_id) REFERENCES saberes(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabela: diarios (reflexões diárias)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS diarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL UNIQUE,
    reflexao TEXT,
    sentimento VARCHAR(100),
    nivel_energia INT CHECK (nivel_energia BETWEEN 1 AND 10),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabela: conexoes (relações entre saberes)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS conexoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saber_de_id INT NOT NULL,
    saber_para_id INT NOT NULL,
    tipo_conexao ENUM('requisito', 'complementar', 'continuacao', 'relacionado') NOT NULL,
    FOREIGN KEY (saber_de_id) REFERENCES saberes(id) ON DELETE CASCADE,
    FOREIGN KEY (saber_para_id) REFERENCES saberes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conexao (saber_de_id, saber_para_id)
);

-- -----------------------------------------------------
-- Views úteis
-- -----------------------------------------------------
CREATE OR REPLACE VIEW v_progresso_geral AS
SELECT 
    c.nome AS categoria,
    COUNT(s.id) AS total_saberes,
    SUM(CASE WHEN p.status = 'concluido' THEN 1 ELSE 0 END) AS concluidos,
    ROUND(SUM(CASE WHEN p.status = 'concluido' THEN 1 ELSE 0 END) * 100.0 / COUNT(s.id), 1) AS percentual
FROM categorias c
LEFT JOIN saberes s ON s.categoria_id = c.id AND s.ativo = TRUE
LEFT JOIN progresso p ON p.saber_id = s.id
GROUP BY c.id, c.nome;

CREATE OR REPLACE VIEW v_saberes_completos AS
SELECT 
    s.id,
    s.titulo,
    s.slug,
    c.nome AS categoria,
    s.nivel,
    s.duracao_minutos,
    s.tags,
    p.status,
    p.concluido_em
FROM saberes s
JOIN categorias c ON c.id = s.categoria_id
LEFT JOIN progresso p ON p.saber_id = s.id
WHERE s.ativo = TRUE;

-- -----------------------------------------------------
-- Índices para performance
-- -----------------------------------------------------
CREATE INDEX idx_saberes_categoria ON saberes(categoria_id);
CREATE INDEX idx_saberes_slug ON saberes(slug);
CREATE INDEX idx_saberes_tags ON saberes(tags(50));
CREATE INDEX idx_progresso_saber ON progresso(saber_id);
CREATE INDEX idx_diarios_data ON diarios(data);
CREATE INDEX idx_conexoes_saber ON conexoes(saber_de_id, saber_para_id);