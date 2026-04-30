-- ============================================================
-- OptimaHomes Database Schema
-- Your Trusted Real Estate Partner
-- ============================================================

CREATE DATABASE IF NOT EXISTS optimahomes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE optimahomes;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar      VARCHAR(255),
  phone       VARCHAR(20),
  location    VARCHAR(150),
  bio         TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- PROPERTIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200)  NOT NULL,
  description  TEXT          NOT NULL,
  price        DECIMAL(15,2) NOT NULL,
  type         ENUM('sale','rent') NOT NULL DEFAULT 'sale',
  status       ENUM('active','sold','rented','pending','inactive') NOT NULL DEFAULT 'active',
  property_type ENUM('house','apartment','villa','condo','townhouse','studio','land','commercial') NOT NULL DEFAULT 'house',
  bedrooms     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  bathrooms    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  area         DECIMAL(10,2) COMMENT 'Square meters',
  garage       TINYINT UNSIGNED DEFAULT 0,
  floors       TINYINT UNSIGNED DEFAULT 1,
  year_built   YEAR,
  address      VARCHAR(255)  NOT NULL,
  city         VARCHAR(100)  NOT NULL,
  state        VARCHAR(100),
  country      VARCHAR(100)  NOT NULL DEFAULT 'Rwanda',
  latitude     DECIMAL(10,8),
  longitude    DECIMAL(11,8),
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  approved     BOOLEAN NOT NULL DEFAULT TRUE,
  views        INT UNSIGNED NOT NULL DEFAULT 0,
  admin_id     INT UNSIGNED,
  amenities    JSON,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_city (city),
  INDEX idx_price (price),
  INDEX idx_featured (featured),
  INDEX idx_bedrooms (bedrooms),
  INDEX idx_property_type (property_type),
  FULLTEXT INDEX idx_search (title, description, address, city)
) ENGINE=InnoDB;

-- ============================================================
-- PROPERTY IMAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id  INT UNSIGNED NOT NULL,
  image_url    VARCHAR(500) NOT NULL,
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   TINYINT UNSIGNED DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property (property_id)
) ENGINE=InnoDB;

-- ============================================================
-- FAVORITES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  property_id  INT UNSIGNED NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, property_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_property (property_id)
) ENGINE=InnoDB;

-- ============================================================
-- INQUIRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id  INT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  phone        VARCHAR(20),
  message      TEXT NOT NULL,
  status       ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_property (property_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- ANALYTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type   ENUM('page_view','property_view','search','inquiry','signup','login') NOT NULL,
  entity_id    INT UNSIGNED COMMENT 'property_id or user_id depending on event',
  user_id      INT UNSIGNED,
  ip_address   VARCHAR(45),
  user_agent   TEXT,
  referrer     VARCHAR(500),
  metadata     JSON,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event (event_type),
  INDEX idx_entity (entity_id),
  INDEX idx_date (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- REFRESH TOKENS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  token        VARCHAR(500) NOT NULL,
  expires_at   TIMESTAMP NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_token (token(100))
) ENGINE=InnoDB;
