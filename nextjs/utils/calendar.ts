import { FlexibleTask, GoogleCalendarEvent, Event } from "../app/types";

export function convertGoogleCalendarEventToEvent( user_id: string, event: GoogleCalendarEvent ): Event {
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

export function convertTaskToEvent( user_id: string, task: FlexibleTask ): Event {
    if (!task.start || !task.end) {
        throw new Error("Task has not been scheduled yet");
    }

    return {
        user_id: user_id, 
        event_id: task.task_id,
        name: task.name,
        start_time: task.start, // assuming that the FlexibleTask start property gets filled once the scheduling algorithm schedules it
        end_time: task.end // same as above
    }
}