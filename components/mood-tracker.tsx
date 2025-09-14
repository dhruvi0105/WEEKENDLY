"use client"

import { useState } from "react"
import { Heart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeekendStore } from "@/lib/store"

interface MoodEntry {
  date: Date
  mood: string
  activities: string[]
  rating: number
}

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [weekendRating, setWeekendRating] = useState<number>(0)
  const { scheduledActivities } = useWeekendStore()

  const moods = [
    { id: "amazing", name: "Amazing", emoji: "🤩", color: "bg-green-100 text-green-800" },
    { id: "great", name: "Great", emoji: "😊", color: "bg-blue-100 text-blue-800" },
    { id: "good", name: "Good", emoji: "🙂", color: "bg-yellow-100 text-yellow-800" },
    { id: "okay", name: "Okay", emoji: "😐", color: "bg-gray-100 text-gray-800" },
    { id: "meh", name: "Meh", emoji: "😕", color: "bg-orange-100 text-orange-800" },
  ]

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
  }

  const handleRatingSelect = (rating: number) => {
    setWeekendRating(rating)
  }

  const saveMoodEntry = () => {
    if (!selectedMood || weekendRating === 0) return

    const entry: MoodEntry = {
      date: new Date(),
      mood: selectedMood,
      activities: scheduledActivities.map((a) => a.name),
      rating: weekendRating,
    }

    // In a real app, this would save to localStorage or a database
    console.log("Saving mood entry:", entry)

    // Reset form
    setSelectedMood(null)
    setWeekendRating(0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            How was your weekend?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Overall Mood</h4>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <h4 className="font-medium">Weekend Rating</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  className={`text-2xl ${weekendRating >= rating ? "text-yellow-500" : "text-gray-300"}`}
                  onClick={() => handleRatingSelect(rating)}
                >
                  ⭐
                </Button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {weekendRating > 0 ? `${weekendRating}/5 stars` : "Rate your weekend"}
              </span>
            </div>
          </div>

          {/* Activities Summary */}
          {scheduledActivities.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Activities Completed</h4>
              <div className="flex flex-wrap gap-2">
                {scheduledActivities.map((activity) => (
                  <Badge key={activity.id} variant="secondary">
                    {activity.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={saveMoodEntry} disabled={!selectedMood || weekendRating === 0} className="w-full">
            Save Weekend Reflection
          </Button>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Weekend Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">4.2</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Weekends Tracked</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl">😊</div>
              <div className="text-sm text-muted-foreground">Most Common Mood</div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium text-sm">Top Activities</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Hiking Trail Adventure</span>
                <Badge variant="outline">4.8 ⭐</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Brunch at Local Cafe</span>
                <Badge variant="outline">4.5 ⭐</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Art Museum Visit</span>
                <Badge variant="outline">4.3 ⭐</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
