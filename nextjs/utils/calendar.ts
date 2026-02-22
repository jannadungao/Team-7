import { GoogleCalendarEvent, Event } from "../app/types";

export function convertGoogleCalendarEventToEvent(user_id: string, event: GoogleCalendarEvent ): Event {
    const start = event.start.dateTime ?? event.start.date;
    const end = event.end.dateTime ?? event.end.date;

    if (!start || !end) {
        throw new Error(`Event ${event.id} is missing start or end time`);
    }
    return {
        user_id: user_id,
        event_id: event.id,
        name: event.summary,
        start_time: start,
        end_time: end
    }
}