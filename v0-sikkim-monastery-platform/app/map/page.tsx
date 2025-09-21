"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Filter,
  Star,
  Users,
  Camera,
  Route,
  Phone,
  Globe,
  Calendar,
  Mountain,
  Car,
  Bus,
  Plane,
  Info,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import Image from "next/image"
import Navigation from "@/components/navigation"
import MapComponent from "@/components/map-component"
import ErrorBoundary from "@/components/error-boundary"
import { useRouter } from "next/navigation"
import { Monastery } from "@/lib/types"

const monasteries = [
  {
    id: "rumtek",
    name: "Rumtek Monastery",
    nameHindi: "रुमटेक मठ",
    nameNepali: "रुमटेक गुम्बा",
    location: "Gangtok, East Sikkim",
    coordinates: { lat: 27.3325, lng: 88.6167 },
    description: "The largest monastery in Sikkim and seat of the Karmapa",
    descriptionHindi: "सिक्किम का सबसे बड़ा मठ और कर्मापा की सीट",
    descriptionNepali: "सिक्किमको सबैभन्दा ठूलो गुम्बा र कर्मापाको सिट",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    rating: 4.9,
    visitors: "2.1k",
    established: "1966",
    altitude: "1,550m",
    category: "Kagyu",
    accessibility: "Easy",
    distance: "24 km from Gangtok",
    highlights: ["Golden Stupa", "Prayer Hall", "Monks' Quarters"],
    contact: "+91-3592-252-xxx",
    website: "rumtek-monastery.org",
    bestTime: "March-June, Sept-Nov",
    transportation: ["Car", "Bus", "Taxi"],
    nearbyLandmark: "Gangtok",
    speciality: "Golden Stupa, Kagyu lineage seat",
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse Monastery",
    nameHindi: "पेमायंग्त्से मठ",
    nameNepali: "पेमायंग्त्से गुम्बा",
    location: "Pelling, West Sikkim",
    coordinates: { lat: 27.3006, lng: 88.2394 },
    description: "One of the oldest and most important monasteries in Sikkim",
    descriptionHindi: "सिक्किम के सबसे पुराने और महत्वपूर्ण मठों में से एक",
    descriptionNepali: "सिक्किमका सबैभन्दा पुरानो र महत्वपूर्ण गुम्बाहरू मध्ये एक",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    rating: 4.8,
    visitors: "1.8k",
    established: "1705",
    altitude: "2,085m",
    category: "Nyingma",
    accessibility: "Moderate",
    distance: "110 km from Gangtok",
    highlights: ["Ancient Murals", "Wooden Sculptures", "Sacred Texts"],
    contact: "+91-3595-250-xxx",
    website: "pemayangtse.org",
    bestTime: "April-June, Oct-Dec",
    transportation: ["Car", "Bus"],
    nearbyLandmark: "Pelling",
    speciality: "Oldest monastery, wooden Zangdok Palri model",
  },
]

export default function InteractiveMapPage() {
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mapRef, setMapRef] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [infoMonastery, setInfoMonastery] = useState<Monastery | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && infoMonastery) {
        setInfoMonastery(null)
      }
    }

    if (infoMonastery) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [infoMonastery])

  const handleMonasteryClick = (monastery: Monastery) => {
    setSelectedMonastery(monastery)
    
    // Smooth zoom to the monastery location
    if (mapRef) {
      mapRef.flyTo([monastery.coordinates.lat, monastery.coordinates.lng], 15, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.1
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleVirtualTour = (monastery: Monastery) => {
    router.push(`/tours?monastery=${monastery.id}`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            Interactive Monastery Map
          </h1>
          <p className="text-muted-foreground">
            Explore the two historic monasteries of Sikkim with their exact locations and detailed information.
          </p>
        </div>

        {/* Selected Monastery Info Card - Fixed Above Map */}
        {selectedMonastery && (
          <div className={`mb-6 ${infoMonastery ? 'z-0' : ''}`}>
            <Card className="border-2 border-blue-200 bg-blue-50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <Image
                        src={selectedMonastery.image}
                        alt={selectedMonastery.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{selectedMonastery.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{selectedMonastery.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>📍 {selectedMonastery.location}</span>
                          <span>🏔️ Near: {selectedMonastery.nearbyLandmark}</span>
                          <span>⭐ {selectedMonastery.speciality}</span>
                        </div>
                        <Button
                          onClick={() => handleVirtualTour(selectedMonastery)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Take Virtual Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMonastery(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Map Controls - Above Map */}
        <div className="flex justify-end mb-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white hover:bg-gray-50 shadow-md"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 mr-1" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-1" />
                Fullscreen
              </>
            )}
          </Button>
        </div>

        {/* Interactive Map */}
        <div className={`relative w-full rounded-lg overflow-hidden mb-6 border ${isFullscreen ? 'fixed inset-0 z-40 h-screen' : 'h-96'} ${infoMonastery ? 'z-0' : ''}`}>
          
          <ErrorBoundary
            fallback={
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
                  <p className="text-gray-600 mb-4">
                    Unable to load the interactive map. Please check your internet connection.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">📍 Rumtek Monastery: 27.3325° N, 88.6167° E</p>
                    <p className="text-sm text-gray-500">📍 Pemayangtse Monastery: 27.3006° N, 88.2394° E</p>
                  </div>
                </div>
              </div>
            }
          >
            <MapComponent
              monasteries={monasteries}
              onMonasteryClick={handleMonasteryClick}
              mapRef={setMapRef}
              onVirtualTour={handleVirtualTour}
            />
          </ErrorBoundary>
        </div>

        {/* Monastery List */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monasteries.map((monastery) => (
              <Card
                key={monastery.id}
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  selectedMonastery?.id === monastery.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleMonasteryClick(monastery)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={monastery.image}
                      alt={monastery.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{monastery.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{monastery.location}</p>
                    <p className="text-sm text-blue-600 mb-2">Near: {monastery.nearbyLandmark}</p>
                    <p className="text-sm text-gray-500 mb-3">{monastery.speciality}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={e => {
                          e.stopPropagation()
                          handleMonasteryClick(monastery)
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        View on Map
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={e => {
                          e.stopPropagation()
                          setInfoMonastery(monastery)
                        }}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Info
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {!isFullscreen && (
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{monasteries.length}</div>
                <div className="text-sm text-muted-foreground">Total Monasteries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">2</div>
                <div className="text-sm text-muted-foreground">Buddhist Schools</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">300+</div>
                <div className="text-sm text-muted-foreground">Years of History</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">3.9k</div>
                <div className="text-sm text-muted-foreground">Monthly Visitors</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Multilingual Info Modal */}
        {infoMonastery && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setInfoMonastery(null)
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 bg-white z-10 flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Monastery Information</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInfoMonastery(null)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Monastery Image */}
                <div className="text-center">
                  <Image
                    src={infoMonastery.image}
                    alt={infoMonastery.name}
                    width={300}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                </div>

                {/* Language Tabs */}
                <div className="space-y-4">
                  {/* English */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 text-blue-600">English</h3>
                    <h4 className="font-bold text-xl mb-2">{infoMonastery.name}</h4>
                    <p className="text-gray-700 mb-3">{infoMonastery.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Location:</span> {infoMonastery.location}
                      </div>
                      <div>
                        <span className="font-medium">Established:</span> {infoMonastery.established}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {infoMonastery.category}
                      </div>
                      <div>
                        <span className="font-medium">Altitude:</span> {infoMonastery.altitude}
                      </div>
                    </div>
                  </div>

                  {/* Hindi */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 text-green-600">हिंदी (Hindi)</h3>
                    <h4 className="font-bold text-xl mb-2">{infoMonastery.nameHindi}</h4>
                    <p className="text-gray-700 mb-3">{infoMonastery.descriptionHindi}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">स्थान:</span> {infoMonastery.location}
                      </div>
                      <div>
                        <span className="font-medium">स्थापित:</span> {infoMonastery.established}
                      </div>
                      <div>
                        <span className="font-medium">श्रेणी:</span> {infoMonastery.category}
                      </div>
                      <div>
                        <span className="font-medium">ऊंचाई:</span> {infoMonastery.altitude}
                      </div>
                    </div>
                  </div>

                  {/* Nepali */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 text-red-600">नेपाली (Nepali)</h3>
                    <h4 className="font-bold text-xl mb-2">{infoMonastery.nameNepali}</h4>
                    <p className="text-gray-700 mb-3">{infoMonastery.descriptionNepali}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">स्थान:</span> {infoMonastery.location}
                      </div>
                      <div>
                        <span className="font-medium">स्थापना:</span> {infoMonastery.established}
                      </div>
                      <div>
                        <span className="font-medium">श्रेणी:</span> {infoMonastery.category}
                      </div>
                      <div>
                        <span className="font-medium">उचाइ:</span> {infoMonastery.altitude}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Speciality:</span> {infoMonastery.speciality}
                    </div>
                    <div>
                      <span className="font-medium">Accessibility:</span> {infoMonastery.accessibility}
                    </div>
                    <div>
                      <span className="font-medium">Best Time:</span> {infoMonastery.bestTime}
                    </div>
                    <div>
                      <span className="font-medium">Distance:</span> {infoMonastery.distance}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="font-medium">Highlights:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {infoMonastery.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
