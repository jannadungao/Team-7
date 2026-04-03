/**
 * Name: Add task page
 * Description: Wrapper page for adding task page. Layout changes depending on mobile vs desktop.
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Addison Bartelli, Janna Dungao
 * Date: 02/09/26
 */
import { ClientRedirect } from "@/components/ClientRedirect"
import AddTaskPage from "@/components/features/addTask"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = getServerSession();
        
    if (!session) {
        redirect("/sign-in");
    }
    
    return (
        <div>
            <ClientRedirect path="/manage-tasks" forDesktop={true}/>
            {/* <AddTaskPage /> -- moving to calendar page as modal */}
        </div>
    )
}