-- Migration 006: Add Saved Searches
-- Allows users to save property search filters for quick re-use

CREATE TABLE IF NOT EXISTS saved_searches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  filters JSON NOT NULL,
  alert_enabled TINYINT(1) DEFAULT 0,
  last_alerted_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_alert_enabled (alert_enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
