/**
 * Name: Import Google Calendar, Calendar component
 * Description:
 * Outputs:
 * Sources:
 * Author(s): Marco M
 * Date: 02/27/26
 */

"use client";

import { useState } from "react";
import CalendarPicklist from "./CalendarPicklist";

export default function ImportGoogleCalendarEvents() {
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarEvents = async () => {
    if (!selectedCalendarId) {
      setError("Please select a calendar first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/calendar?calendarId=${selectedCalendarId}`,
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching calendar events: ${response.statusText}`,
        );
      }
      const data = await response.json();
      setData(data);
      console.log("raw calendar data: ", data);
    } catch (err: any) {
      setError("Failed to fetch calendar events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <CalendarPicklist onCalendarSelect={setSelectedCalendarId} />
      {selectedCalendarId && (
        <button
          onClick={fetchCalendarEvents}
          disabled={loading}
          className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl disabled:opacity-50"
          type="button"
        >
          {loading ? "Loading..." : "Fetch Events"}
        </button>
      )}

      {error && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-red-900 bg-opacity-30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {data && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-green-900 bg-opacity-30">
          <p className="text-green-400 text-sm">
            Calendar events imported successfully!
          </p>
        </div>
      )}
    </div>
  );
}
