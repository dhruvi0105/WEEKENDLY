"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, MapPin, Sparkles, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, getDay } from "date-fns"
import { ACTIVITIES } from "@/lib/activities-data"

interface LongWeekend {
  id: string
  name: string
  startDate: Date
  endDate: Date
  days: number
  type: "holiday" | "bridge" | "extended"
}

export function LongWeekendPlanner() {
  const [selectedLongWeekend, setSelectedLongWeekend] = useState<string | null>(null)

  // Generate upcoming long weekends
  const upcomingLongWeekends = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const longWeekends: LongWeekend[] = []

    // US Federal Holidays that create long weekends
    const holidays = [
      { name: "Martin Luther King Jr. Day", date: new Date(currentYear, 0, 15), type: "holiday" as const },
      { name: "Presidents Day", date: new Date(currentYear, 1, 19), type: "holiday" as const },
      { name: "Memorial Day", date: new Date(currentYear, 4, 27), type: "holiday" as const },
      { name: "Independence Day", date: new Date(currentYear, 6, 4), type: "holiday" as const },
      { name: "Labor Day", date: new Date(currentYear, 8, 2), type: "holiday" as const },
      { name: "Columbus Day", date: new Date(currentYear, 9, 14), type: "holiday" as const },
      { name: "Veterans Day", date: new Date(currentYear, 10, 11), type: "holiday" as const },
      { name: "Thanksgiving", date: new Date(currentYear, 10, 28), type: "holiday" as const },
    ]

    holidays.forEach((holiday) => {
      const dayOfWeek = getDay(holiday.date)
      let startDate = holiday.date
      let endDate = holiday.date
      let days = 1

      // If holiday is on Friday, weekend extends to Monday
      if (dayOfWeek === 5) {
        endDate = addDays(holiday.date, 3)
        days = 4
      }
      // If holiday is on Monday, weekend starts from Saturday
      else if (dayOfWeek === 1) {
        startDate = addDays(holiday.date, -2)
        endDate = holiday.date
        days = 3
      }
      // If holiday is on Thursday, suggest bridge day for 4-day weekend
      else if (dayOfWeek === 4) {
        endDate = addDays(holiday.date, 3)
        days = 4
        holiday.type = "bridge"
      }

      if (days > 2) {
        longWeekends.push({
          id: holiday.name.toLowerCase().replace(/\s+/g, "-"),
          name: holiday.name,
          startDate,
          endDate,
          days,
          type: holiday.type,
        })
      }
    })

    return longWeekends.filter((lw) => lw.startDate >= new Date())
  }, [])

  const getSuggestedActivities = (longWeekend: LongWeekend) => {
    // Suggest different types of activities based on the length of the long weekend
    if (longWeekend.days >= 4) {
      // For 4+ day weekends, suggest a mix including travel-worthy activities
      return ACTIVITIES.filter(
        (activity) => activity.category === "outdoor" || activity.category === "culture" || activity.duration >= 3,
      ).slice(0, 6)
    } else {
      // For 3-day weekends, suggest local activities
      return ACTIVITIES.filter((activity) => activity.mood === "relaxed" || activity.mood === "social").slice(0, 4)
    }
  }

  const getWeekendTypeColor = (type: string) => {
    switch (type) {
      case "holiday":
        return "bg-green-100 text-green-800"
      case "bridge":
        return "bg-blue-100 text-blue-800"
      case "extended":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Long Weekend Planner
        </h2>
        <p className="text-muted-foreground">Discover upcoming long weekends and plan amazing extended getaways</p>
      </div>

      {upcomingLongWeekends.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Long Weekends Found</h3>
            <p className="text-muted-foreground">
              Check back later or create your own extended weekend by taking time off!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingLongWeekends.map((longWeekend) => (
            <Card
              key={longWeekend.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedLongWeekend === longWeekend.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedLongWeekend(selectedLongWeekend === longWeekend.id ? null : longWeekend.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{longWeekend.name}</CardTitle>
                  <Badge className={getWeekendTypeColor(longWeekend.type)}>{longWeekend.days} days</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(longWeekend.startDate, "MMM d")} - {format(longWeekend.endDate, "MMM d, yyyy")}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{longWeekend.days} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{longWeekend.days * 8}+ hours</span>
                  </div>
                </div>

                {longWeekend.type === "bridge" && (
                  <div className="p-2 bg-blue-50 rounded-lg text-sm text-blue-800">
                    💡 Take Friday off for a 4-day weekend!
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Suggested Activities:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getSuggestedActivities(longWeekend)
                      .slice(0, 4)
                      .map((activity) => (
                        <div key={activity.id} className="text-xs p-2 bg-muted rounded flex items-center gap-2">
                          <img
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="truncate">{activity.name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Plan This Weekend
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedLongWeekend && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Your {upcomingLongWeekends.find((lw) => lw.id === selectedLongWeekend)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activities" className="space-y-4">
              <TabsList>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="itinerary">Day-by-Day</TabsTrigger>
                <TabsTrigger value="travel">Travel Ideas</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getSuggestedActivities(upcomingLongWeekends.find((lw) => lw.id === selectedLongWeekend)!).map(
                    (activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{activity.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{activity.duration}h</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Create your day-by-day itinerary by adding activities above</p>
                </div>
              </TabsContent>

              <TabsContent value="travel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Weekend Getaways</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-2 border rounded">
                        <MapPin className="h-8 w-8 text-primary" />
                        <div>
                          <h5 className="font-medium text-sm">Mountain Retreat</h5>
                          <p className="text-xs text-muted-foreground">2-3 hours drive</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 border rounded">
                        <MapPin className="h-8 w-8 text-primary" />
                        <div>
                          <h5 className="font-medium text-sm">Beach Resort</h5>
                          <p className="text-xs text-muted-foreground">3-4 hours drive</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">City Breaks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-2 border rounded">
                        <MapPin className="h-8 w-8 text-primary" />
                        <div>
                          <h5 className="font-medium text-sm">Historic Downtown</h5>
                          <p className="text-xs text-muted-foreground">1-2 hours drive</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 border rounded">
                        <MapPin className="h-8 w-8 text-primary" />
                        <div>
                          <h5 className="font-medium text-sm">Arts District</h5>
                          <p className="text-xs text-muted-foreground">45 min drive</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
