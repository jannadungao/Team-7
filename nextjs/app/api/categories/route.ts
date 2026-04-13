/**
 * Name: Route to handle categories
 * Description: GET all categories, POST to create new category (SELECT then INSERT if not exists)
 * Sources: https://nextjs.org/docs/app/api-reference/file-conventions/route
 * Author(s): Janna Dungao
 * Date: 02/27/26
 */

import { getServerSession } from "next-auth";
import sql, { Categories } from "../../postgres";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";



// GET: Fetch all categories
export async function GET() {
    try {
        // get session to know which user's categories to return
        const session = await getServerSession(authOptions);

        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }

        const googleUserId = session.googleUserId;

        // return categories that belong to the user or are global (NULL)
        const categories = await sql<Categories[]>`
            SELECT * FROM categories
            WHERE google_user_id = ${googleUserId}
            ORDER BY name ASC
        `;
        return Response.json(categories);
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to fetch categories." }, { status: 500 });
    }
}

// POST: Create new category if it doesn't exist 
export async function POST(request: Request) {
    try {
        const body = await request.json(); // user inputted category
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
            INSERT INTO categories (category_id, name)
            VALUES (${randomUUID()}, ${name})
            RETURNING *
        `;

        return Response.json(newCategory[0]); // return the newly created category
    } catch (error) {
        console.error("Database error: ", error);
        return Response.json({ error: "Failed to create category." }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { category_id } = await request.json();

    if (typeof category_id !== "string") {
        return NextResponse.json(
            { error: 'Category parameter is required' },
            { status: 400 }
        );
    }
    
    try {
        // TODO: Add your logic here
        // Get session to access Google user ID
        const session = await getServerSession(authOptions);
        if (!session?.googleUserId) {
            return Response.json({ error: "Unauthorized. Please sign in with Google." }, { status: 401 });
        }
        // Get Google user ID from session
        const googleUserId = session.googleUserId;
                const result = await sql`
                    delete from categories
                    where category_id = ${category_id}
                        and google_user_id = ${googleUserId}
                    returning category_id;
                `;
                // If no rows were deleted, return 404
                if (!result || result.length === 0) {
                    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
                }
                return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' + error },
            { status: 500 },
        );
    }
}


