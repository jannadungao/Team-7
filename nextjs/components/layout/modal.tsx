/**
 * Name: Modal component
 * Description: Reuseable modal component. Currently designed specifically for scheduler.
 * Sources: Based on Simple Modal Component from dev.to
 * Author(s): Anya Combs
 * Date: 03/29/2025
 */

"use client";

import { GoogleCalendarEvent } from "@/app/types";

interface ModalProps {
  onClose: () => void;
  options: GoogleCalendarEvent[];
  taskName: string;
}

const OPTION_COLORS = ["bg-red-400", "bg-green-400", "bg-indigo-400"];

export default function ModalBox({ onClose, options, taskName }: ModalProps) {

  const handleOptionClick = async (option: GoogleCalendarEvent) => {
    const date = option.originalStartTime ?? "";
    const start = `${date}T${option.start.date}`;
    const end = `${date}T${option.end.date}`;

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskName, start, end }),
      });
      if (res.ok) {
        alert(`"${taskName}" scheduled for ${date} at ${option.start.date?.substring(0, 5)}`);
        onClose();
      } else {
        alert("Failed to add to Google Calendar");
      }
    } catch {
      alert("Error adding to calendar");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 shadow-xs z-50">
      <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full mx-4">
        <nav className="bg-black text-white flex justify-between px-4 py-2">
          <span className="text-lg">Schedule Tasks</span>
          <button
            className="bg-red-600 bg-opacity-50 py-1 px-2 hover:bg-red-500 hover:bg-opacity-70 transition-all rounded-full text-sm cursor-pointer"
            onClick={onClose}
          >
            &#10005;
          </button>
        </nav>
        <div className="p-3">
          {options.length === 0 ? (
            <p className="py-8 text-center text-gray-500 text-sm">
              No available slots found in this range. Try a wider date or time window.
            </p>
          ) : (
            <>
              <div className="font-bold py-2 pl-4 text-black">Please choose an option to schedule.</div>
              <div className="flex w-full justify-around items-stretch gap-4 p-2 py-8">
                {options.map((opt, i) => {
                  const date = opt.originalStartTime ?? "";
                  const startStr = opt.start.date?.substring(0, 5) ?? "";
                  const endStr = opt.end.date?.substring(0, 5) ?? "";
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(opt)}
                      className={`cursor-pointer flex-1 ${OPTION_COLORS[i] ?? "bg-gray-400"} rounded-2xl overflow-hidden p-3 text-sm text-white text-center hover:opacity-90 transition-opacity`}
                    >
                      <div className="font-medium">{date}</div>
                      <div>{startStr} – {endStr}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
