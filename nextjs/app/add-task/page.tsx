/**
 * Name: Add task page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */
import CreatableSelect from 'react-select/creatable'
import Creatable from 'react-select/creatable'

export default function Page() {
    async function addTask(formData: FormData) {
        'use server'

        const rawFormData = {
            taskName: formData.get('taskName'),
            category: formData.get('category'),
            deadline: formData.get('deadline'),
            estTime: formData.get('estTime'),
            driveTime: formData.get('driveTime'),
            description: formData.get('description'),
        }
    }

    const newCategory = () => {

    }

    return (
        <div className="p-8">
            <form className="flex mx-auto w-md bg-[#D4DDE2] p-6  rounded-4xl drop-shadow-md" action={addTask}>
                <div className="space-y-12 p-8">
                    <h5 className="text-lg font-semibold text-[#1E1E1E]">New Task</h5>
                    <div className="flex items-center outline-1 outline-white/10 focus-within:outline-1 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">
                            Task Name: 
                        </label>
                        <input
                            id="taskName"
                            name="taskName"
                            type="text"
                            placeholder="Task Name"
                            className="block min-w-0 grow p-2 text-base rounded-4xl bg-white text-[#1E1E1E] placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                        />
                    </div>
                    <div className="flex items-center outline-1 outline-white/10 focus-within:outline-1 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                        <label className="block text-sm/6 p-2 font-medium text-gray-500">
                            Category:
                        </label>
        
                        <select
                            id="taskName"
                            name="taskName"
                            className="block min-w-0 grow p-2 text-base rounded-4xl bg-white text-[#1E1E1E] placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                        >
                            <option value="groceries">Groceries</option>
                            <option value="laundry">Laundry</option>
                            <option value="bills">Pay Bills</option>
                        </select>

                    </div>
                </div>                                        
            </form>            
        </div>
    )
}