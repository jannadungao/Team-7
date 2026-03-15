/**
 * Name: Add task page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */
import { ClientRedirect } from "@/components/ClientRedirect"
import AddTaskPage from "@/components/features/addTask"

export default async function Page() {
    return (
        <div>
            <ClientRedirect path="/manage-tasks" forDesktop={true}/>
            <AddTaskPage />
        </div>
    )
}