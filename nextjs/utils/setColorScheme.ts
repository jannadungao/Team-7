/** Only for client use. 
 * explicit: if specifically set by the user, false if inferred by browser/os settings.
 * Pass null to value to clear all colorScheme cookies. */
export default function setColorSchemeCookie(value: "light" | "dark" | null, explicit: boolean = true) {
    if (!window) {
        throw "Illegal use of setColorScheme in server context";
    }
    const cookieToSet = explicit ? "colorScheme" : "colorSchemeMediaQuery";
    if (value !== null) {
        cookieStore.set(cookieToSet, value);
    }
    else {
        cookieStore.delete("colorScheme");
        cookieStore.delete("colorSchemeMediaQuery");
    }
}