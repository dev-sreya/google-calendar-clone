import { useMemo, useEffect, useRef } from "react";
import { Event } from "@/types/event";

interface DayViewProps {
  currentDate: Date;
  onTimeClick: (date: Date) => void;
  events?: Event[];
  onEventClick?: (event: Event) => void;
}

const DayView = ({ currentDate, onTimeClick, events = [], onEventClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const timeColumnRef = useRef<HTMLDivElement>(null);
  const dayColumnRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = useMemo(() => {
    const compareDate = new Date(currentDate);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  }, [currentDate, today]);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  // Get timezone offset
  const getTimezoneAbbr = () => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const sign = offset > 0 ? '-' : '+';
    return `GMT${sign}${hours}`;
  };

  // Helper function to detect overlapping events and calculate their positions
  const calculateEventPositions = (dayEvents: Event[]) => {
    if (dayEvents.length === 0) return [];

    // Sort events by start time
    const sortedEvents = [...dayEvents].sort((a, b) => {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    interface EventWithPosition extends Event {
      column: number;
      totalColumns: number;
    }

    const eventsWithPositions: EventWithPosition[] = [];
    const columns: Event[][] = [];

    sortedEvents.forEach(event => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);

      // Find a column where this event fits (no overlap)
      let columnIndex = -1;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const hasOverlap = column.some(existingEvent => {
          const existingStart = new Date(existingEvent.start_time);
          const existingEnd = new Date(existingEvent.end_time);
          return eventStart < existingEnd && eventEnd > existingStart;
        });

        if (!hasOverlap) {
          columnIndex = i;
          break;
        }
      }

      // If no column found, create a new one
      if (columnIndex === -1) {
        columnIndex = columns.length;
        columns.push([]);
      }

      columns[columnIndex].push(event);
      eventsWithPositions.push({
        ...event,
        column: columnIndex,
        totalColumns: 0, // Will be updated later
      });
    });

    // Update totalColumns for overlapping groups
    eventsWithPositions.forEach((event, index) => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);

      // Find max columns among overlapping events
      let maxColumns = 1;
      eventsWithPositions.forEach(otherEvent => {
        const otherStart = new Date(otherEvent.start_time);
        const otherEnd = new Date(otherEvent.end_time);

        if (eventStart < otherEnd && eventEnd > otherStart) {
          maxColumns = Math.max(maxColumns, otherEvent.column + 1);
        }
      });

      eventsWithPositions[index].totalColumns = maxColumns;
    });

    return eventsWithPositions;
  };

  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = currentDate.getDate();

  // Filter events for the current day
  const dayEvents = useMemo(() => {
    const compareDate = new Date(currentDate);
    compareDate.setHours(0, 0, 0, 0);

    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === compareDate.getTime();
    });
  }, [currentDate, events]);

  // Sync scroll between time column and day column
  useEffect(() => {
    const dayColumn = dayColumnRef.current;
    const timeColumn = timeColumnRef.current;

    if (!dayColumn || !timeColumn) return;

    const handleDayColumnScroll = () => {
      if (timeColumn) {
        timeColumn.scrollTop = dayColumn.scrollTop;
      }
    };

    dayColumn.addEventListener('scroll', handleDayColumnScroll);
    return () => dayColumn.removeEventListener('scroll', handleDayColumnScroll);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Fixed header row */}
        <div className="flex flex-shrink-0">
          {/* Empty space for timezone column */}
          <div className="w-20 flex-shrink-0">
            <div className="h-20 bg-background"></div>
          </div>

          {/* Day header */}
          <div className="flex-1 min-w-[300px]">
            <div className="h-20 flex flex-col items-start justify-center pl-6 bg-background gap-0.5">
              <div className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? 'text-blue-600' : 'text-foreground'}`}>
                {dayName}
              </div>
              {isToday ? (
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-normal">
                  {dayNumber}
                </div>
              ) : (
                <div className="text-2xl font-normal text-foreground">
                  {dayNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Time column - synced scroll, no scrollbar */}
          <div
            ref={timeColumnRef}
            className="w-20 flex-shrink-0 border-r border-calendar-border overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div style={{ height: `${24 * 64}px` }}>
              {hours.map((hour) => (
                <div key={hour} className="h-16 pr-2 pt-1 text-right relative">
                  <span className="text-xs font-normal text-gray-500">
                    {hour === 0 ? getTimezoneAbbr() : formatHour(hour)}
                  </span>
                  {hour > 0 && (
                    <div className="absolute top-0 left-0 right-0 border-t border-calendar-border" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Day column - scrollable area with visible scrollbar */}
          <div
            ref={dayColumnRef}
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            <div className="min-w-[300px]" style={{ height: `${24 * 64}px` }}>
              {/* Time slots */}
              <div className="relative h-full">
                {hours.map((hour, hourIndex) => (
                  <div
                    key={hour}
                    className="h-16 hover:bg-calendar-hover transition-colors cursor-pointer relative"
                    onClick={() => {
                      const clickedDate = new Date(currentDate);
                      clickedDate.setHours(hour);
                      onTimeClick(clickedDate);
                    }}
                  >
                    {hour > 0 && (
                      <div className="absolute top-0 left-0 right-0 border-t border-calendar-border" />
                    )}
                    {/* Half-hour line */}
                    <div className="absolute top-1/2 left-0 right-0 border-t border-calendar-border opacity-30" />
                  </div>
                ))}

                {/* Render events for this day */}
                {(() => {
                  const eventsWithPositions = calculateEventPositions(dayEvents);

                  return eventsWithPositions.map(event => {
                    const eventStart = new Date(event.start_time);
                    const eventEnd = new Date(event.end_time);

                    // Calculate position and height (64px per hour for day view)
                    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
                    const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;
                    const top = startHour * 64;
                    const height = Math.max((endHour - startHour) * 64, 32);

                    // Calculate horizontal position based on column
                    const widthPercent = (1 / event.totalColumns) * 100;
                    const leftPercent = (event.column / event.totalColumns) * 100;

                    return (
                      <div
                        key={event.id}
                        className="absolute bg-purple-400 text-white text-sm px-3 py-2 rounded cursor-pointer hover:bg-purple-500 transition-colors z-10 overflow-hidden shadow-sm"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: `calc(${leftPercent}% + 8px)`,
                          width: `calc(${widthPercent}% - 16px)`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {height > 40 && (
                          <div className="text-xs opacity-90 truncate mt-0.5">
                            {eventStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </div>
                        )}
                        {height > 70 && event.description && (
                          <div className="text-xs opacity-75 truncate mt-0.5">
                            {event.description}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DayView;
