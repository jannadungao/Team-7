/**
 * Name: Task list page
 * Description: Page for task list and timer
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */

import { ClientRedirect } from "@/components/ClientRedirect";
import TaskListPage from "@/components/features/taskList";

export default function Page() {
    return (
        <>
            {/* redirect of on desktop */}
            <ClientRedirect path="/manage-tasks" forDesktop={true}/> 

            {/* Mobile */}
            <div className="flex flex-col p-6 grow">
                <div className="flex flex-col p-6 pb-2 bg-[#242c39] drop-shadow-4xl rounded-2xl">
                    <h1 className="text-2xl text-center text-white">Task List</h1> 
                    <TaskListPage />
                </div>
                <br />
            </div>
        </>
    );
}

