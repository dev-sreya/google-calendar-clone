import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Users, Video, MapPin, AlignLeft, Calendar as CalendarIcon, Trash2, Clock, Repeat } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventApi } from "@/lib/api";
import { Event } from "@/types/event";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onDelete?: (eventId: number) => void;
  selectedDate?: Date;
  event?: Event | null;
}

const EventModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, event }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState("does-not-repeat");

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      // For updates, use the event's original date; for new events, use selectedDate or today
      let baseDate: Date;

      if (event) {
        // When editing, preserve the original event's date
        baseDate = new Date(event.start_time);
        console.log("EventModal - Using event's original date as base:", baseDate.toString());
        console.log("EventModal - Base date components - Year:", baseDate.getFullYear(), "Month:", baseDate.getMonth(), "Date:", baseDate.getDate());
      } else {
        // When creating, use the selected date or today
        baseDate = selectedDate || new Date();
        console.log("EventModal - Using selected date as base:", baseDate.toString());
      }

      // Create datetime by combining the base date with selected times
      // Use local date components to avoid timezone issues
      const [startHour, startMinute] = startTime.split(':');
      console.log("EventModal - Form start time:", startTime, "-> hour:", startHour, "minute:", startMinute);

      const startDateTime = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        parseInt(startHour),
        parseInt(startMinute),
        0,
        0
      );

      const [endHour, endMinute] = endTime.split(':');
      console.log("EventModal - Form end time:", endTime, "-> hour:", endHour, "minute:", endMinute);

      const endDateTime = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        parseInt(endHour),
        parseInt(endMinute),
        0,
        0
      );

      console.log("EventModal - Constructed start DateTime (local):", startDateTime.toString());
      console.log("EventModal - Constructed end DateTime (local):", endDateTime.toString());

      let finalStartTime: string;
      let finalEndTime: string;

      if (event) {
        // When editing, check if times have changed
        const originalStartDate = new Date(event.start_time);
        const originalEndDate = new Date(event.end_time);

        const originalStartTimeStr = `${originalStartDate.getHours().toString().padStart(2, '0')}:${originalStartDate.getMinutes().toString().padStart(2, '0')}`;
        const originalEndTimeStr = `${originalEndDate.getHours().toString().padStart(2, '0')}:${originalEndDate.getMinutes().toString().padStart(2, '0')}`;

        console.log("EventModal - Original time from event:", originalStartTimeStr, "-", originalEndTimeStr);
        console.log("EventModal - Current form time:", startTime, "-", endTime);

        // If times haven't changed, use the original ISO strings to preserve timezone
        if (originalStartTimeStr === startTime && originalEndTimeStr === endTime) {
          console.log("EventModal - Times unchanged, using original ISO strings");
          finalStartTime = event.start_time;
          finalEndTime = event.end_time;
        } else {
          console.log("EventModal - Times changed, constructing new ISO strings");
          finalStartTime = startDateTime.toISOString();
          finalEndTime = endDateTime.toISOString();
        }
      } else {
        finalStartTime = startDateTime.toISOString();
        finalEndTime = endDateTime.toISOString();
      }

      console.log("EventModal - About to save, event exists:", !!event);
      console.log("EventModal - Final start time:", finalStartTime);
      console.log("EventModal - Final end time:", finalEndTime);

      if (event) {
        // Update existing event
        console.log("EventModal - Updating event ID:", event.id);
        console.log("EventModal - Original start time:", event.start_time);
        console.log("EventModal - New start time:", finalStartTime);

        const updatedEvent = await eventApi.updateEvent(event.id, {
          title,
          description,
          start_time: finalStartTime,
          end_time: finalEndTime,
        });
        console.log("EventModal - Update completed:", updatedEvent);
      } else {
        // Create new event
        console.log("EventModal - Creating new event");
        const newEvent = await eventApi.createEvent({
          title,
          description,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        });
        console.log("EventModal - Create completed:", newEvent);
      }

      console.log("EventModal - Calling onSave callback");
      // Wait for onSave to complete (which invalidates the query cache)
      await onSave();
      console.log("EventModal - onSave callback completed");

      // Small delay before closing to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Reset form
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
      setIsAllDay(false);
      setRecurrence("does-not-repeat");

      console.log("EventModal - Closing modal");
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;

    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);
    try {
      await eventApi.deleteEvent(event.id);
      onDelete(event.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getCurrentDayName = () => {
    const date = event ? new Date(event.start_time) : (selectedDate || new Date());
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getRecurrenceLabel = (value: string) => {
    switch (value) {
      case "does-not-repeat": return "Does not repeat";
      case "daily": return "Daily";
      case "weekly": return `Weekly on ${getCurrentDayName()}`;
      case "monthly": return "Monthly";
      case "annually": return "Annually";
      case "weekday": return "Every weekday (Monday to Friday)";
      default: return "Does not repeat";
    }
  };

  useEffect(() => {
    if (isOpen && event) {
      // Populate form with event data for editing
      console.log("EventModal - Populating form with event:", event);
      setTitle(event.title);
      setDescription(event.description || "");

      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      console.log("EventModal - Original start_time (ISO):", event.start_time);
      console.log("EventModal - Parsed start date (local):", startDate.toString());
      console.log("EventModal - Extracted hours:minutes:", `${startDate.getHours()}:${startDate.getMinutes()}`);

      const formattedStartTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
      const formattedEndTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

      console.log("EventModal - Setting form start time to:", formattedStartTime);
      console.log("EventModal - Setting form end time to:", formattedEndTime);

      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
    } else if (!isOpen) {
      // Reset form when modal closes
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
      setIsAllDay(false);
      setRecurrence("does-not-repeat");
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - semi-transparent but not disabling */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose}></div>
      
      {/* Floating Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-calendar-border">
            <div className="w-6"></div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title Input */}
            <Input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-normal border-0 border-b border-blue-500 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-600"
            />

            {/* Event Type Tabs */}
            <Tabs defaultValue="event" className="w-full">
              <TabsList className="bg-blue-100 h-9">
                <TabsTrigger value="event" className="data-[state=active]:bg-blue-200">Event</TabsTrigger>
                <TabsTrigger value="task">Task</TabsTrigger>
                <TabsTrigger value="appointment">Appointment schedule</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Date and Time */}
            <div className="flex items-center gap-3 py-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {formatDate(event ? new Date(event.start_time) : (selectedDate || new Date()))}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24 h-8 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">–</span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24 h-8 text-sm"
                  />
                </div>

                {/* All-day checkbox and timezone */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="all-day"
                      checked={isAllDay}
                      onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
                    />
                    <label
                      htmlFor="all-day"
                      className="text-xs text-foreground cursor-pointer select-none"
                    >
                      All day
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                    onClick={() => {/* TODO: Implement timezone selector */}}
                  >
                    Time zone
                  </button>
                </div>
              </div>
            </div>

            {/* Recurrence dropdown */}
            <div className="flex items-center gap-3 py-2">
              <Repeat className="h-5 w-5 text-muted-foreground" />
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="flex-1 h-8 text-sm border-0 hover:bg-gray-50">
                  <SelectValue>
                    {getRecurrenceLabel(recurrence)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="does-not-repeat">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly on {getCurrentDayName()}</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="weekday">Every weekday (Monday to Friday)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add guests */}
            <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add guests</span>
            </div>

            {/* Add Google Meet */}
            <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
              <Video className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add Google Meet video conferencing</span>
            </div>

            {/* Add location */}
            <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add location</span>
            </div>

            {/* Add description */}
            <div className="flex items-start gap-3 py-2">
              <AlignLeft className="h-5 w-5 text-muted-foreground mt-1" />
              <Textarea
                placeholder="Add description or a Google Drive attachment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 min-h-[80px] text-sm resize-none"
              />
            </div>

            {/* Calendar selection */}
            <div className="flex items-center gap-3 py-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7986cb]"></div>
                  <span className="text-sm">Sreya Karmakar</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Busy • Default visibility • Notify 30 minutes before
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-calendar-border">
            <div>
              {event && onDelete && (
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
