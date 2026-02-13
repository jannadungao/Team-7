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
import CreatableSelect from "react-select/creatable"
import CategoryDropdown from './categoryDropdown';

interface FormData {
    taskName: string;
    category: string;
    deadline: string;
    estTime: string;
    driveTime: string;
    description: string;
}

export default function AddTaskPage() {
    const { control, handleSubmit } = useForm<FormData>();

    async function onSubmit(formData: FormData) {
        console.log('Form submitted:', formData);
        
        // FormData for user inputted data
        const formDataObj = new FormData();
        formDataObj.append('taskName', formData.taskName);
        formDataObj.append('category', formData.category);
        formDataObj.append('deadline', formData.deadline);
        formDataObj.append('estTime', formData.estTime);
        formDataObj.append('driveTime', formData.driveTime);
        formDataObj.append('description', formData.description);
        
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
        <div className="p-8">
            <form className="flex mx-auto w-md bg-[#D4DDE2] p-6 rounded-2xl drop-shadow-md" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12 p-8">
                    <h5 className="text-lg font-semibold text-[#1E1E1E]">New Task</h5>
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
                                    className="block min-w-0 grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-500 focus-within:outline-indigo-500 sm:text-sm/6"
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
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="taskName"
                                    type="number"
                                    min="0"
                                    placeholder="Est. Task Time"
                                    className="block grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-500 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                            )}
                        />
                    </div>   
                    <div className="flex items-center focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">Estimated Drive Time (Minutes)</label>
                        <Controller
                            name="driveTime"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="driveTime"
                                    type="number"
                                    min="0"
                                    placeholder="Est. Drive Time"
                                    className="block grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-500 focus-within:outline-indigo-500 sm:text-sm/6"
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
                                    className="block text-wrap min-h-20 grow p-2 outline-gray-500 rounded-2xl text-base bg-white text-[#1E1E1E] placeholder:text-gray-500 focus-within:outline-indigo-500 sm:text-sm/6"
                                />
                                
                            )}
                        />
                    </div>
                    <button type="submit" className="flex grow mt-4 bg-blue-500 text-white p-2 rounded-2xl">
                        Add Task
                    </button>                                                         
                </div>

            </form>            
        </div>
    )
}
