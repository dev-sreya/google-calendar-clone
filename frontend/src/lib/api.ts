import { Event, EventCreate, EventUpdate } from "@/types/event";

const API_BASE_URL = "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new ApiError(response.status, error.detail || "An error occurred");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const eventApi = {
  // Get all events, optionally filtered by date range
  getEvents: async (startDate?: Date, endDate?: Date): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (startDate) {
      params.append("start_date", startDate.toISOString());
    }
    if (endDate) {
      params.append("end_date", endDate.toISOString());
    }

    const url = `${API_BASE_URL}/api/events${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    return handleResponse<Event[]>(response);
  },

  // Get a specific event by ID
  getEvent: async (id: number): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
    return handleResponse<Event>(response);
  },

  // Create a new event
  createEvent: async (event: EventCreate): Promise<Event> => {
    console.log("Creating event:", event);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      console.log("Response status:", response.status);
      const result = await handleResponse<Event>(response);
      console.log("Event created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id: number, event: EventUpdate): Promise<Event> => {
    console.log("Updating event:", id, event);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      console.log("Update response status:", response.status);
      const result = await handleResponse<Event>(response);
      console.log("Event updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },
};

export { ApiError };
