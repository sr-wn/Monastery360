// AI Search API Integration
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8007'

export interface AISearchResult {
  id: string
  title: string
  description: string
  type?: string
  monastery?: string
  location?: string
  date?: string
  tags: string[]
  redirect_url: string
  category: 'archive' | 'monastery' | 'festival'
  relevance_score: number
}

export interface AISearchResponse {
  query: string
  results: AISearchResult[]
  total_results: number
  search_type: string
  suggestions: string[]
}

export interface AISuggestionsResponse {
  query: string
  suggestions: string[]
}

class AISearchAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = AI_API_BASE_URL
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(3000)
      })
      return response.ok
    } catch (error) {
      // Only log error in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('AI Search service not available. To start the backend, run: cd ai-search-backend && python main.py')
      }
      return false
    }
  }

  async search(query: string, limit: number = 10): Promise<AISearchResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        }
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: AISearchResponse = await response.json()
      return data
    } catch (error) {
      // Return empty results instead of throwing error
      if (process.env.NODE_ENV === 'development') {
        console.warn('AI Search service not available. To start the backend, run: cd ai-search-backend && python main.py')
      }
      
      return {
        query,
        results: [],
        total_results: 0,
        search_type: 'fallback',
        suggestions: []
      }
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/suggestions?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(3000)
        }
      )

      if (!response.ok) {
        throw new Error(`Suggestions failed: ${response.status}`)
      }

      const data: AISuggestionsResponse = await response.json()
      return data.suggestions
    } catch (error) {
      // Return empty suggestions instead of logging error
      if (process.env.NODE_ENV === 'development') {
        console.warn('AI Search service not available for suggestions')
      }
      return []
    }
  }

  // Helper method to handle redirects
  handleRedirect(result: AISearchResult): void {
    if (typeof window !== 'undefined') {
      window.location.href = result.redirect_url
    }
  }

  // Helper method to get category icon
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'archive':
        return '📚'
      case 'monastery':
        return '🏛️'
      case 'festival':
        return '🎉'
      default:
        return '🔍'
    }
  }

  // Helper method to get category color
  getCategoryColor(category: string): string {
    switch (category) {
      case 'archive':
        return 'bg-blue-100 text-blue-800'
      case 'monastery':
        return 'bg-green-100 text-green-800'
      case 'festival':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
}

export const aiSearchAPI = new AISearchAPI()

