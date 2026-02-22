/**
 * Name: 
 * Description:
 * Outputs: 
 * Sources: https://reactdatepicker.com/#example-date-range
 * Author(s): Janna Dungao
 * Date: 02/22/26
 */
import { useState } from "react";
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
// For user inputted date range
interface DateRangePickerProps {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function ResponsiveDateRangePicker({ onDateChange }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);

    const onChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        onDateChange(start, end);
    };

    return (
        <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        className="flex"
        />
    );
}

// For user inputted time range
interface TimeRangePickerProps {
    onTimeChange: (time: Date | null) => void;
    selectedTime?: Date | null;
}

export function ResponsiveTimeRangePicker({ onTimeChange, selectedTime }: TimeRangePickerProps) {
    const [time, setTime] = useState<Date | null>(selectedTime || new Date());

    const handleChange = (newTime: Date | null) => {
        setTime(newTime);
        onTimeChange(newTime);
    };

    return (
        <DatePicker
        selected={time}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="hh:mm aa"
        className="flex p-2 w-full rounded-2xl bg-white text-gray-500 text-lg"
        />
    )
}
