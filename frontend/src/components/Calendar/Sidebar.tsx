import { Menu, Plus, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import MiniCalendar from "./MiniCalendar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onCreateEvent: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onDateClick?: (date: Date) => void;
}

const Sidebar = ({ currentDate, onDateSelect, onCreateEvent, isCollapsed, onToggleCollapse, onDateClick }: SidebarProps) => {
  const [myCalendarsExpanded, setMyCalendarsExpanded] = useState(true);
  const [otherCalendarsExpanded, setOtherCalendarsExpanded] = useState(true);

  if (isCollapsed) {
    return (
      <aside className="w-16 border-r border-calendar-border bg-background flex flex-col h-full items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full hover:bg-calendar-hover mb-4"
          onClick={onToggleCollapse}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full shadow-md hover:shadow-xl transition-all bg-white hover:bg-gray-50"
          onClick={onCreateEvent}
        >
          <Plus className="h-5 w-5 text-[#5f6368]" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-calendar-border bg-background flex flex-col h-full">
      {/* Logo and Menu - Fixed at top */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-calendar-border">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full hover:bg-calendar-hover"
          onClick={onToggleCollapse}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-calendar-border shadow-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#1a73e8" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              <text x="12" y="16" textAnchor="middle" fill="#ea4335" fontSize="8" fontWeight="bold">26</text>
            </svg>
            
          </div>
          <span className="text-xl font-normal text-foreground">Calendar</span>
        </div>
      </div>

      {/* Create Button - Fixed below header */}
      <div className="px-3 py-4 border-b border-calendar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-auto justify-between gap-3 h-12 rounded-full shadow-md hover:shadow-xl transition-all bg-white hover:bg-gray-50 text-foreground border-0 pl-5 pr-5"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-[#5f6368]" />
                <span className="text-sm font-medium text-[#3c4043]">Create</span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#5f6368]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 bg-white shadow-lg border border-calendar-border rounded-lg p-0 z-50"
          >
            <DropdownMenuItem
              className="px-4 py-3 cursor-pointer hover:bg-calendar-hover text-sm rounded-t-lg"
              onClick={onCreateEvent}
            >
              Event
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-calendar-hover text-sm">
              Task
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-calendar-hover text-sm rounded-b-lg">
              Appointment schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          {/* Mini Calendar */}
          <div className="mb-4">
            <MiniCalendar 
              currentDate={currentDate} 
              onDateSelect={onDateSelect}
              onDateClick={onDateClick}
            />
          </div>

          {/* Search for people - Now an input box */}
          <div className="mb-4">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for people"
                className="pl-9 h-10 text-sm bg-background border-calendar-border shadow-sm"
              />
            </div>
          </div>

          {/* Booking pages */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Booking pages</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded hover:bg-calendar-hover">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* My calendars */}
          <div className="mb-2">
            <Button
              variant="ghost"
              className="w-full justify-between px-0 hover:bg-transparent text-sm font-medium h-8"
              onClick={() => setMyCalendarsExpanded(!myCalendarsExpanded)}
            >
              <span>My calendars</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${myCalendarsExpanded ? "" : "-rotate-90"}`} />
            </Button>
          </div>

          {myCalendarsExpanded && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox id="calendar1" defaultChecked className="data-[state=checked]:bg-[#7986cb] border-[#7986cb]" />
                <label htmlFor="calendar1" className="text-sm cursor-pointer text-foreground">Sreya Karmakar</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="calendar2" defaultChecked className="data-[state=checked]:bg-[#0b8043] border-[#0b8043]" />
                <label htmlFor="calendar2" className="text-sm cursor-pointer text-foreground">Birthdays</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="calendar3" defaultChecked className="data-[state=checked]:bg-[#039be5] border-[#039be5]" />
                <label htmlFor="calendar3" className="text-sm cursor-pointer text-foreground">Goal: AI/ML/DL Basics</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="calendar4" defaultChecked className="data-[state=checked]:bg-[#3f51b5] border-[#3f51b5]" />
                <label htmlFor="calendar4" className="text-sm cursor-pointer text-foreground">Tasks</label>
              </div>
            </div>
          )}

          {/* Other calendars */}
          <div className="mb-2">
            <Button
              variant="ghost"
              className="w-full justify-between px-0 hover:bg-transparent text-sm font-medium h-8"
              onClick={() => setOtherCalendarsExpanded(!otherCalendarsExpanded)}
            >
              <span>Other calendars</span>
              <div className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <ChevronDown className={`h-4 w-4 transition-transform ${otherCalendarsExpanded ? "" : "-rotate-90"}`} />
              </div>
            </Button>
          </div>

          {otherCalendarsExpanded && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox id="calendar5" defaultChecked className="data-[state=checked]:bg-[#9c27b0] border-[#9c27b0]" />
                <label htmlFor="calendar5" className="text-sm cursor-pointer text-foreground">Code with Himanshu 1</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="calendar6" defaultChecked className="data-[state=checked]:bg-[#0b8043] border-[#0b8043]" />
                <label htmlFor="calendar6" className="text-sm cursor-pointer text-foreground">Holidays in India</label>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Terms and Privacy - Fixed at bottom */}
      <div className="px-3 py-3 text-xs text-muted-foreground border-t border-calendar-border flex-shrink-0">
        <a href="#" className="hover:underline">Terms</a>
        {" – "}
        <a href="#" className="hover:underline">Privacy</a>
      </div>
    </aside>
  );
};

export default Sidebar;
