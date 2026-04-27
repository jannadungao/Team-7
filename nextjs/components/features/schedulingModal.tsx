/**
 * Name: Scheduling modal component
 * Description:
 *  Modal for the scheduling. Reuses some code from addTaskModal.tsx for style purposes.
 *  Parts have been moved from the original taskList.tsx file, which was created by Janna Dungao.
 * Sources:
 * Author(s): Anya Combs, Janna Dungao
 * Date: 03/29/2025
 */

import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ResponsiveDateRangePicker, ResponsiveTimeRangePicker } from "./scheduleRangePickers";
import { useState } from "react";

export default function SchedulingModal({buttonStyles, forcedCategory} : {
    buttonStyles?: string
    forcedCategory?: {id: string, name: string}
}
) {
    const [open, setOpen] = useState(false);
    const [formHidden, swapViews] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    // For user inputted date range
    const handleDateChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    // For user inputted time range
    const handleStartTimeChange = (time: Date | null) => {
        setStartTime(time);
    };
    const handleEndTimeChange = (time: Date | null) => {
        setEndTime(time);
    };

    // Handles the scheduling.
    const handleSchedule = () => {
        console.log("In scheduling function.");

        // Validate that end time is after start time
        if (startTime && endTime && endTime <= startTime) {
            alert("End time must be after start time");
            return;
        }

        // Data for scheduling alg
        const scheduleData = {
            dateRange: {
                startDate: startDate,
                endDate: endDate,
            },
            timeRange: {
                startTime: startTime,
                endTime: endTime,
            },
        };

        swapViews(true);

        console.log("Start Date: ", startDate, ", End Date: ", endDate, ", StartTime: ", startTime, ", End Time: ", endTime);
    }    

    return (
        <div className="">
            <button
                onClick={() => setOpen(true)}
                className={buttonStyles || "flex p-2 rounded-md bg-white/10 text-sm text-white inset-ring inset-ring-white/5 hover:bg-white/20 cursor-pointer"}>
            </button>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="flex justify-center fixed inset-0">
                    <div className="flex justify-center w-sm p-4 text-center items-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                                {/* dialog title / close button */}
                                <DialogTitle
                                    className="flex flex-row justify-between items-center p-4">
                                        <span>Schedule Task</span>
                                        <button type="button" onClick={() => setOpen(false)} className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                </DialogTitle>
                                <div
                                    id="dialogContent"
                                    className="p-4 w-full">
                                        <span>You're now scheduling for {forcedCategory?.name}!</span>
                                        { !formHidden ? (
                                        <form
                                            id="scheduleForm">
                                            <div>
                                                {/* Scheduling Range Pickers */}
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
                                            {/* Schedule task button. Switches the content of the dialog. */}
                                            <button 
                                                onClick={() => handleSchedule()} 
                                                className="mt-8 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto cursor-pointer">
                                                Schedule Task
                                            </button>
                                        </form>
                                        ) : (
                                            /* Schedule options. */
                                            <div id="scheduleOptions"
                                                className="p-3">
                                                <div className="flex w-full justify-around items-stretch gap-4 p-2 py-8">
                                                    { /* Scheduling options will be put in here. */ }
                                                    <ScheduleOption />
                                                    <ScheduleOption />
                                                    <ScheduleOption />
                                                </div>
                                                <button 
                                                    onClick={() => swapViews(false)} 
                                                    className="mt-8 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto cursor-pointer">
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
    )
}

function ScheduleOption() {

    // Export to GCAL on submission.
    
    return (
        <button
            className="outset cursor-pointer flex-1 bg-red-400 rounded-2xl overflow-hidden p-2">
                placeholdername
        </button>
    )
}