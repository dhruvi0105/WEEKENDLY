"use client"

import { useRef, useCallback } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Clock, Calendar, GripVertical, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeekendStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format, setHours, setMinutes, startOfWeek, addDays } from "date-fns"

const ItemType = "ACTIVITY"

interface DragItem {
  id: string
  type: string
  sourceContainer: string
  index: number
}

interface DraggableActivityProps {
  activity: any
  sourceContainer: string
  index: number
  moveActivity: (dragIndex: number, hoverIndex: number, day: string) => void
  onRemove?: (id: string) => void
}

function DraggableActivity({ activity, sourceContainer, index, moveActivity, onRemove }: DraggableActivityProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: activity.id, index, type: ItemType, day: sourceContainer },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (
        dragIndex === hoverIndex ||
        item.sourceContainer !== sourceContainer // only reorder within same container
      ) {
        return
      }
      moveActivity(dragIndex, hoverIndex, sourceContainer)
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={cn(
        "p-3 bg-card border rounded-lg cursor-move transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          draggable={false}
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
          {activity.day && (
            <div className="text-xs text-muted-foreground mt-1">
              {format(new Date(activity.scheduledTime), "HH:mm")}
            </div>
          )}
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onRemove(activity.id);
            }}
            className="text-destructive hover:text-destructive p-1 h-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

interface DroppableContainerProps {
  title: string
  day?: "saturday" | "sunday"
  activities: any[]
  onDrop: (item: DragItem, targetDay?: "saturday" | "sunday") => void
  moveActivity: (dragIndex: number, hoverIndex: number, day: string) => void
  onRemove?: (id: string) => void
  className?: string
}

function DroppableContainer({ title, day, activities, onDrop, moveActivity, onRemove, className }: DroppableContainerProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DragItem) => onDrop(item, day),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
  })

  return (
    <div
      ref={el => { drop(el) }}
      className={cn(
        "transition-all duration-200",
        isOver && canDrop && "ring-2 ring-primary/50 bg-primary/5",
        isOver && !canDrop && "ring-2 ring-destructive/50",
        className,
      )}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            {title} ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 min-h-[200px]">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">{day ? `Drop activities here for ${day}` : "Activities to schedule"}</p>
            </div>
          ) : (
            activities.map((activity, idx) => (
              <DraggableActivity
                key={activity.id}
                activity={activity}
                sourceContainer={day || "unscheduled"}
                index={idx}
                moveActivity={moveActivity}
                onRemove={onRemove}
              />
            ))
          )}
          {isOver && canDrop && (
            <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 text-center text-primary">
              Drop here to schedule
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function DragDropScheduler() {
  const { scheduledActivities, scheduleActivity, removeActivity, moveActivityInDay } = useWeekendStore()

  const unscheduledActivities = scheduledActivities.filter(a => !a.day)
  const saturdayActivities = scheduledActivities.filter(a => a.day === "saturday")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
  const sundayActivities = scheduledActivities.filter(a => a.day === "sunday")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())

  // Move activity within the same day (by index). Put this logic in your Zustand store for real app state!
  const moveActivity = useCallback(
    (dragIndex: number, hoverIndex: number, day: string) => {
      // Decide which day's array to reorder
      const copy = scheduledActivities.slice()
      const dayActivities = copy.filter(a => a.day === day)
      const otherActivities = copy.filter(a => a.day !== day)
      const [removed] = dayActivities.splice(dragIndex, 1)
      dayActivities.splice(hoverIndex, 0, removed)
      // Recombine
      const newOrder = [
        ...otherActivities,
        ...dayActivities
      ]
      // If you use Zustand, do this instead:
      // moveActivityInDay(day, dayActivities)
      // For this example, update the list directly if stored in local state!
    },
    [scheduledActivities]
  )

  const handleDrop = useCallback(
    (item: DragItem, targetDay?: "saturday" | "sunday") => {
      if (!targetDay) {
        // Don't update on drop to unscheduled column—implement unscheduling if you want
        return;
      }
      const existingActivities = targetDay === "saturday" ? saturdayActivities : sundayActivities
      let suggestedTime = setHours(setMinutes(new Date(), 0), 9)
      if (existingActivities.length > 0) {
        const lastActivity = existingActivities[existingActivities.length - 1]
        const lastEndTime = new Date(lastActivity.scheduledTime)
        lastEndTime.setHours(lastEndTime.getHours() + lastActivity.duration)
        suggestedTime = lastEndTime
      }
      const baseDate = targetDay === "saturday"
        ? addDays(startOfWeek(new Date()), 6)
        : addDays(startOfWeek(new Date()), 0)
      const scheduledTime = new Date(baseDate)
      scheduledTime.setHours(suggestedTime.getHours())
      scheduledTime.setMinutes(suggestedTime.getMinutes())
      scheduleActivity(item.id, targetDay, scheduledTime)
    }, [scheduleActivity, saturdayActivities, sundayActivities]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Drag & Drop Scheduler</h3>
          <p className="text-muted-foreground">
            Drag activities between any column and reorder them within each day!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DroppableContainer
            title="Unscheduled Activities"
            activities={unscheduledActivities}
            onDrop={handleDrop}
            moveActivity={moveActivity}
            onRemove={removeActivity}
          />
          <DroppableContainer
            title="Saturday"
            day="saturday"
            activities={saturdayActivities}
            onDrop={handleDrop}
            moveActivity={moveActivity}
            onRemove={removeActivity}
          />
          <DroppableContainer
            title="Sunday"
            day="sunday"
            activities={sundayActivities}
            onDrop={handleDrop}
            moveActivity={moveActivity}
            onRemove={removeActivity}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>💡 Tip: Drag any activity to reschedule or reorder instantly!</p>
        </div>
      </div>
    </DndProvider>
  )
}
