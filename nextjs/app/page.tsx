/**
 * Name: Add calendar page
 * Description:
 * Outputs:
 * Sources: https://nextjs.org/docs/app/guides/forms
 * Author(s): Addison Bartelli
 * Date: 02/14/26
 */
import CalendarPage from "@/components/features/calendarPage";

// Added hardcoded scheduled tasks for now (by Elizabeth)
import { FlexibleTask } from "@/app/types";
import { convertTaskToEvent } from "@/utils/calendar";

export const mockScheduledTasks: FlexibleTask[] = [
  {
    task_id: "1",
    name: "Sanitizing Door Handles",
    amt_mins: 30,
    start: "2026-03-20T09:00:00",
    end: "2026-03-20T09:30:00"
  },
  {
    task_id: "2",
    name: "Laundry",
    amt_mins: 180,
    start: "2026-03-17T17:00:00",
    end: "2026-03-17T20:00:00"
  }
]

// Added mock events for now (by Elizabeth)
/*
import { GoogleCalendarEvent } from "../types";
import { convertGoogleCalendarEventToEvent } from "../../utils/calendar";
const mockGoogleCalendarEvents: GoogleCalendarEvent[] = [
  // Monday (23)
  {
    id: "1",
    summary: "HSES 108",
    start: { dateTime: "2026-02-23T09:00:00" },
    end: { dateTime: "2026-02-23T10:00:00" },
  },
  {
    id: "2",
    summary: "ANTH 150 LEC",
    start: { dateTime: "2026-02-23T10:00:00" },
    end: { dateTime: "2026-02-23T11:00:00" },
  },
  {
    id: "3",
    summary: "EECS 582 LEC",
    start: { dateTime: "2026-02-23T12:00:00" },
    end: { dateTime: "2026-02-23T13:00:00" },
  },
  {
    id: "4",
    summary: "BIOL 676 LEC",
    start: { dateTime: "2026-02-23T14:00:00" },
    end: { dateTime: "2026-02-23T15:00:00" },
  },
  {
    id: "5",
    summary: "Lab",
    start: { dateTime: "2026-02-23T15:00:00" },
    end: { dateTime: "2026-02-23T17:00:00" },
  },

  // Tuesday (24)
  {
    id: "6",
    summary: "EECS 690",
    start: { dateTime: "2026-02-24T11:00:00" },
    end: { dateTime: "2026-02-24T12:30:00" },
  },
  {
    id: "7",
    summary: "EECS 465 LEC",
    start: { dateTime: "2026-02-24T14:00:00" },
    end: { dateTime: "2026-02-24T15:00:00" },
  },
  {
    id: "8",
    summary: "Lab Group Meeting",
    start: { dateTime: "2026-02-24T15:30:00" },
    end: { dateTime: "2026-02-24T17:00:00" },
  },

  // Wednesday (25)
  {
    id: "9",
    summary: "HSES 108",
    start: { dateTime: "2026-02-25T09:00:00" },
    end: { dateTime: "2026-02-25T10:00:00" },
  },
  {
    id: "10",
    summary: "ANTH 150 LEC",
    start: { dateTime: "2026-02-25T10:00:00" },
    end: { dateTime: "2026-02-25T11:00:00" },
  },
  {
    id: "11",
    summary: "EECS 465 LBN",
    start: { dateTime: "2026-02-25T11:00:00" },
    end: { dateTime: "2026-02-25T12:00:00" },
  },
  {
    id: "12",
    summary: "EECS 582 LEC",
    start: { dateTime: "2026-02-25T12:00:00" },
    end: { dateTime: "2026-02-25T13:00:00" },
  },
  {
    id: "13",
    summary: "Lab",
    start: { dateTime: "2026-02-25T13:00:00" },
    end: { dateTime: "2026-02-25T17:00:00" },
  },

  // Thursday (26)
  {
    id: "14",
    summary: "SELF Interview",
    start: { dateTime: "2026-02-26T11:00:00" },
    end: { dateTime: "2026-02-26T12:00:00" },
  },
  {
    id: "15",
    summary: "SELF Interview Luncheon",
    start: { dateTime: "2026-02-26T12:00:00" },
    end: { dateTime: "2026-02-26T13:00:00" },
  },
  {
    id: "16",
    summary: "EECS 465 LEC",
    start: { dateTime: "2026-02-26T14:00:00" },
    end: { dateTime: "2026-02-26T15:00:00" },
  },
  {
    id: "17",
    summary: "Lab",
    start: { dateTime: "2026-02-26T15:00:00" },
    end: { dateTime: "2026-02-26T17:00:00" },
  },
  {
    id: "18",
    summary: "SELF Interviewee Dinner",
    start: { dateTime: "2026-02-26T17:30:00" },
    end: { dateTime: "2026-02-26T20:00:00" },
  },

  // Friday (27)
  {
    id: "20",
    summary: "ANTH 150 DIS",
    start: { dateTime: "2026-02-27T10:00:00" },
    end: { dateTime: "2026-02-27T11:00:00" },
  },
  {
    id: "21",
    summary: "Lab",
    start: { dateTime: "2026-02-27T12:00:00" },
    end: { dateTime: "2026-02-27T17:00:00" },
  },
];

const user_id = "123"; // mock user_id for testing
const mockEvents = mockGoogleCalendarEvents.map((event) =>
  convertGoogleCalendarEventToEvent(user_id, event),
);

// convert mockEvents to fullcalendar format for UI
const fullCalendarEvents = mockEvents.map((event) => ({
  id: event.event_id,
  title: event.name,
  start: event.start_time,
  end: event.end_time,
}));
*/

export default async function Page() {
  //return <CalendarPage events={fullCalendarEvents}/>;
  return <CalendarPage scheduledTasks={mockScheduledTasks}/>;
}
