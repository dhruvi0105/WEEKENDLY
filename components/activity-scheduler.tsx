"use client"

import { useState } from "react"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeekendStore } from "@/lib/store"
import { format, setHours, setMinutes, startOfWeek, addDays } from "date-fns"

export function ActivityScheduler() {
  const { scheduledActivities, scheduleActivity } = useWeekendStore()
  const [selectedDay, setSelectedDay] = useState<"saturday" | "sunday">("saturday")
  const [selectedTime, setSelectedTime] = useState<string>("09:00")

  // Get unscheduled activities (activities that haven't been assigned a specific time/day)
  const unscheduledActivities = scheduledActivities.filter((activity) => {
    // Consider an activity unscheduled if it has default values
    const isDefaultTime = new Date(activity.scheduledTime).getTime() === new Date().getTime()
    return isDefaultTime || !activity.scheduledTime
  })

  const scheduledSaturday = scheduledActivities.filter(
    (activity) => activity.day === "saturday" && new Date(activity.scheduledTime).getTime() !== new Date().getTime(),
  )

  const scheduledSunday = scheduledActivities.filter(
    (activity) => activity.day === "sunday" && new Date(activity.scheduledTime).getTime() !== new Date().getTime(),
  )

  const handleScheduleActivity = (activityId: string) => {
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const baseDate =
      selectedDay === "saturday" ? addDays(startOfWeek(new Date()), 6) : addDays(startOfWeek(new Date()), 0)
    const scheduledTime = setMinutes(setHours(baseDate, hours), minutes)

    scheduleActivity(activityId, selectedDay, scheduledTime)
  }

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]

  return (
    <div className="space-y-6">
      {/* Scheduling Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Your Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Day</label>
              <Select value={selectedDay} onValueChange={(value: "saturday" | "sunday") => setSelectedDay(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unscheduled Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Unscheduled ({unscheduledActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unscheduledActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">All activities are scheduled!</p>
            ) : (
              unscheduledActivities.map((activity) => (
                <div key={activity.id} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{activity.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration}h</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleScheduleActivity(activity.id)} className="w-full text-xs">
                    Schedule for {selectedDay} at {selectedTime}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Saturday Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Saturday ({scheduledSaturday.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledSaturday.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No activities scheduled</p>
            ) : (
              scheduledSaturday
                .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                .map((activity) => (
                  <div key={activity.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{activity.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(activity.scheduledTime), "HH:mm")}</span>
                          <span>({activity.duration}h)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Sunday Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sunday ({scheduledSunday.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledSunday.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No activities scheduled</p>
            ) : (
              scheduledSunday
                .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                .map((activity) => (
                  <div key={activity.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{activity.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(activity.scheduledTime), "HH:mm")}</span>
                          <span>({activity.duration}h)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
