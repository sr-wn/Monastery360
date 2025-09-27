-- Monastery360 Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create monasteries table
CREATE TABLE IF NOT EXISTS monasteries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_nepali VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  description TEXT,
  description_nepali TEXT,
  founded VARCHAR(100),
  significance TEXT,
  features TEXT[],
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monastery_id INTEGER REFERENCES monasteries(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monasteries_location ON monasteries(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_monastery_id ON visits(monastery_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);

-- Insert sample monastery data
INSERT INTO monasteries (name, name_nepali, latitude, longitude, address, description, description_nepali, founded, significance, features, image) VALUES
(
  'Rumtek Monastery',
  'रुमटेक गुम्बा',
  27.33194,
  88.60194,
  'Rumtek, Sikkim, India',
  'Rumtek Monastery, also known as the Dharma Chakra Centre, is a Tibetan Buddhist monastery located in the Indian state of Sikkim. It serves as the seat of the Kagyu lineage and houses the Golden Stupa containing the relics of the 16th Karmapa.',
  'रुमटेक गुम्बा, धर्म चक्र केन्द्रको रूपमा पनि चिनिन्छ, भारतको सिक्किम राज्यमा अवस्थित तिब्बती बौद्ध गुम्बा हो। यो काग्यु वंशको सिट हो र 16 औं कर्मापाको अवशेषहरू समावेश गर्ने स्वर्ण स्तूप राख्छ।',
  '1960s (rebuilt)',
  'Seat of the Kagyu lineage of Tibetan Buddhism',
  ARRAY['Golden Stupa', 'Kagyu Lineage Seat', 'Relics of 16th Karmapa', 'Traditional Architecture'],
  '/rumtek-monastery-golden-roof-traditional-architect.jpg'
),
(
  'Pemayangtse Monastery',
  'पेमायंग्त्से गुम्बा',
  27.3006,
  88.2394,
  'Pelling, Sikkim, India',
  'Pemayangtse Monastery is one of the oldest monasteries in Sikkim, belonging to the Nyingma sect of Tibetan Buddhism. It is famous for its wooden model of Zangdok Palri, the heavenly abode of Guru Padmasambhava.',
  'पेमायंग्त्से गुम्बा सिक्किमको सबैभन्दा पुरानो गुम्बाहरू मध्ये एक हो, तिब्बती बौद्ध धर्मको न्यिङ्गमा सम्प्रदायसँग सम्बन्धित। यो गुरु पद्मसम्भवको स्वर्गीय निवास जांगदोक पालरीको काठको मोडेलका लागि प्रसिद्ध छ।',
  '1705',
  'Oldest monastery in Sikkim, Nyingma sect',
  ARRAY['Zangdok Palri Model', 'Nyingma Sect', 'Ancient Architecture', 'Guru Padmasambhava'],
  '/pemayangtse-monastery-white-walls-mountain-view.jpg'
)
ON CONFLICT (name) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE monasteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to monasteries
DROP POLICY IF EXISTS "Monasteries are viewable by everyone" ON monasteries;
CREATE POLICY "Monasteries are viewable by everyone" ON monasteries
  FOR SELECT USING (true);

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for visits table
DROP POLICY IF EXISTS "Users can view their own visits" ON visits;
CREATE POLICY "Users can view their own visits" ON visits
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own visits" ON visits;
CREATE POLICY "Users can insert their own visits" ON visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own visits" ON visits;
CREATE POLICY "Users can update their own visits" ON visits
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own visits" ON visits;
CREATE POLICY "Users can delete their own visits" ON visits
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_monasteries_updated_at ON monasteries;
CREATE TRIGGER update_monasteries_updated_at
  BEFORE UPDATE ON monasteries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

