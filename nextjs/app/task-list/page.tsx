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
            <form>
                <div className="flex flex-col p-6 bg-[#242c39] drop-shadow-4xl rounded-2xl">
                    <h1 className="text-2xl text-center text-gray-300">Task List</h1>
                    <TaskListPage />
                </div>
            </form>
            <br />
            <div className="flex flex-col p-6 text-[#1E1E1E] text-xl bg-[#242c39] drop-shadow-4xl rounded-2xl">
                <h2 className="text-center text-xl text-gray-300">Timer</h2>
                <MyStopwatch />
            </div>      
        </div>
    );
}