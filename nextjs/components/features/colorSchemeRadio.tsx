"use client"

import setColorSchemeCookie from "@/utils/setColorScheme";
import { ChangeEvent, useEffect, useState } from "react";

export default function ColorSchemeRadio({defaultValue} : {defaultValue: "light" | "dark" | "system"}) {

    const [currentValue, setCurrentValue] = useState(defaultValue);

    const lightHandle = (_e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue("light");
        setColorSchemeCookie("light", true);
    };

    const darkHandle = (_e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue("dark");
        setColorSchemeCookie("dark", true);
    };

    const systemHandle = (_e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue("system");
        setColorSchemeCookie(null);
    };

    return (
        <fieldset className="flex gap-4">
            <label htmlFor="colorSchemeLight">
                <input
                    type="radio"
                    name="colorScheme"
                    id="colorSchemeLight"
                    value="light"
                    onChange={lightHandle}
                    checked={currentValue === "light"}
                />
                Light
            </label>

            <label htmlFor="colorSchemeDark">
                <input
                    type="radio"
                    name="colorScheme"
                    id="colorSchemeDark"
                    value="dark"
                    onChange={darkHandle}
                    checked={currentValue === "dark"}
                />
                Dark
            </label>

            <label htmlFor="colorSchemeSystem">
                <input
                    type="radio"
                    name="colorScheme"
                    id="colorSchemeSystem"
                    value="system"
                    onChange={systemHandle}
                    checked={currentValue === "system"}
                />
                System
            </label>
        </fieldset>
    );
}