"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Info,
  MapPin,
  Clock,
  Users,
  Star,
  Headphones,
} from "lucide-react"
import Image from "next/image"

const monasteries = [
  {
    id: "rumtek",
    name: "Rumtek Monastery",
    location: "Gangtok, Sikkim",
    description: "The largest monastery in Sikkim and the main seat of the Karma Kagyu lineage",
    duration: "45 min",
    rating: 4.9,
    visitors: "2.1k",
    languages: ["English", "Hindi", "Nepali", "Tibetan"],
    highlights: ["Golden Stupa", "Prayer Hall", "Monks' Quarters", "Mountain Views"],
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    panorama: "/placeholder.svg?height=400&width=800&text=360°+Rumtek+Monastery+Interior",
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse Monastery",
    location: "Pelling, West Sikkim",
    description: "One of the oldest and most important monasteries in Sikkim",
    duration: "35 min",
    rating: 4.8,
    visitors: "1.8k",
    languages: ["English", "Hindi", "Nepali"],
    highlights: ["Ancient Murals", "Wooden Sculptures", "Sacred Texts", "Himalayan Views"],
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    panorama: "/placeholder.svg?height=400&width=800&text=360°+Pemayangtse+Prayer+Hall",
  },
]

export default function VirtualToursPage() {
  const [selectedMonastery, setSelectedMonastery] = useState(monasteries[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [showInfo, setShowInfo] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const monasteryId = searchParams.get('monastery')
    if (monasteryId) {
      const monastery = monasteries.find(m => m.id === monasteryId)
      if (monastery) {
        setSelectedMonastery(monastery)
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Monastery Selection Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-heading font-semibold text-xl mb-4">Choose Monastery</h2>
              <div className="space-y-3">
                {monasteries.map((monastery) => (
                  <Card
                    key={monastery.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMonastery.id === monastery.id
                        ? "ring-2 ring-primary border-primary/50"
                        : "hover:border-primary/20"
                    }`}
                    onClick={() => setSelectedMonastery(monastery)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Image
                          src={monastery.image || "/placeholder.svg"}
                          alt={monastery.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{monastery.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {monastery.location}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              <span className="text-xs font-medium">{monastery.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {monastery.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tour Controls */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Tour Settings</h3>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Audio Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
                  >
                    {selectedMonastery.languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Auto-rotate</span>
                  <Button size="sm" variant="outline" className="h-8 bg-transparent">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Show Info</span>
                  <Button
                    size="sm"
                    variant={showInfo ? "default" : "outline"}
                    className="h-8"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tour Viewer */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tour Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-heading font-bold text-2xl lg:text-3xl mb-2">{selectedMonastery.name}</h1>
                <p className="text-muted-foreground mb-4">{selectedMonastery.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMonastery.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMonastery.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMonastery.visitors} visitors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>{selectedMonastery.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 360° Viewer */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={selectedMonastery.panorama || "/placeholder.svg"}
                  alt={`360° view of ${selectedMonastery.name}`}
                  fill
                  className="object-cover"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                  {/* Play/Pause Button */}
                  <div className="absolute bottom-4 left-4">
                    <Button
                      size="lg"
                      className="rounded-full w-12 h-12 p-0 bg-background/90 hover:bg-background text-foreground"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>

                  {/* Audio Controls */}
                  <div className="absolute bottom-4 left-20 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-background/90 hover:bg-background"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-white">
                      <Headphones className="w-3 h-3" />
                      <span>{selectedLanguage}</span>
                    </div>
                  </div>

                  {/* Fullscreen Button */}
                  <div className="absolute bottom-4 right-4">
                    <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Interactive Hotspots */}
                  <div className="absolute top-1/3 left-1/4 animate-pulse">
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        Golden Stupa
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-1/3 animate-pulse">
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        Prayer Hall
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div className="h-full bg-accent w-1/3 transition-all duration-1000"></div>
                </div>
              </div>
            </Card>

            {/* Tour Information */}
            {showInfo && (
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="highlights" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="highlights">Highlights</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="visit">Visit Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="highlights" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Tour Highlights</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedMonastery.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Historical Significance</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedMonastery.name} holds deep spiritual and cultural significance in Sikkim's Buddhist
                          heritage. Built centuries ago, it has served as a center for meditation, learning, and
                          community gathering. The monastery's architecture reflects traditional Tibetan Buddhist design
                          principles, with intricate woodwork, colorful murals, and sacred symbols throughout.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="visit" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Visiting Information</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Best Time to Visit</h4>
                            <p className="text-muted-foreground">March to June, September to November</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Opening Hours</h4>
                            <p className="text-muted-foreground">6:00 AM - 6:00 PM daily</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Entry Fee</h4>
                            <p className="text-muted-foreground">Free for all visitors</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Photography</h4>
                            <p className="text-muted-foreground">Allowed in courtyard only</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Related Tours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Explore Other Monastery</h3>
                <div className="grid md:grid-cols-1 gap-4">
                  {monasteries
                    .filter((m) => m.id !== selectedMonastery.id)
                    .map((monastery) => (
                      <div
                        key={monastery.id}
                        className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/20 cursor-pointer transition-colors"
                        onClick={() => setSelectedMonastery(monastery)}
                      >
                        <Image
                          src={monastery.image || "/placeholder.svg"}
                          alt={monastery.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{monastery.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{monastery.location}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              <span className="text-xs">{monastery.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{monastery.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
