/**
 * Name: Calendar object component, split to run on client
 * Author(s): Addison Bartelli, Elizabeth
 * Date: 02/14/26
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { EventSourceInput } from "@fullcalendar/react";
//import { EventInput } from "@fullcalendar/core"; 
import { Event } from "@/app/types"; 
import themePlugin from '@fullcalendar/react/themes/monarch'
import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'
import { ServerDarkmode } from "@/utils/darkmodeEnum";
import isDarkmodeClient from "@/utils/isDarkmodeClient";
import multiMonthPlugin from '@fullcalendar/react/multimonth'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import listPlugin from '@fullcalendar/react/list'
import AddTaskModal from "./addTaskModal";
import TaskListModal from "./taskListModal";
interface CalendarObjectProps {
    events: EventSourceInput
    userId: string; 
    accessToken: string; 
    scheduledTaskEvents: Event[]; 
    serverDarkmode: ServerDarkmode
}

type CalendarEventInput = {
    id?: string;
    title?: string;
    start?: string | Date;
    end?: string | Date | null;
    allDay?: boolean;
};

export default function CalendarObject(props: CalendarObjectProps) {

    const calendarHeightFraction = 1.0;
    let serverDarkmodeString: string | undefined;
    switch (props.serverDarkmode) {
        case ServerDarkmode.Light:
            serverDarkmodeString = "light";
            break;
        case ServerDarkmode.Dark:
            serverDarkmodeString = "dark";
            break;
        case ServerDarkmode.Unset:
            serverDarkmodeString = undefined;
            break;
    }

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [heightPx, setHeightPx] = useState<number | 'auto'>('auto');
    const [colorScheme, setColorScheme] = useState<string | undefined>(
        serverDarkmodeString || isDarkmodeClient() ? "dark" : "light"
    );

    // small screen check (treat <=768px as mobile/small)
    const isSmallScreen = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

    // determine plugins for calendar
    const plugins = [ timeGridPlugin, themePlugin, multiMonthPlugin, listPlugin ];
    if (isSmallScreen) plugins.push(dayGridPlugin);

    // Determine height in pixels using ECMAnative ResizeObserver, runs once after component HTML loads, signified by empty array dependencies argument.
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const update = () => {
            const h = el.clientHeight;
            setHeightPx(h ? Math.round(h * calendarHeightFraction) : 'auto');
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Elizabeth
    const pushEventToGoogleCalendar = async (event: Event) => {
        try {
            const response = await fetch("/api/calendar", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify({
                    title: event.name, 
                    start: event.start_time,
                    end: event.end_time
                })
            })
            const data = await response.json(); // holds the response from Google Calendar API in json format (either the created event or an error message)
            if (!response.ok) {
                console.error("Failed to create event on Google Calendar:", data.error);
            } else {
                console.log("Successfully created event on Google Calendar:", data);
            }
        } catch (error) {
            console.error("Error pushing event to Google Calendar:", error);
        }
    };

    const eventsArray = props.scheduledTaskEvents as CalendarEventInput[]; // cast events to EventInput[] type (the type expected by FullCalendar)
    useEffect(() => {
        eventsArray.forEach(e => {
            pushEventToGoogleCalendar({
                user_id: props.userId,
                event_id: e.id as string,
                name: e.title as string,
                start_time: e.start as string,
                end_time: e.end as string
            })
        });
    }, [props.scheduledTaskEvents]); // runs whenever the events prop changes (i.e. when new events are fetched from Google Calendar or when a new task is scheduled and converted to an event)

    return (
        <div ref={wrapperRef} className="flex-1 min-h-0" suppressHydrationWarning>
            <div className="flex">
                <AddTaskModal />
                <TaskListModal />
            </div>
            <Calendar
                plugins={plugins}
                // ternary operator resolve the display mode based on screensize
                initialView={isSmallScreen ? "timeGridDay" : "timeGridWeek"}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    end: isSmallScreen ? 'timeGridDay,timeGridWeek,dayGridMonth' : 'timeGridWeek,dayGridMonth',
                }}
                height={heightPx === 'auto' ? 'auto' : heightPx}
                titleFormat={{
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                }}
                events={props.events}
                colorScheme={colorScheme}
                slotDuration={"01:00:00"}
                expandRows={true}
                
            />
        </div>
    );
}