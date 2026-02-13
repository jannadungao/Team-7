/**
 * Name: Add task category dropdown
 * Description:
 * Outputs: 
 * Sources: https://react-select.com/creatable
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Controller, ControllerProps } from 'react-hook-form';

interface Option {
    readonly label: string;
    readonly value: string;
}

const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
    createOption('Groceries'),
    createOption('Laundry'),
    createOption('Pay Bills'),
];

interface CategoryDropdownProps {
    control: any;
    name: "category";
    rules?: ControllerProps['rules'];
}

export default function CategoryDropdown({ control, name, rules }: CategoryDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(defaultOptions);

    const handleCreate = (inputValue: string) => {
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setIsLoading(false);
            setOptions((prev) => [...prev, newOption]);
        }, 1000);
    };

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value, onBlur, ref } }) => (
                <CreatableSelect
                    ref={ref}
                    isClearable
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={(newValue) => onChange(newValue?.label || '')}
                    onCreateOption={handleCreate}
                    options={options}
                    value={options.find(option => option.label === value) || null}
                    onBlur={onBlur}
                    className="rounded-2xl outline-hidden grow text-gray-500"
                />
            )}
        />
    );
}
