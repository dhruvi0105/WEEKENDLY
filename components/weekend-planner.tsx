"use client"

import { useState, useRef } from "react"
import { Calendar, Clock, MapPin, Trash2, Share2, Download, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeekendTimeline } from "@/components/weekend-timeline"
import { DragDropScheduler } from "@/components/drag-drop-scheduler"
import { ActivityMap } from "@/components/activity-map"
import { LocationFinder } from "@/components/location-finder"
import { CalendarView } from "@/components/calendar-view"
import { LongWeekendPlanner } from "@/components/long-weekend-planner"
import { ThemeSelector } from "@/components/theme-selector"
import { useWeekendStore } from "@/lib/store"

// ✅ use html-to-image instead of html2canvas
import { toPng } from "html-to-image"

interface WeekendPlannerProps {
  onViewChange: (view: "browse" | "schedule") => void
}

export function WeekendPlanner({ onViewChange }: WeekendPlannerProps) {
  const [activeTab, setActiveTab] = useState("timeline")
  const [selectedMapActivity, setSelectedMapActivity] = useState<string | null>(null)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>()
  const { scheduledActivities, removeActivity, clearWeekend } = useWeekendStore()

  const saturdayActivities = scheduledActivities.filter((activity) => activity.day === "saturday")
  const sundayActivities = scheduledActivities.filter((activity) => activity.day === "sunday")

  // Only Overview gets exported
  const plannerRef = useRef<HTMLDivElement>(null)

  const getTotalDuration = () => {
    return scheduledActivities.reduce((total, activity) => total + activity.duration, 0)
  }

  const getEstimatedCost = () => {
    const costs = { free: 0, low: 25, medium: 75, high: 150 }
    return scheduledActivities.reduce((total, activity) => total + costs[activity.cost], 0)
  }

  const handleExport = async () => {
    if (activeTab !== "overview" || !plannerRef.current) {
      alert("Please switch to the Overview tab before exporting.")
      return
    }
    try {
      const dataUrl = await toPng(plannerRef.current, { cacheBust: true })
      const link = document.createElement("a")
      link.download = "weekend-plan.png"
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Export failed:", err)
    }
  }

const handleShare = async () => {
  if (activeTab !== "overview" || !plannerRef.current) {
    alert("Please switch to the Overview tab before sharing.");
    return;
  }
  try {
    const dataUrl = await toPng(plannerRef.current, { cacheBust: true });

    // For Outlook: use mailto with subject + body
    const subject = encodeURIComponent("My Weekend Plan");
    const body = encodeURIComponent(
      "Here is my weekend plan! (Image attached below)\n\n" + dataUrl
    );

    // Opens Outlook with pre-filled email
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  if (scheduledActivities.length === 0) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="space-y-4">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Your Weekend Awaits!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your perfect weekend by browsing and adding activities. Create memories that last a lifetime.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => onViewChange("browse")} size="lg" className="bg-primary hover:bg-primary/90">
            Browse Activities
          </Button>
          <Button onClick={() => setActiveTab("longweekend")} variant="outline" size="lg">
            <CalendarDays className="h-4 w-4 mr-2" />
            Plan Long Weekend
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">My Weekend Plan</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{scheduledActivities.length} activities</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getTotalDuration()} hours total</span>
            </div>
            <div className="flex items-center gap-1">
              <span>~${getEstimatedCost()} estimated</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Plan
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearWeekend}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => onViewChange("browse")}>Add More Activities</Button>
        </div>
      </div>

      {/* Theme Selector */}
      <ThemeSelector />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="dragdrop">Drag & Drop</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="longweekend">Long Weekends</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <WeekendTimeline />
        </TabsContent>

        <TabsContent value="dragdrop" className="space-y-6">
          <DragDropScheduler />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityMap
                activities={scheduledActivities}
                selectedActivity={selectedMapActivity}
                onActivitySelect={setSelectedMapActivity}
              />
            </div>
            <div>
              <LocationFinder />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarView selectedDate={selectedCalendarDate} onDateSelect={setSelectedCalendarDate} />
        </TabsContent>

        <TabsContent value="longweekend" className="space-y-6">
          <LongWeekendPlanner />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Only this section gets screenshotted */}
          <div
            ref={plannerRef}
            style={{
              background: "#fff",
              color: "#222", // enforce simple color space
              padding: 16,
              borderRadius: 12,
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Saturday Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Saturday ({saturdayActivities.length} activities)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {saturdayActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No activities scheduled for Saturday</p>
                ) : (
                  saturdayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{activity.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{activity.duration}h</span>
                          {activity.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{activity.location.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sunday Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sunday ({sundayActivities.length} activities)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sundayActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No activities scheduled for Sunday</p>
                ) : (
                  sundayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{activity.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{activity.duration}h</span>
                          {activity.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{activity.location.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
