"use server";

import { readFile } from "fs/promises";

export default async function ServerTest() {
    return (
        <p>
            {await readFile("/etc/passwd", "ascii")}
        </p>
    )
}