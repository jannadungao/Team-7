"use client";
/**
 * Name: Navigation Bar
 * Description: Navigation Bar frontend
 * Outputs: Navigation bar with menu button
 * Sources: https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/navbars
 * Author(s): Janna Dungao
 * Date: 02/09/26
 */
import React from "react";
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
import { usePathname } from "next/navigation";
import CurrentTasks from "../features/currentTasksForNav";
import { convertTaskToEvent } from "@/utils/calendar";
import { FlexibleTask } from "@/app/types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
// Navbar function - mainly from source above
export default function Example() {
  const pathname = usePathname();
  const [mascot, setMascot] = React.useState("aegyo.png");

  // page hrefs for mobile
  const mobileNavigation = [
    { name: "Home", href: "/"},
    { name: "Add Task", href: "/add-task"},
    { name: "Task List", href: "/task-list"},
    { name: "Calendar", href: "/calendar"},
    { name: "Mascot Options", href: "/mascot-select"}
  ];
  // page hrefs for desktop
  const desktopNavigation = [
    { name: "Home", href: "/"},
    { name: "Manage Tasks", href: "/manage-tasks"},
    { name: "Calendar", href: "/calendar"},
    { name: "Mascot Dashboard", href: "/mascot-select"},
  ];

  // Get user's mascot for profile picture
  React.useEffect(() => {
    const getMascot = async () => {
      const response = await fetch('/api/mascots', { // http request - get user's mascot id
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      const mascot_id = data[0]?.mascot_id || 0;
      // set correct mascot based on id
      if (mascot_id == 1) {
        setMascot("aegyo.png");
      } else if (mascot_id == 2) {
        setMascot("yassified.png");
      } else if (mascot_id == 3) {
        setMascot("gotcha.png");
      } 
    };
    getMascot();
  }, []);

  /**
   * def copied here from @/app/page to prevent server-client side mismatch for testing purposes
  */
  const mockScheduledTasks: FlexibleTask[] = [
    {
      task_id: "1",
      name: "Sanitizing Door Handles",
      amt_mins: 30,
      start: "2026-03-20T09:00:00",
      end: "2026-03-20T09:30:00"
    },
    {
      task_id: "2",
      name: "Laundry",
      amt_mins: 180,
      start: "2026-03-17T17:00:00",
      end: "2026-03-17T20:00:00"
    }
  ]


  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 flex flex-col gap-y-4"
    >
      <div className="relative flex h-16 items-center ml-6 max-w-7xl pr-4 pl-0">
        <div className="flex items-center sm:hidden">
          {/* Mobile menu button*/}
          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
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
        {/* Logo display */}
        <div className="flex flex-col shrink-0 items-center justify-center h-full">
          <img alt="MARCO" src="MarcoLogo.png" className="h-12 w-auto" />
        </div>

        <div className="nontailwind-spacer grow min-w-8"></div>

        {/* TODO: PRETTY */}
        <button 
          type="button"
          className="p-2 rounded-lg cursor-pointer text-2xl hover:bg-black"
          onClick={() => {/* show modal */}}
        >
          ⚙️
        </button>

        <div className="flex items-center pr-2">
          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 hover:bg-black">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              {/* display user's mascot as profile picture */}
              <img
                alt=""
                src={mascot}
                className="size-12 rounded-full "
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute w-md right-0 z-10 mt-2 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              {/* redirect to dashboard page */}
              <MenuItem>
                  <a
                  key="Mascot Options"
                  href="/mascot-select"
                  aria-current={"/mascot-select" === pathname ? "page" : undefined}
                  className={classNames(
                    "/mascot-select" === pathname
                      ? "bg-gray-950/50 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white",
                    "block px-4 py-2 items-center text-sm w-full text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden",
                  )}
                >
                  Dashboard
                </a>
              </MenuItem>
              <MenuItem>
                  {/* Signout button */}
                  <button
                      onClick={() => signOut({ callbackUrl: "/sign-in" })}
                      className="block px-4 py-2 w-full text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                      Sign out
                  </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {/* Text Menu Items for Left Vertical Nav */}
      <div className="hidden sm:ml-6 sm:flex flex-col justify-center">
        {/* Display menu options - mobile */}
        <div className="flex flex-col space-x-4 xl:hidden">
          {mobileNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
              className={classNames(
                item.href === pathname
                  ? "bg-gray-950/50 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "rounded-md px-3 py-2 text-sm font-medium",
              )}
            >
              {item.name}
            </a>
          ))}
        </div>
        {/* Display menu options - Desktop */}
        <div className="space-x-4 hidden xl:flex flex-col">
          {desktopNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
              className={classNames(
                item.href === pathname
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

      {/* ACTIVE TASKS DISPLAY */}
      {/* consider moving to external component past demo period */}
      {/* currently piped with mock tasks from calendar/page.tsx */}
      {/* <CurrentTasks flexDirection={"col"} gap={2} ml={6} taskEvents={mockScheduledTasks.map(t => convertTaskToEvent("", t))} /> */}

      <DisclosurePanel className="sm:hidden md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {mobileNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
              className={classNames(
                item.href === pathname
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

`<div className="hidden sm:ml-6 sm:flex flex-col justify-center">
  {/* Display menu options - mobile */}
  <div className="flex space-x-4 xl:hidden">
    {mobileNavigation.map((item) => (
      <a
        key={item.name}
        href={item.href}
        aria-current={item.href === pathname ? "page" : undefined}
        className={classNames(
          item.href === pathname
            ? "bg-gray-950/50 text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white",
          "rounded-md px-3 py-2 text-sm font-medium",
        )}
      >
        {item.name}
      </a>
    ))}
  </div>
  {/* Display menu options - Desktop */}
  <div className="space-x-4 hidden xl:flex">
    {desktopNavigation.map((item) => (
      <a
        key={item.name}
        href={item.href}
        aria-current={item.href === pathname ? "page" : undefined}
        className={classNames(
          item.href === pathname
            ? "bg-gray-950/50 text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white",
          "rounded-md px-3 py-2 text-sm font-medium",
        )}
      >
        {item.name}
      </a>
    ))}
  </div>
</div>`