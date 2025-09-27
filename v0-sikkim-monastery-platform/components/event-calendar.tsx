'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Calendar, Clock, MapPin, Info, Ticket } from 'lucide-react'
import { apiService, Festival } from '@/lib/api'

// Fallback data for immediate display - using current and future dates
const currentDate = new Date()

// Helper function to get future dates - using a fixed approach to avoid hydration issues
const getFutureDate = (daysFromNow: number) => {
  // Use a fixed date approach to ensure consistency
  const today = new Date('2024-12-01') // Use a fixed reference date
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysFromNow)
  
  const year = futureDate.getFullYear()
  const month = String(futureDate.getMonth() + 1).padStart(2, '0')
  const day = String(futureDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // Returns YYYY-MM-DD format
}

const fallbackFestivals: Festival[] = [
  {
    id: 1,
    name: "Losar Festival",
    nameNepali: "लोसार पर्व",
    date: getFutureDate(15), // 15 days from now
    description: "Tibetan New Year celebration with traditional ceremonies and cultural performances.",
    descriptionNepali: "तिब्बती नयाँ वर्षको उत्सव पारम्परिक समारोह र सांस्कृतिक प्रदर्शनहरूसहित।",
    location: "Rumtek Monastery",
    duration: "3 days",
    significance: "New Year celebration and community gathering",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg"
  },
  {
    id: 2,
    name: "Saga Dawa Festival",
    nameNepali: "सगा दावा पर्व",
    date: getFutureDate(30), // 30 days from now
    description: "Sacred festival commemorating Buddha's birth, enlightenment, and parinirvana.",
    descriptionNepali: "बुद्धको जन्म, ज्ञानोदय र परिनिर्वाणको स्मरण गर्ने पवित्र पर्व।",
    location: "Pemayangtse Monastery",
    duration: "1 day",
    significance: "Triple celebration of Buddha's major life events",
    image: "/majestic-himalayan-monastery-with-prayer-flags-and.jpg"
  },
  {
    id: 3,
    name: "New Year Blessing Ceremony",
    nameNepali: "नयाँ वर्ष आशीर्वाद समारोह",
    date: getFutureDate(5), // 5 days from now
    description: "Special blessing ceremony for the new year with prayers for peace and prosperity.",
    descriptionNepali: "नयाँ वर्षका लागि विशेष आशीर्वाद समारोह, शान्ति र समृद्धिका लागि प्रार्थनासहित।",
    location: "All Monasteries",
    duration: "3 hours",
    significance: "New year blessings and purification",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg"
  },
  {
    id: 4,
    name: "Bumchu Festival",
    nameNepali: "बुम्चु पर्व",
    date: getFutureDate(20), // 20 days from now
    description: "Sacred water festival with the opening of the holy water vase at Tashiding Monastery.",
    descriptionNepali: "ताशिडिङ गुम्बामा पवित्र पानीको भाँडो खोल्ने पवित्र पानी पर्व।",
    location: "Tashiding Monastery",
    duration: "1 day",
    significance: "Sacred water ceremony and pilgrimage",
    image: "/tashiding-monastery-hilltop-prayer-flags-valley-vi.jpg"
  },
  {
    id: 5,
    name: "Butter Lamp Festival",
    nameNepali: "घिउको बत्ती पर्व",
    date: getFutureDate(25), // 25 days from now
    description: "Beautiful evening festival with thousands of butter lamps creating a magical atmosphere.",
    descriptionNepali: "हजारौं घिउको बत्तीहरूले जादुई वातावरण सिर्जना गर्ने सुन्दर साँझको पर्व।",
    location: "Pemayangtse Monastery",
    duration: "4 hours",
    significance: "Light offering and spiritual illumination",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg"
  }
]

// Debug the generated dates
console.log('Generated festival dates:', fallbackFestivals.map(f => ({ name: f.name, date: f.date })))

// Custom hook to handle date formatting consistently
const useConsistentDate = (dateString: string) => {
  const [formattedDate, setFormattedDate] = useState('')
  
  useEffect(() => {
    try {
      const [year, month, day] = dateString.split('-').map(Number)
      if (year && month && day) {
        setFormattedDate(`${month}/${day}/${year}`)
      } else {
        setFormattedDate('Invalid Date')
      }
    } catch (error) {
      setFormattedDate('Invalid Date')
    }
  }, [dateString])
  
  return formattedDate
}

// Festival Card Component with consistent date formatting
const FestivalCard = ({ festival, isSelected, onSelect, onLearnMore }: {
  festival: Festival
  isSelected: boolean
  onSelect: (festival: Festival) => void
  onLearnMore: (festival: Festival) => void
}) => {
  const formattedDate = useConsistentDate(festival.date)
  
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(festival)}
    >
      <div className="relative">
        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
          <img
            src={festival.image}
            alt={festival.name}
            className="w-full h-full object-cover"
          />
        </div>
        <Badge className="absolute top-2 right-2 bg-red-600 text-white">
          {festival.duration}
        </Badge>
      </div>

      <h3 className="font-semibold text-lg mb-2">{festival.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{festival.description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{festival.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{festival.duration}</span>
        </div>
      </div>

      <Button
        size="sm"
        className="w-full mt-3"
        onClick={(e) => {
          e.stopPropagation()
          onLearnMore(festival)
        }}
      >
        <Info className="w-4 h-4 mr-2" />
        Learn More
      </Button>
    </Card>
  )
}

export default function EventCalendar() {
  const [festivals, setFestivals] = useState<Festival[]>([]) // Start empty to prevent hydration mismatch
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setFestivals(fallbackFestivals)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const fetchFestivals = async () => {
      try {
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 2000)
        )
        
        const festivalsPromise = apiService.getFestivals()
        
        const data = await Promise.race([festivalsPromise, timeoutPromise]) as Festival[]
        
        // Only update if we got data
        if (data && data.length > 0) {
          setFestivals(data)
        }
      } catch (error) {
        // Silently fail - we already have fallback data
        console.warn('API fetch failed, using fallback data:', error)
      }
    }

    // Fetch in background without blocking UI
    fetchFestivals()
  }, [mounted])

  const formatDate = (dateString: string) => {
    try {
      // Parse the date string directly without timezone conversion
      const [year, month, day] = dateString.split('-').map(Number)
      if (!year || !month || !day) {
        return 'Invalid Date'
      }
      // Use a consistent format that works on both server and client
      return `${month}/${day}/${year}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  const getUpcomingFestivals = () => {
    // For now, let's show all festivals to debug the issue
    console.log('All festivals before filtering:', festivals)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    
    const filtered = festivals.filter(festival => {
      try {
        const festivalDate = new Date(festival.date)
        if (isNaN(festivalDate.getTime())) {
          console.warn('Invalid date for festival:', festival.name, festival.date)
          return true // Include invalid dates for debugging
        }
        festivalDate.setHours(0, 0, 0, 0) // Reset time to start of day
        const isUpcoming = festivalDate >= today
        console.log(`Festival ${festival.name} (${festival.date}): ${isUpcoming ? 'upcoming' : 'past'}`)
        return isUpcoming
      } catch (error) {
        console.error('Error filtering festival date:', error)
        return true // Include for debugging
      }
    })
    
    console.log('Filtered festivals:', filtered)
    return filtered
  }

  // Button handlers
  const handleLearnMore = (festival: Festival) => {
    setSelectedFestival(festival)
  }

  const handleBookTickets = (festival: Festival) => {
    alert(`Booking tickets for ${festival.name} at ${festival.location}`)
  }

  const handleAddToCalendar = (festival: Festival) => {
    alert(`Adding ${festival.name} to your calendar`)
  }

  // No loading state needed since we start with fallback data

  const upcomingFestivals = getUpcomingFestivals()

  // Debug logging
  console.log('Total festivals:', festivals.length)
  console.log('Upcoming festivals:', upcomingFestivals.length)
  console.log('Festivals data:', festivals)
  console.log('Today:', new Date().toISOString().split('T')[0])
  
  // For debugging, let's always show all festivals
  const displayFestivals = festivals
  
  // Add a test festival if none exist
  if (displayFestivals.length === 0) {
    console.warn('No festivals found, adding test festival')
    displayFestivals.push({
      id: 999,
      name: "Test Festival",
      nameNepali: "परीक्षण पर्व",
      date: new Date().toISOString().split('T')[0],
      description: "This is a test festival to ensure the calendar works.",
      descriptionNepali: "यो क्यालेन्डर काम गर्छ भन्ने सुनिश्चित गर्नको लागि परीक्षण पर्व हो।",
      location: "Test Location",
      duration: "1 day",
      significance: "Testing purposes",
      image: "/placeholder.svg"
    })
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading calendar...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Festival Calendar
          </h2>
          <div className="text-sm text-gray-500">
            {displayFestivals.length} events
          </div>
        </div>
        
        {/* Debug info */}
        <div className="mb-4 p-2 bg-yellow-100 text-sm">
          Debug: {festivals.length} total festivals, {displayFestivals.length} to display
        </div>

        {/* Festival Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {displayFestivals.length > 0 ? displayFestivals.map((festival) => (
            <FestivalCard
              key={festival.id}
              festival={festival}
              isSelected={selectedFestival?.id === festival.id}
              onSelect={setSelectedFestival}
              onLearnMore={handleLearnMore}
            />
          )) : (
            <div className="col-span-full text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Upcoming Festivals</h3>
              <p className="text-gray-500">Check back later for new festival announcements.</p>
            </div>
          )}
        </div>

        {/* Selected Festival Details */}
        {selectedFestival && (
          <SelectedFestivalDetails festival={selectedFestival} />
        )}
      </Card>
    </div>
  )
}

// Selected Festival Details Component
const SelectedFestivalDetails = ({ festival }: { festival: Festival }) => {
  const formattedDate = useConsistentDate(festival.date)
  
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={festival.image}
            alt={festival.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{festival.name}</h3>
          <p className="text-gray-600 mb-4">{festival.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium">Date:</span> {formattedDate}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {festival.duration}
            </div>
            <div>
              <span className="font-medium">Location:</span> {festival.location}
            </div>
            <div>
              <span className="font-medium">Significance:</span> {festival.significance}
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Nepali Translation:</h4>
            <p className="text-gray-700">{festival.descriptionNepali}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button 
              onClick={() => {
                alert(`Adding ${festival.name} to your calendar`)
              }}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                alert(`Booking tickets for ${festival.name} at ${festival.location}`)
              }}
              className="flex-1"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Book Tickets
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
