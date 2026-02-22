import { UUID } from "crypto";

export interface User {
    username: string; // UUID
    user_id: string; // UUID
    email: string; // chars@[sub.]example.tld
}

export interface FlexibleTask {
    user_id: string; //UUID
    task_id: string; // UUID
    name: string;
    amt_mins: number; // INT
}

// Written by Elizabeth
export interface GoogleCalendarEvent {
    id: string; // UUID (unique per calendar)
    summary: string; // title of the event
    start: { date?: string; dateTime?: string }; // for all-day events, date is used; for events with specific times, dateTime is used
    end: { date?: string; dateTime?: string };
    recurrence?: string[]; // array of recurrence rules
    originalStartTime?: string; // original date-time for an instance of a recurring event that has been moved to a different time
}

// Written by Elizabeth (what GoogleCalendarEvent will be converted to)
export interface Event {
    user_id: string; // UUID
    event_id: string; // UUID
    name: string; // title of the event
    start_time: string;  // can be date or dateTime
    end_time: string; 
}