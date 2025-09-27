# Supabase Setup Guide for Monastery360

This guide will help you set up Supabase for your Monastery360 project.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `monastery360`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## 3. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create monasteries table
CREATE TABLE monasteries (
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
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monastery_id INTEGER REFERENCES monasteries(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_monasteries_location ON monasteries(latitude, longitude);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_monastery_id ON visits(monastery_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at);

-- Insert sample data
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
);

-- Set up Row Level Security (RLS)
ALTER TABLE monasteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to monasteries
CREATE POLICY "Monasteries are viewable by everyone" ON monasteries
  FOR SELECT USING (true);

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for visits table
CREATE POLICY "Users can view their own visits" ON visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visits" ON visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" ON visits
  FOR UPDATE USING (auth.uid() = user_id);

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Set Up Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Enable email authentication
4. Optionally enable Google OAuth:
   - Go to **Authentication** → **Providers**
   - Enable Google provider
   - Add your Google OAuth credentials

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Supabase connection errors

3. Test the database connection by visiting the map page

## 7. Usage Examples

### Fetching Monasteries
```typescript
import { SupabaseService } from '@/lib/supabase-service'

const monasteries = await SupabaseService.getMonasteries()
```

### User Authentication
```typescript
import { SupabaseService } from '@/lib/supabase-service'

// Sign up
await SupabaseService.signUp('user@example.com', 'password', 'User Name')

// Sign in
await SupabaseService.signIn('user@example.com', 'password')

// Sign out
await SupabaseService.signOut()
```

### Recording Visits
```typescript
import { SupabaseService } from '@/lib/supabase-service'

const visit = await SupabaseService.createVisit({
  user_id: 'user-uuid',
  monastery_id: 1,
  visited_at: new Date().toISOString(),
  rating: 5,
  review: 'Amazing experience!'
})
```

## 8. Production Deployment

1. Update your environment variables with production Supabase credentials
2. Update the Site URL in Supabase Authentication settings to your production domain
3. Add your production domain to Redirect URLs
4. Consider setting up additional security policies as needed

## Troubleshooting

- **Connection errors**: Check your environment variables and Supabase project status
- **Authentication issues**: Verify your Site URL and Redirect URLs in Supabase settings
- **Database errors**: Check your RLS policies and table permissions
- **Type errors**: Regenerate types using the Supabase CLI if you modify your schema

For more information, visit the [Supabase Documentation](https://supabase.com/docs).

