'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, MapPin, Calendar, Archive, Sparkles } from 'lucide-react'
import { aiSearchAPI, AISearchResult } from '@/lib/ai-search-api'

interface AISearchBarProps {
  onResultClick?: (result: AISearchResult) => void
  placeholder?: string
  className?: string
}

export default function AISearchBar({ 
  onResultClick, 
  placeholder = "Search archives, monasteries, festivals...",
  className = ""
}: AISearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AISearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAIAvailable, setIsAIAvailable] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check AI service availability on mount
  useEffect(() => {
    const checkAIService = async () => {
      const isAvailable = await aiSearchAPI.healthCheck()
      setIsAIAvailable(isAvailable)
    }
    checkAIService()
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSuggestions([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const searchResponse = await aiSearchAPI.search(query, 8)
        setResults(searchResponse.results)
        setSuggestions(searchResponse.suggestions)
        setShowResults(true)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length + suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        } else if (selectedIndex >= results.length) {
          const suggestionIndex = selectedIndex - results.length
          if (suggestions[suggestionIndex]) {
            setQuery(suggestions[suggestionIndex])
            inputRef.current?.focus()
          }
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = (result: AISearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    } else {
      aiSearchAPI.handleRedirect(result)
    }
    setShowResults(false)
    setQuery('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    inputRef.current?.focus()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'archive':
        return <Archive className="w-4 h-4" />
      case 'monastery':
        return <MapPin className="w-4 h-4" />
      case 'festival':
        return <Calendar className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'archive':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'monastery':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'festival':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* AI-Powered Search Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Search</h3>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
          isAIAvailable 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isAIAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isAIAvailable ? 'AI Active' : 'AI Offline'}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search archives, monasteries, festivals... (e.g., 'Ancient Thangka Paintings', 'Rumtek Monastery')"
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white shadow-lg transition-all duration-300
                     placeholder-gray-500 text-gray-900 text-lg
                     hover:shadow-xl hover:border-gray-300"
        />
        
        {/* Search Tips */}
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
          💡 Try: "thangka paintings", "rumtek monastery", "sacred manuscripts"
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-4 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto">
          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  🔍 Search Results ({results.length})
                </div>
                <div className="text-xs text-gray-500">
                  Press ↑↓ to navigate, Enter to select
                </div>
              </div>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                    ${selectedIndex === index 
                      ? 'bg-blue-50 border-blue-300 shadow-md transform scale-[1.02]' 
                      : 'hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-sm'
                    }`}
                >
                  <div className={`p-3 rounded-xl ${getCategoryColor(result.category)} shadow-sm`}>
                    {getCategoryIcon(result.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {result.title}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(result.category)}`}>
                            {result.category.toUpperCase()}
                          </span>
                          {result.type && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {result.type}
                            </span>
                          )}
                          {result.relevance_score > 30 && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                              {Math.round(result.relevance_score)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                      {result.monastery && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{result.monastery}</span>
                        </span>
                      )}
                      {result.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{result.location}</span>
                        </span>
                      )}
                      {result.date && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{result.date}</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {result.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {result.tags.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                            +{result.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Click indicator */}
                  <div className="flex items-center text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-t-2 border-gray-100 p-4">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                💡 Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedIndex === results.length + index 
                      ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.length === 0 && suggestions.length === 0 && query && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-sm text-gray-600 mb-4">We couldn't find anything matching "{query}"</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Ancient Thangka Paintings</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">Rumtek Monastery</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full">Sacred Manuscripts</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full">Losar Festival</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

