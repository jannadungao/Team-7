/**
 * Name: Import Google Calendar, Calendar component
 * Description: Preloaded calendar picklist for importing events
 * Outputs: json of calendar events for selected calendar, list of calendars to be displayed in home page
 * Sources:
 * Author(s): Marco M
 * Date: 02/27/26
 */

"use client";

import { useState, useEffect } from "react";

export default function ImportGoogleCalendarEvents() {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar list on component mount
  useEffect(() => {
    const fetchCalendarList = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/calendar");
        if (!response.ok) {
          throw new Error(`Error fetching calendars: ${response.statusText}`);
        }
        const data = await response.json();
        setCalendars(data.items || []);
        console.log("fetched calendar list: ", data);
      } catch (err: any) {
        setError("Failed to fetch calendar list");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarList();
  }, []);

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const calendarId = e.target.value;
    setSelectedCalendarId(calendarId);
    setEvents([]);

    if (calendarId) {
      await fetchCalendarEvents(calendarId);
    }
  };

  const fetchCalendarEvents = async (calendarId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/calendar?calendarId=${calendarId}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching calendar events: ${response.statusText}`,
        );
      }
      const eventsData = await response.json();
      setEvents(eventsData.items || []);
      console.log("fetched calendar events: ", eventsData);
    } catch (err: any) {
      setError("Failed to fetch calendar events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-[#6a7281]">
        <label className="text-gray-200 text-lg mb-3">
          Import Calendar Events
        </label>
        <select
          value={selectedCalendarId}
          onChange={handleSelectChange}
          disabled={loading || calendars.length === 0}
          className="bg-gray-800 text-gray-300 p-2 rounded border border-gray-700 text-base disabled:opacity-50"
        >
          <option value="">Select a calendar...</option>
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.summary}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-red-900 bg-opacity-30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg  bg-[#6a7281] bg-opacity-30 space-y-3">
          <p className="text-gray-200  text-sm font-medium">
            {events.length} events found
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 p-2 rounded text-sm text-gray-300"
              >
                <p className="font-medium">{event.summary}</p>
                <p className="text-xs text-gray-400">
                  {event.start?.dateTime || event.start?.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
