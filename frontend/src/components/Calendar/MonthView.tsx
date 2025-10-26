import { useMemo, useRef, useEffect } from "react";
import { Event } from "@/types/event";

interface MonthViewProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  onMonthChange?: (direction: 'next' | 'prev') => void;
  events?: Event[];
  onEventClick?: (event: Event) => void;
}

const MonthView = ({ currentDate, onDateClick, onMonthChange }: MonthViewProps) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    // Previous month's last date
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthLastDate = prevMonthLastDay.getDate();
    
    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i);
      days.push({
        date,
        dayNumber: prevMonthLastDate - i,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
      });
    }
    
    return days;
  }, [currentDate, today]);

  // Handle wheel scroll for month navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onMonthChange) return;

    const handleWheel = (e: WheelEvent) => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to trigger month change
      scrollTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling down - next month
          onMonthChange('next');
        } else if (e.deltaY < 0) {
          // Scrolling up - previous month
          onMonthChange('prev');
        }
      }, 150); // Debounce delay
    };

    container.addEventListener('wheel', handleWheel);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [onMonthChange]);

  return (
    <div ref={containerRef} className="flex-1 bg-background overflow-hidden custom-scrollbar">
      {/* Days of week header */}
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-calendar-gray uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-cell ${index < 7 ? 'border-t-0' : ''}`}
            onClick={() => onDateClick(day.date)}
          >
            <div className="flex justify-center items-start pt-2">
              {day.isToday ? (
                <div className="calendar-today">
                  {day.dayNumber}
                </div>
              ) : (
                <span
                  className={`calendar-day-number ${
                    !day.isCurrentMonth ? "calendar-other-month" : ""
                  }`}
                >
                  {day.dayNumber}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
