-- Migration 003: Seed Admin User
-- Creates default admin account (password: admin123)

INSERT INTO users (name, email, password, role, phone, location, bio, is_active)
VALUES (
  'Optima Admin',
  'admin@optimahomes.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uiFa',
  'admin',
  '+250788000000',
  'Kigali, Rwanda',
  'Platform administrator for OptimaHomes real estate marketplace.',
  1
);
