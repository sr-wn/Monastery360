# Monastery360 - Digital Heritage Platform

A comprehensive digital platform for exploring Sikkim's sacred monasteries through virtual tours, interactive maps, digital archives, and cultural calendars.

## 🌟 Features

### 🏛️ Virtual Tours
- **360° Panoramic Views** of Rumtek and Pemayangtse Monasteries
- **Multilingual Support** (English, Hindi, Nepali)
- **Interactive Hotspots** with detailed information
- **Smooth Navigation** between different monastery sections

### 🗺️ Interactive Maps
- **Real-time Leaflet Maps** with precise monastery locations
- **Smooth Zoom Animations** to monastery locations
- **Detailed Monastery Information** with multilingual support
- **Virtual Tour Integration** from map markers

### 📚 Digital Archives
- **Comprehensive Collection** of manuscripts, murals, and artifacts
- **AI-Powered Search** through historical content
- **PDF Report Generation** for each archive item
- **High-Resolution Downloads** with detailed documentation

### 📅 Cultural Calendar
- **Multi-Year Event Display** (2024-2026)
- **Festival Schedules** and cultural events
- **Monastery-Specific Events** filtering
- **Interactive Event Details** with descriptions

## 🚀 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Leaflet** - Interactive maps
- **React-Leaflet** - React components for maps

### Backend
- **Java Spring Boot** - REST API backend
- **Maven** - Dependency management
- **PostgreSQL** - Database (configurable)

### Libraries & Tools
- **jsPDF** - PDF generation for archive reports
- **html2canvas** - HTML to canvas conversion
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

## 📁 Project Structure

```
v0-sikkim-monastery-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   ├── archives/                 # Digital archives page
│   ├── calendar/                 # Cultural calendar page
│   ├── map/                      # Interactive map page
│   ├── tours/                    # Virtual tours page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── interactive-map.tsx      # Map component
│   ├── panorama-viewer.tsx      # 360° viewer
│   └── digital-archive.tsx      # Archive component
├── lib/                         # Utility libraries
│   ├── types.ts                 # TypeScript interfaces
│   ├── pdf-generator.ts         # PDF generation
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
│   ├── *.jpg                    # Optimized images
│   └── manifest.json            # PWA manifest
├── backend/                     # Java Spring Boot backend
│   ├── src/main/java/           # Java source code
│   └── pom.xml                  # Maven configuration
└── README.md                    # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 17+ (for backend)
- **Maven** 3.6+ (for backend)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

## 🌐 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/monastery360
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=monastery360
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Map Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## 📱 Features Overview

### 🏛️ Monastery Information
- **Rumtek Monastery**: Golden Stupa, Kagyu lineage seat
- **Pemayangtse Monastery**: Oldest monastery, wooden Zangdok Palri model
- **Multilingual Support**: English, Hindi, and Nepali translations
- **Detailed Descriptions**: History, architecture, and cultural significance

### 🗺️ Interactive Features
- **Smooth Zoom Animations** to monastery locations
- **Popup Information** with monastery details
- **Virtual Tour Integration** from map markers
- **Responsive Design** for all devices

### 📚 Digital Archives
- **Manuscript Collections**: Kangyur manuscripts and sutras
- **Artifact Documentation**: Ritual bells, thangkas, and murals
- **PDF Report Generation**: Detailed reports for each archive item
- **Search Functionality**: AI-powered content discovery

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue (#164e63)
- **Accent**: Warm orange (#f59e0b)
- **Background**: Light gray (#f8fafc)
- **Text**: Dark gray (#1f2937)

### Typography
- **Headings**: Space Grotesk (Google Fonts)
- **Body**: DM Sans (Google Fonts)
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build Docker image
docker build -t monastery360 .

# Run container
docker run -p 3000:3000 monastery360
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sikkim Tourism Department** for monastery information
- **Buddhist Heritage Sites** for cultural context
- **Open Source Community** for amazing libraries and tools

## 📞 Support

For support, email support@monastery360.com or create an issue in this repository.

---

**Monastery360** - Preserving sacred heritage through digital innovation. 🏛️✨