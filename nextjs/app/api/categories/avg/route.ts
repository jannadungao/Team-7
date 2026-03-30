import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import sql from '@/app/postgres';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
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
        const result = await sql<{ category_average_ms: number | null }[]>`
          select round(avg(ms_taken), 0)::bigint as category_average_ms
          from flex_tasks
          where google_user_id = ${googleUserId}
            and category_id = (select category_id from categories where name = ${category})
            and done = true
            and ms_taken is not null;
        `;
        const avg = result[0].category_average_ms;
        return NextResponse.json({
            categoryAverageMs: avg
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' + error },
            { status: 500 },
        );
    }
}