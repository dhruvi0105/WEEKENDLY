"use client"

import { useState } from "react"
import { User, Heart, MapPin, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useWeekendStore } from "@/lib/store"
import { ACTIVITIES } from "@/lib/activities-data"

interface PersonalizationWizardProps {
  onComplete: () => void
}

interface UserPreferences {
  budgetRange: [number, number]
  preferredMoods: string[]
  preferredCategories: string[]
  timePreference: string
  activityLevel: string
  groupSize: string
  location: string
}

export function PersonalizationWizard({ onComplete }: PersonalizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<UserPreferences>({
    budgetRange: [25, 100],
    preferredMoods: [],
    preferredCategories: [],
    timePreference: "flexible",
    activityLevel: "moderate",
    groupSize: "couple",
    location: "local",
  })

  const { setTheme, addActivity } = useWeekendStore()

  const steps = [
    {
      title: "Budget Preferences",
      description: "What's your typical weekend budget?",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      title: "Activity Moods",
      description: "What vibes do you enjoy most?",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Activity Categories",
      description: "Which types of activities interest you?",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Lifestyle Preferences",
      description: "Tell us about your weekend style",
      icon: <User className="h-6 w-6" />,
    },
  ]

  const moods = [
    { id: "energetic", name: "Energetic", emoji: "⚡", color: "bg-orange-100 text-orange-800" },
    { id: "relaxed", name: "Relaxed", emoji: "😌", color: "bg-blue-100 text-blue-800" },
    { id: "social", name: "Social", emoji: "👥", color: "bg-green-100 text-green-800" },
    { id: "adventurous", name: "Adventurous", emoji: "🏔️", color: "bg-red-100 text-red-800" },
  ]

  const categories = [
    { id: "food", name: "Food & Dining", emoji: "🍽️" },
    { id: "outdoor", name: "Outdoor Activities", emoji: "🌲" },
    { id: "entertainment", name: "Entertainment", emoji: "🎭" },
    { id: "wellness", name: "Wellness", emoji: "🧘" },
    { id: "social", name: "Social Events", emoji: "🎉" },
    { id: "culture", name: "Arts & Culture", emoji: "🎨" },
  ]

  const handleMoodToggle = (moodId: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferredMoods: prev.preferredMoods.includes(moodId)
        ? prev.preferredMoods.filter((id) => id !== moodId)
        : [...prev.preferredMoods, moodId],
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(categoryId)
        ? prev.preferredCategories.filter((id) => id !== categoryId)
        : [...prev.preferredCategories, categoryId],
    }))
  }

  const generateRecommendations = () => {
    // Find the best matching theme based on preferences
    let recommendedTheme = "lazy"

    if (preferences.preferredMoods.includes("adventurous") || preferences.activityLevel === "high") {
      recommendedTheme = "adventurous"
    } else if (preferences.preferredMoods.includes("social") || preferences.groupSize !== "solo") {
      recommendedTheme = "family"
    } else if (preferences.preferredCategories.includes("culture")) {
      recommendedTheme = "cultural"
    }

    setTheme(recommendedTheme)

    // Add recommended activities based on preferences
    const recommendedActivities = ACTIVITIES.filter((activity) => {
      const matchesMood = preferences.preferredMoods.length === 0 || preferences.preferredMoods.includes(activity.mood)
      const matchesCategory =
        preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(activity.category)

      const costValue = { free: 0, low: 25, medium: 75, high: 150 }[activity.cost]
      const matchesBudget = costValue >= preferences.budgetRange[0] && costValue <= preferences.budgetRange[1]

      return matchesMood && matchesCategory && matchesBudget
    }).slice(0, 3)

    recommendedActivities.forEach((activity) => {
      addActivity(activity)
    })
  }

  const handleComplete = () => {
    generateRecommendations()
    onComplete()
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Weekend Budget Range: ${preferences.budgetRange[0]} - ${preferences.budgetRange[1]}
              </Label>
              <Slider
                value={preferences.budgetRange}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, budgetRange: value as [number, number] }))
                }
                max={200}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Free</span>
                <span>$50</span>
                <span>$100</span>
                <span>$150+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-medium">Budget-Friendly</h4>
                <p className="text-sm text-muted-foreground">$0-50 per weekend</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl mb-2">💎</div>
                <h4 className="font-medium">Premium</h4>
                <p className="text-sm text-muted-foreground">$100+ per weekend</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Select all moods that appeal to you:</p>
            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    preferences.preferredMoods.includes(mood.id)
                      ? "border-primary bg-primary/10"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => handleMoodToggle(mood.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{mood.emoji}</div>
                    <h4 className="font-medium">{mood.name}</h4>
                    <Badge className={mood.color}>{mood.name}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Choose your favorite activity types:</p>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    preferences.preferredCategories.includes(category.id)
                      ? "border-primary bg-primary/10"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{category.emoji}</div>
                    <h4 className="font-medium text-sm">{category.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Activity Level</Label>
                <RadioGroup
                  value={preferences.activityLevel}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, activityLevel: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low-key (1-2 activities per day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (2-3 activities per day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High-energy (3+ activities per day)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">Group Size</Label>
                <RadioGroup
                  value={preferences.groupSize}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, groupSize: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" />
                    <Label htmlFor="solo">Solo adventures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="couple" id="couple" />
                    <Label htmlFor="couple">Couple activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group">Group activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="family" />
                    <Label htmlFor="family">Family-friendly</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">Time Preference</Label>
                <RadioGroup
                  value={preferences.timePreference}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, timePreference: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning" id="morning" />
                    <Label htmlFor="morning">Morning person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening" id="evening" />
                    <Label htmlFor="evening">Night owl</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible">Flexible timing</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {steps[currentStep].icon}
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </div>
          <Badge variant="outline">
            {currentStep + 1} of {steps.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex items-center justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create My Weekend
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
