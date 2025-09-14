export interface Activity {
  id: string
  name: string
  category: "food" | "outdoor" | "entertainment" | "wellness" | "social" | "culture"
  duration: number // in hours
  description: string
  image: string
  mood: "energetic" | "relaxed" | "social" | "adventurous"
  location?: {
    name: string
    address: string
    lat: number
    lng: number
  }
  cost: "free" | "low" | "medium" | "high"
  timeOfDay: "morning" | "afternoon" | "evening" | "any"
}

export interface ScheduledActivity extends Activity {
  scheduledTime: Date
  day: "saturday" | "sunday"
}

export interface WeekendPlan {
  id: string
  name: string
  theme: "lazy" | "adventurous" | "family" | "romantic" | "cultural"
  saturday: ScheduledActivity[]
  sunday: ScheduledActivity[]
  createdAt: Date
}

export interface WeekendTheme {
  id: string
  name: string
  description: string
  color: string
  icon: string
  suggestedActivities: string[]
}
