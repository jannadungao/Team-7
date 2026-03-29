/**
 * Name:
 * Description:
 * Outputs:
 * Sources:
 * Author(s): Marco?, Elizabeth
 * Date:
 */

import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { request } from "http";
import { google } from "googleapis"; // word is that this is more robust than fetch (elizabeth's been having issues with fetch)

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

// Elizabeth
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, start, end } = body;

    // Validate required fields
    if (!title || !start || !end) {
      return NextResponse.json(
        { error: "Missing required event fields (title, start, end)" },
        { status: 400 }
      );
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    });

    // Creates a Google Calendar API client instance using the access token from the session
    const googleCalendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = await googleCalendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        start: { dateTime: new Date(start).toISOString() },
        end: { dateTime: new Date(end).toISOString() }
      }
    });
    // Make API call to push event to user's primary Google Calendar 
    /*const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          summary: title, 
          start: { dateTime: new Date(start).toISOString() },
          end: { dateTime: new Date(end).toISOString() }
        })
      }
    )*/
    return NextResponse.json(event.data); // Return the created event data from Google Calendar API
  } catch (error) {
    console.error("Error creating event on Google Calendar:", error);
    return NextResponse.json(
      { error: "Failed to create event on Google Calendar" },
      { status: 500 }
    );
  }   
}