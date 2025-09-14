"use client"

import { useState } from "react"
import { WeekendPlanner } from "@/components/weekend-planner"
import { ActivityBrowser } from "@/components/activity-browser"
import { PersonalizationWizard } from "@/components/personalization-wizard"
import { MoodTracker } from "@/components/mood-tracker"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [currentView, setCurrentView] = useState<"browse" | "schedule" | "personalize" | "mood">("personalize")
  const [showPersonalization, setShowPersonalization] = useState(true)

  const handlePersonalizationComplete = () => {
    setShowPersonalization(false)
    setCurrentView("browse")
  }

  if (showPersonalization) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background">
          <Header currentView={currentView} onViewChange={setCurrentView} />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-foreground">Welcome to Weekendly!</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Let's personalize your weekend planning experience. Answer a few quick questions to get started with
                activities tailored just for you.
              </p>
            </div>
            <PersonalizationWizard onComplete={handlePersonalizationComplete} />
          </main>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="container mx-auto px-4 py-8">
          {currentView === "browse" && <ActivityBrowser onViewChange={setCurrentView} />}
          {currentView === "schedule" && <WeekendPlanner onViewChange={setCurrentView} />}
          {currentView === "mood" && <MoodTracker />}
        </main>
      </div>
    </ThemeProvider>
  )
}
