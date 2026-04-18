-- ============================================================
-- SCHÉMA COMPLET DE LA BASE DE DONNÉES - ABC INFORMATIQUE
-- ============================================================
-- Copie-colle tout ce code dans phpMyAdmin SQL et exécute!
-- ============================================================

-- TABLE: products
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description LONGTEXT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nom (nom),
    INDEX idx_prix (prix)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    adresse LONGTEXT NOT NULL,
    product_id BIGINT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    statut ENUM('en_attente', 'confirmé', 'livré') NOT NULL DEFAULT 'en_attente',
    note_client LONGTEXT NULL,
    livreur_nom VARCHAR(255) NULL,
    date_livraison TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_statut (statut),
    INDEX idx_created_at (created_at),
    INDEX idx_product_id (product_id),
    INDEX idx_date_livraison (date_livraison),
    INDEX idx_nom_client (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: cache (corrigée avec backticks)
CREATE TABLE IF NOT EXISTS cache (
    `key` VARCHAR(255) PRIMARY KEY,
    value LONGTEXT NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_expiration (expiration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    queue VARCHAR(255) NOT NULL,
    payload LONGTEXT NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL,
    INDEX idx_queue (queue),
    INDEX idx_reserved_at (reserved_at),
    INDEX idx_available_at (available_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: personal_access_tokens (pour Sanctum - Laravel Auth)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities LONGTEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tokenable (tokenable_type, tokenable_id),
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNÉES D'EXEMPLE
-- ============================================================

-- Insérer un administrateur
INSERT INTO users (name, email, role, password, created_at, updated_at) VALUES
('Admin ABC', 'admin@abcinformatique.com', 'admin', '$2y$10$L8ZBCRc5LnyHhwl8K8.xReuQ8MpkVu6f8Dy65ONtuIq5w8j8cJaju', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insérer des produits
INSERT INTO products (nom, description, prix, stock, created_at, updated_at) VALUES
('Ordinateur Portable Dell XPS 13', 'Ultrabook performant avec processeur Intel i7 et 16GB RAM', 1299.99, 10, NOW(), NOW()),
('Souris sans fil Logitech', 'Souris ergonomique avec batterie longue durée', 45.99, 50, NOW(), NOW()),
('Clavier mécanique RGB', 'Clavier gaming avec switches mécaniques', 129.99, 25, NOW(), NOW()),
('Écran 4K 27 pouces', 'Moniteur UHD pour la productivité et les jeux', 399.99, 15, NOW(), NOW()),
('Disque SSD 1TB NVMe', 'Stockage ultra-rapide pour vos données', 89.99, 40, NOW(), NOW()),
('Casque sans fil Sony', 'Casque audio avec réduction de bruit active', 249.99, 20, NOW(), NOW())
ON DUPLICATE KEY UPDATE nom=VALUES(nom);

-- Insérer des commandes d'exemple
INSERT INTO orders (nom, telephone, adresse, product_id, product_name, product_price, statut, note_client, livreur_nom, date_livraison, created_at, updated_at) VALUES
('Mohamed Ali', '+216 98 123 456', '123 Rue de France, Tunis 1000', 1, 'Ordinateur Portable Dell XPS 13', 1299.99, 'en_attente', 'Livraison avant 17h si possible', NULL, NULL, NOW(), NOW()),
('Fatima Ben Salah', '+216 91 234 567', '456 Avenue Mohamed V, Sfax 3000', 3, 'Clavier mécanique RGB', 129.99, 'confirmé', NULL, 'Ahmed Chebbi', DATE_ADD(NOW(), INTERVAL 2 DAY), NOW(), NOW()),
('Karim Khaled', '+216 97 876 543', '789 Rue du Hammam, Sousse 4000', 5, 'Disque SSD 1TB NVMe', 89.99, 'livré', 'Merci pour la livraison rapide', 'Salah Eddine', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE nom=VALUES(nom);

-- ============================================================
-- VÉRIFICATION - Ces requêtes doivent retourner des résultats
-- ============================================================
-- SELECT * FROM products;
-- SELECT * FROM orders;
-- SELECT * FROM users;
-- ============================================================
