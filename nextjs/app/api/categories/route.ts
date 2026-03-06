/**
 * Name: Route to handle categories
 * Description: GET all categories, POST to create new category (SELECT then INSERT if not exists)
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route
 * Author(s): Janna Dungao
 * Date: 02/27/26
 */

import sql, { Categories } from "../../postgres";
import { randomUUID } from "crypto";

// interface Category {
//     category_id: string;
//     name: string;
//     time: number;
// }

// GET: Fetch all categories
export async function GET() {
    try {
        const categories = await sql<Categories[]>`SELECT * FROM categories ORDER BY name ASC`;
        return Response.json(categories);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch categories." }, { status: 500 });
    }
}

// POST: Create new category if it doesn't exist 
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return Response.json({ error: "Category name is required." }, { status: 400 });
        }

        // First, try to find existing category
        const existing = await sql<Categories[]>`
            SELECT * FROM categories WHERE LOWER(name) = LOWER(${name})
        `;

        if (existing.length > 0) {
            // Category already exists, return it
            return Response.json(existing[0]);
        }

        // Category doesn't exist, create new one
        const newCategory = await sql<Categories[]>`
            INSERT INTO categories (category_id, name, time)
            VALUES (${randomUUID()}, ${name}, 0)
            RETURNING *
        `;

        return Response.json(newCategory[0]);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to create category." }, { status: 500 });
    }
}



