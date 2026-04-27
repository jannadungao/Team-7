import { Temporal } from '@js-temporal/polyfill';
import { rrulestr } from 'rrule';
import type { calendar_v3 } from 'googleapis';
import { GoogleCalendarEvent } from '@/app/types';

// TODO: Get this working with Event type from types.ts (which is what GoogleCalendarEvent and FlexibleTask will be converted to) instead of the Event class defined here. Will likely need to change the Event class to an interface and update the parseCalendar function accordingly.
class CalItem {
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

function parseCalendar(calendar: calendar_v3.Schema$Events, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate)
: {date : Temporal.PlainDate; events : CalItem[]}[] {
    // Sort calendar events into a 2D array where each subarray corresponds to a day and contains the events for that day
    const tempCalendar : {date : Temporal.PlainDate; events : CalItem[]}[] = [];
    if (calendar.items == undefined) {
        return tempCalendar;
    }
    // Iterate through each day in the date range
    for (let currentDate = startDate; Temporal.PlainDate.compare(currentDate, endDate) <= 0; currentDate = currentDate.add({ days: 1 })) {
        // Add a new subarray for the current day
        const tempEvents : CalItem[] = [];
        calendar.items.forEach((item) => {
            if (item.start?.dateTime == undefined || item.end?.dateTime == undefined) return;
            const eventStartDate = Temporal.PlainDate.from(item.start.dateTime);
            if (Temporal.PlainDate.compare(eventStartDate, currentDate) == 0) {
                const eventStartTime = Temporal.PlainTime.from(item.start.dateTime);
                const eventEndTime = Temporal.PlainTime.from(item.end.dateTime);
                if (item.summary != undefined) {
                    tempEvents.push(new CalItem(item.summary, currentDate, eventStartTime, eventEndTime));
                } else {
                    tempEvents.push(new CalItem('', currentDate, eventStartTime, eventEndTime));
                }
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
                                if (item.summary != undefined) {
                                    tempEvents.push(new CalItem(item.summary, currentDate, eventStartTime, eventEndTime));
                                } else {
                                    tempEvents.push(new CalItem('', currentDate, eventStartTime, eventEndTime));
                                }
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
function findEventGaps(calendar: calendar_v3.Schema$Events, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number)
: { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] {
    const calendarEvents = parseCalendar(calendar, startDate, endDate);
    const eventGaps: { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] = [];
    for (const day of calendarEvents) {
        const dayGaps: { start: Temporal.PlainTime; end: Temporal.PlainTime }[] = [];
        const events = day.events;

        if (events.length === 0) {
            // Entire time window is free
            if (startTime.until(endTime).total('minutes') >= newEventLength) {
                dayGaps.push({ start: startTime, end: endTime });
            }
        } else {
            // Gap before the first event
            if (Temporal.PlainTime.compare(startTime, events[0].start) < 0 &&
                startTime.until(events[0].start).total('minutes') >= newEventLength) {
                dayGaps.push({ start: startTime, end: events[0].start });
            }
            // Gaps between each consecutive pair of events
            for (let i = 0; i < events.length - 1; i++) {
                if (Temporal.PlainTime.compare(events[i].end, events[i + 1].start) < 0 &&
                    events[i].end.until(events[i + 1].start).total('minutes') >= newEventLength) {
                    dayGaps.push({ start: events[i].end, end: events[i + 1].start });
                }
            }
            // Gap after the last event
            const last = events[events.length - 1];
            if (Temporal.PlainTime.compare(last.end, endTime) < 0 &&
                last.end.until(endTime).total('minutes') >= newEventLength) {
                dayGaps.push({ start: last.end, end: endTime });
            }
        }

        if (dayGaps.length > 0) {
            eventGaps.push({ date: day.date, gaps: dayGaps });
        }
    }
    return eventGaps;
}

/**
 * Using outputs of parseCalendar and findEventGaps, returns 3 optimal event gaps for users to choose from, chosen by which days have the fewest already-scheduled events.
 * If there are three or fewer total gaps found during which an event can be scheduled, returns all of them.
 */
export function findOptimalEventGaps(calendar: calendar_v3.Schema$Events, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number): GoogleCalendarEvent[] {
    const calendarEvents = parseCalendar(calendar, startDate, endDate);
    const eventGaps : { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] = findEventGaps(calendar, startDate, endDate, startTime, endTime, newEventLength);
    const optimalEventGaps : GoogleCalendarEvent[] = [];

    // Flatten all gaps with their dates
    const allGaps = eventGaps.flatMap(day => day.gaps.map(gap => ({ date: day.date, start: gap.start, end: gap.end })));

    if (allGaps.length <= 3) {
        // Append each gap, adjusting end time if necessary
        for (const gap of allGaps) {
            const duration = gap.start.until(gap.end).total('minutes');
            if (duration > newEventLength) {
                gap.end = gap.start.add({ minutes: newEventLength });
            }
            const newEvent: GoogleCalendarEvent = {
                id: '0',
                summary: 'New event',
                start: {date: gap.start.toString()},
                end: {date: gap.end.toString()},
                recurrence: null,
                originalStartTime: gap.date.toString()
            }
            optimalEventGaps.push(newEvent);
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
            const newEvent: GoogleCalendarEvent = {
                id: '0',
                summary: 'New event',
                start: {date: gap.start.toString()},
                end: {date: gap.end.toString()},
                recurrence: null,
                originalStartTime: gap.date.toString()
            }
            optimalEventGaps.push(newEvent);
        }
    }

    return optimalEventGaps;
}