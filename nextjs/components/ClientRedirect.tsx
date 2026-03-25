"use client"

import { desktopPixelWidthThreshold } from "@/app/types";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @argument path - Path to redirect to.
 * @argument forDesktop - `true` if to be taken for desktops, `false` for mobile, `undefined` for both.
 */
interface ClientRedirectProps {
    path: `/${string}`;
    forDesktop?: boolean
}

/**
 * @argument path - Path to redirect to.
 * @argument forDesktop - `true` if to be taken for desktops, `false` for mobile, `undefined` for both.
 */
export function ClientRedirect({path, forDesktop} : ClientRedirectProps) {
    useEffect(() => {
        const screenWidthPx = window.screen.width;

        switch (forDesktop) {
            case false:
                if (screenWidthPx < desktopPixelWidthThreshold) {
                    redirect(path, RedirectType.replace);
                }
                break;
            case true:
                if (screenWidthPx >= desktopPixelWidthThreshold) {
                    redirect(path, RedirectType.replace);
                }
                break;
            case undefined:
                redirect(path, RedirectType.replace);
        }
    }, []);

    return <></> // required to return a JSX object to be a valid component
}