
/**
 * Name: Add task category dropdown
 * Description:
 * Outputs:
 * Sources: https://react-select.com/creatable
 * Author(s): Janna Dungao
 * Date: 02/11/26
 */

'use client';
import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Controller, ControllerProps } from 'react-hook-form';

interface Option {
    readonly label: string;
    readonly value: string;
}

// const createOption = (label: string) => ({
//     label,
//     value: label.toLowerCase().replace(/\W/g, ''),
// });

// const defaultOptions = [
//     createOption('Groceries'),
//     createOption('Laundry'),
//     createOption('Pay Bills'),
// ];

interface Category {
    category_id: string;
    name: string;
}

interface CategoryDropdownProps {
    control: any;
    name: "category";
    rules?: ControllerProps['rules'];
}

const STORAGE_KEY = 'task-categories';

export default function CategoryDropdown({ control, name, rules }: CategoryDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [usedDb, setUsedDb] = useState(false);

    // Default options as fallback
    const defaultOptions: Option[] = [
        { label: 'Groceries', value: 'Groceries' },
        { label: 'Laundry', value: 'Laundry' },
        { label: 'Pay Bills', value: 'Pay Bills' },
    ];

    // Load categories 
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const categories: Category[] = await response.json();
                    const categoryOptions = categories.map((cat) => ({
                        label: cat.name,
                        value: cat.category_id,
                    }));
                    setOptions(categoryOptions);
                    setUsedDb(true);
                    return;
                }
            } catch (error) {
                console.log('DB not available, using localStorage fallback');
            }

            // Fallback to localStorage 
            // const savedCategories = localStorage.getItem(STORAGE_KEY);
            // if (savedCategories) {
            //     try {
            //         const parsed = JSON.parse(savedCategories);
            //         setOptions([...defaultOptions, ...parsed]);
            //     } catch (e) {
            //         setOptions(defaultOptions);
            //     }
            // } else {
            //     setOptions(defaultOptions);
            // }
        }
        fetchCategories();
    }, []);

    // save new categories to local as backup
    // const saveCategories = (newOptions: Option[]) => {
    //     const customOptions = newOptions.filter(
    //         opt => !defaultOptions.some(def => def.label === opt.label)
    //     );
    //     localStorage.setItem(STORAGE_KEY, JSON.stringify(customOptions));
    // };

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
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: inputValue }),
                });

                if (response.ok) {
                    const newCategory: Category = await response.json();
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

        // Fallback: create locally
        // setTimeout(() => {
        //     const newOption = { label: inputValue, value: inputValue };
        //     setOptions((prev) => {
        //         const updated = [...prev, newOption];
        //         saveCategories(updated);
        //         return updated;
        //     });
        //     setIsLoading(false);
        // }, 500);
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

