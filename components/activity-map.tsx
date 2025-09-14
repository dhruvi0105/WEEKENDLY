"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MapProps {
  activities: any[]
  selectedActivity?: string | null
  onActivitySelect?: (activityId: string) => void
}

export function ActivityMap({ activities, selectedActivity, onActivitySelect }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied:", error)
          // Default to NYC if location is denied
          setUserLocation({ lat: 40.7128, lng: -74.006 })
        },
      )
    } else {
      // Default location if geolocation is not supported
      setUserLocation({ lat: 40.7128, lng: -74.006 })
    }
  }, [])

  const activitiesWithLocation = activities.filter((activity) => activity.location)

  const getDirectionsUrl = (activity: any) => {
    if (!activity.location) return ""
    return `https://www.google.com/maps/dir/?api=1&destination=${activity.location.lat},${activity.location.lng}`
  }

  const getMapUrl = () => {
    if (activitiesWithLocation.length === 0) return ""

    const markers = activitiesWithLocation
      .map((activity, index) => {
        const color = selectedActivity === activity.id ? "red" : "blue"
        return `markers=color:${color}%7Clabel:${index + 1}%7C${activity.location.lat},${activity.location.lng}`
      })
      .join("&")

    const center = userLocation
      ? `center=${userLocation.lat},${userLocation.lng}`
      : `center=${activitiesWithLocation[0].location.lat},${activitiesWithLocation[0].location.lng}`

    return `https://maps.googleapis.com/maps/api/staticmap?${center}&zoom=12&size=600x400&${markers}&key=YOUR_API_KEY`
  }

  // Fallback map component using OpenStreetMap
  const MapFallback = () => (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100" />
      <div className="relative z-10 text-center space-y-4">
        <MapPin className="h-12 w-12 text-primary mx-auto" />
        <div>
          <h3 className="font-semibold text-foreground">Interactive Map</h3>
          <p className="text-sm text-muted-foreground">{activitiesWithLocation.length} locations to explore</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {activitiesWithLocation.slice(0, 3).map((activity, index) => (
            <Badge key={activity.id} variant="secondary" className="text-xs">
              {index + 1}. {activity.location.name}
            </Badge>
          ))}
          {activitiesWithLocation.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{activitiesWithLocation.length - 3} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Activity Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activitiesWithLocation.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities with locations in your schedule</p>
            <p className="text-sm mt-2">Add activities with specific venues to see them on the map</p>
          </div>
        ) : (
          <>
            <MapFallback />

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Scheduled Locations:</h4>
              {activitiesWithLocation.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedActivity === activity.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => onActivitySelect?.(activity.id)}
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <img
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{activity.name}</h5>
                    <p className="text-xs text-muted-foreground truncate">{activity.location.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.location.address}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={getDirectionsUrl(activity)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {userLocation && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                <MapPin className="h-3 w-3 inline mr-1" />
                Showing locations relative to your current position
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
