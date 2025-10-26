import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

interface MiniCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onDateClick?: (date: Date) => void;
}

const MiniCalendar = ({ currentDate, onDateSelect, onDateClick }: MiniCalendarProps) => {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthLastDate = prevMonthLastDay.getDate();
    
    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];
    
    const selectedDate = new Date(currentDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i);
      days.push({
        date,
        dayNumber: prevMonthLastDate - i,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: date.getTime() === selectedDate.getTime(),
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
        isSelected: date.getTime() === selectedDate.getTime(),
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: date.getTime() === selectedDate.getTime(),
      });
    }
    
    return days;
  }, [displayDate, currentDate, today]);

  const monthYear = displayDate.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  return (
    <div className="bg-background">
      {/* Month/Year header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{monthYear}</span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded hover:bg-calendar-hover"
            onClick={() => {
              const newDate = new Date(displayDate);
              newDate.setMonth(displayDate.getMonth() - 1);
              setDisplayDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded hover:bg-calendar-hover"
            onClick={() => {
              const newDate = new Date(displayDate);
              newDate.setMonth(displayDate.getMonth() + 1);
              setDisplayDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-calendar-gray py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => {
              if (onDateClick) {
                onDateClick(day.date);
              } else {
                onDateSelect(day.date);
              }
            }}
            className={`
              text-center text-xs py-1 hover:bg-calendar-hover rounded transition-colors
              ${!day.isCurrentMonth ? "text-calendar-gray" : "text-foreground"}
              ${day.isToday ? "bg-google-blue text-white hover:bg-google-blue-hover rounded-full font-semibold" : ""}
              ${day.isSelected && !day.isToday ? "bg-calendar-light-gray rounded-full" : ""}
            `}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
