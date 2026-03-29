/**
 * Name: Mascot select component
 * Description:
 * Outputs:
 * Sources: 
 * Author(s): Janna Dungao
 * Date: 03/25/26
 */
'use client'

import React, { useState, useEffect } from 'react';

export default function MascotSelect() {
  const [selectedMascotId, setSelectedMascotId] = useState<number | null>(null);

    // mock mascots
    const mascots = [
        {name: "Happy-maxxing", href: "/aegyo.png", mascot_id: 1 },
        {name: "The Ultimate Yassifier", href: "/yassified.png", mascot_id: 2 },
        {name: "You better watch (for g)out", href: "/gotcha.png", mascot_id: 3 },
    ];

    useEffect(() => {
        const loadCurrent = async () => {
            try {
                const res = await fetch('/api/mascots');
                if (res.ok) {
                    const data = await res.json();
                    setSelectedMascotId(data[0]?.mascot_id || null);
                }
            } catch (e) {
                console.error('Failed to load current mascot:', e);
            }
        };
        loadCurrent();
    }, []);

    const handleSubmit = async () => {
        if (!selectedMascotId) {
            alert('Please select a mascot.'); 
            return;
        }

        try {
            const response = await fetch('/api/mascots', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mascot_id: selectedMascotId }),
            });

            if (response.ok) {
                alert('Mascot selection saved successfully.');
                console.log('Mascot selection saved.');
                window.location.reload();  // Reload to update navbar image
            } else {
                const error = await response.text();
                alert('Failed to save mascot: ' + error);
                console.error('Mascot save failed:', error);
            }
        } catch (error) {
            alert('Failed to save mascot.');
            console.error('Mascot save failed:', error);
        }
    };

    return (
        <>
            {/* Mascot Options */}
            <div className="grid grid-cols-3 gap-4">
                {mascots.map((item, index) => (
                    <button 
                        key={index} 
                        type="button"
                        onClick={() => setSelectedMascotId(item.mascot_id)}
                        className={`flex flex-col p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl shadow transition-all focus:outline-none
                            ${selectedMascotId === item.mascot_id ? 'ring-2 ring-blue-500 ring-offset-2 bg-gray-800 dark:ring-offset-gray-900' : ''}`}
                    >
                        <img key={index} alt={item.name} src={item.href} className="rounded-2xl object-cover" /> 
                        <span className="p-2 text-2xl">{item.name}</span>    
                    </button>
                    
                ))}   
                <button type="button" onClick={handleSubmit} className="flex w-full bg-[#0b1930] text-gray-300 justify-center p-2 rounded-2xl mt-4">
                    Submit
                </button>                 
            </div>
        </>
    )
}

