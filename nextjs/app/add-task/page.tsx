/**
 * Name: Add task page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */
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
            <AddTaskPage />
        </div>
    )
}