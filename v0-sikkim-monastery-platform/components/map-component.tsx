'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Button } from './ui/button'
import { Info, Camera } from 'lucide-react'
import { Monastery } from '@/lib/types'

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>
})

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { 
  ssr: false 
})

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { 
  ssr: false 
})

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { 
  ssr: false 
})


interface MapComponentProps {
  monasteries: Monastery[]
  onMonasteryClick: (monastery: Monastery) => void
  mapRef: any
  onVirtualTour?: (monastery: Monastery) => void
}

export default function MapComponent({ monasteries, onMonasteryClick, mapRef, onVirtualTour }: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Fix default marker icons for Leaflet - only on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
      }).catch((error) => {
        console.error('Failed to load Leaflet:', error)
      })
    }
  }, [])

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={[27.3166, 88.4281]} // Center between the two monasteries
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {monasteries.map((monastery) => (
        <Marker
          key={monastery.id}
          position={[monastery.coordinates.lat, monastery.coordinates.lng]}
          eventHandlers={{
            click: () => onMonasteryClick(monastery)
          }}
        >
          <Popup>
            <div className="p-3 min-w-[200px]">
              <div className="mb-3">
                <Image
                  src={monastery.image}
                  alt={monastery.name}
                  width={200}
                  height={120}
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
                        onClick={() => onMonasteryClick(monastery)}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {onVirtualTour && (
                        <Button
                          size="sm"
                          className="text-xs flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => onVirtualTour(monastery)}
                        >
                          <Camera className="w-3 h-3 mr-1" />
                          Virtual Tour
                        </Button>
                      )}
                    </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
