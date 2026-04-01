import { Event } from "@/app/types";

export default function CurrentTasks({flexDirection, gap, taskEvents, ml} : {
    flexDirection: "col" | "row",
    gap: 0 | 2 | 4 | 6 | 8,
    taskEvents: Event[],
    ml: 0 | 2 | 4 | 6 | 8,
}) {

    return (
        <section id="taskList" className={`flex flex-${flexDirection} gap-${gap.toString()} ml-${ml.toString()}`}>
            <h2 className="text-2xl">Active Tasks</h2>
            {taskEvents.map(te => <TaskForCurrentTasks taskEvent={te} key={te.start_time}/>)}
        </section>
    );
}

export function TaskForCurrentTasks({taskEvent} : {taskEvent: Event}) {

    return (
        <div>
            <h3 className="text-xl">{taskEvent.name}</h3>
            <ul>
                <li>Starts: {taskEvent.start_time}</li>
                <li>Ends: {taskEvent.end_time}</li>
            </ul>
        </div>
    );
}