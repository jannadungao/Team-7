/**
 * Name: Add task component
 * Description: Component for adding a task with necessary inputs.
 * Outputs: Add task block component
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
import { rrulestr } from 'rrule';
import { start } from 'repl';

interface FormData {
    taskName: string;
    category_id: UUID;
    deadline: Date;
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


/**
 * TODO: Get this working with Event type from types.ts (which is what GoogleCalendarEvent and FlexibleTask will be converted to) instead of the Event class defined here. Will likely need to change the Event class to an interface and update the parseCalendar function accordingly.
 */
class Event {
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

export default function AddTaskPage() {
    function parseCalendar(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): {date : Temporal.PlainDate; events : Event[]}[] {
        // Sort calendar events into a 2D array where each subarray corresponds to a day and contains the events for that day
        const tempCalendar : {date : Temporal.PlainDate; events : Event[]}[] = [];
        // Iterate through each day in the date range
        for (let currentDate = startDate; Temporal.PlainDate.compare(currentDate, endDate) <= 0; currentDate = currentDate.add({ days: 1 })) {
            // Add a new subarray for the current day
            const tempEvents : Event[] = [];
            calendar.items.forEach((item) => {
                const eventStartDate = Temporal.PlainDate.from(item.start.dateTime);
                if (Temporal.PlainDate.compare(eventStartDate, currentDate) == 0) {
                    const eventStartTime = Temporal.PlainTime.from(item.start.dateTime);
                    const eventEndTime = Temporal.PlainTime.from(item.end.dateTime);
                    tempEvents.push(new Event(item.summary, currentDate, eventStartTime, eventEndTime));
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
                                    tempEvents.push(
                                        new Event(item.summary, currentDate, eventStartTime, eventEndTime)
                                    );
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

    function findEventGaps(calendar: CalendarJson, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime, newEventLength: number) {
        const calendarEvents = parseCalendar(calendar, startDate, endDate);
        const eventGaps: { date : Temporal.PlainDate; gaps: { start: Temporal.PlainTime, end: Temporal.PlainTime }[] }[] = [];
        for (let day of calendarEvents) {
            const dayGaps : { start: Temporal.PlainTime; end: Temporal.PlainTime }[] = [];
            if (day.events.length == 0) {
                continue;
            }
            for (let i = 0; i < day.events.length; i++) {
                if (i > 0 && i < day.events.length - 1) {
                    if (Temporal.PlainTime.compare(day.events[i-1].end, day.events[i].start) == -1 && day.events[i-1].end.until(day.events[i].start).total('minutes') >= newEventLength) {
                        dayGaps.push({ start: day.events[i-1].end, end: day.events[i].start });
                    }
                } else if (i == 0) {
                    if (Temporal.PlainTime.compare(startTime, day.events[i].start) == -1 && startTime.until(day.events[i].start).total('minutes') >= newEventLength) {
                        dayGaps.push({ start: startTime, end: day.events[i].start });
                    }
                } else {
                    if (Temporal.PlainTime.compare(day.events[i].end, endTime) == -1 && day.events[i].end.until(endTime).total('minutes') >= newEventLength) {
                        dayGaps.push({ start: day.events[i].end, end: endTime });
                    }
                }
            }
            eventGaps.push({date: day, gaps: dayGaps});
        }
        return eventGaps;
    }
    
    const { control, handleSubmit } = useForm<FormData>();

    async function onSubmit(formData: FormData) {
        console.log('Form submitted:', formData);
        
        // FormData for user inputted data
        let formDataObj = new FormData();
        formDataObj.append('taskName', formData.taskName);
        formDataObj.append('category_id', formData.category_id);
        formDataObj.append('deadline', formData.deadline.toISOString());
        formDataObj.append('estTime', formData.estTime.toString());
        formDataObj.append('driveTime', formData.driveTime.toString());
        formDataObj.append('description', formData.description);
        formDataObj.append('task_id', crypto.randomUUID().toString());

        // Send to db
        const response = await fetch('/api/tasks', {
            method: 'POST',
            credentials: 'include',
            body: formDataObj,
        });
        
        if (response.ok) {
            alert('Task Added!');
            console.log('Task saved.');
            
            // Clear the form inputs after successful submission
            reset({
                taskName: '',
                category_id: '' as unknown as UUID,
                deadline: new Date(),
                estTime: 0,
                driveTime: 0,
                description: '',
                task_id: '' as unknown as UUID
            });
        }
    }

    return (
        <div className="p-6 grow box-border">
            <form className="flex flex-col bg-[#242c39] rounded-2xl drop-shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2 p-8">
                    <h5 className="text-center text-xl text-gray-300">New Task</h5>
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
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
                                    required
                                    className="block min-w-0 grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Deadline:
                        </label>
                        <Controller
                            name="deadline"
                            control={control}
                            render={({ field }) => (
                                <input 
                                    {...field}
                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                    id="deadline"
                                    type="date"
                                    required
                                    className="block grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Category:
                        </label>
                        <CategoryDropdown
                            control={control}
                            name="category_id"
                            rules={{ required: "Category is required" }}
                        />
                    </div>
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">Estimated Task Time (Minutes)</label>
                        <Controller
                            name="estTime"
                            control={control}
                            defaultValue={0}
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
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">Estimated Drive Time (Minutes)</label>
                        <Controller
                            name="driveTime"
                            control={control}
                            defaultValue={0}
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
                                    className="text-wrap grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500"
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
