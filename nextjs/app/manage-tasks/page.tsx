/**
 * Name: Manage tasks routing component
 * Description: Top-level routing server component for task management on desktop screens.
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Addison Batelli
 * Date: 03/15/26
 */
import { ClientRedirect } from "@/components/ClientRedirect"
import AddTaskPage from "@/components/features/addTask"
import TaskListPage from "@/components/features/taskList"

export default async function Page() {
    return (
        <>
            <ClientRedirect path="/" forDesktop={false}/>
            <div className="flex grow">
                <div className="flex-1">
                    <AddTaskPage />
                </div>
                <div className="flex-1">
                    <TaskListPage />
                </div>
            </div>
        </>
    )
}