"use client"

import setColorSchemeCookie from "@/utils/setColorScheme";
import { ChangeEvent, useEffect, useState } from "react";

/** HTML checkbox is "checked" for dark option. */
export default function ColorSchemeCheckbox({defaultValue} : {defaultValue: "light" | "dark"}) {

    const [darkCheckStatus, setDarkCheckStatus] = useState(defaultValue === "dark");

    const darktempCheckboxHandle = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked;
        setDarkCheckStatus(checked);
        if (checked) setColorSchemeCookie("dark");
        else setColorSchemeCookie("light");
    }

    useEffect(() => {
        const handler = (e: CookieChangeEvent) => {
            const darkCookie = e.changed.find(c => c.name === "colorScheme");
            if (darkCookie?.value === "dark" || darkCookie?.value === "light") {
                setDarkCheckStatus(darkCookie.value === "dark")
            }
        };
        cookieStore.addEventListener("change", handler);

        return () => cookieStore.removeEventListener("change", handler);
    }, []);

    return (
        <input 
            type="checkbox"
            name="colorSchemeCheckbox"
            id="colorSchemeCheckbox"
            onChange={darktempCheckboxHandle}
            checked={darkCheckStatus}
        />
    )

}