"use client";
import { useState } from "react";

interface CalendarPicklistProps {
  onCalendarSelect: (calendarId: string) => void;
}

export default function CalendarPicklist({
  onCalendarSelect,
}: CalendarPicklistProps) {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicklist, setShowPicklist] = useState(false);

  const fetchCalendarList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        throw new Error(`Error fetching calendar list: ${response.statusText}`);
      }
      const data = await response.json();
      setCalendars(data.items || []);
      setShowPicklist(true);
      console.log("fetched calendar list: ", data);
    } catch (err: any) {
      setError("Failed to fetch calendar list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCalendarId = e.target.value;
    setSelectedCalendarId(selectedCalendarId);
    onCalendarSelect(selectedCalendarId);
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchCalendarList}
        disabled={loading}
        className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl"
        type="button"
      >
        {loading ? "Loading..." : "Select Calendar"}
      </button>

      {showPicklist && calendars.length > 0 && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-[#6a7281]">
          <label className="text-gray-200 text-lg mb-3">
            Choose a calendar:
          </label>
          <select
            value={selectedCalendarId}
            onChange={handleSelectChange}
            className="bg-gray-800 text-gray-300 p-2 rounded border border-gray-700 text-base"
          >
            <option value="">Select a calendar...</option>
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.summary}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && (
        <div className="flex flex-col p-4 rounded-2xl drop-shadow-lg bg-red-900 bg-opacity-30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
