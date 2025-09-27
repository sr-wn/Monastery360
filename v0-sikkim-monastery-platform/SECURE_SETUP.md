# 🔒 Secure Supabase Setup Guide

## ✅ Your Credentials Are Integrated

Your Supabase credentials have been securely integrated into the project:

- **Project URL**: `https://fqjgzgkeoebfdldhdxkb.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (configured)

## 🛡️ Security Measures Implemented

### 1. **Environment Variables Setup**
Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fqjgzgkeoebfdldhdxkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxamd6Z2tlb2ViZmRsZGhkeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTYzNTUsImV4cCI6MjA3NDUzMjM1NX0.-W75gkbHlPRBLprVCl_JbrN3bDNe1e2Q9iuSMhWc6rg

# Other environment variables...
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. **Fallback Configuration**
The Supabase client is configured with fallback values, so it works even without environment variables during development.

### 3. **Anon Key Security**
- ✅ **Safe for client-side use** - The anon key is designed to be public
- ✅ **Row Level Security** - Your data is protected by RLS policies
- ✅ **No sensitive operations** - Anon key can only perform operations allowed by your RLS policies

## 🧪 Test Your Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the test page:**
   ```
   http://localhost:3000/supabase-test
   ```

3. **Run the tests:**
   - Connection Test
   - Authentication Test  
   - Database Table Test

## 🗄️ Database Setup Required

You need to set up your database tables. Run this SQL in your Supabase SQL Editor:

```sql
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

-- Enable Row Level Security
ALTER TABLE monasteries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Monasteries are viewable by everyone" ON monasteries
  FOR SELECT USING (true);
```

## 🔐 Security Best Practices

### ✅ What's Secure:
- **Anon key in client code** - This is safe and intended
- **Environment variables** - Never committed to git
- **RLS policies** - Protect your data at the database level

### ⚠️ What to Protect:
- **Service role key** - Never expose this in client code
- **Database password** - Keep this secret
- **API secrets** - Use environment variables

### 🛡️ Additional Security:
1. **Set up RLS policies** in your Supabase dashboard
2. **Use environment variables** for production
3. **Regular security audits** of your policies
4. **Monitor API usage** in Supabase dashboard

## 🚀 Usage Examples

```typescript
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/supabase-service'

// Fetch monasteries
const monasteries = await SupabaseService.getMonasteries()

// Create a visit record
const visit = await SupabaseService.createVisit({
  user_id: 'user-uuid',
  monastery_id: 1,
  visited_at: new Date().toISOString(),
  rating: 5,
  review: 'Amazing experience!'
})
```

## 📱 Test Your Setup

1. Visit `/supabase-test` to verify everything works
2. Check the browser console for any errors
3. Verify data appears in your Supabase dashboard

Your Supabase integration is now secure and ready to use! 🎉

