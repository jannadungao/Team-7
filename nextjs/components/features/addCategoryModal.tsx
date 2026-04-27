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
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

// interface for input data to be saved to database
interface FormData {
    categoryName: string
}

type Category = {
  category_id: string;
  name: string;
};

type AddCategoryModalProps = {
  buttonText?: string;
  buttonStyles?: string;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export default function AddCategoryModal({
  buttonText,
  buttonStyles,
  categories,
  setCategories,
}: AddCategoryModalProps) {

    const [open, setOpen] = useState(false);
    const { control, handleSubmit } = useForm<FormData>();

    // Handles submit clicked by sending inputted data to database
    async function onSubmit(formData: FormData) {
        const name = formData.categoryName;
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error("Failed to create category");
            const newCat = await res.json();
            setCategories((prev) => {
                // avoid duplicates
                if (prev.find((p) => p.category_id === newCat.category_id)) {
                    alert("Category already exists!");
                    return prev;
                }
                return [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name));
            });
        } catch (err) {
            window.alert("Could not create category: " + String(err));
        }
    }

    return (
        <div className="">
            {/* button for modal */}
            <button
                onClick={() => setOpen(true)}
                className={buttonStyles || "flex p-2 mt-4 rounded-md bg-white/10 text-sm text-white inset-ring inset-ring-white/5 hover:bg-white/20 cursor-pointer"}
            >
                {buttonText || "Add Task"}
            </button>
            {/* Add task pop up */}
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />
                <div className="flex justify-center fixed inset-0">
                    <div className="flex justify-center p-4 text-center items-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            {/* X / close button */}
                            <button type="button" onClick={() => setOpen(false)} className="absolute top-0 right-0 p-4 cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button> 
                            {/* Add task form inputs - Task Name, Category, Estimated Time */}
                            <form className="flex items-center " onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2 p-8">
                                    <h5 className="text-center text-2xl text-gray-900 dark:text-gray-100">New Category</h5>
                                    <div className="flex flex-col focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                        <label className="block text-sm/6 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Category Name: 
                                        </label>
                                        {/* Controller for task name input */}
                                        <Controller
                                            name="categoryName"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    id="categoryName" 
                                                    type="text"
                                                    placeholder="Category Name"
                                                    required
                                                    className="block min-w-0 grow p-2 outline-gray-500 rounded-sm text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-within:outline-indigo-500 sm:text-sm/6"
                                                />
                                            )}
                                        />
                                    </div>
                                    {/* Submit button - uses handleSubmit function to send above form data to database */}
                                    <button 
                                        type="submit" 
                                        onClick={() => setOpen(false)} 
                                        className="mt-8 inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 dark:bg-gray-700 dark:text-white sm:mt-0 sm:w-auto cursor-pointer">
                                        Add Category
                                    </button>                                        
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpen(false)}
                                        className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto cursor-pointer"
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
