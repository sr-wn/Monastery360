"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Ticket,
  Bell,
  List,
} from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { apiService, Festival } from "@/lib/api"

// Event interface to match the API data structure
interface Event {
  id: string
  title: string
  type: string
  monastery: string
  date: string
  endDate: string
  time: string
  description: string
  image: string
  category: string
  duration: string
  attendees: number
  ticketRequired: boolean
  featured: boolean
  highlights: string[]
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Fallback data for immediate display - using current and future dates
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()

// Helper function to get future dates - using current month approach
const getFutureDate = (daysFromNow: number) => {
  // Use current date to generate events for the current month
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysFromNow)
  
  const year = futureDate.getFullYear()
  const month = String(futureDate.getMonth() + 1).padStart(2, '0')
  const day = String(futureDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // Returns YYYY-MM-DD format
}

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

// Event Card Component with consistent date formatting
const EventCard = ({ event, onSelect }: {
  event: Event
  onSelect: (event: Event) => void
}) => {
  const formattedDate = useConsistentDate(event.date)
  
  return (
    <div
      className="p-3 rounded-lg border border-border hover:border-primary/20 cursor-pointer transition-colors"
      onClick={() => onSelect(event)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm line-clamp-2">{event.title}</h3>
          {event.featured && (
            <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
              Featured
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {event.monastery}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" />
          {formattedDate}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {event.type}
          </Badge>
          {event.ticketRequired && (
            <Badge variant="outline" className="text-xs">
              <Ticket className="w-3 h-3 mr-1" />
              Ticket Required
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

// List View Event Card Component
const ListEventCard = ({ event, onSelect }: {
  event: Event
  onSelect: (event: Event) => void
}) => {
  const formattedDate = useConsistentDate(event.date)
  
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(event)}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={120}
            height={90}
            className="rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {event.monastery}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {event.featured && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {event.type}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{event.attendees} attendees</span>
              </div>
              {event.ticketRequired && (
                <div className="flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  <span>Ticket Required</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Event Detail Component
const EventDetail = ({ event, onBack, onBookTickets, onAddToCalendar, onSetReminder }: {
  event: Event
  onBack: () => void
  onBookTickets: (event: Event) => void
  onAddToCalendar: (event: Event) => void
  onSetReminder: (event: Event) => void
}) => {
  const formattedDate = useConsistentDate(event.date)
  const formattedEndDate = useConsistentDate(event.endDate)
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>
        <div className="h-4 w-px bg-border"></div>
        <Badge variant="outline" className="capitalize">
          {event.type}
        </Badge>
        {event.featured && (
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            Featured Event
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-6">
              <h1 className="font-heading font-bold text-3xl mb-4">{event.title}</h1>
              <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Event Highlights</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {event.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.monastery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {formattedDate}
                    {event.date !== event.endDate &&
                      ` - ${formattedEndDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.attendees} expected attendees</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                {event.ticketRequired ? (
                  <Button 
                    className="w-full"
                    onClick={() => onBookTickets(event)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Book Tickets
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => onAddToCalendar(event)}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={() => onSetReminder(event)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium">{event.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry</span>
                  <span className="font-medium">{event.ticketRequired ? "Ticket Required" : "Free"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Generate events for multiple years (2024, 2025, 2026)
const generateEventsForYear = (year: number): Event[] => {
  const events: Event[] = []
  
  // January
  events.push({
    id: `losar-${year}`,
    title: "Losar Festival",
    type: "festival",
    monastery: "Rumtek Monastery",
    date: `${year}-01-15`,
    endDate: `${year}-01-17`,
    time: "6:00 AM - 8:00 PM",
    description: "Tibetan New Year celebration with traditional dances, prayers, and community feast",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Religious Festival",
    duration: "3 days",
    attendees: 500,
    ticketRequired: false,
    featured: true,
    highlights: ["Cham Dance", "Traditional Music", "Community Feast", "Prayer Ceremonies"],
  })

  // February
  events.push({
    id: `monlam-${year}`,
    title: "Monlam Prayer Festival",
    type: "festival",
    monastery: "Pemayangtse Monastery",
    date: `${year}-02-10`,
    endDate: `${year}-02-12`,
    time: "5:00 AM - 6:00 PM",
    description: "Great Prayer Festival with extensive prayers for world peace and prosperity",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Religious Festival",
    duration: "3 days",
    attendees: 400,
    ticketRequired: false,
    featured: true,
    highlights: ["Prayer Ceremonies", "Butter Sculptures", "Community Prayers", "Peace Rituals"],
  })

  // March
  events.push({
    id: `spring-retreat-${year}`,
    title: "Spring Meditation Retreat",
    type: "retreat",
    monastery: "Rumtek Monastery",
    date: `${year}-03-20`,
    endDate: `${year}-03-27`,
    time: "6:00 AM - 6:00 PM",
    description: "7-day silent meditation retreat focusing on mindfulness and inner peace",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Spiritual Retreat",
    duration: "7 days",
    attendees: 25,
    ticketRequired: true,
    featured: false,
    highlights: ["Silent Meditation", "Dharma Talks", "Walking Meditation", "Personal Guidance"],
  })

  // April
  events.push({
    id: `saga-dawa-${year}`,
    title: "Saga Dawa Festival",
    type: "festival",
    monastery: "Pemayangtse Monastery",
    date: `${year}-04-15`,
    endDate: `${year}-04-15`,
    time: "5:00 AM - 6:00 PM",
    description: "Sacred festival commemorating Buddha's birth, enlightenment, and parinirvana",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Religious Festival",
    duration: "1 day",
    attendees: 300,
    ticketRequired: false,
    featured: true,
    highlights: ["Prayer Wheels", "Butter Lamp Lighting", "Merit Making", "Meditation"],
  })

  // May
  events.push({
    id: `buddha-purnima-${year}`,
    title: "Buddha Purnima",
    type: "festival",
    monastery: "All Monasteries",
    date: `${year}-05-05`,
    endDate: `${year}-05-05`,
    time: "6:00 AM - 8:00 PM",
    description: "Celebration of Buddha's birth, enlightenment, and parinirvana",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Religious Festival",
    duration: "1 day",
    attendees: 600,
    ticketRequired: false,
    featured: true,
    highlights: ["Buddha Puja", "Procession", "Community Feast", "Prayer Ceremonies"],
  })

  // June
  events.push({
    id: `summer-teaching-${year}`,
    title: "Summer Dharma Teaching",
    type: "teaching",
    monastery: "Rumtek Monastery",
    date: `${year}-06-10`,
    endDate: `${year}-06-15`,
    time: "10:00 AM - 4:00 PM",
    description: "5-day intensive dharma teaching session with senior monks",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Educational",
    duration: "5 days",
    attendees: 100,
    ticketRequired: false,
    featured: false,
    highlights: ["Dharma Talks", "Q&A Sessions", "Meditation Practice", "Philosophy Discussion"],
  })

  // July
  events.push({
    id: `rainy-season-retreat-${year}`,
    title: "Rainy Season Retreat",
    type: "retreat",
    monastery: "Pemayangtse Monastery",
    date: `${year}-07-15`,
    endDate: `${year}-07-22`,
    time: "6:00 AM - 6:00 PM",
    description: "Traditional rainy season retreat following ancient Buddhist practices",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Spiritual Retreat",
    duration: "7 days",
    attendees: 30,
    ticketRequired: true,
    featured: false,
    highlights: ["Silent Retreat", "Rainy Season Practices", "Monastic Life", "Spiritual Guidance"],
  })

  // August
  events.push({
    id: `independence-day-${year}`,
    title: "Independence Day Blessing",
    type: "ceremony",
    monastery: "All Monasteries",
    date: `${year}-08-15`,
    endDate: `${year}-08-15`,
    time: "8:00 AM - 10:00 AM",
    description: "Special blessing ceremony for India's Independence Day",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Religious Ceremony",
    duration: "2 hours",
    attendees: 200,
    ticketRequired: false,
    featured: true,
    highlights: ["National Prayer", "Flag Hoisting", "Patriotic Songs", "Community Gathering"],
  })

  // September
  events.push({
    id: `autumn-festival-${year}`,
    title: "Autumn Harvest Festival",
    type: "festival",
    monastery: "Pemayangtse Monastery",
    date: `${year}-09-20`,
    endDate: `${year}-09-22`,
    time: "6:00 AM - 8:00 PM",
    description: "Celebration of autumn harvest with traditional dances and community feast",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Cultural Festival",
    duration: "3 days",
    attendees: 350,
    ticketRequired: false,
    featured: true,
    highlights: ["Harvest Dances", "Traditional Music", "Community Feast", "Cultural Performances"],
  })

  // October
  events.push({
    id: `dussehra-${year}`,
    title: "Dussehra Celebration",
    type: "festival",
    monastery: "Rumtek Monastery",
    date: `${year}-10-12`,
    endDate: `${year}-10-12`,
    time: "6:00 PM - 10:00 PM",
    description: "Victory of good over evil celebration with cultural performances",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Cultural Festival",
    duration: "1 day",
    attendees: 400,
    ticketRequired: false,
    featured: true,
    highlights: ["Cultural Dance", "Drama Performance", "Community Celebration", "Traditional Music"],
  })

  // November
  events.push({
    id: `butter-lamp-${year}`,
    title: "Butter Lamp Festival",
    type: "festival",
    monastery: "Pemayangtse Monastery",
    date: `${year}-11-15`,
    endDate: `${year}-11-15`,
    time: "6:00 PM - 10:00 PM",
    description: "Beautiful evening festival with thousands of butter lamps creating a magical atmosphere",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Religious Festival",
    duration: "4 hours",
    attendees: 400,
    ticketRequired: false,
    featured: true,
    highlights: ["Butter Lamp Lighting", "Evening Prayers", "Photography", "Community Gathering"],
  })

  // December
  events.push({
    id: `winter-solstice-${year}`,
    title: "Winter Solstice Ceremony",
    type: "ceremony",
    monastery: "Rumtek Monastery",
    date: `${year}-12-21`,
    endDate: `${year}-12-21`,
    time: "5:00 AM - 7:00 AM",
    description: "Special ceremony marking the winter solstice with prayers for the return of light",
    image: "/rumtek-monastery-golden-roof-traditional-architect.jpg",
    category: "Religious Ceremony",
    duration: "2 hours",
    attendees: 150,
    ticketRequired: false,
    featured: false,
    highlights: ["Solstice Prayers", "Light Ceremony", "Meditation", "Community Gathering"],
  })

  // New Year Eve
  events.push({
    id: `new-year-eve-${year}`,
    title: "New Year Eve Blessing",
    type: "ceremony",
    monastery: "All Monasteries",
    date: `${year}-12-31`,
    endDate: `${year}-12-31`,
    time: "11:00 PM - 12:30 AM",
    description: "Special blessing ceremony for the new year with prayers for peace and prosperity",
    image: "/pemayangtse-monastery-white-walls-mountain-view.jpg",
    category: "Religious Ceremony",
    duration: "1.5 hours",
    attendees: 300,
    ticketRequired: false,
    featured: true,
    highlights: ["New Year Blessings", "Prayer Ceremony", "Community Gathering", "Peace Prayers"],
  })

  return events
}

// Generate events for all three years
const allEvents: Event[] = [
  ...generateEventsForYear(2024),
  ...generateEventsForYear(2025),
  ...generateEventsForYear(2026),
]

const fallbackEvents: Event[] = allEvents

export default function CulturalCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [filterType, setFilterType] = useState("all")
  const [filterMonastery, setFilterMonastery] = useState("all")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState<Event[]>(fallbackEvents) // Start with fallback data
  const [loading, setLoading] = useState(false) // Start as false since we have fallback data
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false) // For background refresh indicator
  const [useFallbackData, setUseFallbackData] = useState(true) // Track if we should use fallback data

  const currentMonth = currentDate.getMonth()
  const currentYear = selectedYear

  // Temporarily disable API fetch to ensure fallback events always show
  useEffect(() => {
    // Keep fallback events and don't fetch from API
    setEvents(fallbackEvents)
    setUseFallbackData(true)
    setIsRefreshing(false)
  }, [])

  // Ensure we always have events - fallback to fallbackEvents if events array is empty
  const displayEvents = events.length > 0 ? events : fallbackEvents

  const filteredEvents = displayEvents.filter((event) => {
    const eventYear = new Date(event.date).getFullYear()
    const matchesYear = eventYear === selectedYear
    const matchesType = filterType === "all" || event.type === filterType
    const matchesMonastery = filterMonastery === "all" || event.monastery === filterMonastery
    return matchesYear && matchesType && matchesMonastery
  })

  // Debug logging to track events
  console.log('Events state:', events.length, 'Display events:', displayEvents.length, 'Filtered events:', filteredEvents.length)

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const events = filteredEvents.filter((event) => {
      const eventStart = new Date(event.date)
      const eventEnd = new Date(event.endDate)
      
      // Reset time to start of day for accurate comparison
      const compareDate = new Date(date)
      compareDate.setHours(0, 0, 0, 0)
      
      eventStart.setHours(0, 0, 0, 0)
      eventEnd.setHours(0, 0, 0, 0)
      
      const matches = compareDate >= eventStart && compareDate <= eventEnd
      return matches
    })
    
    return events
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Button handlers
  const handleBookTickets = (event: Event) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams({
        eventId: event.id,
        title: event.title,
        monastery: event.monastery,
        date: event.date,
      })
      window.location.href = `/booking?${params.toString()}`
    }
  }

  const handleAddToCalendar = (event: Event) => {
    alert(`Adding ${event.title} to your calendar`)
  }

  const handleSetReminder = (event: Event) => {
    alert(`Setting reminder for ${event.title}`)
  }

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event)
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border/50"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const hasEvents = dayEvents.length > 0

      days.push(
        <div
          key={day}
          className={`h-24 border border-border/50 p-2 hover:bg-muted/50 transition-colors ${
            isToday 
              ? "bg-primary/5 border-primary/20" 
              : hasEvents 
                ? "bg-accent/5 border-accent/20" 
                : ""
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday 
              ? "text-primary" 
              : hasEvents 
                ? "text-accent font-semibold" 
                : ""
          }`}>
            {day}
            {hasEvents && <span className="ml-1 text-xs">●</span>}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded cursor-pointer truncate ${
                  event.featured
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  // No loading or error states needed since we start with fallback data

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedEvent ? (
          <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-heading font-bold text-2xl">Cultural Calendar</h2>
                  {isRefreshing && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  )}
                </div>
                <p className="text-muted-foreground">
                  Discover festivals, ceremonies, and spiritual events across Sikkim's monasteries
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="festival">Festivals</SelectItem>
                    <SelectItem value="ceremony">Ceremonies</SelectItem>
                    <SelectItem value="retreat">Retreats</SelectItem>
                    <SelectItem value="teaching">Teachings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterMonastery} onValueChange={setFilterMonastery}>
                  <SelectTrigger className="w-48">
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
                <div className="flex border border-border rounded-md">
                  <Button
                    size="sm"
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    className="rounded-r-none"
                    onClick={() => setViewMode("calendar")}
                  >
                    <CalendarIcon className="w-4 h-4" />
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

            {viewMode === "calendar" ? (
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <CardTitle className="text-xl">
                        {months[currentMonth]} {currentYear}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigateMonth("prev")}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateMonth("next")}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-0 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div
                            key={day}
                            className="h-10 flex items-center justify-center font-medium text-sm border border-border/50 bg-muted/30"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-0">{renderCalendarGrid()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredEvents
                        .filter((event) => new Date(event.date) >= new Date())
                        .slice(0, 5)
                        .map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onSelect={setSelectedEvent}
                          />
                        ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Event Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span>Featured Events</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-muted rounded-full"></div>
                        <span>Regular Events</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <ListEventCard
                    key={event.id}
                    event={event}
                    onSelect={setSelectedEvent}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Event Detail View */
          <EventDetail
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onBookTickets={handleBookTickets}
            onAddToCalendar={handleAddToCalendar}
            onSetReminder={handleSetReminder}
          />
        )}
      </div>
    </div>
    </AuthGuard>
  )
}
