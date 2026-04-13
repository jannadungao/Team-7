/**
 * Name: Schedule Range Pickers
 * Description: Component for user to choose date and time ranges when scheduling.
 * Outputs: 
 * Sources: https://reactdatepicker.com/#example-date-range
 * Author(s): Janna Dungao
 * Date: 02/22/26
 */
import { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

// For user inputted date range
interface DateRangePickerProps {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

// Main function - mainly from source website above
export function ResponsiveDateRangePicker({ onDateChange }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);

    // when chooser clicks and makes a change in interface
    const onChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        onDateChange(start, end);
    };

    return (
        // from source
        <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        required
        selectsRange
        showIcon
        className="flex text-center bg-white rounded-2xl text-gray-500 w-full"
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

    // update inputted time
    const handleChange = (newTime: Date | null) => {
        setTime(newTime);
        onTimeChange(newTime);
    };

    return (
        <div className="flex flex-1 [&>.react-datepicker-wrapper]:flex-1">
            {/* from source */}
            <DatePicker
            selected={time}
            onChange={handleChange}
            showTimeSelect
            showTimeSelectOnly
            required
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="hh:mm aa"
            className="flex py-1 w-full flex-1 rounded-2xl bg-white text-center text-gray-500 text-lg"
            />
        </div>
    )
}
