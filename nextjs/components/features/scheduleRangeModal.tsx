/**
 * Name: 
 * Description:
 * Outputs: 
 * Sources:
 * Author(s): Janna Dungao
 * Date: 02/21/26
 */
'use client'

import { useState } from 'react'

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                >$#x2715;</button>
                {children}
            </div>
        </div>
    );
};

const FormModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: { startDate: Date; endDate: Date; startTime: Time}) => void }) => {
    const [formData, setFormData] = useState({ name: '', email: ''});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg">Enter Scheduling Dates & Times</h2>
            <form onSubmit={handleSubmit}>

            </form>
        </Modal>
    )
}