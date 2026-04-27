/**
 * Name: Scheduling modal component
 * Description:
 *  Modal for the scheduling. Reuses some code from addTaskModal.tsx for style purposes.
 *  Parts have been moved from the original taskList.tsx file, which was created by Janna Dungao.
 * Sources:
 * Author(s): Anya Combs, Janna Dungao
 * Date: 03/29/2025
 */

"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ResponsiveDateRangePicker, ResponsiveTimeRangePicker } from "./scheduleRangePickers";
import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import getAvgForCategory from "@/utils/apiWrap";
import { findOptimalEventGaps } from "@/utils/addTaskOptions";
import { GoogleCalendarEvent } from "@/app/types";

export default function SchedulingModal({buttonStyles, forcedCategory} : {
    buttonStyles?: string
    forcedCategory: {id: string, name: string}
}) {
    const [open, setOpen] = useState(false);
    const [formHidden, swapViews] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [scheduledOptions, setScheduledOptions] = useState<GoogleCalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };
    const handleStartTimeChange = (time: Date | null) => setStartTime(time);
    const handleEndTimeChange = (time: Date | null) => setEndTime(time);

    const handleClose = () => {
        setOpen(false);
        swapViews(false);
        setScheduledOptions([]);
    };

    const handleSchedule = async () => {
        if (startTime && endTime && endTime <= startTime) {
            alert("End time must be after start time");
            return;
        }
        if (!startDate || !endDate || !startTime || !endTime) {
            alert("Please fill in all date and time fields");
            return;
        }

        setIsLoading(true);
        swapViews(true);

        try {
            // Fetch primary calendar events
            const calRes = await fetch("/api/calendar?calendarId=primary");
            if (!calRes.ok) throw new Error("Failed to fetch calendar events");
            const calData = await calRes.json();

            // Get avg task duration for this category; fall back to 30 mins if unavailable
            let durationMins = 30;
            try {
                const avgMs = await getAvgForCategory(forcedCategory.name);
                if (avgMs !== undefined) durationMins = Math.max(1, Math.round(avgMs / 60000));
            } catch {
                // getAvgForCategory already alerted the user; continue with default
            }

            // Convert JS Dates → Temporal types required by the scheduling algorithm
            const tStartDate = Temporal.PlainDate.from({
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                day: startDate.getDate(),
            });
            const tEndDate = Temporal.PlainDate.from({
                year: endDate.getFullYear(),
                month: endDate.getMonth() + 1,
                day: endDate.getDate(),
            });
            const tStartTime = Temporal.PlainTime.from({
                hour: startTime.getHours(),
                minute: startTime.getMinutes(),
            });
            const tEndTime = Temporal.PlainTime.from({
                hour: endTime.getHours(),
                minute: endTime.getMinutes(),
            });

            const options = findOptimalEventGaps(calData, tStartDate, tEndDate, tStartTime, tEndTime, durationMins);
            setScheduledOptions(options);
        } catch (err) {
            console.error("Scheduling failed:", err);
            setScheduledOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <button
                onClick={() => setOpen(true)}
                className={buttonStyles || "flex p-2 rounded-md bg-gray-100 text-sm text-gray-900 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"}>
                S
            </button>

            <Dialog open={open} onClose={handleClose} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="flex justify-center fixed inset-0">
                    <div className="flex justify-center w-sm p-4 text-center items-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                                {/* dialog title / close button */}
                                <DialogTitle className="flex flex-row justify-between items-center p-4">
                                    <span>Schedule Task</span>
                                    <button type="button" onClick={handleClose} className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </DialogTitle>
                                <div id="dialogContent" className="p-4 w-full">
                                    <span className="text-gray-900 dark:text-gray-100">You're now scheduling for {forcedCategory?.name}!</span>
                                    {!formHidden ? (
                                        <form id="scheduleForm">
                                            <div>
                                                <div className="flex flex-row">
                                                    <h2 className="p-2">Date Range:</h2>
                                                    <ResponsiveDateRangePicker onDateChange={handleDateChange}/>
                                                </div>
                                                <div className="flex flex-row">
                                                    <h2 className="p-2">Time Range: </h2>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <ResponsiveTimeRangePicker onTimeChange={handleStartTimeChange} selectedTime={startTime} />
                                                        </div>
                                                        <div className="flex text-2xl p-2 justify-center">-</div>
                                                        <div className="flex-1">
                                                            <ResponsiveTimeRangePicker onTimeChange={handleEndTimeChange} selectedTime={endTime} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleSchedule}
                                                className="mt-8 inline-flex w-full justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm font-semibold sm:mt-0 sm:w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                                Schedule Task
                                            </button>
                                        </form>
                                    ) : (
                                        <div id="scheduleOptions" className="p-3">
                                            {isLoading ? (
                                                <p className="text-gray-300 text-center py-8">Finding available slots...</p>
                                            ) : scheduledOptions.length === 0 ? (
                                                <p className="text-gray-400 text-center py-8">No available slots found in this range. Try a wider date or time window.</p>
                                            ) : (
                                                <div className="flex w-full justify-around items-stretch gap-4 p-2 py-8">
                                                    {scheduledOptions.map((opt, i) => (
                                                        <ScheduleOption
                                                            key={i}
                                                            option={opt}
                                                            categoryName={forcedCategory.name}
                                                            onSuccess={handleClose}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                                <button
                                                    type="button"
                                                    onClick={() => swapViews(false)}
                                                    className="mt-8 inline-flex w-full justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm font-semibold sm:mt-0 sm:w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                                    Reschedule
                                                </button>
                                        </div>
                                    )}
                                </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

function ScheduleOption({ option, categoryName, onSuccess }: {
    option: GoogleCalendarEvent;
    categoryName: string;
    onSuccess: () => void;
}) {
    const [pushed, setPushed] = useState(false);

    // The algorithm stores the date in originalStartTime and the time in start.date / end.date
    const date = option.originalStartTime ?? "";
    const startStr = option.start.date?.substring(0, 5) ?? "";
    const endStr = option.end.date?.substring(0, 5) ?? "";

    const handleSelect = async () => {
        const start = `${date}T${option.start.date}`;
        const end = `${date}T${option.end.date}`;

        try {
            const res = await fetch("/api/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: categoryName, start, end }),
            });
            if (res.ok) {
                setPushed(true);
                setTimeout(onSuccess, 800);
            } else {
                alert("Failed to add to Google Calendar");
            }
        } catch {
            alert("Error adding to calendar");
        }
    };

    return (
        <button
            type="button"
            onClick={handleSelect}
            disabled={pushed}
            className="cursor-pointer flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-2xl p-3 text-sm text-white text-center transition-colors">
            <div className="font-medium">{date}</div>
            <div className="text-gray-300">{startStr} – {endStr}</div>
            {pushed && <div className="text-green-400 mt-1">Added!</div>}
        </button>
    );
}
