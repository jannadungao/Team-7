"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import MascotSelect from "./settings";
import ColorSchemeRadio from "./colorSchemeRadio";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "mascot">("general");
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | "system">(
    "system",
  );

  useEffect(() => {
    const stored = localStorage.getItem("colorScheme");
    if (stored === "light" || stored === "dark") {
      setColorScheme(stored);
    } else {
      const isDark = document.documentElement.classList.contains("dark");
      setColorScheme(isDark ? "dark" : "light");
    }
  }, []);

  const menuItems = [
    { id: "general", label: "General Settings" },
    { id: "mascot", label: "Mascot Selection" },
  ];

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="flex justify-center fixed inset-0">
        <div className="flex justify-center p-4 text-center items-center">
          <DialogPanel className="sm:min-w-[800px] sm:min-h-[500px] relative rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 sm:w-full sm:max-w-3xl sm:max-h-[85vh] flex flex-col overflow-hidden">
            {/* X / close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-0 right-0 p-4 cursor-pointer z-10 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Main Body  */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar with nav */}
              <div className="w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-white/10 overflow-y-auto">
                <nav className="flex flex-col p-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setActiveTab(item.id as "general" | "mascot")
                      }
                      className={`text-left px-4 py-3 rounded-lg transition-all mb-2 font-medium ${
                        activeTab === item.id
                          ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {activeTab === "general" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">General Settings</h2>
                    <div className="space-y-4">
                      <div className="w-fit mx-auto">
                        <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Color Scheme</label>
                        <ColorSchemeRadio defaultValue={colorScheme} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "mascot" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Mascot Selection</h2>
                    <MascotSelect />
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
