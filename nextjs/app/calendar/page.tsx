/**
 * Name: Add calendar page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */
import CalendarPage from "@/components/features/calendarPage"

// Added mock events for now (by Elizabeth)
import { GoogleCalendarEvent } from "../types";
import { convertGoogleCalendarEventToEvent } from "../../utils/calendar";
const mockGoogleCalendarEvents: GoogleCalendarEvent[] = [
  {
    id: "1",
    summary: "Meeting with team",
    start: { dateTime: "2026-02-25T10:00:00Z" },
    end: { dateTime: "2026-02-25T11:30:00Z" }
  },
  {
    id: "2",
    summary: "Lunch with client",
    start: { dateTime: "2026-02-14T13:00:00Z" },
    end: { dateTime: "2026-02-14T14:30:00Z" }
  }
];

const user_id = "123"; // mock user_id for testing
const mockEvents = mockGoogleCalendarEvents.map(event => 
    convertGoogleCalendarEventToEvent(user_id, event)
);

// convert mockEvents to fullcalendar format for UI
const fullCalendarEvents = mockEvents.map(event => ({
    id: event.event_id,
    title: event.name,
    start: event.start_time,
    end: event.end_time
}));

export default async function Page() {
    return (
        <CalendarPage events={fullCalendarEvents} />
    )
}