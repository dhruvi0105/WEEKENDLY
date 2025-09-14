"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Activity, ScheduledActivity, WeekendPlan } from "./types"

interface WeekendStore {
  scheduledActivities: ScheduledActivity[]
  currentPlan: WeekendPlan | null
  selectedTheme: string | null

  // Actions
  addActivity: (activity: Activity) => void
  removeActivity: (activityId: string) => void
  scheduleActivity: (activityId: string, day: "saturday" | "sunday", time: Date) => void
  updateActivityTime: (activityId: string, newTime: Date) => void
  setTheme: (theme: string) => void
  clearWeekend: () => void
  savePlan: (name: string) => void
  moveActivityInDay: (day: "saturday" | "sunday", dragIndex: number, hoverIndex: number) => void
}

export const useWeekendStore = create<WeekendStore>()(
  persist(
    (set, get) => ({
      scheduledActivities: [],
      currentPlan: null,
      selectedTheme: null,

      addActivity: (activity) => {
        const { scheduledActivities } = get()

        // Check if activity is already scheduled
        if (scheduledActivities.some((scheduled) => scheduled.id === activity.id)) {
          return
        }

        // Add activity without specific scheduling (user will schedule it later)
        const scheduledActivity: ScheduledActivity = {
          ...activity,
          scheduledTime: new Date(), // Default time, will be updated when scheduled
          day: "saturday", // Default day, will be updated when scheduled
        }

        set({
          scheduledActivities: [...scheduledActivities, scheduledActivity],
        })
      },

      removeActivity: (activityId) => {
        set((state) => ({
          scheduledActivities: state.scheduledActivities.filter((activity) => activity.id !== activityId),
        }))
      },

      moveActivityInDay: (day: "saturday" | "sunday", dragIndex: number, hoverIndex: number) => {
        set((state) => {
          // Get all activities for the day
          const dayActivities = state.scheduledActivities.filter(a => a.day === day);
          const otherActivities = state.scheduledActivities.filter(a => a.day !== day);

          if (dragIndex === hoverIndex || dragIndex < 0 || hoverIndex < 0) return {};

          // Reorder in a copy of the day's array
          const [removed] = dayActivities.splice(dragIndex, 1);
          dayActivities.splice(hoverIndex, 0, removed);

          // Merge and preserve correct order (others first, then sorted day)
          return {
            scheduledActivities: [...otherActivities, ...dayActivities]
          };
        });
      },

      scheduleActivity: (activityId, day, time) => {
        set((state) => ({
          scheduledActivities: state.scheduledActivities.map((activity) =>
            activity.id === activityId ? { ...activity, day, scheduledTime: time } : activity,
          ),
        }))
      },

      updateActivityTime: (activityId, newTime) => {
        set((state) => ({
          scheduledActivities: state.scheduledActivities.map((activity) =>
            activity.id === activityId ? { ...activity, scheduledTime: newTime } : activity,
          ),
        }))
      },

      setTheme: (theme) => {
        set({ selectedTheme: theme })
      },

      clearWeekend: () => {
        set({
          scheduledActivities: [],
          currentPlan: null,
          selectedTheme: null,
        })
      },

      savePlan: (name) => {
        const { scheduledActivities, selectedTheme } = get()

        const saturdayActivities = scheduledActivities.filter((a) => a.day === "saturday")
        const sundayActivities = scheduledActivities.filter((a) => a.day === "sunday")

        const plan: WeekendPlan = {
          id: Date.now().toString(),
          name,
          theme: (selectedTheme as any) || "lazy",
          saturday: saturdayActivities,
          sunday: sundayActivities,
          createdAt: new Date(),
        }

        set({ currentPlan: plan })
      },
    }),
    {
      name: "weekend-storage",
      partialize: (state) => ({
        scheduledActivities: state.scheduledActivities,
        currentPlan: state.currentPlan,
        selectedTheme: state.selectedTheme,
      }),
    },
  ),
)
