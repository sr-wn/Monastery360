-- Check if tables exist and create if they don't
-- Run this in your Supabase SQL Editor

-- Check if users table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Create users table
        CREATE TABLE public.users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own profile" ON public.users
            FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON public.users
            FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON public.users
            FOR INSERT WITH CHECK (auth.uid() = id);

        -- Create trigger for automatic user profile creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.users (id, email, name, avatar_url)
            VALUES (
                NEW.id,
                NEW.email,
                COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
                COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        CREATE OR REPLACE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

        RAISE NOTICE 'Users table created successfully';
    ELSE
        RAISE NOTICE 'Users table already exists';
    END IF;
END $$;

-- Check if monasteries table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'monasteries') THEN
        -- Create monasteries table
        CREATE TABLE public.monasteries (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            location TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            image TEXT,
            website TEXT,
            phone TEXT,
            email TEXT,
            visiting_hours TEXT,
            special_events TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.monasteries ENABLE ROW LEVEL SECURITY;

        -- Create policies (allow all users to read monasteries)
        CREATE POLICY "Anyone can view monasteries" ON public.monasteries
            FOR SELECT USING (true);

        -- Insert sample data
        INSERT INTO public.monasteries (name, description, location, latitude, longitude, image, visiting_hours) VALUES
        ('Rumtek Monastery', 'The largest monastery in Sikkim, home to the Karmapa lineage', 'Rumtek, Sikkim', 27.33194, 88.60194, '/rumtek-monastery.jpg', '6:00 AM - 6:00 PM'),
        ('Pemayangtse Monastery', 'One of the oldest and most important monasteries in Sikkim', 'Pelling, Sikkim', 27.3000, 88.2500, '/pemayangtse-monastery.jpg', '6:00 AM - 6:00 PM'),
        ('Tashiding Monastery', 'A sacred monastery known for its annual Bumchu festival', 'Tashiding, Sikkim', 27.3500, 88.3000, '/tashiding-monastery.jpg', '6:00 AM - 6:00 PM');

        RAISE NOTICE 'Monasteries table created successfully';
    ELSE
        RAISE NOTICE 'Monasteries table already exists';
    END IF;
END $$;

-- Check if visits table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'visits') THEN
        -- Create visits table
        CREATE TABLE public.visits (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            monastery_id INTEGER REFERENCES public.monasteries(id) ON DELETE CASCADE,
            visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            review TEXT,
            photos TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own visits" ON public.visits
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can create own visits" ON public.visits
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own visits" ON public.visits
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete own visits" ON public.visits
            FOR DELETE USING (auth.uid() = user_id);

        RAISE NOTICE 'Visits table created successfully';
    ELSE
        RAISE NOTICE 'Visits table already exists';
    END IF;
END $$;

-- Check if all tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'monasteries', 'visits') THEN '✅ Required table exists'
        ELSE '❌ Missing required table'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'monasteries', 'visits')
ORDER BY table_name;
