"use client"

import { useEffect, useState } from "react";
import getColorSchemeClientByCookie from "@/utils/getColorSchemeClientByCookie";
import setColorSchemeCookie from "@/utils/setColorScheme";

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
            if (!darkCookie?.value) {
                // explicit cookie was removed — fallback to media query and set implicit cookie
                const prefersDarkNow = matchMedia("(prefers-color-scheme: dark)").matches;
                if (prefersDarkNow) {
                    classList?.remove("light");
                    classList?.add("dark");
                    setColorSchemeCookie("dark", false);
                } else {
                    classList?.remove("dark");
                    classList?.remove("light");
                    setColorSchemeCookie("light", false);
                }
            }

            // update internal flag to reflect whether an explicit cookie currently exists
            const exists = getColorSchemeClientByCookie() !== undefined;
            setInternalCookieExists(exists);
        };
        cookieStore.addEventListener("change", handler);

        return () => cookieStore.removeEventListener("change", handler);
    }, []);

    // initial sync: prefer explicit cookie, otherwise use media query to set class and implicit cookie
    useEffect(() => {
        const classList = document.querySelector("html")?.classList;
        const explicit = getColorSchemeClientByCookie();
        if (explicit === "dark") {
            classList?.remove("light");
            classList?.add("dark");
        }
        else if (explicit === "light") {
            classList?.remove("dark");
            classList?.add("light");
        }
        else {
            const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
            if (prefersDark) {
                classList?.remove("light");
                classList?.add("dark");
                setColorSchemeCookie("dark", false);
            } else {
                classList?.remove("dark");
                classList?.remove("light");
                setColorSchemeCookie("light", false);
            }
        }
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

    // set listener for media query change
        useEffect(() => {
            const handler = (e: MediaQueryListEvent) => {
                if (e.matches) setColorSchemeCookie("dark", false);
                else setColorSchemeCookie("light", false);
            };
    
            const darkmodeQuery = matchMedia("(prefers-color-scheme: dark)");
            darkmodeQuery.addEventListener("change", handler);
    
            return () => darkmodeQuery.removeEventListener("change", handler);
        }, []);

    return <></>;
}