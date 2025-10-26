import { ChevronLeft, ChevronRight, Search, HelpCircle, Settings, Calendar as CalendarIcon, CheckSquare, Grid3x3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  onViewChange: (view: "month" | "week" | "day") => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onSearchClick: () => void;
}

const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onSearchClick,
}: CalendarHeaderProps) => {
  const formatTitle = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (view === "week") {
      // Calculate week start and end dates
      const weekStart = new Date(currentDate);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day;
      weekStart.setDate(diff);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Format for week view: "Oct – Nov 2025" or "Oct 2025"
      const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
      const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
      const year = weekEnd.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${year}`;
      } else {
        return `${startMonth} – ${endMonth} ${year}`;
      }
    } else {
      // Day view: "October 26, 2025"
      return currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
  };

  const viewLabel = view === "day" ? "Day" : view === "week" ? "Week" : "Month";

  return (
    <TooltipProvider delayDuration={300}>
      <header className="flex items-center justify-between px-4 py-3 border-b border-calendar-border bg-background">
        <div className="flex items-center gap-4">
        <Button
          onClick={onToday}
          variant="outline"
          className="h-10 px-5 rounded-full border border-calendar-border hover:bg-calendar-hover font-medium text-sm"
        >
          Today
        </Button>
        
        <div className="flex items-center gap-0">
          <Button
            onClick={onPrevious}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-calendar-hover"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={onNext}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-calendar-hover"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <h1 className="text-xl font-normal text-foreground">
          {formatTitle()}
        </h1>
      </div>
      
        <div className="flex items-center gap-2">
          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full hover:bg-calendar-hover"
                onClick={onSearchClick}
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-calendar-hover">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-calendar-hover">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
          
          {/* View Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 px-4 rounded-full border border-calendar-border hover:bg-calendar-hover font-medium text-sm gap-2"
              >
                {viewLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white shadow-lg border border-calendar-border rounded-lg p-0 z-50">
              <DropdownMenuItem 
                className="px-4 py-2 cursor-pointer hover:bg-calendar-hover text-sm rounded-t-lg"
                onClick={() => onViewChange("day")}
              >
                Day
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="px-4 py-2 cursor-pointer hover:bg-calendar-hover text-sm"
                onClick={() => onViewChange("week")}
              >
                Week
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="px-4 py-2 cursor-pointer hover:bg-calendar-hover text-sm rounded-b-lg"
                onClick={() => onViewChange("month")}
              >
                Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Calendar view icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-calendar-hover border border-calendar-border bg-background">
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show side panel</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Tasks icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-calendar-hover border border-calendar-border bg-background">
                <CheckSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tasks</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Grid menu */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-calendar-hover">
                <Grid3x3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Google apps</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Profile picture */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
                S
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Google Account</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default CalendarHeader;
