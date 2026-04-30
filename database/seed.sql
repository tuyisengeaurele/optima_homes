-- ============================================================
-- OptimaHomes Seed Data
-- ============================================================

USE optimahomes;

-- ============================================================
-- ADMIN USER (password: Admin@2024!)
-- ============================================================
INSERT INTO users (name, email, password, role, phone, location, bio) VALUES
('Ange Aurele TUYISENGE', 'admin@optimahomes.com',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
 'admin', '+250788000001', 'Kigali, Rwanda',
 'Founder and CEO of OptimaHomes. Passionate about connecting people with their dream homes.'),

-- Sample Users (password: User@2024!)
('Alice Uwase', 'alice@example.com',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'user', '+250788000002', 'Kigali, Rwanda', 'Looking for my dream home.'),

('Bob Kamanzi', 'bob@example.com',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'user', '+250788000003', 'Musanze, Rwanda', 'Real estate investor.'),

('Grace Ineza', 'grace@example.com',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'user', '+250788000004', 'Huye, Rwanda', 'First-time home buyer.');

-- ============================================================
-- PROPERTIES
-- ============================================================
INSERT INTO properties (title, description, price, type, status, property_type, bedrooms, bathrooms, area, garage, floors, year_built, address, city, state, country, latitude, longitude, featured, amenities, admin_id) VALUES

-- Featured Properties
('Luxury Villa in Kiyovu',
 'Exquisite 5-bedroom villa nestled in the prestigious Kiyovu neighborhood. Features a stunning infinity pool, state-of-the-art kitchen, and panoramic views of Kigali city. Built with premium finishes and smart home technology throughout. The landscaped garden offers a private sanctuary perfect for entertaining. 24/7 security and dedicated parking for 3 vehicles.',
 850000000, 'sale', 'active', 'villa', 5, 4, 480.00, 3, 2, 2022,
 'KN 5 Ave, Kiyovu', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9441, 30.0619, TRUE,
 '["Swimming Pool", "Smart Home", "Garden", "Security", "Gym", "Generator", "Solar Power", "CCTV"]', 1),

('Modern Apartment in Nyarutarama',
 'Sophisticated 3-bedroom apartment in the highly sought-after Nyarutarama estate. Floor-to-ceiling windows flood the space with natural light. Open-plan living and dining area perfect for modern lifestyles. Fully fitted kitchen with premium appliances. Access to communal facilities including gym, swimming pool, and 24/7 concierge service.',
 45000000, 'rent', 'active', 'apartment', 3, 2, 165.00, 1, 1, 2021,
 'KG 9 Ave, Nyarutarama', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9397, 30.0827, TRUE,
 '["Gym", "Swimming Pool", "Concierge", "Generator", "Parking", "CCTV", "Elevator"]', 1),

('Executive 4-Bed House in Kimihurura',
 'Stunning executive home in prime Kimihurura location. This beautifully designed property features a large open-plan ground floor with separate living and dining areas. The master suite boasts a walk-in wardrobe and luxurious en-suite bathroom. Generous garden with outdoor entertaining area. Perfect for families and professionals.',
 320000000, 'sale', 'active', 'house', 4, 3, 320.00, 2, 2, 2020,
 'KG 15 Ave, Kimihurura', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9465, 30.0898, TRUE,
 '["Garden", "Security", "Generator", "Solar Power", "Parking", "CCTV", "Study Room"]', 1),

('Studio Apartment in Remera',
 'Chic and fully furnished studio apartment in vibrant Remera. Ideal for young professionals and students. Features modern furnishings, high-speed internet, and all utilities included. Walking distance to shops, restaurants, and public transport. Secure building with controlled access.',
 600000, 'rent', 'active', 'studio', 1, 1, 45.00, 0, 1, 2023,
 'KK 15 Rd, Remera', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9562, 30.1095, FALSE,
 '["Furnished", "WiFi Included", "CCTV", "Water Included"]', 1),

('Elegant Townhouse in Gacuriro',
 'Beautifully designed 3-bedroom townhouse in the developing Gacuriro neighborhood. Features modern architecture, quality finishes, and a private courtyard. The home offers excellent value with spacious rooms, fitted wardrobes, and a modern kitchen. Gated community with 24/7 security and ample parking.',
 95000000, 'sale', 'active', 'townhouse', 3, 2, 210.00, 1, 2, 2022,
 'KK 500 Rd, Gacuriro', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9200, 30.1100, FALSE,
 '["Garden", "Security", "Generator", "Parking", "Modern Kitchen"]', 1),

('Premium 2-Bed Condo in Kacyiru',
 'Premium condominium in the heart of Kacyiru, close to government offices and diplomatic missions. This 2-bedroom unit offers contemporary design, premium finishes, and stunning city views. Includes access to rooftop terrace, gym, and underground parking. Perfect for diplomats and senior professionals.',
 180000000, 'sale', 'active', 'condo', 2, 2, 120.00, 1, 1, 2023,
 'KG 7 Ave, Kacyiru', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9396, 30.0601, TRUE,
 '["Rooftop Terrace", "Gym", "Underground Parking", "Elevator", "Security", "Generator"]', 1),

('Family Home in Kabeza',
 'Spacious family home in the tranquil Kabeza neighborhood. Features 4 bedrooms, 2 bathrooms, large living room, and a well-maintained garden. Solar water heater installed. This property offers great potential for customization. Close to schools, hospitals, and shopping centers.',
 75000000, 'sale', 'active', 'house', 4, 2, 250.00, 1, 1, 2019,
 'KK 200 Rd, Kabeza', 'Kigali', 'Kigali City', 'Rwanda',
 -1.9700, 30.1200, FALSE,
 '["Garden", "Solar Water Heater", "Parking", "Security Fence"]', 1),

('Furnished Apartment in Kicukiro',
 'Well-furnished 2-bedroom apartment ready for immediate occupation. Situated in peaceful Kicukiro with easy access to the city center. Features include a fully equipped kitchen, comfortable furnishings, backup generator, and 24/7 security. Ideal for expats and families on short or long-term stays.',
 18000000, 'rent', 'active', 'apartment', 2, 1, 95.00, 0, 1, 2020,
 'KK 30 Rd, Kicukiro', 'Kigali', 'Kicukiro', 'Rwanda',
 -1.9820, 30.0820, FALSE,
 '["Furnished", "Generator", "Security", "WiFi Ready", "Parking"]', 1),

('Panoramic Villa in Kanombe',
 'Breathtaking 6-bedroom villa on elevated plot with panoramic views of Kigali and surrounding hills. Designed by award-winning architects, this property seamlessly blends indoor and outdoor living. Features infinity pool, home cinema, professional kitchen, and a separate guest cottage. Impeccable security with perimeter wall and CCTV.',
 1200000000, 'sale', 'active', 'villa', 6, 5, 650.00, 4, 3, 2021,
 'KK 15 Rd, Kanombe', 'Kigali', 'Kicukiro', 'Rwanda',
 -1.9680, 30.1270, TRUE,
 '["Infinity Pool", "Home Cinema", "Guest Cottage", "Smart Home", "Solar Power", "Generator", "Garden", "Security"]', 1),

('Affordable Studio in Nyabugogo',
 'Compact and affordable studio apartment in busy Nyabugogo area. Perfect for students or young professionals on a budget. Close to Nyabugogo bus terminal and local markets. Basic furnishings included. Water and electricity included in the rent.',
 350000, 'rent', 'active', 'studio', 1, 1, 30.00, 0, 1, 2018,
 'Nyabugogo Rd, Nyabugogo', 'Kigali', 'Nyarugenge', 'Rwanda',
 -1.9463, 30.0493, FALSE,
 '["Furnished", "Water Included", "Electricity Included"]', 1);

-- ============================================================
-- PROPERTY IMAGES (using placeholder paths)
-- ============================================================
INSERT INTO property_images (property_id, image_url, is_primary, sort_order) VALUES
(1, '/uploads/properties/villa-kiyovu-1.jpg', TRUE, 0),
(1, '/uploads/properties/villa-kiyovu-2.jpg', FALSE, 1),
(1, '/uploads/properties/villa-kiyovu-3.jpg', FALSE, 2),
(2, '/uploads/properties/apt-nyarutarama-1.jpg', TRUE, 0),
(2, '/uploads/properties/apt-nyarutarama-2.jpg', FALSE, 1),
(3, '/uploads/properties/house-kimihurura-1.jpg', TRUE, 0),
(3, '/uploads/properties/house-kimihurura-2.jpg', FALSE, 1),
(4, '/uploads/properties/studio-remera-1.jpg', TRUE, 0),
(5, '/uploads/properties/townhouse-gacuriro-1.jpg', TRUE, 0),
(6, '/uploads/properties/condo-kacyiru-1.jpg', TRUE, 0),
(7, '/uploads/properties/house-kabeza-1.jpg', TRUE, 0),
(8, '/uploads/properties/apt-kicukiro-1.jpg', TRUE, 0),
(9, '/uploads/properties/villa-kanombe-1.jpg', TRUE, 0),
(9, '/uploads/properties/villa-kanombe-2.jpg', FALSE, 1),
(10, '/uploads/properties/studio-nyabugogo-1.jpg', TRUE, 0);

-- ============================================================
-- FAVORITES
-- ============================================================
INSERT INTO favorites (user_id, property_id) VALUES
(2, 1), (2, 3), (2, 6),
(3, 1), (3, 9),
(4, 2), (4, 4);

-- ============================================================
-- INQUIRIES
-- ============================================================
INSERT INTO inquiries (property_id, user_id, name, email, phone, message, status) VALUES
(1, 2, 'Alice Uwase', 'alice@example.com', '+250788000002',
 'I am very interested in this villa. Can we schedule a viewing this weekend?', 'read'),
(3, 3, 'Bob Kamanzi', 'bob@example.com', '+250788000003',
 'What is the final price? Is there room for negotiation?', 'replied'),
(2, 4, 'Grace Ineza', 'grace@example.com', '+250788000004',
 'Is the apartment available for viewing? I am looking for immediate occupancy.', 'new'),
(9, NULL, 'John Mutabazi', 'john.mutabazi@gmail.com', '+250788999111',
 'This villa looks incredible. What are the payment options?', 'new'),
(6, 2, 'Alice Uwase', 'alice@example.com', '+250788000002',
 'I would like more information about the rooftop terrace and parking.', 'new');

-- ============================================================
-- ANALYTICS (sample events)
-- ============================================================
INSERT INTO analytics (event_type, entity_id, user_id, ip_address) VALUES
('property_view', 1, 2, '192.168.1.1'),
('property_view', 1, 3, '192.168.1.2'),
('property_view', 1, NULL, '192.168.1.3'),
('property_view', 9, 2, '192.168.1.1'),
('property_view', 3, 4, '192.168.1.4'),
('search', NULL, 2, '192.168.1.1'),
('search', NULL, NULL, '192.168.1.5'),
('inquiry', 1, 2, '192.168.1.1'),
('inquiry', 3, 3, '192.168.1.2'),
('signup', 2, 2, '192.168.1.1'),
('signup', 3, 3, '192.168.1.2'),
('signup', 4, 4, '192.168.1.4'),
('page_view', NULL, NULL, '192.168.1.6'),
('page_view', NULL, 2, '192.168.1.1'),
('login', NULL, 2, '192.168.1.1'),
('login', NULL, 3, '192.168.1.2');
