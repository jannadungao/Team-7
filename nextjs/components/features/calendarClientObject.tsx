/**
 * Name: Calendar object component, split to run on client
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */

"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { EventSourceInput } from "@fullcalendar/react";
import themePlugin from '@fullcalendar/react/themes/monarch'
import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'
import { ServerDarkmode } from "@/utils/darkmodeEnum";
import isDarkmodeClient from "@/utils/isDarkmodeClient";
import multiMonthPlugin from '@fullcalendar/react/multimonth'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import listPlugin from '@fullcalendar/react/list'

interface CalendarObjectProps {
    events: EventSourceInput
    serverDarkmode: ServerDarkmode
}

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

    return (
        <div ref={wrapperRef} className="flex-1 min-h-0" suppressHydrationWarning>
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