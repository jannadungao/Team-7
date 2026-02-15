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

export default function MyStopwatch() {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 20 });


  return (
    <div className="flex flex-col p-8 text-center">
        <div className="text-4xl">
            {hours}:{minutes}:{seconds}
        </div>
        <button className="text-4xl" onClick={isRunning ? pause : start}>{isRunning ? 'Pause' : 'Start'}</button>
        <br /><button onClick={() => reset((new Date()), false)}>Reset</button>
    </div>
  );
}
