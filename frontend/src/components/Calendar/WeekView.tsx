import { useMemo, useState, useEffect, useRef } from "react";
import { Event } from "@/types/event";

interface WeekViewProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  events?: Event[];
  onEventClick?: (event: Event) => void;
}

const WeekView = ({ currentDate, onDateClick, events = [], onEventClick }: WeekViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeColumnRef = useRef<HTMLDivElement>(null);
  const dayColumnsRef = useRef<HTMLDivElement>(null);

  // Filter events for the current week
  const weekEvents = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return eventStart >= startOfWeek && eventStart < endOfWeek;
    });
  }, [currentDate, events]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync scroll between time column and day columns
  useEffect(() => {
    const dayColumns = dayColumnsRef.current;
    const timeColumn = timeColumnRef.current;

    if (!dayColumns || !timeColumn) return;

    const handleDayColumnsScroll = () => {
      if (timeColumn) {
        timeColumn.scrollTop = dayColumns.scrollTop;
      }
    };

    dayColumns.addEventListener('scroll', handleDayColumnsScroll);
    return () => dayColumns.removeEventListener('scroll', handleDayColumnsScroll);
  }, []);

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();

      return {
        date,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        isToday,
      };
    });
  }, [currentDate, today]);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  // Calculate position of current time indicator
  const currentTimePosition = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours * 48) + (minutes / 60 * 48); // 48px per hour
  }, [currentTime]);

  // Check if current time indicator should be shown (only if today is in the week)
  const showTimeIndicator = useMemo(() => {
    return weekDays.some(day => day.isToday);
  }, [weekDays]);

  // Get current day index
  const currentDayIndex = useMemo(() => {
    return weekDays.findIndex(day => day.isToday);
  }, [weekDays]);

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

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Fixed header row */}
        <div className="flex flex-shrink-0">
          {/* Empty space for timezone column */}
          <div className="w-20 flex-shrink-0">
            <div className="h-20 bg-background"></div>
          </div>

          {/* Day headers */}
          <div className="flex-1 grid grid-cols-7">
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="min-w-[100px]">
                <div className="h-20 flex flex-col items-center justify-center pt-2 bg-background">
                  <div className={`text-[11px] font-medium uppercase tracking-wider ${day.isToday ? 'text-blue-600' : 'text-muted-foreground'}`}>
                    {day.dayName}
                  </div>
                  {day.isToday ? (
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-normal mt-1">
                      {day.dayNumber}
                    </div>
                  ) : (
                    <div className="text-2xl font-normal mt-1 text-foreground">
                      {day.dayNumber}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
            <div style={{ height: `${24 * 48}px` }}>
              {hours.map((hour) => (
                <div key={hour} className="h-12 pr-2 pt-1 text-right relative">
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

          {/* Days columns - scrollable area with scrollbar right of Saturday */}
          <div
            ref={dayColumnsRef}
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            <div className="grid grid-cols-7" style={{ height: `${24 * 48}px` }}>
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-calendar-border last:border-r-0 relative min-w-[100px]">
                  {/* Time slots */}
                  <div className="relative" style={{ height: `${24 * 48}px` }}>
                    {hours.map((hour, hourIndex) => (
                      <div
                        key={hour}
                        className="h-12 cursor-pointer relative hover:bg-blue-50/30 transition-colors"
                        onClick={() => {
                          const clickedDate = new Date(day.date);
                          clickedDate.setHours(hour);
                          onDateClick(clickedDate);
                        }}
                      >
                        {hour > 0 && (
                          <div className="absolute top-0 left-0 right-0 border-t border-calendar-border" />
                        )}
                      </div>
                    ))}

                    {/* Render events for this day */}
                    {(() => {
                      const dayEventsFiltered = weekEvents.filter(event => {
                        const eventDate = new Date(event.start_time);
                        return eventDate.toDateString() === day.date.toDateString();
                      });

                      const eventsWithPositions = calculateEventPositions(dayEventsFiltered);

                      return eventsWithPositions.map(event => {
                        const eventStart = new Date(event.start_time);
                        const eventEnd = new Date(event.end_time);

                        // Calculate position and height (48px per hour)
                        const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
                        const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;
                        const top = startHour * 48;
                        const height = Math.max((endHour - startHour) * 48, 24);

                        // Calculate horizontal position based on column
                        const widthPercent = (1 / event.totalColumns) * 100;
                        const leftPercent = (event.column / event.totalColumns) * 100;

                        return (
                          <div
                            key={event.id}
                            className="absolute bg-purple-400 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-purple-500 transition-colors z-10 overflow-hidden shadow-sm"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              left: `${leftPercent}%`,
                              width: `calc(${widthPercent}% - 4px)`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            {height > 30 && (
                              <div className="text-[10px] opacity-90 truncate mt-0.5">
                                {eventStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                              </div>
                            )}
                            {height > 50 && event.description && (
                              <div className="text-[10px] opacity-75 truncate mt-0.5">
                                {event.description}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}

                    {/* Current time indicator */}
                    {showTimeIndicator && dayIndex === currentDayIndex && (
                      <div
                        className="absolute left-0 right-0 z-20 pointer-events-none"
                        style={{ top: `${currentTimePosition}px` }}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
                          <div className="flex-1 h-0.5 bg-red-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default WeekView;
