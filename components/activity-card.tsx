"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Plus, Check, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ActivityCardProps {
  activity: Activity
  onAdd: (activity: Activity) => void
  isScheduled: boolean
}

export function ActivityCard({ activity, onAdd, isScheduled }: ActivityCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (isScheduled) return

    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Brief animation delay
    onAdd(activity)
    setIsAdding(false)
  }

  const getCostIcon = (cost: string) => {
    switch (cost) {
      case "free":
        return "Free"
      case "low":
        return "$"
      case "medium":
        return "$$"
      case "high":
        return "$$$"
      default:
        return cost
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "energetic":
        return "bg-orange-100 text-orange-800"
      case "relaxed":
        return "bg-blue-100 text-blue-800"
      case "social":
        return "bg-green-100 text-green-800"
      case "adventurous":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-yellow-100 text-yellow-800"
      case "outdoor":
        return "bg-green-100 text-green-800"
      case "entertainment":
        return "bg-purple-100 text-purple-800"
      case "wellness":
        return "bg-pink-100 text-pink-800"
      case "social":
        return "bg-blue-100 text-blue-800"
      case "culture":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer",
        isScheduled && "ring-2 ring-primary/20 bg-primary/5",
      )}
    >
      <div className="relative">
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button
          variant="ghost"
          size="sm"
          className={cn("absolute top-2 right-2 bg-white/80 hover:bg-white", isLiked && "text-red-500")}
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{activity.name}</CardTitle>
          <Badge className={getMoodColor(activity.mood)}>{activity.mood}</Badge>
        </div>
        <CardDescription className="text-sm">{activity.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Activity Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{activity.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{getCostIcon(activity.cost)}</span>
          </div>
          {activity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{activity.location.name}</span>
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getCategoryColor(activity.category)}>
            {activity.category}
          </Badge>
          <Badge variant="outline">{activity.timeOfDay === "any" ? "Flexible timing" : activity.timeOfDay}</Badge>
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAdd}
          disabled={isScheduled || isAdding}
          className={cn("w-full transition-all duration-300", isScheduled && "bg-green-500 hover:bg-green-500")}
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : isScheduled ? (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Added to Weekend
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to Weekend
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
