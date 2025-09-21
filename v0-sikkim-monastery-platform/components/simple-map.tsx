'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { MapPin } from 'lucide-react'

interface Monastery {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  image: string
  nearbyLandmark: string
  speciality: string
}

interface SimpleMapProps {
  monasteries: Monastery[]
  onMonasteryClick: (monastery: Monastery) => void
}

export default function SimpleMap({ monasteries, onMonasteryClick }: SimpleMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
    <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
      {/* Simulated map background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Mountain ranges */}
          <path d="M0,200 Q100,150 200,180 T400,160 L400,300 L0,300 Z" fill="#10b981" opacity="0.3" />
          <path d="M0,220 Q150,170 300,190 T400,180 L400,300 L0,300 Z" fill="#059669" opacity="0.4" />
          {/* Rivers */}
          <path
            d="M50,250 Q150,200 250,220 T350,200"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Monastery Markers */}
      {monasteries.map((monastery, index) => (
        <div
          key={monastery.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
          style={{
            left: `${30 + (index * 40)}%`,
            top: `${40 + (index * 20)}%`,
          }}
          onClick={() => onMonasteryClick(monastery)}
        >
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap shadow-lg">
            {monastery.name}
          </div>
        </div>
      ))}

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Monastery Location</span>
        </div>
        <div className="text-gray-600">
          <p>📍 Rumtek: 27.3325° N, 88.6167° E</p>
          <p>📍 Pemayangtse: 27.3006° N, 88.2394° E</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 text-xs">
        <p className="font-medium mb-1">Interactive Map</p>
        <p className="text-gray-600">Click on markers to view details</p>
      </div>
    </div>
  )
}
