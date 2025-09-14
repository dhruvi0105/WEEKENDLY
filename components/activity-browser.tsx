"use client"

import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActivityCard } from "@/components/activity-card"
import { ACTIVITIES } from "@/lib/activities-data"
import type { Activity } from "@/lib/types"
import { useWeekendStore } from "@/lib/store"

interface ActivityBrowserProps {
  onViewChange: (view: "browse" | "schedule") => void
}

export function ActivityBrowser({ onViewChange }: ActivityBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [moodFilter, setMoodFilter] = useState<string>("all")
  const [costFilter, setCostFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")

  const { addActivity, scheduledActivities } = useWeekendStore()

  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter((activity) => {
      const matchesSearch =
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter
      const matchesMood = moodFilter === "all" || activity.mood === moodFilter
      const matchesCost = costFilter === "all" || activity.cost === costFilter
      const matchesTime = timeFilter === "all" || activity.timeOfDay === timeFilter || activity.timeOfDay === "any"

      return matchesSearch && matchesCategory && matchesMood && matchesCost && matchesTime
    })
  }, [searchQuery, categoryFilter, moodFilter, costFilter, timeFilter])

  const handleAddActivity = (activity: Activity) => {
    addActivity(activity)
    // Show a brief success message or animation
  }

  const isActivityScheduled = (activityId: string) => {
    return scheduledActivities.some((scheduled) => scheduled.id === activityId)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Discover Amazing Activities</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our curated collection of weekend activities. Filter by your preferences and add them to your
          perfect weekend plan.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Find Your Perfect Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>

            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Mood</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="adventurous">Adventurous</SelectItem>
              </SelectContent>
            </Select>

            <Select value={costFilter} onValueChange={setCostFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="low">Low Cost</SelectItem>
                <SelectItem value="medium">Medium Cost</SelectItem>
                <SelectItem value="high">High Cost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time of Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Found {filteredActivities.length} activities</p>
        {scheduledActivities.length > 0 && (
          <Button onClick={() => onViewChange("schedule")} variant="outline">
            View My Weekend ({scheduledActivities.length} activities)
          </Button>
        )}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onAdd={handleAddActivity}
            isScheduled={isActivityScheduled(activity.id)}
          />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No activities match your current filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("all")
              setMoodFilter("all")
              setCostFilter("all")
              setTimeFilter("all")
            }}
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
