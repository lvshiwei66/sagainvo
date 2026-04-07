"use client";

import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-40 hidden lg:block",
      className
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-semibold">Saga Invoice</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>🏠</span>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href="/editor"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
            >
              <span>➕</span>
              <span>New Invoice</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>📋</span>
              <span>Templates</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>👥</span>
              <span>Clients</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>📦</span>
              <span>Items</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>📄</span>
              <span>History</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}
