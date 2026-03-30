import { Temporal } from '@js-temporal/polyfill';
import { rrulestr } from 'rrule';

/**
 * TODO: Get this working with Event type from types.ts (which is what GoogleCalendarEvent and FlexibleTask will be converted to) instead of the Event class defined here. Will likely need to change the Event class to an interface and update the parseCalendar function accordingly.
 */
class Event {
    public name: string;
    public date: Temporal.PlainDate;
    public start: Temporal.PlainTime;
    public end: Temporal.PlainTime;
    public constructor(name: string, date: Temporal.PlainDate, start: Temporal.PlainTime, end: Temporal.PlainTime) {
        this.name = name;
        this.date = date;
        this.start = start;
        this.end = end;
    }
}

interface CalendarJson {
    kind: string;
    etag: string;
    summary: string;
    description: string;
    updated: string;
    timeZone: string;
    accessRole: string;
    items: {
        kind: string;
        etag: string;
        id: string;
        status: string;
        htmlLink: string;
        created: string;
        updated: string;
        summary: string;
        creator: {
            email: string;
            self: boolean;
        };
        organizer: {
            email: string;
            self: boolean;
        };
        start: {
            dateTime: string;
            timeZone: string;
        };
        end: {
            dateTime: string;
            timeZone: string;
        };
        recurrence?: string[];
        iCalUID: string;
        sequence: number;
        reminders: {
            useDefault: boolean;
        };
        eventType: string;
    }[];
};

function parseCalendar(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate)
: {date : Temporal.PlainDate; events : Event[]}[] {
    // Sort calendar events into a 2D array where each subarray corresponds to a day and contains the events for that day
    const tempCalendar : {date : Temporal.PlainDate; events : Event[]}[] = [];
    // Iterate through each day in the date range
    for (let currentDate = startDate; Temporal.PlainDate.compare(currentDate, endDate) <= 0; currentDate = currentDate.add({ days: 1 })) {
        // Add a new subarray for the current day
        const tempEvents : Event[] = [];
        calendar.items.forEach((item) => {
            const eventStartDate = Temporal.PlainDate.from(item.start.dateTime);
            if (Temporal.PlainDate.compare(eventStartDate, currentDate) == 0) {
                const eventStartTime = Temporal.PlainTime.from(item.start.dateTime);
                const eventEndTime = Temporal.PlainTime.from(item.end.dateTime);
                tempEvents.push(new Event(item.summary, currentDate, eventStartTime, eventEndTime));
            } else if (item.recurrence) {
                /**
                 * Handle recurring events: check if they occur on the current date
                 */
                const eventStartTime = Temporal.PlainTime.from(item.start.dateTime);
                const eventEndTime = Temporal.PlainTime.from(item.end.dateTime);
                
                // Process each recurrence rule (items may have multiple RRULE entries)
                for (const rruleString of item.recurrence) {
                    try {
                        // Convert Temporal dates to JavaScript Date objects for rrule compatibility
                        const jsEventStartDate = new Date(
                            Temporal.PlainDate.from(item.start.dateTime).year,
                            Temporal.PlainDate.from(item.start.dateTime).month - 1,
                            Temporal.PlainDate.from(item.start.dateTime).day
                        );
                        
                        const jsRangeStart = new Date(startDate.year, startDate.month - 1, startDate.day);
                        const jsRangeEnd = new Date(endDate.year, endDate.month - 1, endDate.day);
                        const jsCurrentDate = new Date(currentDate.year, currentDate.month - 1, currentDate.day);
                        
                        // Parse the RRULE and get all occurrences in the date range
                        const rule = rrulestr(rruleString, { dtstart: jsEventStartDate });
                        const occurrences = rule.between(jsRangeStart, jsRangeEnd, true);
                        
                        // Check if any occurrence falls on the current date
                        for (const occurrence of occurrences) {
                            if (
                                occurrence.getFullYear() === jsCurrentDate.getFullYear() &&
                                occurrence.getMonth() === jsCurrentDate.getMonth() &&
                                occurrence.getDate() === jsCurrentDate.getDate()
                            ) {
                                tempEvents.push(
                                    new Event(item.summary, currentDate, eventStartTime, eventEndTime)
                                );
                                break; // Event found for this day, no need to check other occurrences
                            }
                        }
                    } catch (error) {
                        console.error(`Error parsing recurrence rule '${rruleString}':`, error);
                    }
                }
            }
        });
        tempCalendar.push({date: currentDate, events: tempEvents});
    }
    return tempCalendar;
}

/**
 * Takes in user's calendar events, earliest/latest dates/times new event can be scheduled, and length of new event
 * @returns List of dates and time gaps on each date (if any) where event can be scheduled
 */
function findEventGaps(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number)
: { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] {
    const calendarEvents = parseCalendar(calendar, startDate, endDate);
    const eventGaps: { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] = [];
    for (let day of calendarEvents) {
        const dayGaps : { start: Temporal.PlainTime; end: Temporal.PlainTime }[] = [];
        if (day.events.length == 0) {
            continue;
        }
        for (let i = 0; i < day.events.length; i++) {
            if (i > 0 && i < day.events.length - 1) {
                if (Temporal.PlainTime.compare(day.events[i-1].end, day.events[i].start) == -1 && day.events[i-1].end.until(day.events[i].start).total('minutes') >= newEventLength) {
                    dayGaps.push({ start: day.events[i-1].end, end: day.events[i].start });
                }
            } else if (i == 0) {
                if (Temporal.PlainTime.compare(startTime, day.events[i].start) == -1 && startTime.until(day.events[i].start).total('minutes') >= newEventLength) {
                    dayGaps.push({ start: startTime, end: day.events[i].start });
                }
            } else {
                if (Temporal.PlainTime.compare(day.events[i].end, endTime) == -1 && day.events[i].end.until(endTime).total('minutes') >= newEventLength) {
                    dayGaps.push({ start: day.events[i].end, end: endTime });
                }
            }
        }
        eventGaps.push({date: day.date, gaps: dayGaps});
    }
    return eventGaps;
}

/**
 * Using outputs of parseCalendar and findEventGaps, returns 3 optimal event gaps for users to choose from, chosen by which days have the fewest already-scheduled events.
 * If there are three or fewer total gaps found during which an event can be scheduled, returns all of them.
 */
function findOptimalEventGaps(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number) {
    const calendarEvents = parseCalendar(calendar, startDate, endDate);
    const eventGaps : { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] = findEventGaps(calendar, startDate, endDate, startTime, endTime, newEventLength);
    const optimalEventGaps : { date : Temporal.PlainDate; start : Temporal.PlainTime; end: Temporal.PlainTime }[] = [];

    // Flatten all gaps with their dates
    const allGaps = eventGaps.flatMap(day => day.gaps.map(gap => ({ date: day.date, start: gap.start, end: gap.end })));

    if (allGaps.length <= 3) {
        // Append each gap, adjusting end time if necessary
        for (const gap of allGaps) {
            const duration = gap.start.until(gap.end).total('minutes');
            if (duration > newEventLength) {
                gap.end = gap.start.add({ minutes: newEventLength });
            }
            optimalEventGaps.push(gap);
        }
    } else {
        // Find days with fewest events
        const dayEventCounts = calendarEvents.map(day => ({ date: day.date, count: day.events.length }));
        dayEventCounts.sort((a, b) => a.count - b.count);

        // Select up to 3 gaps from days with fewest events
        const selectedGaps: { date: Temporal.PlainDate; start: Temporal.PlainTime; end: Temporal.PlainTime }[] = [];
        for (const day of dayEventCounts) {
            const dayGaps = eventGaps.find(d => d.date.equals(day.date))?.gaps || [];
            for (const gap of dayGaps) {
                selectedGaps.push({ date: day.date, start: gap.start, end: gap.end });
                if (selectedGaps.length >= 3) break;
            }
            if (selectedGaps.length >= 3) break;
        }

        // Adjust end times and add to optimalEventGaps
        for (const gap of selectedGaps) {
            const duration = gap.start.until(gap.end).total('minutes');
            if (duration > newEventLength) {
                gap.end = gap.start.add({ minutes: newEventLength });
            }
            optimalEventGaps.push(gap);
        }
    }

    return optimalEventGaps;
}



export default function addTaskOptions() {

}