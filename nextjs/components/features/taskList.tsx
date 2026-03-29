/**
 * Name: Task list component
 * Description: Holds task list and timer component
 * Outputs: Task list, Timer
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 02/15/26
 */

'use client'

import { useState, useEffect } from "react";
import { ResponsiveDateRangePicker } from "./scheduleRangePickers";
import { ResponsiveTimeRangePicker } from "./scheduleRangePickers";
import ConfirmDelete from "./confirmDelete";
import MyStopwatch from "./timer";
import TaskOption from "./taskOptions";

export default function TaskListPage() {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [option, setOption] = useState<string>('Mark Complete');
    // Database Query for tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // Map database fields to UI fields
            const mappedTasks = (data || []).map((item: any) => ({
                task_id: item.task_id,
                taskName: item.name,
                category: item.category_name || 'Uncategorized',
                category_id: item.category_id,
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

    // Get the currently selected task for timer (only if single selection)
    const selectedTimerTask = selectedTasks.length === 1 ? tasks.find(t => t.task_id === selectedTasks[0]) : null;

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

    // Remove task from list (w/o completing)
    const handleDeleteClick = () => {
        if (selectedTasks.length === 0) {
            alert("Please select a task to delete");
            return;
        }
        setShowDeleteConfirm(true);
    }

    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false);
        try {
            for (const taskId of selectedTasks) {
                const response = await fetch(`/api/tasks?id=${taskId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete task ${taskId}`);
                }
            }

            // Update the task list by removing deleted tasks
            setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task.task_id)));
            setSelectedTasks([]);
            console.log("Successfully removed tasks");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting tasks:", error);
            alert("Failed to delete task(s)");
        }
    }

    const handleCancelDelete = () => { // user cancels when confirm pops up
        setShowDeleteConfirm(false);
    }


    const handleOptionSelect = (selectedOption: string) => { // select dropdown 
      setOption(selectedOption);
      console.log('Selected option:', selectedOption, 'for tasks:', selectedTasks);
    };

    const handleSubmit = async () => { // handle if user selected mark complete or delete
        if (selectedTasks.length === 0) {
            alert('Please select tasks first');
            return;
        } 
        if (option === 'Mark Complete' && selectedTasks.length > 1) {
            alert('Select one task to mark complete at a time.');
            return;
        }
        if (option === 'Mark Complete') {
            const timeInput = prompt('Enter minutes spent completing task:');
            const minutes = parseInt(timeInput || '0');
            if (isNaN(minutes) || minutes < 0) {
            alert('Invalid input. Please enter a non-negative integer.');
            return;
            }
                try {
                    const response = await fetch('/api/tasks', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            taskId: selectedTasks[0],
                            time: minutes,
                        }),
                    });
                    if (response.ok) {
                        alert("Task marked complete successfully");
                        window.location.reload();
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log("Error marking task complete and submitting time.");
                } 
            } else if (option === 'Delete') {
            handleDeleteClick(); // handle delete logic
            }
    };

    return (
        <>
            <div className="space-y-2 p-8">
                {/* Select Task List operation */}
                <div className="flex items-center gap-2">
                    <TaskOption 
                        value={option}
                        onSelect={handleOptionSelect}
                    />
                    <button 
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedTasks.length === 0}
                    >
                        Submit
                    </button>
                </div>
                {/* Confirm Delete Dialog */}
                {showDeleteConfirm && (
                    <ConfirmDelete 
                        isOpen={showDeleteConfirm}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}

                {/* Task List */}
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
                <div>
                    {/* Scheduling Range Pickers */}
                    <div className="flex flex-col">
                        <h2 className="p-2">Date Range:</h2>
                        <ResponsiveDateRangePicker onDateChange={handleDateChange}/>
                    </div>
                    
                    <div className="flex flex-col">
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
                    className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl"
                >
                    Schedule Task(s)
                </button>
            </div>
            <hr />
            {/* Timer */}
            {/* pb-0 assumes this is the bottom child of the component, remove if changed */}
            <div className="flex flex-col items-center p-4 bg-[#242c39] rounded-2xl">
                <h2 className="text-xl text-gray-300 mb-4">Task Timer</h2>
                {selectedTasks.length === 0 && (
                    <p className="text-gray-400">Select a task to use the timer</p>
                )}
                {selectedTasks.length > 1 && (
                    <p className="text-yellow-400">Please select only one task for the timer</p>
                )}
                <MyStopwatch selectedTask={selectedTimerTask} />
            </div>            
        </>

    )
}
