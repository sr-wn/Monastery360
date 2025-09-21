'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Search, MapPin, Calendar, Archive, X } from 'lucide-react'
import { apiService, SearchResults } from '@/lib/api'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null)
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const searchResults = await apiService.searchAll(searchQuery)
      setResults(searchResults)
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const clearSearch = () => {
    setQuery('')
    setResults(null)
    setShowResults(false)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'monastery':
        return <MapPin className="w-4 h-4" />
      case 'festival':
        return <Calendar className="w-4 h-4" />
      case 'archive':
        return <Archive className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getResultColor = (type: string) => {
    switch (type) {
      case 'monastery':
        return 'bg-blue-100 text-blue-800'
      case 'festival':
        return 'bg-green-100 text-green-800'
      case 'archive':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-full">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          Search Monastery360
        </h2>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Try searching for 'Losar Festival' or 'Rumtek Monastery'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="mt-3 w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>

        {/* Search Results */}
        {showResults && results && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Search Results for "{results.query}"
              </h3>
              <Badge variant="secondary">
                {results.totalResults} results found
              </Badge>
            </div>

            {/* Monasteries */}
            {results.monasteries.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Monasteries ({results.monasteries.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.monasteries.map((monastery) => (
                    <Card key={monastery.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={monastery.image}
                            alt={monastery.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm mb-1">{monastery.name}</h5>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{monastery.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              Monastery
                            </Badge>
                            <span className="text-xs text-gray-500">{monastery.location}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Festivals */}
            {results.festivals.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Festivals ({results.festivals.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.festivals.map((festival) => (
                    <Card key={festival.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={festival.image}
                            alt={festival.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm mb-1">{festival.name}</h5>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{festival.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Festival
                            </Badge>
                            <span className="text-xs text-gray-500">{festival.date}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Archives */}
            {results.archives.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-purple-600" />
                  Archives ({results.archives.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.archives.map((archive) => (
                    <Card key={archive.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={archive.image}
                            alt={archive.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm mb-1">{archive.title}</h5>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{archive.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              <Archive className="w-3 h-3 mr-1" />
                              {archive.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{archive.period}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.totalResults === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
                <p className="text-gray-500">Try searching with different keywords.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Search Suggestions */}
        {!showResults && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Search Suggestions:</h3>
            <div className="flex flex-wrap gap-2">
              {['Losar Festival', 'Rumtek Monastery', 'Buddhist Thangka', 'Saga Dawa'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion)
                    handleSearch(suggestion)
                  }}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
