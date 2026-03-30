/**
 * Name: Types
 * Description: Contains types and constants for application
 * Author(s): 
 * Date:
 */


/**
 * When set to 1280, corresponds to tailwind "xl"
 */
export const desktopPixelWidthThreshold = 1280;

export interface User {
  username: string; // UUID
  user_id: string; // UUID
  email: string; // chars@[sub.]example.tld
}

export interface FlexibleTask {
   //user_id: string; //UUID <- commented out by Elizabeth: user_id will only be for type Event (which FlexibleTask will be converted to)
    task_id: string; // UUID <- make sure this is different from any id Google Calendar generates!!
    name: string;
    amt_mins: number; // INT
    //startDate?: Date;
    //endDate?: Date;
    //startTime?: string;
    //endTime?: string;
    start?: string; // edited by Elizabeth: will be in ISO format
    end?: string; // edited by Elizabeth: will be in ISO format
}

// next auth types written by marco
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string; // added by Elizabeth: needed to refresh the access token when it expires (without asking user to sign in again)
    error?: string;
    googleUserId?: string; // Google user's subject identifier
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accesTokenExpires?: number;
    error?: string;
    user_id?: string;
  }
}

// Calendar API types
// Written by Elizabeth
export interface GoogleCalendarEvent {
  id: string; // UUID (unique per calendar)
  summary: string; // title of the event
  start: { date?: string | null; dateTime?: string | null}; // for all-day events, date is used; for events with specific times, dateTime is used
  end: { date?: string | null; dateTime?: string | null };
  recurrence?: string[] | null; // array of recurrence rules
  originalStartTime?: string | null; // original date-time for an instance of a recurring event that has been moved to a different time
}

// Written by Elizabeth (what GoogleCalendarEvent and FlexibleTask will be converted to)
export interface Event {
  user_id: string; // UUID
  event_id: string; // UUID
  name: string; // title of the event
  start_time: string; // can be date or dateTime
  end_time: string;
}

