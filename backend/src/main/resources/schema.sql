-- FreshGuard Database Schema
CREATE DATABASE IF NOT EXISTS freshguard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE freshguard;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  member_id VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('HOME_USER','SHOPKEEPER','ADMIN') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_member_id (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: storage_locations
CREATE TABLE IF NOT EXISTS storage_locations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name ENUM('FRIDGE','PANTRY','FREEZER','OTHER') NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_storage_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  storage_id BIGINT UNSIGNED NULL,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NULL,
  quantity DECIMAL(10,2) DEFAULT 1.00,
  quantity_unit VARCHAR(30) NULL,
  barcode VARCHAR(60) NULL,
  mfg_date DATE NULL,
  expiry_date DATE NOT NULL,
  expiry_status ENUM('FRESH','NEAR_EXPIRY','EXPIRED') NOT NULL DEFAULT 'FRESH',
  input_method ENUM('MANUAL','BARCODE','BILL_SCAN','VOICE') DEFAULT 'MANUAL',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (storage_id) REFERENCES storage_locations(id) ON DELETE SET NULL,
  INDEX idx_products_user_id (user_id),
  INDEX idx_products_expiry_date (expiry_date),
  INDEX idx_products_barcode (barcode),
  INDEX idx_products_expiry_status (expiry_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  alert_type ENUM('UPCOMING_EXPIRY','ALREADY_EXPIRED','TODAY_EXPIRY') NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: barcode_product_catalog
CREATE TABLE IF NOT EXISTS barcode_product_catalog (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  barcode VARCHAR(60) NOT NULL UNIQUE,
  product_name VARCHAR(180) NOT NULL,
  brand VARCHAR(100) NULL,
  category VARCHAR(80) NULL,
  default_expiry_days INT NULL,
  INDEX idx_catalog_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: recipes
CREATE TABLE IF NOT EXISTS recipes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  cook_time VARCHAR(40) NULL,
  servings VARCHAR(40) NULL,
  difficulty ENUM('Easy','Medium','Hard') DEFAULT 'Easy',
  steps JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: recipe_ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recipe_id BIGINT UNSIGNED NOT NULL,
  ingredient VARCHAR(120) NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  INDEX idx_recipe_ingredient (ingredient)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
