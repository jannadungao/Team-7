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
    milliseconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 20 });


  return (
    <div className="flex flex-col text-center">
        <div className="text-4xl text-gray-300">
            {hours}:{minutes}:{seconds}:{milliseconds}
        </div><br />
        <button className="text-2xl bg-[#6a7281] text-gray-200 rounded-2xl w-full p-2" onClick={isRunning ? pause : start}>{isRunning ? 'Pause' : 'Start'}</button>
        <br /><button onClick={() => reset((new Date()), false)} className="text-gray-300">Reset</button>
    </div>
  );
}
