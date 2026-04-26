import { GoogleCalendar, GoogleCalendarEvent } from "@/app/types"
import { analytics } from "googleapis/build/src/apis/analytics"

/** Returns number of ms taken on average for tasks in the category if good. If the response to the query is not a number, undefined. else, throws errors that callers should handle. */
export default async function getAvgForCategory(categoryName: string) {
    try {
        const url = `/api/categories/avg?category=${encodeURIComponent(categoryName)}`
        const res = await fetch(url)

        if (!res.ok) {
            // Try to read body for more detailed error info
            const body = await res.text().catch(() => '')
            throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`)
        }

        const data = await res.json()

        if (Number.isInteger(data.categoryAverageMs)) {
            return data.categoryAverageMs as number;
        }
        else {
            return undefined;
        }
    }
    catch (e: unknown) {
        // Log full error object for debugging
        console.error('Error in getAvgForCategory:', e)

        // Extract a safe message to show to the user
        const message = e instanceof Error ? e.message : String(e)
        alert(`Error occurred: ${message}`)

        // Re-throw so callers can handle the error as well
        throw e
    }
}

export async function getCalendarJson(optionalCalendarID?: string) {
    const url = `/api/calendar${optionalCalendarID === undefined ? "" : `?=${encodeURIComponent(optionalCalendarID)}`}`;
    const res = await fetch(url);

     if (!res.ok) {
        // Try to read body for more detailed error info
        const body = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`)
    }

    const data = await res.json();

    if (optionalCalendarID !== undefined) {
        const items = Array.isArray(data?.items) ? data.items : [];
        const events: GoogleCalendarEvent[] = items.map((item: any) => {
            const {
                id,
                summary = '',
                start = { date: null, dateTime: null },
                end = { date: null, dateTime: null },
                recurrence = null,
                originalStartTime = null,
            } = item || {};

            return {
                id: String(id ?? ''),
                summary: String(summary ?? ''),
                start,
                end,
                recurrence,
                originalStartTime,
            } as GoogleCalendarEvent;
        });

        return events;
    }

    else {
        const items = Array.isArray(data?.items) ? data.items : [];
        const calendars: GoogleCalendar[] = items.map((c: any) => {
            const {
                id,
                summary
            } = c || {};

            return {
                id: String(id ?? ""),
                summary: String(summary ?? "")
            } as GoogleCalendar;
        });

        return calendars;
    }
}