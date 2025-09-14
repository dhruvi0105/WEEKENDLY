"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WEEKEND_THEMES } from "@/lib/activities-data"
import { useWeekendStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { selectedTheme, setTheme } = useWeekendStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Weekend Vibe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEKEND_THEMES.map((theme) => (
            <Button
              key={theme.id}
              variant={selectedTheme === theme.id ? "default" : "outline"}
              className={cn(
                "h-auto p-4 flex flex-col items-start gap-2 text-left",
                selectedTheme === theme.id && "ring-2 ring-primary/20",
              )}
              onClick={() => setTheme(theme.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-lg">{theme.icon}</span>
                <span className="font-semibold">{theme.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
              <Badge variant="secondary" className={theme.color}>
                {theme.suggestedActivities.length} suggested activities
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
