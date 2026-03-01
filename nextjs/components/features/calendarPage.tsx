/**
 * Name: Calendar page component
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */

import { EventSourceInput } from "fullcalendar/index.js";
import CalendarObject from "./calendarClientObject";

interface CalendarPageProps {
    events: EventSourceInput;
}

export default async function CalendarPage(props: CalendarPageProps) {

    const tempEvents = props.events; 
    return (
        <div id="calendarTopContainer" className="grow flex flex-col min-h-0 m-4">
            <CalendarObject events={tempEvents} />
            {/* <h1 className="text-2xl">temp textbox to demonstrate the calendar is growing to fill space in flexbox.</h1> */}
        </div>
    );
}