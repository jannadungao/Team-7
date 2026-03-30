/**
 * Name: Task timer compoennt
 * Description: Component that handles timer logic including saving time to database.
 * Outputs: Timer with selected task.
 * Sources: https://www.npmjs.com/package/react-timer-hook
 * Author(s): Janna Dungao
 * Date: 02/14/26
 */
'use client'
import { useStopwatch } from "react-timer-hook";
import { useState } from "react";

interface TimerProps {
  selectedTask: {
    task_id: string;
    taskName: string;
    category: string;
    category_id?: string;
  } | null;
}

// main function mainly from above source
export default function MyStopwatch({ selectedTask }: TimerProps) {
  // to be used to display time
  const {
    milliseconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 20 });

  const [isSubmitting, setIsSubmitting] = useState(false); // for submitting time

  // handles submitting time to database
  const submitTime = async () => {
    if (!selectedTask?.task_id) {
      alert("Please select a task first");
      return;
    }

    if (!confirm("Submit time?")) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const time = minutes + (hours * 60);
      
      const response = await fetch('/api/tasks', { // http request - send time to db
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskId: selectedTask.task_id,
          time: time,
        }),
      });

      if (response.ok) { // erro rhandling
        alert("Time submitted successfully!");
        reset(new Date(), false); // reset timer to zero
        window.location.reload(); // reload page
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting time:", error);
      alert("Failed to submit time");
    } finally {
      setIsSubmitting(false); // reset 
    }
  }

  return (
    <div className="flex flex-col text-center">
        {/* Displays Time on stopwatch */}
        <div className="text-4xl text-gray-300 m-2">
            {hours}:{minutes}:{seconds}.{milliseconds}
        </div>
        {/* Display the user's chosen task to time */}
        {selectedTask && (
          <div className="text-gray-400 mt-2">
            Selected Task: {selectedTask.taskName}
          </div>
        )}
        <br />
        <div className="flex gap-4">
            {/* Start / Pause button */}
          <button
            className="bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2"
            onClick={isRunning ? pause : start}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          {/* Reset button */}
          <button onClick={() => reset(new Date(), false)} className="bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2">Reset</button>
          <button
            onClick={submitTime}
            disabled={!selectedTask || isSubmitting}
            className={`bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2 ${!selectedTask ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Time'}
          </button>
        </div>
    </div>
  );
}
