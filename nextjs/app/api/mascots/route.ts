/**
 * Name: Route to handle mascot selection
 * Description: HTTP PUT request to save the user's mascot selection to the database.
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route
 * Author(s): Janna Dungao
 * Date: 03/28/26
 */

import sql, { User } from "../../postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Update user's mascot selection
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions); // check session

        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 }); // check if logged in
        }

        const googleUserId = session.googleUserId;

        const jsonData = await request.json();
        const mascot_id = jsonData.mascot_id; // id to be saved

        if (!mascot_id || ![1,2,3].includes(Number(mascot_id))) {
            return Response.json({ error: "Valid mascot_id (1-3) is required."}, {status: 400});
        }

        // Update user's mascot selection
        const result = await sql<User[]>`
            UPDATE users
            SET mascot_id = ${mascot_id}
            WHERE google_user_id = ${googleUserId}
            RETURNING *;
        `;
        return Response.json(result);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to update user's mascot selection."}, {status: 500});
    }
}

//Get the user's mascot selection
export async function GET() {
    try {
        // Get session to access Google user ID
        const session = await getServerSession(authOptions);
        
        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }
        
        // Get Google user ID from session
        const googleUserId = session.googleUserId;
        
        // get the user's saved mascot id
        const mascot_id = await sql<User[]>`
            SELECT mascot_id
            FROM users
            WHERE google_user_id = ${googleUserId};
        `;
        return Response.json(mascot_id); // return the retrieved id
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch user's mascot."}, { status: 500 });
    }
}