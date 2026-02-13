/**
 * Name: Task timer page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */


export default async function Page() {
    // fetch user's task list
    const response = await fetch('/api/tasks', {
        method: 'GET',
    });
    
    

    return (
        <div className="flex mx-auto w-md flex-col p-8 bg-[#D4DDE2] rounded-2xl">
            
        </div>
    )
}