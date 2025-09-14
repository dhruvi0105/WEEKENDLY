"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  addMonths,
  subMonths,
  isToday,
  getDay,
} from "date-fns"
import { useWeekendStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { scheduledActivities } = useWeekendStore()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get long weekends and holidays
  const longWeekends = useMemo(() => {
    const longWeekendDates = []
    const currentYear = currentMonth.getFullYear()

    // US Federal Holidays that create long weekends
    const holidays = [
      { name: "Martin Luther King Jr. Day", date: new Date(currentYear, 0, 15) }, // 3rd Monday in January
      { name: "Presidents Day", date: new Date(currentYear, 1, 19) }, // 3rd Monday in February
      { name: "Memorial Day", date: new Date(currentYear, 4, 27) }, // Last Monday in May
      { name: "Independence Day", date: new Date(currentYear, 6, 4) },
      { name: "Labor Day", date: new Date(currentYear, 8, 2) }, // 1st Monday in September
      { name: "Columbus Day", date: new Date(currentYear, 9, 14) }, // 2nd Monday in October
      { name: "Veterans Day", date: new Date(currentYear, 10, 11) },
      { name: "Thanksgiving", date: new Date(currentYear, 10, 28) }, // 4th Thursday in November
    ]

    return holidays.filter((holiday) => {
      const holidayMonth = holiday.date.getMonth()
      const currentMonthNum = currentMonth.getMonth()
      return holidayMonth === currentMonthNum
    })
  }, [currentMonth])

  const getActivitiesForDate = (date: Date) => {
    return scheduledActivities.filter((activity) => {
      const activityDate = new Date(activity.scheduledTime)
      return isSameDay(activityDate, date)
    })
  }

  const isLongWeekend = (date: Date) => {
    return longWeekends.some((holiday) => {
      const holidayDate = holiday.date
      const dayOfWeek = getDay(holidayDate)

      // Check if it's a Friday holiday (making Sat-Mon a long weekend)
      if (dayOfWeek === 5) {
        return (
          isSameDay(date, holidayDate) ||
          isSameDay(date, new Date(holidayDate.getTime() + 24 * 60 * 60 * 1000)) ||
          isSameDay(date, new Date(holidayDate.getTime() + 2 * 24 * 60 * 60 * 1000))
        )
      }

      // Check if it's a Monday holiday (making Sat-Mon a long weekend)
      if (dayOfWeek === 1) {
        return (
          isSameDay(date, holidayDate) ||
          isSameDay(date, new Date(holidayDate.getTime() - 24 * 60 * 60 * 1000)) ||
          isSameDay(date, new Date(holidayDate.getTime() - 2 * 24 * 60 * 60 * 1000))
        )
      }

      return false
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => (direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {monthDays.map((day) => {
            const activities = getActivitiesForDate(day)
            const isWeekendDay = isWeekend(day)
            const isLongWeekendDay = isLongWeekend(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors relative",
                  isWeekendDay && "bg-blue-50 border-blue-200",
                  isLongWeekendDay && "bg-orange-50 border-orange-200",
                  isSelected && "ring-2 ring-primary",
                  isTodayDate && "bg-primary/10 border-primary",
                  "hover:bg-muted/50",
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-sm font-medium", isTodayDate && "text-primary font-bold")}>
                    {format(day, "d")}
                  </span>
                  {isLongWeekendDay && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      Long
                    </Badge>
                  )}
                </div>

                {/* Activities for this day */}
                <div className="space-y-1">
                  {activities.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="text-xs p-1 bg-primary/20 text-primary rounded truncate">
                      {format(new Date(activity.scheduledTime), "HH:mm")} {activity.name}
                    </div>
                  ))}
                  {activities.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{activities.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Long Weekend Alerts */}
        {longWeekends.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Long Weekends This Month
            </h4>
            {longWeekends.map((holiday) => (
              <div key={holiday.name} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <Badge className="bg-orange-100 text-orange-800">{format(holiday.date, "MMM d")}</Badge>
                <span className="text-sm">{holiday.name}</span>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Plus className="h-3 w-3 mr-1" />
                  Plan Weekend
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
