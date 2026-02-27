/**
 * Name: Calendar object component, split to run on client
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */

"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventSourceInput } from "fullcalendar/index.js";

interface CalendarObjectProps {
    events: EventSourceInput
}

export default function CalendarObject(props: CalendarObjectProps) {

    const calendarHeightFraction = 1.0;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [heightPx, setHeightPx] = useState<number | 'auto'>('auto');

    // small screen check (treat <=768px as mobile/small)
    const isSmallScreen = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

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
        <div ref={wrapperRef} className="flex-1 min-h-0">
            <FullCalendar
                plugins={[ timeGridPlugin ]}
                // ternary operator resolve the display mode based on screensize
                initialView={isSmallScreen ? "timeGridDay" : "timeGridWeek"}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'today'
                }}
                height={heightPx === 'auto' ? 'auto' : heightPx}
                titleFormat={{
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                }}
                events={props.events}
            />
        </div>
    );
}