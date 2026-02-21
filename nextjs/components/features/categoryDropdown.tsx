/**
 * Name: Add task category dropdown
 * Description:
 * Outputs: 
 * Sources: https://react-select.com/creatable
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'task-categories';

interface CategoryDropdownProps {
    control: any;
    name: "category";
    rules?: ControllerProps['rules'];
}

export default function CategoryDropdown({ control, name, rules }: CategoryDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>(defaultOptions);

    // Load saved categories from localStorage on mount
    useEffect(() => {
        const savedCategories = localStorage.getItem(STORAGE_KEY); // TO DO - change to use database
        if (savedCategories) {
            try {
                const parsed = JSON.parse(savedCategories);
                setOptions((prev) => [...prev, ...parsed]);
            } catch (e) {
                console.error('Failed to parse saved categories:', e);
            }
        }
    }, []);

    // Save categories to localStorage when new ones are added
    const saveCategories = (newOptions: Option[]) => {
        const customOptions = newOptions.filter(
            opt => !defaultOptions.some(def => def.label === opt.label)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customOptions));
    };

    const handleCreate = (inputValue: string) => {
        // Check if category already exists
        const exists = options.some(
            opt => opt.label.toLowerCase() === inputValue.toLowerCase()
        );
        if (exists) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setOptions((prev) => {
                const updated = [...prev, newOption];
                saveCategories(updated);
                return updated;
            });
            setIsLoading(false);
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
                    className="outline-hidden grow text-gray-500 placeholder:text-gray-300"
                />
            )}
        />
    );
}
