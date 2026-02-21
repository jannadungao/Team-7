/**
 * Name: Task list component
 * Description:
 * Outputs: 
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 02/15/26
 */

'use client'

import { useState } from "react";

export default function TaskListPage() {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([])
    // Database Query for tasks - TO DO

    // Fake Tasks
    const tasks = [{'taskName': 'Dillons', 'category': 'Groceries', 'deadline': '01/02/26',
                    'estTime': '30', 'driveTime': '13', 'description': 'Grocery shop at dillons.', 'task_id': 'c8f1ea85-14eb-4881-9d81-20bfd43e9338'},
                    {'taskName': 'Visa Bill', 'category': 'Pay Bills', 'deadline': '02/10/26',
                     'estTime': '10', 'driveTime': '0', 'description': 'Pay bill for Visa Credit Card.', 'task_id': '8c5e8866-de3d-4fdd-abbb-19d450204055'}
                ];

    const handleClick = (taskId: string) => {
        // Use callback to get latest state
        setSelectedTasks(prevSelected => {
            const newSelected = prevSelected.includes(taskId)
                ? prevSelected.filter(id => id !== taskId)
                : [...prevSelected, taskId];
            return newSelected;
        });
    }

    const handleSchedule = () => {
        // TO DO: Send to scheduling algorithm 
        console.log("Selected tasks:", selectedTasks);
        
    }

    return (
        <div className="space-y-12 p-8">
            {tasks.map((item, index) => (
                <button 
                    type="button"
                    key={index} 
                    onClick={() => handleClick(item.task_id)} 
                    className={`flex flex-col p-4 rounded-2xl drop-shadow-lg bg-[#6a7281] w-full text-left ${
                        selectedTasks.includes(item.task_id) 
                            ? 'outline outline-blue-500' 
                            : 'hover:outline hover:outline-gray-400'
                    }`}
                >
                    <h2 className="text-gray-200 text-lg">{item.taskName}</h2>
                    <p className="text-gray-400 text-sm">{item.category} | {item.deadline} | Task Time: {item.estTime} </p>
                    <p className="text-gray-400">{item.description}</p>
                </button>
            ))}
            
            <button 
                type="button"
                onClick={handleSchedule}
                className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl"
            >
                Schedule Task(s)
            </button>
        </div>
    )
}

