-- Migration 002: Add Performance Indexes
-- Adds indexes on frequently queried columns

ALTER TABLE properties ADD INDEX idx_listing_type (listing_type);
ALTER TABLE properties ADD INDEX idx_property_type (property_type);
ALTER TABLE properties ADD INDEX idx_status (status);
ALTER TABLE properties ADD INDEX idx_city (city);
ALTER TABLE properties ADD INDEX idx_price (price);
ALTER TABLE properties ADD INDEX idx_is_featured (is_featured);
ALTER TABLE properties ADD INDEX idx_created_at (created_at);
ALTER TABLE properties ADD INDEX idx_user_id (user_id);

ALTER TABLE inquiries ADD INDEX idx_status (status);
ALTER TABLE inquiries ADD INDEX idx_property_id (property_id);
ALTER TABLE inquiries ADD INDEX idx_user_id (user_id);

ALTER TABLE analytics ADD INDEX idx_event_type (event_type);
ALTER TABLE analytics ADD INDEX idx_created_at (created_at);
ALTER TABLE analytics ADD INDEX idx_property_id (property_id);

ALTER TABLE refresh_tokens ADD INDEX idx_token (token(255));
ALTER TABLE refresh_tokens ADD INDEX idx_user_id (user_id);
ALTER TABLE refresh_tokens ADD INDEX idx_expires_at (expires_at);
