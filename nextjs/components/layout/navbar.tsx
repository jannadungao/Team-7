/**
 * Name:
 * Description:
 * Outputs: 
 * Sources:
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */

import Link from 'next/link'
import '../../app/globals.css'

async function getNavData() {
    return [
        { name: 'Home', href: '/' }, 
        { name: 'Add Task', href: '/add-task' }, 
        { name: 'Task Timer', href: '/task-timer'},
    ];
}

export default async function Navbar() {
    const navItems = await getNavData();

    return (
        <nav className="bg-[#5C7E8F] p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-[#1E1E1E]">Mascot for AutoReCOrd</h1>
                <div className="space-x-4">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="text-[#1E1E1E]">
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}