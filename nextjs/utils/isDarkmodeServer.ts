import { cookies } from "next/headers";

export default async function getDarkmodeServer() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("colorScheme")?.value
    if (cookieValue === "light" || cookieValue === "dark") {
        return cookieValue;
    }
    return undefined;
}

export async function getImplicitDarkmodeServer() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("colorSchemeMediaQuery")?.value
    if (cookieValue === "dark" || cookieValue === "light") {
        return cookieValue
    }
    return undefined;
}