import { Event } from "@/app/types"

export function eventToFullCalEvent(event: Event) {
    return {
        id: event.event_id,
        title: event.name,
        start: event.start_time,
        end: event.end_time,
    }
}