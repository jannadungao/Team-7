/**
 * Name: Calendar object component, split to run on client
 * Author(s): Addison Bartelli, Elizabeth
 * Date: 02/14/26
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, EventClickData } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { EventSourceInput } from "@fullcalendar/react";
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
import { eventToFullCalEvent } from "@/utils/eventConversions";
import EventDetailModal from "./eventDetailModal";
import { useRouter } from "next/navigation";
import MyStopwatch from "./timer";
import { XMarkIcon } from "@heroicons/react/24/outline";
interface CalendarObjectProps {
    events: EventSourceInput
    userId: string; 
    accessToken: string; 
    scheduledTaskEvents: Event[]; 
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

const [selectedEvent, setSelectedEvent] = useState<any>(null);
const [showEventModal, setShowEventModal] = useState(false);
const [showTimer, setShowTimer] = useState(false);
const [timerTask, setTimerTask] = useState<any>(null);
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

    const eventsArray = props.scheduledTaskEvents;
    useEffect(() => {
        eventsArray.forEach(e => pushEventToGoogleCalendar(e));
    }, [props.scheduledTaskEvents]); // runs whenever the events prop changes (i.e. when new events are fetched from Google Calendar or when a new task is scheduled and converted to an event)

    // handles when user clicks on a specific event on the calendar
    const handleEventClick = async (clickInfo: EventClickData) => {
        setSelectedEvent(clickInfo);
        setShowEventModal(true);
    }

    // handles when the user clicks on an event and clicks on Time
    const handleGoToTimer = () => {
        if (selectedEvent) {
            // convert fullcal data to timer input
            const taskData = {
                task_id: selectedEvent.event.id,
                category: selectedEvent.event.title, // Use title as category/name
                taskName: selectedEvent.event.title,
            };
            setTimerTask(taskData);
            setShowEventModal(false);
            setShowTimer(true);
        }
    };

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
                eventClick={handleEventClick}
            />
            {/* Event modal - shows name and start and end times */}
            {showEventModal && (
                <EventDetailModal
                    event={selectedEvent}
                    isOpen={showEventModal}
                    onClose={() => {
                        setShowEventModal(false);
                        setSelectedEvent(null);
                    }}
                    onGoToTimer={handleGoToTimer}
                />
            )}
            {/* Goes to timer for selected task */}
            {showTimer && timerTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
                    <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto outline outline-offset-1 outline-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Timer for: {timerTask.category}</h2>
                            {/* Button to close timer */}
                            <button
                                onClick={() => {
                                    setShowTimer(false);
                                    setTimerTask(null);
                                }}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="size-6" />
                            </button>
                        </div>
                        {/* imported timer */}
                        <MyStopwatch selectedTask={timerTask} />
                        {/* close timer modal */}
                        <button
                            onClick={() => setShowTimer(false)}
                            className="w-full mt-6 bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-2xl font-medium transition-colors"
                        >
                            Close Timer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}