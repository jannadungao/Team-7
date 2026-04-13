/**
 * Name: Modal component
 * Description: Reuseable modal component. Currently designed specifically for scheduler.
 * Sources: Based on Simple Modal Component from dev.to
 * Author(s): Anya Combs
 * Date: 03/29/2025
 */

// notes: once the scheduler backend is in, need to adjust a lot of this.
// basically just a mockup for now, but should also maybe be remodeled.
// might look better as a dropdown menu with the current setup, but unsure.
import { useState, useEffect } from "react";

import { ResponsiveDateRangePicker, ResponsiveTimeRangePicker } from "../../components/features/scheduleRangePickers";
import ConfirmDelete from "../../components/features/confirmDelete";
import MyStopwatch from "../../components/features/timer";
import TaskOption from "../../components/features/taskOptions";

interface ModalProps {
  onClose: () => void;
}


export default function ModalBox({ onClose }: ModalProps) {

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 shadow-xs">
      <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full mx-4">
        <nav className="bg-black text-white flex justify-between px-4 py-2">
          <span className="text-lg">Schedule Tasks</span>
          <button
            className="bg-red-600 bg-opacity-50 py-1 px-2 hover:bg-red-500 hover:bg-opacity-70 transition-all rounded-full text-sm"
            onClick={onClose}
          >
            &#10005;
          </button>
        </nav>
        <div className="p-3">
            
        </div>
      </div>
    </div>
  );
};

// code here is by janna; moved to the modal for now
function ModalContent() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [option, setOption] = useState<string>('Mark Complete');
  
  return (
    <div>
      {/* Scheduling Range Pickers */}
      <div className="flex flex-col">
          <h2 className="p-2">Date Range:</h2>
          <ResponsiveDateRangePicker onDateChange={handleDateChange}/>
      </div>
      
      <div className="flex flex-col">
          <h2 className="p-2">Time Range: </h2>
          <div className="flex gap-2">
              <div className="flex-1">
                  <ResponsiveTimeRangePicker onTimeChange={handleStartTimeChange} selectedTime={startTime} />
              </div>
              <div className="flex text-2xl p-2 justify-center">-</div>
              <div className="flex-1">
                  <ResponsiveTimeRangePicker onTimeChange={handleEndTimeChange} selectedTime={endTime} />
              </div>
          </div>
      </div>    
  </div>
  
  {/* Submit button to send selected tasks to the scheduling algorithm */}
  <button 
      type="button"
      onClick={handleSchedule}
      className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl cursor-pointer"
  >
      Schedule Task(s)
  </button>
  )
}