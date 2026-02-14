/**
 * Name: Task timer page
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */

import Timer from "@/components/features/timer";

export default async function Page() {
    // fetch user's task list
    const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`HTTP error method: GET. Status: ${response.status}`);
    } else {
        console.log('Tasks fetched successfully.')
    }

    // const tasks = await response.json();  // get list of tasks
    
    // Fake Tasks
    const tasks = [{'taskName': 'Dillons', 'category': 'Groceries', 'deadline': '01/02/26',
                    'estTime': '30', 'driveTime': '13', 'description': 'Grocery shop at dillons.',},
                    {'taskName': 'Visa Bill', 'category': 'Pay Bills', 'deadline': '02/10/26',
                     'estTime': '10', 'driveTime': '0', 'description': 'Pay bill for Visa Credit Card.'}
                ];

    return (
        <div className="flex">
            <div className="flex mx-auto items-center flex-col w-md p-8 bg-[#D4DDE2] drop-shadow-2xl rounded-2xl">
                <h1 className="p-6 text-lg font-semibold text-[#1E1E1E]">Task List</h1>
                <div className="space-y-12 p-8">
                    {tasks.map((item, index) => (
                        <div key={index} className="flex flex-col p-8 bg-white rounded-2xl">
                            <h3 className="text-[#1E1E1E]">{item.taskName}</h3>
                            <p className="text-gray-400">{item.category} | {item.deadline} | Task Time: {item.estTime} </p>
                            <p className="text-gray-500">{item.description}</p>
                        </div>
                    ))}                
                </div>
            </div>
            <div className="text-[#1E1E1E] ">
                Timer
                <Timer />
            </div>            
        </div>

    );
}