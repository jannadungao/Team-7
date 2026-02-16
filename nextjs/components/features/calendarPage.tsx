/**
 * Name: Calendar page component
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */

import { EventSourceInput } from "fullcalendar/index.js";
import CalendarObject from "./calendarClientObject";

interface CalendarPageProps {
    authTokens?: unknown; //make not optional and define type once details are clear.
}

export default async function CalendarPage(props: CalendarPageProps) {

    // Temporary proof of concept event list to pass to calendar.
    // Will later need middleware to convert gcal events into this format.
    let eventId = 0;
    const tempEvents: EventSourceInput = [
        {
            id: String(eventId++),
            start: new Date(),
            title: `Test Event ${eventId}`
        }
    ] as const;

    return (
        <div id="calendarTopContainer" className="grow flex flex-col min-h-0 m-4">
            <CalendarObject events={tempEvents} />
            <h1 className="text-2xl">temp textbox to demonstrate the calendar is growing to fill space in flexbox.</h1>
        </div>
    );
}