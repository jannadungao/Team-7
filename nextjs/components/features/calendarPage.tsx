/**
 * Name: Calendar page component
 * Author(s): Addison Bartelli, Elizabeth Miller
 * Date: 02/14/26, 03/01/26
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { google } from "googleapis";
import { EventSourceInput } from "fullcalendar/index.js";
import CalendarObject from "./calendarClientObject";
import { GoogleCalendarEvent, Event } from "../../app/types";
import { convertGoogleCalendarEventToEvent } from "../../utils/calendar";

import { FlexibleTask } from "@/app/types";
import { convertTaskToEvent } from "@/utils/calendar";

interface CalendarPageProps {
    //events: EventSourceInput;
    scheduledTasks: FlexibleTask[];
}



export default async function CalendarPage( { scheduledTasks }: CalendarPageProps ) {
    const session = await getServerSession(authOptions); // returns the user's session object
    
    // Checks if session exists and has an access token
    if (!session?.accessToken) {
        return <div>Please sign in to view your calendar.</div>;
    }

    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({ 
        access_token: session.accessToken,
        refresh_token: session.refreshToken 
    });
    // Creates a Google Calendar API client instance using the access token from the session
    const googleCalendar = google.calendar({ version: "v3", auth: oAuth2Client }); 
    
    // Fetches the user's Google Calendar events using the API client
    const now = new Date(); // current time
    const timeMin = new Date(now); // copy of current time 
    timeMin.setDate(now.getDate() - 7); // set timeMin to one week ago
    const timeMax = new Date(now);
    timeMax.setDate(now.getDate() + 21); // set timeMax to three weeks from now
    const response = await googleCalendar.events.list({
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true, // expands recurring events into individual instances
        orderBy: "startTime" // orders events by their start time
    });

    if (!session.googleUserId) {
        throw new Error("No user ID found in session");
    }
    const user_id = session.googleUserId; 

    const googleCalendarEvents: GoogleCalendarEvent[] = response.data.items?.map(e => ({
        id: e.id ?? "",
        summary: e.summary ?? "",
        start: { dateTime: e.start?.dateTime, date: e.start?.date },
        end: { dateTime: e.end?.dateTime, date: e.end?.date },
        recurrence: e.recurrence,
        originalStartTime: e.originalStartTime?.dateTime ?? e.originalStartTime?.date,
    })) ?? [];

    const events: Event[] = [
        ...googleCalendarEvents.map(e => convertGoogleCalendarEventToEvent(user_id, e)),
        ...scheduledTasks.map(task => convertTaskToEvent(user_id, task)) // hardcoded scheduled tasks
    ];

    const fullCalEvents = events.map((e) => ({
        id: e.event_id,
        title: e.name,
        start: e.start_time,
        end: e.end_time,
    }));

    return (
        <div id="calendarTopContainer" className="grow flex flex-col min-h-0 m-4">
            <CalendarObject events={fullCalEvents} />
        </div>
    );
}