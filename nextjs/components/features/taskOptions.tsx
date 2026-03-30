/**
 * Name: Mark complete
 * Description: Mark tasks complete and send times to database.
 * Outputs: Mark Complete/Delete markdown
 * Sources: https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus#component-71d9116be789a254c260369f03472985-dark
 * Author(s): Janna Dungao
 * Date: 03/13/26
 */
'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

const taskOptions = [ // dropdown options
  'Mark Complete',
  'Delete'
]

interface TaskOptionProps {
  value: string;
  onSelect?: (option: string) => void;
}

// main function - mainly from above source
export default function TaskOption({ value, onSelect }: TaskOptionProps) {
  return (
    <Listbox value={value} onChange={(selected) => onSelect?.(selected)}>
      <div className="relative mt-2">
        <ListboxButton className="flex rounded-md bg-gray-800/50 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <span className="block truncate">{value}</span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="mt-1 w-full overflow-auto rounded-md bg-gray-800 text-base outline-1 -outline-offset-1 outline-white/10 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {taskOptions.map((task) => (
            <ListboxOption
              key={task}
              value={task}
              className="group relative cursor-default py-2 pr-9 pl-3 text-white select-none data-focus:bg-indigo-500 data-focus:outline-hidden"
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal">{task}</span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
