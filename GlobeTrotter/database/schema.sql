-- GlobeTrotter MySQL Schema
CREATE DATABASE IF NOT EXISTS globetrotter;
USE globetrotter;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(100),
  country VARCHAR(100),
  additional_info TEXT,
  photo VARCHAR(255) DEFAULT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  cost_index INT DEFAULT 50,
  popularity INT DEFAULT 50,
  image_url VARCHAR(500),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  category ENUM('sightseeing','food','adventure','transport','stay','other') DEFAULT 'other',
  cost DECIMAL(10,2) DEFAULT 0,
  duration_hours DECIMAL(4,1) DEFAULT 1,
  description TEXT,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_photo VARCHAR(500),
  status ENUM('upcoming','ongoing','completed') DEFAULT 'upcoming',
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(64) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  city_id INT NOT NULL,
  start_date DATE,
  end_date DATE,
  order_index INT DEFAULT 0,
  budget DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE stop_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stop_id INT NOT NULL,
  activity_id INT NOT NULL,
  day_number INT DEFAULT 1,
  time_slot VARCHAR(50),
  cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  order_index INT DEFAULT 0,
  FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE community_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trip_id INT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_stops_trip ON stops(trip_id);
CREATE INDEX idx_stop_activities_stop ON stop_activities(stop_id);
