/**
 * Name: Task timer page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */

import Timer from "@/components/features/timer";
import TaskListPage from "@/components/features/taskList";

export default async function Page() {
    // fetch user's task list 
    // const response = await fetch('http://localhost:3000/api/tasks', {
    //     method: 'GET',
    // });

    // if (!response.ok) {
    //     throw new Error(`HTTP error method: GET. Status: ${response.status}`);
    // } else {
    //     console.log('Tasks fetched successfully.')
    // }
    // const tasks = await response.json();  // get list of tasks

    // Database Query for tasks - TO DO


    return (
        <div>
            <form className="p-6 h-svh">
                <div className="flex flex-col p-8 bg-[#D4DDE2] drop-shadow-2xl rounded-2xl">
                    <h1 className="p-6 text-lg font-semibold text-[#1E1E1E]">Task List</h1><hr className="border-gray-400"/>
                    <TaskListPage />
                </div>
            </form>

            <div className="text-[#1E1E1E] ">
                Timer
                <Timer />
            </div>      
        </div>
        

    );
}