/**
 * Name:
 * Description:
 * Outputs:
 * Sources:
 * Author(s):
 * Date:
 */

import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { request } from "http";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //added local variables to help with sotring current calendar info
  const searchParams = request.nextUrl.searchParams;
  const calendarId = searchParams.get("calendarId");

  try {
    if (!calendarId) {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        console.error(
          "Google Calendar API rejected calendar list request:",
          response.status,
        );
        return NextResponse.json(
          { error: " Gcal API rejected calendar list request" },
          { status: response.status },
        );
      }
      const data = await response.json();
      return NextResponse.json(data);
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "Google Calendar API rejected request for retreiving events for this calendar:",
        response.status,
      );
      return NextResponse.json(
        {
          error:
            "Google Calendar API rejected the request for retrieving events for this calendar",
        },
        { status: response.status }, // Return actual status from Google
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}
