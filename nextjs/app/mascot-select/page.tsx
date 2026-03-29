/**
 * Name: Mascot select page
 * Description:
 * Outputs:
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 03/25/26
 */
import MascotSelect from "@/components/features/mascotSelect"


export default function Page() {
    return (
        <>  <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Mascot Dashboard</h1>
                </div>
            </header>
            <div className="p-4">
                <MascotSelect />
            </div>
        </>
    )
}