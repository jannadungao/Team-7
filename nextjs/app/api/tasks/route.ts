/**
 * Name: Route to handle saving new task creation
 * Description:
 * Outputs: 
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route
 * Author(s): Janna Dungao
 * Date: 02/13/26
 */

import sql, { Flex_Tasks } from "../../postgres";
import { randomUUID } from "crypto";
export async function POST(request: Request) {
    try {
        // get formdata from body
        const formData = await request.formData();
        
        // get values from FormData
        const taskName = formData.get('taskName') as string;
        const category = formData.get('category') as string;
        const deadline = formData.get('deadline') as string;
        const estTime = formData.get('estTime') as string;
        const driveTime = formData.get('driveTime') as string;
        const description = formData.get('description') as string;
        
        // generate UUID for task
        const taskId = randomUUID();
        
        // calculate total minutes (estTime + driveTime)
        const totalMinutes = parseInt(estTime) + parseInt(driveTime);
        
        // Insert into database
        const result = await sql<Flex_Tasks[]>
            `INSERT INTO flex_tasks (task_id, name, category_id, minutes, done, created_at, updated_at)
            VALUES (${taskId}, ${taskName}, ${category}, ${totalMinutes}, false, ${Date.now()}, ${Date.now()})`;
        
        return Response.json({ message: 'Task created successfully', task: result[0] });
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to create task." }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Get tasks from db
        const tasks = await sql<Flex_Tasks[]>`SELECT * FROM flex_tasks ORDER BY created_at DESC`;
        return Response.json(tasks);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch tasks." }, { status: 500 });
    }
}

