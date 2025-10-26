import { Event } from "@/types/event";
import { X, Edit, Trash2, Mail, MoreVertical, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventQuickViewProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  position?: { top: number; left: number };
}

const EventQuickView = ({ event, isOpen, onClose, onEdit, onDelete, position }: EventQuickViewProps) => {
  if (!isOpen) return null;

  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dayName = start.toLocaleDateString("en-US", { weekday: "long" });
    const month = start.toLocaleDateString("en-US", { month: "long" });
    const day = start.getDate();

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    return `${dayName}, ${month} ${day}⋅${startTimeStr} – ${endTimeStr}`;
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(event);
    // Don't close here - parent will handle it
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 z-40" onClick={onClose}></div>

      {/* Quick View Popup */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl w-[380px] animate-scale-in"
        style={{
          top: position ? `${position.top}px` : "50%",
          left: position ? `${position.left}px` : "50%",
          transform: position ? "none" : "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with action buttons */}
        <div className="flex items-center justify-end px-4 py-3 border-b border-gray-200 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
            onClick={handleEdit}
            title="Edit event"
          >
            <Edit className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
            onClick={handleDelete}
            title="Delete event"
          >
            <Trash2 className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
            title="Send email"
          >
            <Mail className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
            title="More options"
          >
            <MoreVertical className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-gray-700" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Event Title */}
          <h2 className="text-2xl font-normal text-gray-900">{event.title}</h2>

          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-800">
              {formatDateTime(event.start_time, event.end_time)}
            </div>
          </div>

          {/* Description (if available) */}
          {event.description && (
            <div className="text-sm text-gray-700 pl-8">
              {event.description}
            </div>
          )}

          {/* Notification */}
          <div className="flex items-center gap-3 pl-8 text-sm text-gray-600">
            <span>30 minutes before</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-800">Sreya Karmakar</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventQuickView;
