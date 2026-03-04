-- Create Database
CREATE DATABASE IF NOT EXISTS room_for_u;
USE room_for_u;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('user', 'owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('apartment', 'house', 'villa', 'hostel', 'pg') NOT NULL,
    bedrooms INT,
    bathrooms INT,
    price DECIMAL(10, 2) NOT NULL,
    area_sqft DECIMAL(10, 2),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    status ENUM('available', 'rented', 'sold') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Property Amenities Table
CREATE TABLE IF NOT EXISTS property_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    amenity_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Property Inquiries Table
CREATE TABLE IF NOT EXISTS property_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status ENUM('new', 'contacted', 'resolved', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Admin User (Password: admin123)
INSERT INTO admin (username, password, email, role)
VALUES ('admin', '$2y$10$1qAz2wSx3eMc6F.eBXKQlueKZSgFVZswqLqcYVTH7XIHuQ5RtEPQC', 'admin@roomforu.com', 'developer');

-- Insert Sample User Data
INSERT INTO users (name, email, password, phone, user_type)
VALUES 
('John Doe', 'john@example.com', '$2y$10$1qAz2wSx3eMc6F.eBXKQlueKZSgFVZswqLqcYVTH7XIHuQ5RtEPQC', '9981501289', 'user'),
('Jane Smith', 'jane@example.com', '$2y$10$1qAz2wSx3eMc6F.eBXKQlueKZSgFVZswqLqcYVTH7XIHuQ5RtEPQC', '9876543211', 'owner'),
('Amit Kumar', 'amit@example.com', '$2y$10$1qAz2wSx3eMc6F.eBXKQlueKZSgFVZswqLqcYVTH7XIHuQ5RtEPQC', '9876543212', 'owner'),
('Priya Sharma', 'priya@example.com', '$2y$10$1qAz2wSx3eMc6F.eBXKQlueKZSgFVZswqLqcYVTH7XIHuQ5RtEPQC', '9876543213', 'user');

-- Insert Sample Property Data
INSERT INTO properties (owner_id, title, description, property_type, bedrooms, bathrooms, price, area_sqft, address, city, state, pincode, status, featured)
VALUES 
(2, 'Modern Apartment in City Center', 'Spacious and modern apartment located in the heart of the city with all amenities nearby.', 'apartment', 2, 1, 15000.00, 1200.00, '123 Main Street, City Center', 'Mumbai', 'Maharashtra', '400001', 'available', true),
(2, 'Cozy Studio for Students', 'Perfect studio apartment for students, close to universities and public transport.', 'apartment', 1, 1, 8000.00, 500.00, '456 College Road, University Area', 'Pune', 'Maharashtra', '411001', 'available', false),
(3, 'Luxury Villa with Garden', 'Beautiful luxury villa with a large garden, perfect for families looking for space and comfort.', 'villa', 4, 3, 45000.00, 3000.00, '789 Park Avenue, Luxury Villas', 'Bangalore', 'Karnataka', '560001', 'available', true),
(3, 'PG Accommodation for Working Professionals', 'Clean and well-maintained PG accommodation with meals included, ideal for working professionals.', 'pg', 1, 1, 7000.00, 250.00, '101 Work Street, IT Park', 'Hyderabad', 'Telangana', '500001', 'available', false);

-- Insert Sample Property Images
INSERT INTO property_images (property_id, image_path, is_primary)
VALUES 
(1, '../img/apartments/apt1_main.jpg', true),
(1, '../img/apartments/apt1_living.jpg', false),
(1, '../img/apartments/apt1_kitchen.jpg', false),
(2, '../img/apartments/studio1_main.jpg', true),
(2, '../img/apartments/studio1_interior.jpg', false),
(3, '../img/villas/villa1_main.jpg', true),
(3, '../img/villas/villa1_garden.jpg', false),
(3, '../img/villas/villa1_pool.jpg', false),
(4, '../img/pg/pg1_main.jpg', true),
(4, '../img/pg/pg1_room.jpg', false);

-- Insert Sample Property Amenities
INSERT INTO property_amenities (property_id, amenity_name)
VALUES 
(1, 'Air Conditioning'),
(1, 'Elevator'),
(1, 'WiFi'),
(1, 'Parking'),
(1, 'Security'),
(2, 'WiFi'),
(2, 'Study Table'),
(2, 'Laundry'),
(3, 'Swimming Pool'),
(3, 'Garden'),
(3, 'Garage'),
(3, 'Security'),
(3, 'Air Conditioning'),
(4, 'WiFi'),
(4, 'Meals Included'),
(4, 'Laundry'),
(4, 'Security');

-- Insert Sample Property Inquiries
INSERT INTO property_inquiries (property_id, user_id, name, email, phone, message, status)
VALUES 
(1, 1, 'John Doe', 'john@example.com', '9981501289', 'I am interested in this apartment. Is it still available?', 'new'),
(1, 4, 'Priya Sharma', 'priya@example.com', '9876543213', 'Can I schedule a viewing for this weekend?', 'contacted'),
(3, 1, 'John Doe', 'john@example.com', '9981501289', 'Is this villa pet-friendly?', 'resolved'),
(2, 4, 'Priya Sharma', 'priya@example.com', '9876543213', 'What is the minimum lease period for this studio?', 'new'); 