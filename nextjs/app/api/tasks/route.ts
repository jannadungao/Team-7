/**
 * Name: Task list API route
 * Description: Handles route logic for adding to and fetching task list
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route, Utilized Blackbox extension with Minimax M2.5 for troubleshooting
 * Author(s): Janna Dungao
 * Date: 02/13/26
 */

import sql, { Flex_Tasks } from "../../postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// for adding a new task
export async function POST(request: Request) {
    try {
        // Get session to access Google user ID
        const session = await getServerSession(authOptions);
        
        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }
        
        // get formdata from body
        const formData = await request.formData();
        
        // get values from FormData
        const taskName = formData.get('taskName') as string; 
        const categoryId = formData.get('category_id') as string;
        const estTime = formData.get('estTime') as string;
        //const driveTime = formData.get('driveTime') as string;
        const taskId = formData.get('task_id') as string;

        
        // calculate total minutes (estTime + driveTime)
        //const totalMinutes = parseInt(estTime) + parseInt(driveTime);
        
        // Get Google user ID from session
        const googleUserId = session.googleUserId;
        
        // Insert into database with actual Google user ID
        const result = await sql<Flex_Tasks[]>
            `INSERT INTO flex_tasks (task_id, google_user_id, name, category_id, minutes, done, created_at, updated_at)
            VALUES (${taskId}, ${googleUserId}, ${taskName}, ${categoryId}, ${estTime}, false, NOW(), NOW())`;
        
        return Response.json({ message: 'Task created successfully', task: result[0] });
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to create task." }, { status: 500 });
    }
}

// for task list page
export async function GET() {
    try {
        // Get session to access Google user ID
        const session = await getServerSession(authOptions);
        
        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }
        
        // Get Google user ID from session
        const googleUserId = session.googleUserId;
        
        // Get tasks from db - join with categories to get category name
        // Fetch incomplete tasks (done=false) filtered by google_user_id
        const tasks = await sql<Flex_Tasks[]>`
            SELECT ft.task_id, ft.google_user_id, ft.name, ft.minutes, ft.done, ft.created_at, ft.updated_at, ft.assigned_time, ft.category_id, c.name as category_name
            FROM flex_tasks ft
            LEFT JOIN categories c ON ft.category_id = c.category_id
            WHERE ft.done = false AND ft.google_user_id = ${googleUserId}
            ORDER BY ft.created_at DESC
        `;
        return Response.json(tasks);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch tasks." }, { status: 500 });
    }
}

// Used when user deletes a task w/o completing
export async function DELETE(request: Request) { // request should contain task id
    try {
        const session = await getServerSession(authOptions);

        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }

        const googleUserId = session.googleUserId;

        // Get task ID from URL search params
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json({ error: "Task ID is required" }, { status: 400 });
        }

        const response = await sql<Flex_Tasks[]>
            `DELETE FROM flex_tasks WHERE task_id = ${id} AND google_user_id = ${googleUserId} RETURNING *`;
        
        console.log(`Task ${id} deleted successfully.`);
        return Response.json({ message: "Task deleted successfully", deletedTask: response[0] });
    } catch (error) {
        console.error("Error deleting task record", error);
        return Response.json({ error: "Failed to delete record" }, { status: 500 });
    }
}

// PUT: Update category time
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }

        const googleUserId = session.googleUserId;

        const body = await request.json();
        const { taskId, ms_taken } = body;

        if (!taskId || ms_taken === undefined) {
            return Response.json({ error: "Task ID and time are required." }, { status: 400 });
        }

        // Update the category's time column by adding to existing time
        const result = await sql<Flex_Tasks[]>`
            UPDATE flex_tasks 
            SET ms_taken = ${ms_taken}, done=TRUE
            WHERE task_id = ${taskId} AND  google_user_id = ${googleUserId}
            RETURNING *
        `;

        if (result.length === 0) {
            return Response.json({ error: "Category not found." }, { status: 404 });
        }

        return Response.json(result[0]);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to update time." }, { status: 500 });
    }
}