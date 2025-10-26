import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import MonthView from "@/components/Calendar/MonthView";
import WeekView from "@/components/Calendar/WeekView";
import DayView from "@/components/Calendar/DayView";
import Sidebar from "@/components/Calendar/Sidebar";
import RightSidebar from "@/components/Calendar/RightSidebar";
import EventModal from "@/components/Calendar/EventModal";
import EventQuickView from "@/components/Calendar/EventQuickView";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { eventApi } from "@/lib/api";
import { Event } from "@/types/event";

const Index = () => {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [previousView, setPreviousView] = useState<"month" | "week" | "day">("week");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastClickedDate, setLastClickedDate] = useState<Date | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewEvent, setQuickViewEvent] = useState<Event | null>(null);

  // Fetch events from backend
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventApi.getEvents(),
    staleTime: 0, // Always refetch
    gcTime: 0, // Don't cache
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: number) => eventApi.deleteEvent(eventId),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleMonthChange = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setQuickViewEvent(event);
    setIsQuickViewOpen(true);
  };

  const handleEditFromQuickView = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(undefined); // Don't set selectedDate when editing - use event's date
    setIsQuickViewOpen(false); // Close quick view first
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    console.log("handleSaveEvent called, selectedEvent:", selectedEvent);

    // Small delay to ensure backend has processed the request
    await new Promise(resolve => setTimeout(resolve, 200));

    // Refetch events directly
    console.log("Refetching events...");
    const result = await refetch();
    console.log("Refetch complete, new events count:", result.data?.length);

    toast({
      title: selectedEvent ? "Event updated" : "Event created",
      description: selectedEvent
        ? "Your event has been updated successfully."
        : "Your event has been added to your calendar.",
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleMiniCalendarDateClick = (date: Date) => {
    const dateStr = date.toDateString();
    const lastDateStr = lastClickedDate?.toDateString();
    
    if (dateStr === lastDateStr && view === "day") {
      // Revert to previous view
      setView(previousView);
      setLastClickedDate(null);
    } else {
      // Switch to day view
      if (view !== "day") {
        setPreviousView(view);
      }
      setView("day");
      setCurrentDate(date);
      setLastClickedDate(date);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isSearchOpen && (
        <Sidebar 
          currentDate={currentDate} 
          onDateSelect={setCurrentDate}
          onCreateEvent={handleCreateEvent}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          onDateClick={handleMiniCalendarDateClick}
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {isSearchOpen ? (
          <div className="flex items-center gap-4 px-4 py-3 border-b border-calendar-border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-calendar-hover"
              onClick={() => setIsSearchOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-xl font-normal">Search</span>
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-12 px-4 rounded-lg border border-calendar-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>
        ) : (
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onSearchClick={() => setIsSearchOpen(true)}
          />
        )}
        
        <div className="flex-1 overflow-hidden transition-all duration-300 ease-in-out">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading events...</div>
            </div>
          ) : (
            <>
              {view === "month" && (
                <div className="animate-fade-in h-full">
                  <MonthView
                    currentDate={currentDate}
                    onDateClick={handleDateClick}
                    events={events}
                    onEventClick={handleEventClick}
                    onMonthChange={handleMonthChange}
                  />
                </div>
              )}

              {view === "week" && (
                <div className="animate-fade-in h-full">
                  <WeekView
                    currentDate={currentDate}
                    onDateClick={handleDateClick}
                    events={events}
                    onEventClick={handleEventClick}
                  />
                </div>
              )}

              {view === "day" && (
                <div className="animate-fade-in h-full">
                  <DayView
                    currentDate={currentDate}
                    onTimeClick={handleDateClick}
                    events={events}
                    onEventClick={handleEventClick}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <RightSidebar />

      <EventQuickView
        event={quickViewEvent!}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onEdit={handleEditFromQuickView}
        onDelete={handleDeleteEvent}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(undefined);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        event={selectedEvent}
      />
    </div>
  );
};

export default Index;
