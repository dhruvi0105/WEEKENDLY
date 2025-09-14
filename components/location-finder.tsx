"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin, Plus, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface LocationResult {
  id: string
  name: string
  address: string
  category: string
  rating?: number
  priceLevel?: number
  lat: number
  lng: number
}

export function LocationFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LocationResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search results - in a real app, this would call Google Places API
  const mockSearchResults: LocationResult[] = [
    {
      id: "1",
      name: "Central Park",
      address: "New York, NY 10024",
      category: "Park",
      rating: 4.7,
      lat: 40.7829,
      lng: -73.9654,
    },
    {
      id: "2",
      name: "The High Line",
      address: "New York, NY 10011",
      category: "Tourist Attraction",
      rating: 4.6,
      lat: 40.748,
      lng: -74.0048,
    },
    {
      id: "3",
      name: "Brooklyn Bridge",
      address: "New York, NY 10038",
      category: "Bridge",
      rating: 4.5,
      lat: 40.7061,
      lng: -73.9969,
    },
    {
      id: "4",
      name: "Times Square",
      address: "Manhattan, NY 10036",
      category: "Tourist Attraction",
      rating: 4.3,
      lat: 40.758,
      lng: -73.9855,
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter mock results based on search query
    const filtered = mockSearchResults.filter(
      (result) =>
        result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(filtered)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getGoogleMapsUrl = (location: LocationResult) => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Discover New Places
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for restaurants, parks, museums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Search Results:</h4>
            {searchResults.map((location) => (
              <div key={location.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm">{location.name}</h5>
                  <p className="text-xs text-muted-foreground">{location.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {location.category}
                    </Badge>
                    {location.rating && <div className="text-xs text-muted-foreground">⭐ {location.rating}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={getGoogleMapsUrl(location)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Activity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No results found for "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for different keywords</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>💡 Tip: Search for specific venues, attractions, or activity types in your area</p>
        </div>
      </CardContent>
    </Card>
  )
}
