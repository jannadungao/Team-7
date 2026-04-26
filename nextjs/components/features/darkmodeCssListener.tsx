"use client"

import { useEffect, useState } from "react";
import getColorSchemeClientByCookie from "@/utils/getColorSchemeClientByCookie";

export default function darkmodeCookieListenerAffectingCSS({cookieExists} : {cookieExists: boolean}) {

    const [internalCookieExists, setInternalCookieExists] = useState(cookieExists);

    // set listener for dark mode cookie change.
    useEffect(() => {
        const handler = (e: CookieChangeEvent) => {
            const darkCookie = e.changed.find(c => c.name === "colorScheme");
            const classList = document.querySelector("html")?.classList;
            if (darkCookie?.value === "dark") {
                classList?.remove("light");
                classList?.add("dark");
            }
            else if (darkCookie?.value === "light") {
                classList?.remove("dark");
                classList?.add("light");
            }

            // update internal flag to reflect whether an explicit cookie currently exists
            const exists = getColorSchemeClientByCookie() !== undefined;
            setInternalCookieExists(exists);
        };
        cookieStore.addEventListener("change", handler);

        return () => cookieStore.removeEventListener("change", handler);
    }, []);

    // set listener for implicit dark mode cookie change.
    useEffect(() => {
        const handler = (e: CookieChangeEvent) => {
            // prefer checking whether an explicit cookie exists now (avoid stale closure over internalCookieExists)
            const explicitExistsNow = getColorSchemeClientByCookie() !== undefined;
            if (!explicitExistsNow) {
                const darkCookie = e.changed.find(c => c.name === "colorSchemeMediaQuery");
                const classList = document.querySelector("html")?.classList;
                if (darkCookie?.value === "dark") {
                    classList?.remove("light");
                    classList?.add("dark");
                }
                else if (darkCookie?.value === "light") {
                    classList?.remove("dark");
                    classList?.add("light");
                }
            }
        };
        cookieStore.addEventListener("change", handler);

        return () => cookieStore.removeEventListener("change", handler);
    }, []);

    return <></>;
}