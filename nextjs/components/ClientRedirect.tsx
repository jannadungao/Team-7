"use client"

import { desktopPixelWidthThreshold } from "@/app/types";
import { redirect, RedirectType } from "next/navigation";

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
    switch (forDesktop) {
        case false:
            if (window.screen.width < desktopPixelWidthThreshold) {
                redirect(path, RedirectType.replace);
            }
            break;
        case true:
            if (window.screen.width >= desktopPixelWidthThreshold) {
                redirect(path, RedirectType.replace);
            }
            break;
        case undefined:
            redirect(path, RedirectType.replace);
    }

    return <></>
}