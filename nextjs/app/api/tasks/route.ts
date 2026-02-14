/**
 * Name: Route to handle saving new task creation
 * Description:
 * Outputs: 
 * Sources:
 * Author(s): Janna Dungao
 * Date: 02/13/26
 */

import type { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    //TO DO
    try {
        // add task to db
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch from database." }, { status: 500 });
    }
    return Response.json({ message: 'Test successful' })
}

export async function GET(request: Request) {
    //TO DO
    try {
        // get tasks from db
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch from database"}, { status: 500 });
    }
    return Response.json({ message: 'Test successful' })
}