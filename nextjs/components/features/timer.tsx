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
    if (!selectedTask?.category_id) {
      alert("Please select a task first");
      return;
    }

    if (!confirm("Submit time?")) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const time = minutes + (hours * 60);
      
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category_id: selectedTask.category_id,
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
        <div className="text-4xl text-gray-300">
            {hours}:{minutes}:{seconds}:{milliseconds}
        </div>
        {selectedTask && (
          <div className="text-gray-400 mt-2">
            Selected Task: {selectedTask.taskName}
          </div>
        )}
        <br />
        <button 
          className="text-2xl bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2" 
          onClick={isRunning ? pause : start}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <br />
        <button onClick={() => reset(new Date(), false)} className="text-gray-300">Reset</button>
        <button 
          onClick={submitTime} 
          disabled={!selectedTask || isSubmitting}
          className={`text-gray-300 text-lg ${!selectedTask ? 'opacity-50' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Time'}
        </button>
    </div>
  );
}
