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

// interface for input data to be saved to database
interface FormData {
    taskName: string;
    category_id: UUID;
    deadline: Date;
    estTime: number;
    driveTime: number;
//    description: string;
    task_id: UUID;
    // user_id: UUID;
}

export default function AddTaskPage() {
    
    const { control, handleSubmit } = useForm<FormData>();

    // Handles submit clicked by sending inputted data to database
    async function onSubmit(formData: FormData) {
        console.log('Form submitted:', formData);
        
        // FormData for user inputted data
        let formDataObj = new FormData();
        formDataObj.append('taskName', formData.taskName);
        formDataObj.append('category_id', formData.category_id);
        formDataObj.append('deadline', formData.deadline.toISOString());
        formDataObj.append('estTime', formData.estTime.toString());
        formDataObj.append('driveTime', formData.driveTime.toString());
        //formDataObj.append('description', formData.description);
        formDataObj.append('task_id', crypto.randomUUID().toString());

        // Send to db
        const response = await fetch('/api/tasks', {
            method: 'POST',
            credentials: 'include',
            body: formDataObj,
        });
        
        if (response.ok) { // error handling
            alert('Task Added!');
            console.log('Task saved.');
            
            // Clear the form inputs after successful submission 
            reset({
                taskName: '',
                category_id: '' as unknown as UUID,
                deadline: new Date(),
                estTime: 0,
                driveTime: 0,
                //description: '',
                task_id: '' as unknown as UUID
            });
            window.location.reload(); // reload page
        }
    }

    return (
        <div className="p-6 grow box-border">
            <form className="flex flex-col bg-[#242c39] rounded-2xl drop-shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2 p-8">
                    <h5 className="text-center text-2xl text-gray-300">New Task</h5>
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">
                            Task Name: 
                        </label>
                        {/* Controller for task name input */}
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
                        {/* controller for deadline date */}
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
                        {/* imported from other file, creates new category if it does not exist or selects it if it does exist */}
                        <CategoryDropdown
                            control={control}
                            name="category_id"
                            rules={{ required: "Category is required" }}
                        />
                    </div>
                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-300">Estimated Task Time (Minutes)</label>
                        {/* Input controller for user estimated time */}
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
                        {/* Input controller for user estimated drive time */}
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
                    {/* <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
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
                    </div> */}
                    {/* Submit button - uses handleSubmit function to send above form data to database */}
                    <button type="submit" className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl">
                        Add Task
                    </button>                                                         
                </div>

            </form>            
        </div>
    )
}
