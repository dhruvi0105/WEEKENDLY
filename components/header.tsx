"use client"

import { Calendar, MapPin, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  currentView: "browse" | "schedule" | "personalize" | "mood"
  onViewChange: (view: "browse" | "schedule" | "personalize" | "mood") => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Weekendly</h1>
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">Your perfect weekend planner</span>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("browse")}
              className={cn(
                "flex items-center gap-2",
                currentView === "browse" && "bg-primary text-primary-foreground",
              )}
            >
              <MapPin className="h-4 w-4" />
              Browse Activities
            </Button>
            <Button
              variant={currentView === "schedule" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("schedule")}
              className={cn(
                "flex items-center gap-2",
                currentView === "schedule" && "bg-primary text-primary-foreground",
              )}
            >
              <Calendar className="h-4 w-4" />
              My Weekend
            </Button>
            <Button
              variant={currentView === "mood" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("mood")}
              className={cn("flex items-center gap-2", currentView === "mood" && "bg-primary text-primary-foreground")}
            >
              <Heart className="h-4 w-4" />
              Mood Tracker
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
