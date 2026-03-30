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
import React from "react";

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
            <div className="font-bold py-2 pl-4 text-black">Please choose an option to schedule.</div>
            <div className="flex w-full justify-around items-stretch gap-4 p-2 py-8">
                <button className="flex-1 bg-indigo-400 rounded-2xl overflow-hidden p-2">Time 1</button>
                <button className="flex-1 bg-red-400 rounded-2xl overflow-hidden p-2">Time 2</button>
                <button className="flex-1 bg-green-400 rounded-2xl overflow-hidden p-2">Time 3</button>
            </div>
        </div>
      </div>
    </div>
  );
};
