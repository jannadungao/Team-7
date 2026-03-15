/**
 * Name: Task timer compoennt
 * Description:
 * Outputs: 
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

export default function MyStopwatch({ selectedTask }: TimerProps) {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      const response = await fetch('/api/tasks', {
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

      if (response.ok) {
        alert("Time submitted successfully!");
        reset(new Date(), false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting time:", error);
      alert("Failed to submit time");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col text-center">
        <div className="text-4xl text-gray-300 m-2">
            {hours}:{minutes}:{seconds}.{milliseconds}
        </div>
        {selectedTask && (
          <div className="text-gray-400 mt-2">
            Selected Task: {selectedTask.taskName}
          </div>
        )}
        <br />
        <div className="flex gap-4">
          <button
            className="bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2"
            onClick={isRunning ? pause : start}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
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
