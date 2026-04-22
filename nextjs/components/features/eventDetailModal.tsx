/**
 * Name: Event Details Modal
 * Description: Modal pops up when user clicks on an event on their calendar
 * Sources: https://fullcalendar.io/docs/eventClick
 * Author(s): Janna Dungao
 * Date: 04/20/26
 */

'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

// event detail interface
interface EventDetailModalProps {
    event: any; // EventClickData
    isOpen: boolean;
    onClose: () => void;
    onGoToTimer: () => void;
}

// exports to calendar client object
export default function EventDetailModal({ event, isOpen, onClose, onGoToTimer }: EventDetailModalProps) { 
    if (!event) return null;
    
    // get time variables from clicked event
    const startTime = event.event.start ? new Date(event.event.start).toLocaleString() : 'N/A';
    const endTime = event.event.end ? new Date(event.event.end).toLocaleString() : 'N/A';

    return (
        <div className="mx-4">
            {/* Modal  */}
            <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                <DialogBackdrop 
                    transition 
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                    <div className="fixed inset-0 flex justify-center">
                        <div className="flex justify-center p-8 text-center items-center">
                            <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                                {/* Close button */}
                                <button type="button" onClick={onClose} className="absolute top-0 right-0 p-4 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button> 

                                {/* Displays event info - name start and end times */}
                                <div className="flex flex-col h-full p-8">
                                    <h2 className="text-2xl text-white mb-4 text-center">Event Details</h2>
                                    <div className="space-y-4 mb-6">
                                        {/* Display category or event title */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 block mb-1">Name:</label>
                                            <p className="text-lg text-white bg-gray-700 p-3 rounded-lg">{event.event.title}</p>
                                        </div>
                                        {/* display start time */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 block mb-1">Start Time:</label>
                                            <p className="text-lg text-white bg-gray-700 p-3 rounded-lg">{startTime}</p>
                                        </div>
                                        {/* Display end time */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 block mb-1">End Time:</label>
                                            <p className="text-lg text-white bg-gray-700 p-3 rounded-lg">{endTime}</p>
                                        </div>
                                    </div>
                                    {/* close button, time task button */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-xl cursor-pointer text-white px-6 py-3 rounded-2xl font-medium transition-colors"
                                        >
                                            Close
                                        </button>
                                        {/* button to redirect user to timer for clicked event */}
                                        <button
                                            onClick={onGoToTimer}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xl cursor-pointer text-white px-6 py-3 rounded-2xl font-medium transition-colors"
                                        >
                                            Time task
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>    
                        </div>
                        
                    </div>
            </Dialog>            
        </div>

    );
}
