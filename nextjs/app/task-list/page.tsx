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
    // const tasks = await response.json();  // get list of tasks

    // Fake Tasks
    const tasks = [{'taskName': 'Dillons', 'category': 'Groceries', 'deadline': '01/02/26',
                    'estTime': '30', 'driveTime': '13', 'description': 'Grocery shop at dillons.',},
                    {'taskName': 'Visa Bill', 'category': 'Pay Bills', 'deadline': '02/10/26',
                     'estTime': '10', 'driveTime': '0', 'description': 'Pay bill for Visa Credit Card.'}
                ];
    

    return (
        <div className="flex mx-auto w-md flex-col p-8 bg-[#D4DDE2] rounded-2xl">
            
        </div>
    )
}