"use client";
/**
 * Name: Navigation Bar
 * Description: Navigation Bar frontend
 * Outputs:
 * Sources: https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/navbars
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Add Task", href: "/add-task", current: false },
  { name: "Task List", href: "/task-list", current: false },
  { name: "Calendar", href: "/calendar", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 bg-gray-500 group-data-open:hidden rounded"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="MARCO" src="MarcoLogo.png" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-950/50 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium",
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="data:image/jpeg;base64,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" //change this later
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <button
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-950/50 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
