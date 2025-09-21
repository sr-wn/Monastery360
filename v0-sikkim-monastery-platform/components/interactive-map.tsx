'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { MapPin, Navigation, Info, X, Camera, Maximize2, Minimize2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
// L will be imported dynamically to avoid SSR issues
import { apiService, Monastery } from '@/lib/api'

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center">Loading map...</div>
}) as any
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false }) as any
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false }) as any
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false }) as any

interface InteractiveMapProps {
  onMonasterySelect?: (monastery: Monastery) => void
}

export default function InteractiveMap({ onMonasterySelect }: InteractiveMapProps) {
  const [monasteries, setMonasteries] = useState<Monastery[]>([])
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)
  const [infoMonastery, setInfoMonastery] = useState<Monastery | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [mapRef, setMapRef] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const fetchMonasteries = async () => {
      try {
        const data = await apiService.getMonasteries()
        setMonasteries(data)
      } catch (error) {
        console.error('Failed to fetch monasteries:', error)
        // Fallback data for the two specific monasteries
        setMonasteries([
          {
            id: 1,
            name: 'Rumtek Monastery',
            nameNepali: 'रुमटेक गुम्बा',
            latitude: 27.3325,
            longitude: 88.6167,
            address: 'Rumtek, Sikkim, India',
            description: 'Rumtek Monastery, also known as the Dharma Chakra Centre, is a Tibetan Buddhist monastery located in the Indian state of Sikkim. It serves as the seat of the Kagyu lineage and houses the Golden Stupa containing the relics of the 16th Karmapa.',
            descriptionNepali: 'रुमटेक गुम्बा, धर्म चक्र केन्द्रको रूपमा पनि चिनिन्छ, भारतको सिक्किम राज्यमा अवस्थित तिब्बती बौद्ध गुम्बा हो। यो काग्यु वंशको सिट हो र 16 औं कर्मापाको अवशेषहरू समावेश गर्ने स्वर्ण स्तूप राख्छ।',
            founded: '1960s (rebuilt)',
            significance: 'Seat of the Kagyu lineage of Tibetan Buddhism',
            features: ['Golden Stupa', 'Kagyu Lineage Seat', 'Relics of 16th Karmapa', 'Traditional Architecture'],
            image: '/rumtek-monastery-golden-roof-traditional-architect.jpg'
          },
          {
            id: 2,
            name: 'Pemayangtse Monastery',
            nameNepali: 'पेमायंग्त्से गुम्बा',
            latitude: 27.3006,
            longitude: 88.2394,
            address: 'Pelling, Sikkim, India',
            description: 'Pemayangtse Monastery is one of the oldest monasteries in Sikkim, belonging to the Nyingma sect of Tibetan Buddhism. It is famous for its wooden model of Zangdok Palri, the heavenly abode of Guru Padmasambhava.',
            descriptionNepali: 'पेमायंग्त्से गुम्बा सिक्किमको सबैभन्दा पुरानो गुम्बाहरू मध्ये एक हो, तिब्बती बौद्ध धर्मको न्यिङ्गमा सम्प्रदायसँग सम्बन्धित। यो गुरु पद्मसम्भवको स्वर्गीय निवास जांगदोक पालरीको काठको मोडेलका लागि प्रसिद्ध छ।',
            founded: '1705',
            significance: 'Oldest monastery in Sikkim, Nyingma sect',
            features: ['Zangdok Palri Model', 'Nyingma Sect', 'Ancient Architecture', 'Guru Padmasambhava'],
            image: '/pemayangtse-monastery-white-walls-mountain-view.jpg'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMonasteries()
    
    // Fix default marker icons - only on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
      })
    }
  }, [])

  const handleMonasteryClick = (monastery: Monastery) => {
    setSelectedMonastery(monastery)
    onMonasterySelect?.(monastery)
    
    // Smooth zoom to the monastery location
    if (mapRef) {
      mapRef.flyTo([monastery.latitude, monastery.longitude], 15, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.1
      })
    }
  }

  const handleInfoClick = (monastery: Monastery) => {
    setInfoMonastery(monastery)
  }

  const handleCloseInfo = () => {
    setInfoMonastery(null)
  }

  const handleVirtualTour = (monastery: Monastery) => {
    // Redirect to virtual tours page with monastery parameter
    router.push(`/tours?monastery=${monastery.id}`)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!mounted || loading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Monastery Locations
        </h2>
        
        {/* Selected Monastery Info Card - Fixed Above Map */}
        {selectedMonastery && (
          <div className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50 shadow-xl animate-in slide-in-from-top-2 duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <img
                        src={selectedMonastery.image}
                        alt={selectedMonastery.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{selectedMonastery.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{selectedMonastery.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {selectedMonastery.address}</span>
                          <span>🏔️ Near: {selectedMonastery.nearbyLandmark}</span>
                          <span>⭐ {selectedMonastery.significance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInfoClick(selectedMonastery)}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVirtualTour(selectedMonastery)}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Virtual Tour
                    </Button>
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
        
        {/* Interactive Map */}
        <div className={`relative w-full rounded-lg overflow-hidden mb-4 border ${isFullscreen ? 'fixed inset-0 z-40 h-screen' : 'h-96'}`}>
          {/* Fullscreen Toggle Button */}
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 z-30 bg-white/90 hover:bg-white shadow-md"
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
          
          <MapContainer
            center={[27.3166, 88.4281]} // Center between the two monasteries
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            ref={setMapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {monasteries.map((monastery) => (
              <Marker
                key={monastery.id}
                position={[monastery.latitude, monastery.longitude]}
                eventHandlers={{
                  click: () => handleMonasteryClick(monastery)
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="mb-3">
                      <img
                        src={monastery.image}
                        alt={monastery.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">{monastery.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{monastery.speciality}</p>
                      <p className="text-xs text-gray-500">Near: {monastery.nearbyLandmark}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex-1"
                        onClick={() => handleInfoClick(monastery)}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Info
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => handleVirtualTour(monastery)}
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Tour
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Monastery List */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monasteries.map((monastery) => (
              <Card
                key={monastery.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedMonastery?.id === monastery.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleMonasteryClick(monastery)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={monastery.image}
                      alt={monastery.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{monastery.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{monastery.address}</p>
                    <p className="text-xs text-blue-600 mb-2">Near: {monastery.nearbyLandmark}</p>
                    <p className="text-xs text-gray-500 mb-2">{monastery.speciality}</p>
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
                        <Navigation className="w-3 h-3 mr-1" />
                        View on Map
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={e => {
                          e.stopPropagation()
                          handleInfoClick(monastery)
                        }}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Info
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={e => {
                          e.stopPropagation()
                          handleVirtualTour(monastery)
                        }}
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Virtual Tour
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Modal */}
        {infoMonastery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseInfo}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-lg mb-2">{infoMonastery.name}</h3>
              <img
                src={infoMonastery.image}
                alt={infoMonastery.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <p className="text-gray-600 mb-3">{infoMonastery.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                <div>
                  <span className="font-medium">Founded:</span> {infoMonastery.founded}
                </div>
                <div>
                  <span className="font-medium">Significance:</span> {infoMonastery.significance}
                </div>
              </div>
              <div>
                <span className="font-medium text-sm">Features:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {infoMonastery.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}