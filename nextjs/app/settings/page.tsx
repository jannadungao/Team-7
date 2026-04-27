/**
 * Name: Mascot select page
 * Description: Top level for mascot dashboard where users select their mascot.
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 03/25/26
 */
import ColorSchemeRadio from "@/components/features/colorSchemeRadio"
import MascotSelect from "@/components/features/settings"
import getDarkmodeServer from "@/utils/isDarkmodeServer"

export default async function Page() {

    const explicitCookieValue = await getDarkmodeServer();

    return (
        <div>  
            <header className="flex relative after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="px-4 py-6 sm:px-6 lg:px-8 w-fit">
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                </div>
                <div className="grow"></div>
                <p className="text-xl font-semibold tracking-tight self-center mr-8 hover:underline"><a href="/">Back to Home</a></p>
            </header>
            <div className="p-4">
                <MascotSelect />
                <br /><hr /><br />
                <div>
                    <h2>Appearance</h2>
                    <ColorSchemeRadio defaultValue={explicitCookieValue ?? "system"} />
                </div>
            </div>
        </div>
    )
}