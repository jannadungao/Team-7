import { cookies } from "next/headers";
import { ServerDarkmode as ServerDarkmode } from "./darkmodeEnum";

export default async function getDarkmodeServer() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("darkOrLight")?.value
    let darkMode: ServerDarkmode = ServerDarkmode.Unset;
    switch (cookieValue) {
        case "dark":
            darkMode = ServerDarkmode.Dark;
            break;
        case "light":
            darkMode = ServerDarkmode.Light;
            break;
    }
    return darkMode;
}