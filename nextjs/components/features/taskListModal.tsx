/**
 * Name: Task list component
 * Description: Holds task list and timer component
 * Sources: https://heroicons.com
 * Author(s): Janna Dungao
 * Date: 02/15/26
 */

'use client'

import { useState, useEffect } from "react";
import { ResponsiveDateRangePicker } from "./scheduleRangePickers";
import { ResponsiveTimeRangePicker } from "./scheduleRangePickers";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import ConfirmDelete from "./confirmDelete";
import MyStopwatch from "./timer";
import TaskOption from "./taskOptions";

import ModalBox from "../layout/modal";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TaskListModal({buttonStyles, forcedCategory} : {buttonStyles?: string, forcedCategory?: string}) {
    // Use States for handling changes
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [option, setOption] = useState<string>('Mark Complete');
    const [showTimer, setShowTimer] = useState(false);
    // for task list modal
    const [open, setOpen] = useState(false);
    const [showRange, setShowRange] = useState(false);

    // modal for scheduling
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    // Database Query for tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', { // http request
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json(); // data from db

            // Map database fields to UI fields
            const temp1 = (data && data instanceof Array) ? data : [];
            const mappedTasks = temp1.map((item: any) => ({
                task_id: item.task_id,
                taskName: item.name,
                category: item.category_name || 'Uncategorized',
                category_id: item.category_id,
                deadline: item.assigned_time 
                    ? new Date(item.assigned_time).toLocaleDateString()
                    : new Date(item.created_at).toLocaleDateString(),
                estTime: item.minutes || 0,
//                driveTime: '0', // Not in DB, default to 0
//                description: 'Task from database', // Description not  in DB
            }));
            setTasks(mappedTasks);
        };
        fetchTasks();
    }, []);

    const handleClick = (taskId: string) => { // handle task being clicked - for outline display
        // Use callback to get latest state
        setSelectedTasks(prevSelected => { // set selected tasks to currently selected tasks + the new one
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

        // add error handling

        console.log("Schedule Data for Algorithm:", scheduleData);
        setShowRange(false);

        // TO DO - Send to scheduling alg

        // TO DO: pop up modal
        setIsModalVisible(true);
    }

    // Remove task from list (w/o completing)
    const handleDeleteClick = () => {
        if (selectedTasks.length === 0) {
            alert("Please select a task to delete");
            return;
        }
        setShowDeleteConfirm(true); // show confirmation pop up
    }

    // handle delete
    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false); // hide confirmation pop up
        try {
            for (const taskId of selectedTasks) {
                const response = await fetch(`/api/tasks?id=${taskId}`, { // http request for list of incomplete tasks
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
        setShowDeleteConfirm(false); // hide confirmation pop up
    }


    const handleOptionSelect = (selectedOption: string) => { // select dropdown 
      setOption(selectedOption);
      setShowTimer(false);
      setShowRange(false);
      console.log('Selected option:', selectedOption, 'for tasks:', selectedTasks);
    };

    const handleSubmit = async () => { // handle if user selected mark complete or delete
        if (selectedTasks.length === 0) { // if no tasks selected
            alert('Please select tasks first');
            return;
        } 
        if (option === 'Mark Complete' && selectedTasks.length > 1) { // only allow one task to be marked complete at a time
            alert('Select one task to mark complete at a time.');
            return;
        }
        if (option === 'Mark Complete') {
            const timeInput = prompt('Enter minutes spent completing task:'); // have user input the time taken to complete
            const minutes = parseInt(timeInput || '0'); // convert into int
            if (isNaN(minutes) || minutes < 0) {
            alert('Invalid input. Please enter a non-negative integer.');
            return;
            }
                try {
                    const response = await fetch('/api/tasks', { // http request - save input to database
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
                    if (response.ok) { // error handling
                        alert("Task marked complete successfully");
                        window.location.reload(); // reload page to show task is removed
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log("Error marking task complete and submitting time.");
                } 
        } else if (option === 'Delete') {
            handleDeleteClick(); // handle delete logic
        } else if (option == 'Schedule') {
            setShowRange(true);
        } else if (option == 'Time') {
            setShowTimer(true);
        }
    };

    return (
        <div className="">
            {/* modal button */}
            <button
                onClick={() => setOpen(true)}
                className={buttonStyles || "flex rounded-md p-2 bg-white/10 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"}
            >
                Task List
            </button>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="flex justify-center fixed inset-0">
                    <div className="flex justify-center p-8 text-center items-center">
                        <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >   
                            {/* Button to close modal */}
                            <button type="button" onClick={() => setOpen(false)} className="absolute top-0 right-0 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button> 
                            
                            <div className="flex flex-col h-full p-8">
                                
                                <h2 className="text-2xl text-center p-2">Task List</h2>

                                {/* Select Task List operation */}
                                <div className="flex items-center  gap-4">
                                    {/* drop down with options: 'Mark complete' and 'Delete' */}
                                    <TaskOption 
                                        value={option}
                                        onSelect={handleOptionSelect}
                                    />
                                    {/* Submit button for above dropdown */}
                                    <button 
                                        onClick={handleSubmit}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 mt-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                <div className="flex p-2 mt-2 w-full outline -outline-offset-1 outline-white/10 rounded-2xl">
                                    {/* Task List */}
                                    {tasks.map((item, index) => (
                                        <button 
                                            type="button"
                                            key={index} 
                                            onClick={() => handleClick(item.task_id)} 
                                            className={`p-2 m-2 rounded-2xl text-center hover:bg-gray-600 cursor-pointer ${
                                                selectedTasks.includes(item.task_id) 
                                                    ? "bg-gray-500 outline-white transition-colors"
                                                    : "bg-gray-700 transition-colors"
                                            }`}
                                        >
                                            
                                            <h2 className=" text-gray-200 text-md">{item.taskName}</h2>
                                            {/* <p className="text-gray-400 text-sm">{item.category} | {item.deadline} | Task Time: {item.estTime} </p> */}
                                            {/* <p className="text-gray-400">{item.description}</p> */}
                                        </button>
                                    ))}                                    
                                </div>
                                {showRange &&
                                    <div>
                                        {/* Scheduling Range Pickers */}
                                        <div className="flex flex-col">
                                            <h2 className="p-2">Select Date Range:</h2>
                                            <ResponsiveDateRangePicker onDateChange={handleDateChange}/>
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <h2 className="p-2">Select Time Range: </h2>
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
                                        {/* Submit button to send selected tasks to the scheduling algorithm  -- moving to drop down */}
                                        <button 
                                            type="button"
                                            onClick={handleSchedule}
                                            className="flex w-full justify-center mt-4 mx-auto bg-blue-600 text-white px-2 py-3 rounded-2xl hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={selectedTasks.length === 0}
                                        >
                                            Schedule
                                        </button>                                             
                                    </div>         
                      
                                }
                                                            
                                {isModalVisible && <ModalBox onClose={handleCloseModal} />}
                            </div>
                            {/* Timer -- moving to dropdown */}
                            {/* pb-0 assumes this is the bottom child of the component, remove if changed */}
                            {showTimer && 
                                <div className="flex flex-col items-center p-4 mx-4 mb-4 outline -outline-offset-1 outline-white/10 rounded-2xl">
                                    <h2 className="text-2xl text-gray-300 mb-4">Task Timer</h2>
                                    {selectedTasks.length === 0 && (
                                        <p className="text-gray-400">Select a task to use the timer</p>
                                    )}
                                    {selectedTasks.length > 1 && (
                                        <p className="text-yellow-400">Please select only one task for the timer</p>
                                    )}
                                    <MyStopwatch selectedTask={selectedTimerTask} />

                                </div>                                
                            }
                 
                        </DialogPanel>
                    </div>                    
                </div>
            </Dialog>
               
        </div>
    )
}
