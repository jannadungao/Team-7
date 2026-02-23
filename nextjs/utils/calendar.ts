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

// Need to export to GCAL from mock calendar event.
// Takes an in-app calendar event and converts it to GCAL format.
// Still need a lot of work on this.
// Unsure if we have task objects yet, but it should be fetched by Hunter's algorithm and used here.
// Hunter's algorithm should have both the task name and the Event object.
export function convertAppEventToGCALEvent(event: Event): GoogleCalendarEvent {
    // TODO: Fetch calendar ID, fetch date.
    const calId = event.user_id; // This is the UUID, which is the same in the GCAL type..
    const appStart = event.start_time; // should be dateTime
    const appEnd = event.end_time; // should be dateTime

    // TODO: Add check for malformed GCAL event.
    return {
        id: calId, // won't be used in this current implementation as it's not getting sent to gcal yet
        summary: "placeholder", // change this later; should be taskName
        start: {
            dateTime: appStart
        },
        end: {
            dateTime: appEnd
        },
        recurrence: undefined,
        originalStartTime: undefined
    };
}