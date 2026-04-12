/**
 * Name: Route to handle categories
 * Description: GET all categories, POST to create new category (SELECT then INSERT if not exists)
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route
 * Author(s): Janna Dungao, Elizabeth Miller
 * Date: 02/27/26
 */

import sql, { Categories } from "../../postgres";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

// GET: Fetch all categories associated with user's google ID
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const googleUserId = session.googleUserId;
        
        const categories = await sql<Categories[]>`
            SELECT * 
            FROM categories 
            WHERE google_user_id = ${googleUserId}
            ORDER BY name ASC`; // get all categories linked to user's google ID

        return Response.json(categories);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch categories." }, { status: 500 });
    }
}

// POST: Create new category if it doesn't exist 
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const googleUserId = session.googleUserId;

        const body = await request.json(); // user inputted category
        const { name } = body;

        if (!name) {
            return Response.json({ error: "Category name is required." }, { status: 400 });
        }

        // First, try to find existing category for current user
        const existing = await sql<Categories[]>`
            SELECT * 
            FROM categories 
            WHERE LOWER(name) = LOWER(${name})
            AND google_user_id = ${googleUserId}
        `;

        if (existing.length > 0) {
            // Category already exists, return it
            return Response.json(existing[0]);
        }

        // Category doesn't exist, create new one (tied to user)
        const newCategory = await sql<Categories[]>`
            INSERT INTO categories (category_id, name, google_user_id)
            VALUES (${randomUUID()}, ${name}, ${googleUserId})
            RETURNING *
        `;

        return Response.json(newCategory[0]); // return the newly created category
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to create category." }, { status: 500 });
    }
}



