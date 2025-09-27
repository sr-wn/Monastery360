"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import {
  Search,
  Filter,
  BookOpen,
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  MapPin,
  Tag,
  Heart,
  Share2,
  Maximize,
  Grid3X3,
  List,
} from "lucide-react"
import Image from "next/image"
import { generateArchivePDF } from "@/lib/pdf-generator"

const archiveItems = [
  {
    id: "manuscript-001",
    title: "Kangyur Manuscript Collection",
    type: "manuscript",
    monastery: "Rumtek Monastery",
    date: "18th Century",
    description: "The 'Kangyur' translates to 'Translated Words of the Buddha' and consists of over 100 volumes of canonical scriptures. It includes sutras, tantras, and teachings attributed directly to Buddha Shakyamuni, preserved in Tibetan script. Considered sacred and often recited during ceremonies; many monasteries hold hand-copied or woodblock-printed editions.",
    image: "/Digital Archive 1.jpg",
    category: "Religious Texts",
    language: "Tibetan",
    condition: "Excellent",
    digitized: true,
    downloads: 1240,
    views: 5680,
    tags: ["Buddhism", "Kangyur", "Sacred Texts", "Tibetan"],
    detailedDescription: {
      overview: "The 'Kangyur' translates to 'Translated Words of the Buddha' and consists of over 100 volumes of canonical scriptures.",
      content: "It includes sutras, tantras, and teachings attributed directly to Buddha Shakyamuni, preserved in Tibetan script.",
      importance: "Considered sacred and often recited during ceremonies; many monasteries hold hand-copied or woodblock-printed editions.",
      additionalImages: ["/Digital Archive 1.jpg", "/Digital archive 2.jpg"]
    }
  },
  {
    id: "mural-002",
    title: "Wheel of Life Mural (Bhavachakra)",
    type: "artwork",
    monastery: "Pemayangtse Monastery",
    date: "17th Century",
    description: "A symbolic painting depicting the Buddhist understanding of existence and rebirth. Typically found at monastery entrances, the mural illustrates the six realms of existence, the twelve links of dependent origination, and Yama (the Lord of Death) holding the wheel. Serves as a visual teaching tool to explain karma, suffering, and liberation (nirvana).",
    image: "/Digital archive 2.jpg",
    category: "Wall Paintings",
    language: "Visual",
    condition: "Good",
    digitized: true,
    downloads: 890,
    views: 3420,
    tags: ["Art", "Wheel of Life", "Buddhism", "Mural"],
    detailedDescription: {
      overview: "A symbolic painting depicting the Buddhist understanding of existence and rebirth.",
      details: "Typically found at monastery entrances, the mural illustrates the six realms of existence, the twelve links of dependent origination, and Yama (the Lord of Death) holding the wheel.",
      purpose: "Serves as a visual teaching tool to explain karma, suffering, and liberation (nirvana).",
      additionalImages: ["/Digital archive 2.jpg", "/digital archive 3.jpg"]
    }
  },
  {
    id: "artifact-003",
    title: "Ritual Bell (Ghanta) and Dorje (Vajra) Set",
    type: "artifact",
    monastery: "Tashiding Monastery",
    date: "16th Century",
    description: "Essential ritual instruments in Tibetan Buddhism, always used together. The dorje (vajra) represents compassion and the indestructible nature of reality. The bell (ghanta) represents wisdom and emptiness. Their union in rituals symbolizes the inseparability of wisdom and compassion — the two pillars of Buddhist practice.",
    image: "/digital archive 3.jpg",
    category: "Ceremonial Objects",
    language: "N/A",
    condition: "Very Good",
    digitized: true,
    downloads: 567,
    views: 2130,
    tags: ["Ritual", "Bronze", "Ceremony", "Sacred Objects"],
    detailedDescription: {
      overview: "Essential ritual instruments in Tibetan Buddhism, always used together.",
      symbolism: {
        dorje: "The dorje (vajra) represents compassion and the indestructible nature of reality.",
        bell: "The bell (ghanta) represents wisdom and emptiness."
      },
      usage: "Their union in rituals symbolizes the inseparability of wisdom and compassion — the two pillars of Buddhist practice.",
      additionalImages: ["/digital archive 3.jpg", "/Digital archive 4.jpg"]
    }
  },
  {
    id: "manuscript-004",
    title: "Prajnaparamita Sutra",
    type: "manuscript",
    monastery: "Enchey Monastery",
    date: "19th Century",
    description: "One of the most important Mahayana Buddhist texts, meaning 'Perfection of Wisdom.' Explores the philosophy of emptiness (śūnyatā), emphasizing that all phenomena are devoid of inherent existence. A foundational scripture for scholars, monks, and practitioners, shaping Mahayana philosophy across Asia.",
    image: "/Digital archive 4.jpg",
    category: "Religious Texts",
    language: "Tibetan",
    condition: "Good",
    digitized: true,
    downloads: 723,
    views: 2890,
    tags: ["Sutra", "Wisdom", "Illuminated", "Calligraphy"],
    detailedDescription: {
      overview: "One of the most important Mahayana Buddhist texts, meaning 'Perfection of Wisdom.'",
      content: "Explores the philosophy of emptiness (śūnyatā), emphasizing that all phenomena are devoid of inherent existence.",
      importance: "A foundational scripture for scholars, monks, and practitioners, shaping Mahayana philosophy across Asia.",
      additionalImages: ["/Digital archive 4.jpg", "/Digital archive 5.jpg"]
    }
  },
  {
    id: "photo-005",
    title: "Historical Monastery Construction",
    type: "photograph",
    monastery: "Dubdi Monastery",
    date: "1920s",
    description: "Sikkimese monasteries were constructed between the 16th–18th centuries in traditional Tibetan style. Features sloping golden roofs, intricately carved wooden windows, and walls adorned with thangkas and frescoes. Many monasteries were reconstructed in the 20th century to preserve architecture and adapt to modern needs while maintaining heritage aesthetics.",
    image: "/Digital archive 6.jpg",
    category: "Historical Documents",
    language: "Visual",
    condition: "Fair",
    digitized: true,
    downloads: 445,
    views: 1670,
    tags: ["History", "Construction", "Photography", "Archive"],
    detailedDescription: {
      overview: "Sikkimese monasteries were constructed between the 16th–18th centuries in traditional Tibetan style.",
      features: "Sloping golden roofs, intricately carved wooden windows, and walls adorned with thangkas and frescoes.",
      preservation: "Many monasteries were reconstructed in the 20th century to preserve architecture and adapt to modern needs while maintaining heritage aesthetics.",
      additionalImages: ["/Digital archive 6.jpg", "/Digital archive 5.jpg", "/pemayangtse-monastery-white-walls-mountain-view.jpg"]
    }
  },
  {
    id: "thangka-006",
    title: "Medicine Buddha Thangka (Bhaisajyaguru)",
    type: "artwork",
    monastery: "Rumtek Monastery",
    date: "18th Century",
    description: "A thangka painting of the Medicine Buddha, recognizable by his deep blue skin. He holds a bowl of medicinal nectar in his left hand and a myrobalan plant in his right hand. Revered as the supreme healer, these thangkas are used in rituals for health, healing, and spiritual purification.",
    image: "/Digital archive 5.jpg",
    category: "Thangka Paintings",
    language: "Tibetan",
    condition: "Excellent",
    digitized: true,
    downloads: 1120,
    views: 4560,
    tags: ["Thangka", "Medicine Buddha", "Healing", "Silk Painting"],
    detailedDescription: {
      overview: "A thangka painting of the Medicine Buddha, recognizable by his deep blue skin.",
      symbolism: "He holds a bowl of medicinal nectar in his left hand and a myrobalan plant in his right hand.",
      purpose: "Revered as the supreme healer, these thangkas are used in rituals for health, healing, and spiritual purification.",
      additionalImages: ["/Digital archive 5.jpg", "/Digital Archive 1.jpg"]
    }
  },
]

export default function DigitalArchivesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [monasteryFilter, setMonasteryFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<(typeof archiveItems)[0] | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [isDownloading, setIsDownloading] = useState(false)

  const filteredItems = archiveItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesMonastery = monasteryFilter === "all" || item.monastery === monasteryFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesType && matchesMonastery && matchesCategory
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return b.date.localeCompare(a.date)
      case "views":
        return b.views - a.views
      case "downloads":
        return b.downloads - a.downloads
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const handleDownloadPDF = async (item: typeof archiveItems[0]) => {
    setIsDownloading(true)
    try {
      generateArchivePDF(item)
      // Update download count (in a real app, this would be sent to the server)
      console.log(`Downloading PDF report for: ${item.title}`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedItem ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search archives..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="manuscript">Manuscripts</SelectItem>
                        <SelectItem value="artwork">Artwork</SelectItem>
                        <SelectItem value="artifact">Artifacts</SelectItem>
                        <SelectItem value="photograph">Photographs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Monastery</label>
                    <Select value={monasteryFilter} onValueChange={setMonasteryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All monasteries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Monasteries</SelectItem>
                        <SelectItem value="Rumtek Monastery">Rumtek Monastery</SelectItem>
                        <SelectItem value="Pemayangtse Monastery">Pemayangtse Monastery</SelectItem>
                        <SelectItem value="Tashiding Monastery">Tashiding Monastery</SelectItem>
                        <SelectItem value="Enchey Monastery">Enchey Monastery</SelectItem>
                        <SelectItem value="Dubdi Monastery">Dubdi Monastery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Religious Texts">Religious Texts</SelectItem>
                        <SelectItem value="Wall Paintings">Wall Paintings</SelectItem>
                        <SelectItem value="Ceremonial Objects">Ceremonial Objects</SelectItem>
                        <SelectItem value="Thangka Paintings">Thangka Paintings</SelectItem>
                        <SelectItem value="Historical Documents">Historical Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setTypeFilter("all")
                      setMonasteryFilter("all")
                      setCategoryFilter("all")
                    }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Archive Statistics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Archive Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Items</span>
                    <span className="font-semibold">{archiveItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Manuscripts</span>
                    <span className="font-semibold">
                      {archiveItems.filter((item) => item.type === "manuscript").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Artworks</span>
                    <span className="font-semibold">
                      {archiveItems.filter((item) => item.type === "artwork").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Artifacts</span>
                    <span className="font-semibold">
                      {archiveItems.filter((item) => item.type === "artifact").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Digitized</span>
                    <span className="font-semibold">{archiveItems.filter((item) => item.digitized).length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-2xl mb-2">Digital Archives</h2>
                  <p className="text-muted-foreground">
                    Explore {filteredItems.length} digitized artifacts, manuscripts, and artworks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="downloads">Most Downloaded</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-md">
                    <Button
                      size="sm"
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === "list" ? "default" : "ghost"}
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Archive Items */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-background/90 text-foreground capitalize">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs">
                            <Eye className="w-3 h-3" />
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {item.monastery}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Download className="w-3 h-3" />
                              {item.downloads}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedItem(item)
                            }}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={120}
                            height={90}
                            className="rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.monastery} • {item.date}
                                </p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{item.views} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  <span>{item.downloads} downloads</span>
                                </div>
                                <span>Condition: {item.condition}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedItem(item)
                                }}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Item Detail View */
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={() => setSelectedItem(null)} className="bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Archives
              </Button>
              <div className="h-4 w-px bg-border"></div>
              <Badge variant="outline" className="capitalize">
                {selectedItem.type}
              </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden mb-6">
                  <div className="relative">
                    <Image
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.title}
                      width={800}
                      height={600}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="related">Related Items</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">About This Item</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">{selectedItem.description}</p>
                        
                        {/* Detailed Description */}
                        {selectedItem.detailedDescription && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-lg mb-3">Overview</h4>
                              <p className="text-muted-foreground leading-relaxed">
                                {selectedItem.detailedDescription.overview}
                              </p>
                            </div>

                            {selectedItem.detailedDescription.content && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Content</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.content}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.importance && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Importance</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.importance}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.details && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Details</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.details}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.purpose && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Purpose</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.purpose}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.symbolism && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Symbolism</h4>
                                {typeof selectedItem.detailedDescription.symbolism === 'object' ? (
                                  <div className="space-y-2">
                                    {Object.entries(selectedItem.detailedDescription.symbolism).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="font-medium capitalize">{key}:</span>
                                        <span className="text-muted-foreground ml-2">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground leading-relaxed">
                                    {selectedItem.detailedDescription.symbolism}
                                  </p>
                                )}
                              </div>
                            )}

                            {selectedItem.detailedDescription.usage && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Usage</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.usage}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.features && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Features</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.features}
                                </p>
                              </div>
                            )}

                            {selectedItem.detailedDescription.preservation && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Preservation</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedItem.detailedDescription.preservation}
                                </p>
                              </div>
                            )}

                            {/* Additional Images */}
                            {selectedItem.detailedDescription.additionalImages && selectedItem.detailedDescription.additionalImages.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-lg mb-3">Additional Images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {selectedItem.detailedDescription.additionalImages.map((image, index) => (
                                    <div key={index} className="relative overflow-hidden rounded-lg">
                                      <Image
                                        src={image}
                                        alt={`${selectedItem.title} - Image ${index + 1}`}
                                        width={200}
                                        height={150}
                                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-2 mt-6">
                          <h4 className="font-medium">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Technical Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Monastery</span>
                            <p className="font-medium">{selectedItem.monastery}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date</span>
                            <p className="font-medium">{selectedItem.date}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category</span>
                            <p className="font-medium">{selectedItem.category}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Language</span>
                            <p className="font-medium">{selectedItem.language}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Condition</span>
                            <p className="font-medium">{selectedItem.condition}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Digitized</span>
                            <p className="font-medium">{selectedItem.digitized ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="related" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {archiveItems
                        .filter((item) => item.id !== selectedItem.id && item.monastery === selectedItem.monastery)
                        .slice(0, 4)
                        .map((item) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedItem(item)}
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-3">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                                  <Badge variant="outline" className="text-xs mt-2 capitalize">
                                    {item.type}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{selectedItem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedItem.monastery}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedItem.date}</span>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleDownloadPDF(selectedItem)}
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? 'Generating PDF...' : 'Download High-Res'}
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Favorites
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Usage Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Views</span>
                        <span className="font-medium">{selectedItem.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads</span>
                        <span className="font-medium">{selectedItem.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Condition</span>
                        <span className="font-medium">{selectedItem.condition}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  )
}
