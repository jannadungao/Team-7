/**
 * Name: Mascot select page
 * Description: Top level for mascot dashboard where users select their mascot.
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 03/25/26
 */
import Settings from "@/components/features/settings"

export default function Page() {
    return (
        <div>  
            <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
                </div>
            </header>
            <div className="p-4">
                <Settings />
                <br /><hr /><br />
                <h2>Appearance</h2>


            </div>
        </div>
    )
}