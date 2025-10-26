import { Calendar, CheckSquare, Users, ChevronLeft, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const RightSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <aside className="border-l border-calendar-border bg-background flex flex-col h-full">
        {isExpanded ? (
          <div className="w-80 flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-calendar-border">
              <h3 className="text-sm font-medium">Calendar</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <p className="text-sm text-muted-foreground">
                Select a sidebar option to view details
              </p>
            </div>
          </div>
        ) : (
          <div className="w-16 flex flex-col items-center py-2 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-calendar-hover"
                  onClick={() => setIsExpanded(true)}
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-calendar-hover"
                  onClick={() => setIsExpanded(true)}
                >
                  <CheckSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Tasks</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-calendar-hover"
                  onClick={() => setIsExpanded(true)}
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Contacts</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-calendar-hover"
                  onClick={() => setIsExpanded(true)}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Maps</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-calendar-hover"
                  onClick={() => setIsExpanded(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Get add-ons</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
};

export default RightSidebar;