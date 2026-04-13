/**
 * Name: Add task component
 * Description: Component for adding a task with necessary inputs.
 * Outputs: Add task block component
 * Sources: https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/modal-dialogs
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

'use client';
import { useForm, Controller } from 'react-hook-form';
import CategoryDropdown from './categoryDropdown';
import { UUID } from 'crypto';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

// interface for input data to be saved to database
interface FormData {
//    taskName: string;
    category_id: UUID;
//    deadline: Date;
    estTime: number;
//    driveTime: number;
//    description: string;
    task_id: UUID;
    // user_id: UUID;
}

export default function AddTaskModal({buttonText, buttonStyles, forcedCategory} : {
        buttonText?: string,
        buttonStyles?: string,
        forcedCategory?: {id: string, name: string}
    }) {

    const [open, setOpen] = useState(false);
    const { control, handleSubmit } = useForm<FormData>();

    // Handles submit clicked by sending inputted data to database
    async function onSubmit(formData: FormData) {
        console.log('Form submitted:', formData);
        
        // FormData for user inputted data
        let formDataObj = new FormData();
        //formDataObj.append('taskName', formData.taskName);
        formDataObj.append('category_id', forcedCategory?.id || formData.category_id);
        //formDataObj.append('deadline', formData.deadline.toISOString());
        formDataObj.append('estTime', formData.estTime.toString());
        //formDataObj.append('driveTime', formData.driveTime.toString());
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
            window.location.reload(); // reload page
        }
    }

    return (
        <div className="">
            {/* button for modal */}
            <button
                onClick={() => setOpen(true)}
                className={buttonStyles || "flex p-2 rounded-md bg-white/10 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"}
            >
                {buttonText || "Add Task"}
            </button>
            {/* Add task pop up */}
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="flex justify-center fixed inset-0">
                    <div className="flex justify-center p-4 text-center items-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            {/* X / close button */}
                            <button type="button" onClick={() => setOpen(false)} className="absolute top-0 right-0 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button> 
                            {/* Add task form inputs - Task Name, Category, Estimated Time */}
                            <form className="flex items-center " onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2 p-8">
                                    <h5 className="text-center text-2xl text-gray-300">New Task</h5>
                                    {/* <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                        <label className="block text-sm/6 py-2 font-medium text-gray-300">
                                            Task Name: 
                                        </label> */}
                                        {/* Controller for task name input */}
                                        {/* <Controller
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
                                                    className="block min-w-0 grow p-2 outline-gray-500 rounded-sm text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                                />
                                            )}
                                        />
                                    </div> */}
                                    <div className="flex flex-col">
                                        <label className="block text-sm/6 py-2 font-medium text-gray-300">
                                            Category:
                                        </label>
                                        {/* imported from other file, creates new category if it does not exist or selects it if it does exist */}
                                        {forcedCategory ? <p>{forcedCategory.name}</p> :
                                        <CategoryDropdown
                                            control={control}
                                            name="category_id"
                                            rules={{ required: "Category is required" }}
                                        />}
                                    </div>
                                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                        <label className="block text-sm/6 py-2 font-medium text-gray-300">Estimated Task Time (Minutes)</label>
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
                                                    className="block grow p-2 outline-gray-500 rounded-sm text-base bg-white text-[#1E1E1E] placeholder:text-gray-300 focus-within:outline-indigo-500 sm:text-sm/6"
                                                />
                                            )}
                                        />
                                    </div>   
                                    {/* Submit button - uses handleSubmit function to send above form data to database */}
                                    <button 
                                        type="submit" 
                                        onClick={() => setOpen(false)} 
                                        className="mt-8 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto">
                                        Add Task
                                    </button>                                        
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpen(false)}
                                        className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>                                                 
                                </div>
                            </form>                               
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
