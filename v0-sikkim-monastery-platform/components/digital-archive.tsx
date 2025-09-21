'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Archive, Image, BookOpen, Search, Info } from 'lucide-react'
import { apiService, Archive as ArchiveType } from '@/lib/api'

// Fallback data for immediate display
const fallbackArchives: ArchiveType[] = [
  {
    id: 1,
    title: "Kangyur Manuscript Collection",
    titleNepali: "काङ्ग्युर पाण्डुलिपि संग्रह",
    description: "The 'Kangyur' translates to 'Translated Words of the Buddha' and consists of over 100 volumes of canonical scriptures. It includes sutras, tantras, and teachings attributed directly to Buddha Shakyamuni, preserved in Tibetan script. Considered sacred and often recited during ceremonies; many monasteries hold hand-copied or woodblock-printed editions.",
    descriptionNepali: "काङ्ग्युरले 'बुद्धका अनुवादित शब्दहरू' भन्ने अर्थ दिन्छ र १०० भन्दा बढी खण्डहरूको कैननिक ग्रन्थहरू समावेश गर्छ। यसमा सूत्र, तन्त्र र बुद्ध शाक्यमुनिलाई सीधै जिम्मेवार ठहराइएका शिक्षाहरू समावेश छन्, तिब्बती लिपिमा संरक्षित। पवित्र मानिन्छ र प्रायः समारोहहरूमा पाठ गरिन्छ; धेरै गुम्बाहरूले हस्तलिखित वा काठको ब्लक प्रिन्ट संस्करणहरू राख्छन्।",
    category: "Literature",
    period: "18th Century",
    location: "Rumtek Monastery",
    significance: "Sacred canonical texts and religious teachings",
    image: "/Digital Archive 1.jpg"
  },
  {
    id: 2,
    title: "Wheel of Life Mural (Bhavachakra)",
    titleNepali: "जीवन चक्र भित्ता चित्र (भवचक्र)",
    description: "A symbolic painting depicting the Buddhist understanding of existence and rebirth. Typically found at monastery entrances, the mural illustrates the six realms of existence, the twelve links of dependent origination, and Yama (the Lord of Death) holding the wheel. Serves as a visual teaching tool to explain karma, suffering, and liberation (nirvana).",
    descriptionNepali: "अस्तित्व र पुनर्जन्मको बौद्ध समझलाई चित्रण गर्ने प्रतीकात्मक चित्र। प्रायः गुम्बा प्रवेशद्वारमा भेटिन्छ, भित्ता चित्रले अस्तित्वका छ वटा क्षेत्रहरू, निर्भर उत्पत्तिका बाह्र वटा लिंकहरू र यम (मृत्युका देवता) ले चक्र लिएको चित्रण गर्छ। कर्म, दुःख र मुक्ति (निर्वाण) बुझाउनको लागि दृश्य शिक्षण उपकरणको रूपमा काम गर्छ।",
    category: "Art",
    period: "17th Century",
    location: "Pemayangtse Monastery",
    significance: "Visual teaching tool for Buddhist philosophy",
    image: "/Digital archive 2.jpg"
  },
  {
    id: 3,
    title: "Ritual Bell (Ghanta) and Dorje (Vajra) Set",
    titleNepali: "अनुष्ठानिक घण्टी (घण्टा) र दोर्जे (वज्र) सेट",
    description: "Essential ritual instruments in Tibetan Buddhism, always used together. The dorje (vajra) represents compassion and the indestructible nature of reality. The bell (ghanta) represents wisdom and emptiness. Their union in rituals symbolizes the inseparability of wisdom and compassion — the two pillars of Buddhist practice.",
    descriptionNepali: "तिब्बती बौद्ध धर्ममा आवश्यक अनुष्ठानिक उपकरणहरू, सधैं सँगै प्रयोग हुन्छ। दोर्जे (वज्र) ले करुणा र वास्तविकताको अविनाशी प्रकृतिलाई प्रतिनिधित्व गर्छ। घण्टा (घण्टा) ले ज्ञान र शून्यतालाई प्रतिनिधित्व गर्छ। अनुष्ठानहरूमा तिनीहरूको मिलनले ज्ञान र करुणाको अविभाज्यतालाई प्रतीक बनाउँछ — बौद्ध अभ्यासका दुई स्तम्भहरू।",
    category: "Artifacts",
    period: "16th Century",
    location: "Tashiding Monastery",
    significance: "Essential ritual instruments in Buddhist practice",
    image: "/digital archive 3.jpg"
  },
  {
    id: 4,
    title: "Prajnaparamita Sutra",
    titleNepali: "प्रज्ञापारमिता सूत्र",
    description: "One of the most important Mahayana Buddhist texts, meaning 'Perfection of Wisdom.' Explores the philosophy of emptiness (śūnyatā), emphasizing that all phenomena are devoid of inherent existence. A foundational scripture for scholars, monks, and practitioners, shaping Mahayana philosophy across Asia.",
    descriptionNepali: "सबैभन्दा महत्वपूर्ण महायान बौद्ध ग्रन्थहरू मध्ये एक, जसको अर्थ 'ज्ञानको पूर्णता' हो। शून्यताको दर्शन (शून्यता) अन्वेषण गर्छ, जोर दिन्छ कि सबै घटनाहरू आन्तरिक अस्तित्वबाट रहित छन्। विद्वानहरू, भिक्षुहरू र अभ्यासकर्ताहरूका लागि आधारभूत ग्रन्थ, एसियामा महायान दर्शनलाई आकार दिन्छ।",
    category: "Literature",
    period: "19th Century",
    location: "Enchey Monastery",
    significance: "Foundational Mahayana Buddhist scripture",
    image: "/Digital archive 4.jpg"
  },
  {
    id: 5,
    title: "Historical Monastery Construction",
    titleNepali: "ऐतिहासिक गुम्बा निर्माण",
    description: "Sikkimese monasteries were constructed between the 16th–18th centuries in traditional Tibetan style. Features sloping golden roofs, intricately carved wooden windows, and walls adorned with thangkas and frescoes. Many monasteries were reconstructed in the 20th century to preserve architecture and adapt to modern needs while maintaining heritage aesthetics.",
    descriptionNepali: "सिक्किमी गुम्बाहरू १६औं-१८औं शताब्दीका बीच पारम्परिक तिब्बती शैलीमा निर्माण गरिएका थिए। ढलानदार सुनौलो छतहरू, जटिल नक्काशीदार काठका झ्यालहरू र थाङ्का र भित्ता चित्रहरूले सजिएका पर्खालहरू समावेश गर्छ। धेरै गुम्बाहरू २०औं शताब्दीमा वास्तुकला संरक्षण गर्न र आधुनिक आवश्यकताहरू अनुकूल बनाउन पुनर्निर्माण गरिएका थिए जबकि विरासत सौन्दर्यशास्त्र कायम राख्दै।",
    category: "Art",
    period: "16th-18th Century",
    location: "Various Monasteries",
    significance: "Architectural heritage and cultural preservation",
    image: "/Digital archive 6.jpg"
  },
  {
    id: 6,
    title: "Medicine Buddha Thangka (Bhaisajyaguru)",
    titleNepali: "चिकित्सा बुद्ध थाङ्का (भैषज्यगुरु)",
    description: "A thangka painting of the Medicine Buddha, recognizable by his deep blue skin. He holds a bowl of medicinal nectar in his left hand and a myrobalan plant in his right hand. Revered as the supreme healer, these thangkas are used in rituals for health, healing, and spiritual purification.",
    descriptionNepali: "चिकित्सा बुद्धको थाङ्का चित्र, जुन उनको गहिरो नीलो छालाले पहिचान गरिन्छ। उनले आफ्नो बाँया हातमा औषधीय अमृतको कटोरा र दायाँ हातमा हर्रोको बिरुवा राख्छन्। सर्वोच्च चिकित्सकको रूपमा सम्मानित, यी थाङ्काहरू स्वास्थ्य, उपचार र आध्यात्मिक शुद्धिकरणका लागि अनुष्ठानहरूमा प्रयोग हुन्छन्।",
    category: "Art",
    period: "18th Century",
    location: "Rumtek Monastery",
    significance: "Healing and spiritual purification rituals",
    image: "/Digital archive 5.jpg"
  }
]

export default function DigitalArchive() {
  const [archives, setArchives] = useState<ArchiveType[]>(fallbackArchives) // Start with fallback data
  const [selectedArchive, setSelectedArchive] = useState<ArchiveType | null>(null)
  const [loading, setLoading] = useState(false) // Start as false since we have fallback data
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArchives, setFilteredArchives] = useState<ArchiveType[]>(fallbackArchives)

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 2000)
        )
        
        const archivesPromise = apiService.getArchives()
        
        const data = await Promise.race([archivesPromise, timeoutPromise]) as ArchiveType[]
        
        // Only update if we got data
        if (data && data.length > 0) {
          setArchives(data)
          setFilteredArchives(data)
        }
      } catch (error) {
        // Silently fail - we already have fallback data
        console.warn('API fetch failed, using fallback data:', error)
      }
    }

    // Fetch in background without blocking UI
    fetchArchives()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArchives(archives)
    } else {
      const filtered = archives.filter(archive =>
        archive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        archive.titleNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
        archive.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        archive.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredArchives(filtered)
    }
  }, [searchQuery, archives])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'art':
        return <Image className="w-4 h-4" />
      case 'literature':
        return <BookOpen className="w-4 h-4" />
      default:
        return <Archive className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'art':
        return 'bg-purple-100 text-purple-800'
      case 'literature':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  // No loading state needed since we start with fallback data

  return (
    <div className="w-full">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6 text-blue-600" />
            Digital Archive
          </h2>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="art">Art</TabsTrigger>
            <TabsTrigger value="literature">Literature</TabsTrigger>
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ArchiveGrid
              archives={filteredArchives}
              selectedArchive={selectedArchive}
              onArchiveSelect={setSelectedArchive}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>

          <TabsContent value="art" className="mt-6">
            <ArchiveGrid
              archives={filteredArchives.filter(archive => archive.category.toLowerCase() === 'art')}
              selectedArchive={selectedArchive}
              onArchiveSelect={setSelectedArchive}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>

          <TabsContent value="literature" className="mt-6">
            <ArchiveGrid
              archives={filteredArchives.filter(archive => archive.category.toLowerCase() === 'literature')}
              selectedArchive={selectedArchive}
              onArchiveSelect={setSelectedArchive}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>

          <TabsContent value="artifacts" className="mt-6">
            <ArchiveGrid
              archives={filteredArchives.filter(archive => archive.category.toLowerCase() === 'artifacts')}
              selectedArchive={selectedArchive}
              onArchiveSelect={setSelectedArchive}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>
        </Tabs>

        {/* Selected Archive Details */}
        {selectedArchive && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={selectedArchive.image}
                  alt={selectedArchive.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">{selectedArchive.title}</h3>
                  <Badge className={getCategoryColor(selectedArchive.category)}>
                    {getCategoryIcon(selectedArchive.category)}
                    <span className="ml-1">{selectedArchive.category}</span>
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{selectedArchive.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium">Period:</span> {selectedArchive.period}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {selectedArchive.location}
                  </div>
                  <div>
                    <span className="font-medium">Significance:</span> {selectedArchive.significance}
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Nepali Translation:</h4>
                  <p className="text-gray-700">{selectedArchive.descriptionNepali}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  )
}

interface ArchiveGridProps {
  archives: ArchiveType[]
  selectedArchive: ArchiveType | null
  onArchiveSelect: (archive: ArchiveType) => void
  getCategoryIcon: (category: string) => React.ReactNode
  getCategoryColor: (category: string) => string
}

function ArchiveGrid({ archives, selectedArchive, onArchiveSelect, getCategoryIcon, getCategoryColor }: ArchiveGridProps) {
  if (archives.length === 0) {
    return (
      <div className="text-center py-8">
        <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Archives Found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {archives.map((archive) => (
        <Card
          key={archive.id}
          className={`p-4 cursor-pointer transition-all duration-200 ${
            selectedArchive?.id === archive.id
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:shadow-md'
          }`}
          onClick={() => onArchiveSelect(archive)}
        >
          <div className="relative">
            <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
              <img
                src={archive.image}
                alt={archive.title}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge className={`absolute top-2 right-2 ${getCategoryColor(archive.category)}`}>
              {getCategoryIcon(archive.category)}
              <span className="ml-1">{archive.category}</span>
            </Badge>
          </div>

          <h3 className="font-semibold text-lg mb-2">{archive.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{archive.description}</p>

          <div className="space-y-1 text-xs text-gray-500">
            <div><span className="font-medium">Period:</span> {archive.period}</div>
            <div><span className="font-medium">Location:</span> {archive.location}</div>
          </div>

          <Button
            size="sm"
            className="w-full mt-3"
            onClick={(e) => {
              e.stopPropagation()
              onArchiveSelect(archive)
            }}
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Card>
      ))}
    </div>
  )
}
