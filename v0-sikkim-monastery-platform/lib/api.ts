const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'

export interface Monastery {
  id: number
  name: string
  nameNepali: string
  description: string
  descriptionNepali: string
  latitude: number
  longitude: number
  address: string
  founded: string
  significance: string
  features: string[]
  image: string
}

export interface Festival {
  id: number
  name: string
  nameNepali: string
  date: string
  description: string
  descriptionNepali: string
  location: string
  duration: string
  significance: string
  image: string
}

export interface Archive {
  id: number
  title: string
  titleNepali: string
  description: string
  descriptionNepali: string
  category: string
  period: string
  location: string
  significance: string
  image: string
}

export interface AudioGuide {
  id: number
  monasteryId: number
  language: string
  title: string
  description: string
  duration: string
  audioUrl: string
  transcript: string
}

export interface SearchResults {
  query: string
  monasteries: Monastery[]
  festivals: Festival[]
  archives: Archive[]
  totalResults: number
}

// API Service Functions
export const apiService = {
  // Monasteries
  async getMonasteries(): Promise<Monastery[]> {
    const response = await fetch(`${API_BASE_URL}/monasteries`)
    if (!response.ok) throw new Error('Failed to fetch monasteries')
    return response.json()
  },

  async getMonastery(id: number): Promise<Monastery> {
    const response = await fetch(`${API_BASE_URL}/monasteries/${id}`)
    if (!response.ok) throw new Error('Failed to fetch monastery')
    return response.json()
  },

  async searchMonasteries(query: string): Promise<Monastery[]> {
    const response = await fetch(`${API_BASE_URL}/monasteries/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search monasteries')
    return response.json()
  },

  // Festivals
  async getFestivals(): Promise<Festival[]> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/festivals`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error('Failed to fetch festivals')
      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  },

  async getFestival(id: number): Promise<Festival> {
    const response = await fetch(`${API_BASE_URL}/festivals/${id}`)
    if (!response.ok) throw new Error('Failed to fetch festival')
    return response.json()
  },

  async searchFestivals(query: string): Promise<Festival[]> {
    const response = await fetch(`${API_BASE_URL}/festivals/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search festivals')
    return response.json()
  },

  // Archives
  async getArchives(): Promise<Archive[]> {
    const response = await fetch(`${API_BASE_URL}/archives`)
    if (!response.ok) throw new Error('Failed to fetch archives')
    return response.json()
  },

  async getArchive(id: number): Promise<Archive> {
    const response = await fetch(`${API_BASE_URL}/archives/${id}`)
    if (!response.ok) throw new Error('Failed to fetch archive')
    return response.json()
  },

  async searchArchives(query: string): Promise<Archive[]> {
    const response = await fetch(`${API_BASE_URL}/archives/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search archives')
    return response.json()
  },

  // Audio Guides
  async getAudioGuides(): Promise<AudioGuide[]> {
    const response = await fetch(`${API_BASE_URL}/audio-guides`)
    if (!response.ok) throw new Error('Failed to fetch audio guides')
    return response.json()
  },

  async getAudioGuidesByMonastery(monasteryId: number): Promise<AudioGuide[]> {
    const response = await fetch(`${API_BASE_URL}/audio-guides/monastery/${monasteryId}`)
    if (!response.ok) throw new Error('Failed to fetch audio guides for monastery')
    return response.json()
  },

  async getAudioGuidesByLanguage(language: string): Promise<AudioGuide[]> {
    const response = await fetch(`${API_BASE_URL}/audio-guides/language/${language}`)
    if (!response.ok) throw new Error('Failed to fetch audio guides by language')
    return response.json()
  },

  // Search
  async searchAll(query: string): Promise<SearchResults> {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search')
    return response.json()
  }
}
