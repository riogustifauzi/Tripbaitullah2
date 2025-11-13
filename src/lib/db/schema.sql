-- Tripbaitullah Database Schema for Neon PostgreSQL

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id VARCHAR(255) PRIMARY KEY,
  image TEXT NOT NULL,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[], -- Array of tags
  author VARCHAR(255) NOT NULL,
  published_at TIMESTAMP NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(500),
  meta_description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Travels Table
CREATE TABLE IF NOT EXISTS travels (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  logo TEXT,
  city VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  description TEXT NOT NULL,
  certifications TEXT[], -- Array of certifications
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  total_packages INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  verified BOOLEAN NOT NULL DEFAULT false,
  tagline VARCHAR(500),
  experience INTEGER,
  facilities TEXT[], -- Array of facilities
  detailed_certifications JSONB, -- JSON for detailed certifications
  achievements TEXT[], -- Array of achievements
  gallery TEXT[], -- Array of image URLs
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(255) PRIMARY KEY,
  travel_id VARCHAR(255) NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  price DECIMAL(12,2) NOT NULL,
  duration INTEGER NOT NULL, -- in days
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  departure_city VARCHAR(255) NOT NULL,
  airline VARCHAR(255),
  hotel_makkah VARCHAR(255),
  hotel_madinah VARCHAR(255),
  quota INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  facilities TEXT[], -- Array of facilities
  itinerary JSONB, -- JSON for itinerary details
  includes TEXT[], -- Array of inclusions
  excludes TEXT[], -- Array of exclusions
  terms_conditions TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'available',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- hashed password
  full_name VARCHAR(500),
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Settings Table (for site-wide settings)
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_travels_status ON travels(status);
CREATE INDEX IF NOT EXISTS idx_travels_city ON travels(city);
CREATE INDEX IF NOT EXISTS idx_packages_travel_id ON packages(travel_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_departure_date ON packages(departure_date);
CREATE INDEX IF NOT EXISTS idx_packages_is_featured ON packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_packages_is_pinned ON packages(is_pinned);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides("order");
CREATE INDEX IF NOT EXISTS idx_hero_slides_is_active ON hero_slides(is_active);
