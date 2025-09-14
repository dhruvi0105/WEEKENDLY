"use client"
import { Clock, MapPin, Edit3, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeekendStore } from "@/lib/store"
import { format, addHours, startOfDay } from "date-fns"

export function WeekendTimeline() {
  const { scheduledActivities, removeActivity, updateActivityTime } = useWeekendStore()

  const saturdayActivities = scheduledActivities
    .filter((activity) => activity.day === "saturday")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())

  const sundayActivities = scheduledActivities
    .filter((activity) => activity.day === "sunday")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())

  const TimelineDay = ({ day, activities }: { day: string; activities: any[] }) => {
    const dayStart = startOfDay(new Date())

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {day} ({activities.length} activities)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activities scheduled for {day.toLowerCase()}</p>
              <p className="text-sm mt-2">Use the scheduler tab to add activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const startTime = new Date(activity.scheduledTime)
                const endTime = addHours(startTime, activity.duration)

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {index < activities.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-8 bg-border" />}

                    <div className="flex gap-4">
                      {/* Time indicator */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 text-center">
                          <div>{format(startTime, "HH:mm")}</div>
                          <div>{format(endTime, "HH:mm")}</div>
                        </div>
                      </div>

                      {/* Activity card */}
                      <div className="flex-1">
                        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1">
                              <img
                                src={activity.image || "/placeholder.svg"}
                                alt={activity.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground">{activity.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="secondary">{activity.category}</Badge>
                                  <Badge className="bg-blue-100 text-blue-800">{activity.mood}</Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{activity.duration}h</span>
                                  </div>
                                  {activity.location && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate max-w-32">{activity.location.name}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(activity.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TimelineDay day="Saturday" activities={saturdayActivities} />
      <TimelineDay day="Sunday" activities={sundayActivities} />
    </div>
  )
}
