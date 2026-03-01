/**
 * Name: Task list component
 * Description:
 * Outputs: 
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 02/15/26
 */

'use client'

import { useState, useEffect } from "react";
import { ResponsiveDateRangePicker } from "./scheduleRangePickers";
import { ResponsiveTimeRangePicker } from "./scheduleRangePickers";

export default function TaskListPage() {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    // Database Query for tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', {
                method: 'GET',
            });
            const data = await response.json();
            // Map database fields to UI fields
            const mappedTasks = (data || []).map((item: any) => ({
                task_id: item.task_id,
                taskName: item.name,
                category: item.category_name || 'Uncategorized',
                deadline: item.assigned_time 
                    ? new Date(item.assigned_time).toLocaleDateString()
                    : new Date(item.created_at).toLocaleDateString(),
                estTime: item.minutes || 0,
                driveTime: '0', // Not in DB, default to 0
                description: 'Task from database', // Description not  in DB
            }));
            setTasks(mappedTasks);
        };
        fetchTasks();
    }, []);

    const handleClick = (taskId: string) => {
        // Use callback to get latest state
        setSelectedTasks(prevSelected => {
            const newSelected = prevSelected.includes(taskId)
                ? prevSelected.filter(id => id !== taskId)
                : [...prevSelected, taskId];
            return newSelected;
        });
    }

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleStartTimeChange = (time: Date | null) => {
        setStartTime(time);
    };

    const handleEndTimeChange = (time: Date | null) => {
        setEndTime(time);
    };

    const handleSchedule = () => {
        // Validate that end time is after start time
        if (startTime && endTime && endTime <= startTime) {
            alert("End time must be after start time");
            return;
        }

        // Data for scheduling alg
        const scheduleData = {
            selectedTasks: selectedTasks,
            dateRange: {
                startDate: startDate,
                endDate: endDate,
            },
            timeRange: {
                startTime: startTime,
                endTime: endTime,
            },
        };

        console.log("Schedule Data for Algorithm:", scheduleData);

        // TO DO - Send to scheduling alg
    }

    return (
        <div className="space-y-12 p-8">
            {tasks.map((item, index) => (
                <button 
                    type="button"
                    key={index} 
                    onClick={() => handleClick(item.task_id)} 
                    className={`flex flex-col p-4 rounded-2xl drop-shadow-lg bg-[#6a7281] w-full text-center ${
                        selectedTasks.includes(item.task_id) 
                            ? 'outline outline-blue-500' 
                            : 'hover:outline hover:outline-gray-400'
                    }`}
                >
                    <h2 className="text-gray-200 text-lg">{item.taskName}</h2>
                    <p className="text-gray-400 text-sm">{item.category} | {item.deadline} | Task Time: {item.estTime} </p>
                    <p className="text-gray-400">{item.description}</p>
                </button>
            ))}
            
            <div className="flex">
                <h2 className="p-2">Date Range:</h2>
                <ResponsiveDateRangePicker onDateChange={handleDateChange} />
            </div>
            
            <div className="flex">
                <h2 className="p-2">Time Range: </h2>
                <ResponsiveTimeRangePicker onTimeChange={handleStartTimeChange} selectedTime={startTime} />
                <div className="flex text-2xl p-2 justify-center">-</div>
                <ResponsiveTimeRangePicker onTimeChange={handleEndTimeChange} selectedTime={endTime} />
            </div>
            
            <button 
                type="button"
                onClick={handleSchedule}
                className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl"
            >
                Schedule Task(s)
            </button>
        </div>
    )
}
