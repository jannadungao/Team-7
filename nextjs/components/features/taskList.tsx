/**
 * Name: Task list component
 * Description:
 * Outputs: 
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 02/15/26
 */

'use client'

import { UUID } from "crypto";

export default function TaskListPage() {
    // Database Query for tasks - TO DO


    // Fake Tasks
    const tasks = [{'taskName': 'Dillons', 'category': 'Groceries', 'deadline': '01/02/26',
                    'estTime': '30', 'driveTime': '13', 'description': 'Grocery shop at dillons.', 'task_id': 'c8f1ea85-14eb-4881-9d81-20bfd43e9338'},
                    {'taskName': 'Visa Bill', 'category': 'Pay Bills', 'deadline': '02/10/26',
                     'estTime': '10', 'driveTime': '0', 'description': 'Pay bill for Visa Credit Card.', 'task-id': '8c5e8866-de3d-4fdd-abbb-19d450204055'}
                ];

    const handleClick = (item: string | undefined) => { // change to UUID later
        // TO DO 
        console.log(`Selected: ${item}`); // Only for testing

    }

    


    return (
        <div className="space-y-12 p-8">
            {tasks.map((item, index) => (
                <button key={index} onClick={() => handleClick(item.task_id)} className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-[#6a7281] focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50">
                    <h2 className="text-[#1E1E1E] text-lg">{item.taskName}</h2>
                    <p className="text-gray-400 text-sm">{item.category} | {item.deadline} | Task Time: {item.estTime} </p>
                    <p className="text-gray-400">{item.description}</p>
                </button>
            ))}                
        </div>
    )
}

