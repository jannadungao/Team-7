/**
 * Name: Import Google Calendar, Calendar component
 * Description:
 * Outputs:
 * Sources:
 * Author(s): Marco M
 * Date: 02/27/26
 */

"use client";
import { log } from "console";
import { useState } from "react";

export default function ImportGoogleCalendarEvents() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        throw new Error(
          `Error fetching calendar events: ${response.statusText}`,
        );
      }
      const data = await response.json();
      setData(data);
      console.log("raw calendar data: ", data);
    } catch (err: any) {
      setError("failed to log calendar events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchCalendarEvents}
        disabled={loading}
        className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl"
        type="button"
      >
        {loading ? "Loading..." : "Import Calendar Events"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <div className="mt-6 space-y-4">
          <h6 className="text-sm font-medium text-gray-300">
            raw api response
          </h6>
          <pre className="bg-gray-800 p-4 rounded text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
