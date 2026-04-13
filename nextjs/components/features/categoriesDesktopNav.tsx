"use client";
import React from "react";
import AddTaskModal from "./addTaskModal";

type Category = {
  category_id: string;
  name: string;
};

function stringToHslColor(str: string, s = 70, l = 55) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h} ${s}% ${l}%)`;
}

export default function CategoriesDesktopNav({ className }: { className?: string }) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async () => {
    const name = window.prompt("New category name");
    if (!name) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      const newCat = await res.json();
      setCategories((prev) => {
        // avoid duplicates
        if (prev.find((p) => p.category_id === newCat.category_id)) return prev;
        return [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name));
      });
    } catch (err) {
      window.alert("Could not create category: " + String(err));
    }
  };

  const deleteCategory = async (cat: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: cat.category_id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Failed to delete category');
      }
      setCategories((prev) => prev.filter((p) => p.category_id !== cat.category_id));
    } catch (err) {
      window.alert('Could not delete category: ' + String(err));
    }
  }

  return (
    <div className={className}>
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase">TASK CATEGORIES</h3>
        <div className="mt-2 flex flex-col gap-2">
          {loading && <div className="text-sm text-gray-400">Loading...</div>}
          {error && <div className="text-sm text-red-400">{error}</div>}

          {categories.map((c) => (
            <div key={c.category_id} className="flex items-center gap-2">
              <div
                className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-200 hover:bg-white/10 flex-1 text-left"
              >
                {c.name}
              </div>
              <AddTaskModal buttonStyles="h-6 w-6 rounded-full shrink-0 border-2 border-white/10 text-green-700 cursor-pointer" forcedCategory={{name: c.name, id: c.category_id}} buttonText="+" />
              <button
                onClick={() => deleteCategory(c)}
                aria-label={`delete-${c.name}`}
                className="h-6 w-6 rounded-full shrink-0 border-2 border-white/10 cursor-pointer"
              >
                <span className="text-red-700">×</span>
              </button>
            </div>
          ))}

          <button
            onClick={addCategory}
            className="mt-1 rounded-full bg-gray-700/40 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700/60 flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            add category
          </button>
        </div>
      </div>
    </div>
  );
}
