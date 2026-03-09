/**
 * Name: Add task component
 * Description:
 * Outputs: 
 * Sources:
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

'use client';
import { useForm, Controller } from 'react-hook-form';
import CategoryDropdown from './categoryDropdown';
import { UUID } from 'crypto';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';
import { start } from 'repl';

interface FormData {
    taskName: string;
    category: string;
    deadline: string;
    estTime: number;
    driveTime: number;
    description: string;
    task_id: UUID;
    // user_id: UUID;
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


class Event {
    public name: string;
    public start: Temporal.PlainTime;
    public end: Temporal.PlainTime;
    public constructor(name: string, start: Temporal.PlainTime, end: Temporal.PlainTime) {
        this.name = name;
        this.start = start;
        this.end = end;
    }
}

export default function AddTaskPage() {
    function parseCalendar(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): Event[][] {
        // Sort calendar events into a 2D array where each subarray corresponds to a day and contains the events for that day
        const calendarEvents: Event[][] = [];
        // Iterate through each day in the date range
        for (let currentDate = startDate; Temporal.PlainDate.compare(currentDate, endDate) <= 0; currentDate = currentDate.add({ days: 1 })) {
            // Add a new subarray for the current day
            calendarEvents.push([]);
            calendar.items.forEach((item) => {
                const eventStartDate = Temporal.PlainDate.from(item.start.dateTime);
                if (Temporal.PlainDate.compare(eventStartDate, currentDate) == 0) {
                    const eventStartTime = Temporal.PlainTime.from(item.start.dateTime);
                    const eventEndTime = Temporal.PlainTime.from(item.end.dateTime);
                    calendarEvents[calendarEvents.length - 1].push(new Event(item.summary, eventStartTime, eventEndTime));
                } else if (item.recurrence) {
                    /**
                     * TODO: add functionality to detect if recurring event falls on current date
                     */
                }
            });
        }
        return calendarEvents;
    }

    function findEventGaps(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number,) {
        const calendarEvents = parseCalendar(calendar, startDate, endDate);
        for (let day of calendarEvents) {
            if (day.length == 0) {
                continue;
            }
            for (let i = 0; i < day.length; i++) {
                if (i > 0 && i < day.length - 1) {
                    
                } else if (i == 0) {

                } else {

                }
            }
        }
    }
    /*
    const week: Event[][] = [];

    function sortEvent() {
        const dayStart = new Temporal.PlainTime(0,0);
        const dayEnd = new Temporal.PlainTime(0,0);

        const windows : Temporal.PlainTime[][][] = [];

        let taskTime : number = 0;

        for (let day of week) {
            if (day.length === 0) {
                windows.push([[dayStart, dayEnd]]);
            } else {
                const dayGaps : Temporal.PlainTime[][] = [];
                let firstEventFound : boolean = false;
                for (let i : number = 0; i < day.length; i++) {
                    if (Temporal.PlainTime.compare(dayStart, day[i]) == 1) {
                        continue;
                    } else {
                        if (!firstEventFound) {
                            firstEventFound = true;
                            if (dayStart.until(day[i]).minutes >= taskTime) {
                                dayGaps.push([dayStart, day[i].start]);
                            }
                        } else {
                            if (i < day.length - 1) {
                                if (day[i].end.until(day[i+1].start).minutes >= taskTime) {
                                    dayGaps.push([day[i].end,day[i+1].start]);
                                }
                            } else {
                                if (day[i].end.until(dayEnd).minutes >= taskTime) {
                                    dayGaps.push([day[i].end,dayEnd]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    */
    
    const { control, handleSubmit } = useForm<FormData>();

    async function onSubmit(formData: FormData) {
        console.log('Form submitted:', formData);
        
        // FormData for user inputted data
        const formDataObj = new FormData();
        formDataObj.append('taskName', formData.taskName);
        formDataObj.append('category', formData.category);
        formDataObj.append('deadline', formData.deadline);
        formDataObj.append('estTime', formData.estTime.toString());
        formDataObj.append('driveTime', formData.driveTime.toString());
        formDataObj.append('description', formData.description);
        formDataObj.append('task_id', crypto.randomUUID());
        // formDataObj.append('user_id', crypto.randomUUID());

        // Submit to server
        const response = await fetch('/api/tasks', {
            method: 'POST',
            body: formDataObj,
        }); 
        
        if (response.ok) {
            console.log('Task saved.');
        }
    }

    return (
        <div className="p-6 h-svh">
            <form className="flex bg-[#242c39] rounded-2xl drop-shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12 p-8">
                    <h5 className="text-center text-xl text-gray-300">New Task</h5>
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Task Name: 
                        </label>
                        <Controller
                            name="taskName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="taskName" 
                                    type="text"
                                    placeholder="Task Name"
                                    className="block min-w-0 grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Category:
                        </label>
                        <CategoryDropdown
                            control={control}
                            name="category"
                        />
                    </div>
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">Estimated Task Time (Minutes)</label>
                        <Controller
                            name="estTime"
                            control={control}
                            //defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="taskName"
                                    type="number"
                                    min="0"
                                    placeholder="Est. Task Time"
                                    className="block grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>   
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">Estimated Drive Time (Minutes)</label>
                        <Controller
                            name="driveTime"
                            control={control}
                            //defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="driveTime"
                                    type="number"
                                    min="0"
                                    placeholder="Est. Drive Time"
                                    className="block grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Description (optional):
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    id="description"
                                    placeholder="Description"
                                    rows={2}
                                    className="block text-wrap min-h-20 grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500"
                                />
                                
                            )}
                        />
                    </div>
                    <button type="submit" className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl">
                        Add Task
                    </button>                                                         
                </div>

            </form>            
        </div>
    )
}
