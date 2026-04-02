-- ============================================================
-- SCHÉMA DE LA BASE DE DONNÉES - E-COMMERCE INFORMATIQUE
-- ============================================================

-- ============================================================
-- TABLE: products
-- Description: Contient les produits disponibles à la vente
-- ============================================================
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


-- ============================================================
-- TABLE: orders
-- Description: Contient les commandes des clients
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    adresse LONGTEXT NOT NULL,
    product_id BIGINT NULL,
    product_name VARCHAR(255) NOT NULL COMMENT 'Copie du nom du produit au moment de la commande',
    product_price DECIMAL(10, 2) NOT NULL COMMENT 'Copie du prix du produit au moment de la commande',
    statut ENUM('en_attente', 'confirmé', 'livré') NOT NULL DEFAULT 'en_attente',
    note_client LONGTEXT NULL,
    livreur_nom VARCHAR(255) NULL COMMENT 'Nom du livreur assigné (si applicable)',
    date_livraison TIMESTAMP NULL COMMENT 'Date estimée ou réelle de livraison',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_statut (statut),
    INDEX idx_created_at (created_at),
    INDEX idx_product_id (product_id),
    INDEX idx_date_livraison (date_livraison),
    INDEX idx_nom_client (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: users
-- Description: Contient les utilisateurs et administrateurs
-- ============================================================
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


-- ============================================================
-- TABLE: cache
-- Description: Table de cache Laravel
-- ============================================================
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value LONGTEXT NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_expiration (expiration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: jobs
-- Description: Table des jobs en file d'attente
-- ============================================================
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


-- ============================================================
-- DONNÉES D'EXEMPLE
-- ============================================================

-- Insérer un administrateur
INSERT INTO users (name, email, role, password, created_at, updated_at) VALUES
('Admin', 'admin@example.com', 'admin', '$2y$12$abcdefghijklmnopqrstuvwxyz', NOW(), NOW())
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
('Karim Khaled', '+216 97 876 543', '789 Rue du Hammam, Sousse 4000', 5, 'Disque SSD 1TB NVMe', 89.99, 'livré', 'Merci pour la livraison rapide', 'Salah Eddine', NOW(), NOW(), NOW());


-- ============================================================
-- RELATIONS ET NOTES IMPORTANTES
-- ============================================================
-- ✓ Une commande (orders) est liée à un produit (products) via product_id
-- ✓ Si un produit est supprimé, product_id devient NULL (SET NULL)
-- ✓ Les informations du produit au moment de la commande sont sauvegardées :
--   - product_name : Nom du produit au moment de la commande
--   - product_price : Prix du produit au moment de la commande
-- ✓ Cela évite les incohérences si le produit change ou est supprimé
-- ✓ Les dates de livraison permettent au gérant de planifier
-- ✓ Le champ livreur_nom permet d'assigner un livreur à chaque commande
-- ✓ Tous les champs importants ont des index pour optimiser les requêtes

-- ============================================================
-- OPTIMISATIONS DE PERFORMANCE
-- ============================================================
-- Index sur statut : pour les filtres (en_attente, confirmé, livré)
-- Index sur created_at : pour les tri par date
-- Index sur product_id : pour les jointures
-- Index sur date_livraison : pour planifier les livraisons
-- Index sur nom : pour rechercher les clients
-- Charset utf8mb4 : support complet des caractères spéciaux (accents, emojis, etc.)

-- ============================================================
-- SÉCURITÉ ET MEILLEURES PRATIQUES
-- ============================================================
-- ✓ ON DELETE SET NULL : évite la suppression en cascade dangereuse
-- ✓ product_name et product_price : préservent l'historique des prix
-- ✓ Validations au niveau base de données (NOT NULL, UNIQUE, ENUM)
-- ✓ Timestamps automatiques (created_at, updated_at)
-- ✓ Index adéquats pour les performances de recherche et de tri

-- ============================================================
-- UTILISATION AVEC LARAVEL
-- ============================================================
-- Pour exécuter ce schéma manuellement :
--   mysql -u root -p < database/schema.sql
--
-- OU pour utiliser les migrations Laravel (RECOMMANDÉ) :
--   php artisan migrate
--
-- NOTE: Ce fichier est un backup du schéma SQL pur.
-- Les migrations Laravel dans database/migrations/ sont la source de vérité.
-- ============================================================
