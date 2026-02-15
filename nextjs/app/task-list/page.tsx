/**
 * Name: Task timer page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */

import TaskListPage from "@/components/features/taskList";
import MyStopwatch from "@/components/features/timer";

export default async function Page() {
    return (
        <div className="flex flex-col p-6 h-svh">
            <form className="h-svh">
                <div className="flex flex-col p-8 bg-[#D4DDE2] drop-shadow-2xl rounded-2xl">
                    <h1 className="text-lg text-center font-semibold text-[#1E1E1E]">Task List</h1><hr className="border-gray-400"/>
                    <TaskListPage />
                </div>
            </form>

            <div className="flex flex-col p-8 text-[#1E1E1E] text-lg bg-[#D4DDE2] drop-shadow-2xl rounded-2xl">
                <h2 className="text-center font-semibold text-[#1E1E1E]">Timer</h2><hr className="border-gray-400"/>
                <MyStopwatch />
            </div>      
        </div>
    );
}