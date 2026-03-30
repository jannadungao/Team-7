
/**
 * Name: Add task category dropdown
 * Description: Dropdown displaying categories
 * Outputs: Category dropdown
 * Sources: https://react-select.com/creatable
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

'use client';
import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Controller, ControllerProps } from 'react-hook-form';

// Interfaces

interface Option {
    readonly label: string;
    readonly value: string;
}

interface Category {
    category_id: string;
    name: string;
}

interface CategoryDropdownProps {
    control: any;
    name: string;
    rules?: ControllerProps['rules'];
}

// Main function - mainly from above source website

export default function CategoryDropdown({ control, name, rules }: CategoryDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [usedDb, setUsedDb] = useState(false);

    // Load categories 
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories'); // get categories from database
                if (response.ok) {
                    const categories: Category[] = await response.json();
                    const categoryOptions = categories.map((cat) => ({
                        label: cat.name,
                        value: cat.category_id,
                    }));
                    setOptions(categoryOptions); // save categories
                    setUsedDb(true);
                    return;
                }
            } catch (error) {
                console.log('Error fetching database');
            }

        }
        fetchCategories();
    }, []);

    // Handle creating a new category if it does not already exist
    const handleCreate = async (inputValue: string) => {
        // check if category exists
        const exists = options.some(
            opt => opt.label.toLowerCase() === inputValue.toLowerCase()
        );
        if (exists) {
            return;
        }

        setIsLoading(true);

        if (usedDb) {
            // try to create in database
            try {
                const response = await fetch('/api/categories', { // http request
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: inputValue }),
                });

                if (response.ok) { // error handling
                    const newCategory: Category = await response.json(); // create the new category
                    const newOption = {
                        label: newCategory.name,
                        value: newCategory.category_id,
                    };
                    setOptions((prev) => [...prev, newOption]);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Failed to create category in DB:', error);
            }
        }
    };

    return (
        // Controller to be displayed in addTask page - displays all current categories and allows for creation of new ones
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value, onBlur, ref } }) => (
                <CreatableSelect
                    ref={ref}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={(newValue) => onChange(newValue?.value || '')}
                    onCreateOption={handleCreate}
                    options={options}
                    value={options.find(option => option.value === value) || null}
                    onBlur={onBlur}
                    className="outline-hidden grow text-gray-500 placeholder:text-gray-300"
                />
            )}
        />
    );
}

