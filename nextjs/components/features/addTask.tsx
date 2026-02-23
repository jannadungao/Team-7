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
import jsonData from '../../event.json';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';


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

let week: Event[][];
week = [];

export default function AddTaskPage() {
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

    let dayStart : Temporal.PlainTime;
    dayStart = new Temporal.PlainTime(0,0);
    let dayEnd : Temporal.PlainTime;
    dayEnd = new Temporal.PlainTime(0,0);

    let windows : Temporal.PlainTime[][][] = [];

    let taskTime : number;
    taskTime = 0;

    for (let day of week) {
        if (day.length === 0) {
            windows.push([[dayStart, dayEnd]]);
        } else {
            let dayGaps : Temporal.PlainTime[][] = [];
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

    return (
        <div className="p-6 h-svh">
            <div className="">
            </div>
            <form className="flex bg-[#D4DDE2] rounded-2xl drop-shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12 p-8">
                    <h5 className="text-lg text-center font-semibold text-[#1E1E1E]">New Task</h5>
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">
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
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">
                            Category:
                        </label>
                        <CategoryDropdown
                            control={control}
                            name="category"
                        />
                    </div>
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">Estimated Task Time (Minutes)</label>
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
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">Estimated Drive Time (Minutes)</label>
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
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">
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
                    <button type="submit" className="flex w-full bg-gray-800/50 text-white justify-center p-2 rounded-2xl">
                        Add Task
                    </button>                                                         
                </div>

            </form>
            <button className="flex w-full bg-gray-800/50 text-white justify-center p-2 rounded-2xl" onClick={console.log(jsonData.summary)}>
                Test
            </button>   
        </div>
    )
}
