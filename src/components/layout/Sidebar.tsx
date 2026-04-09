"use client";

import { FileText, Home, Plus, Clipboard, Users, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/settings/LanguageSwitcher";
import { useI18n } from "@/i18n/context";
import { useState } from 'react';
import SettingsModal from '@/components/settings/SettingsModal';
import LanguageSettings from '@/components/settings/LanguageSettings';
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { tCommon } = useI18n();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-40 hidden lg:block",
      className
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold">Saga Invoice</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === "/" ? "bg-primary text-white" : "hover:bg-slate-800"
              )}
            >
              <Home className="h-5 w-5" />
              <span>{tCommon("nav.home")}</span>
            </a>
          </li>
          <li>
            <a
              href="/editor"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === "/editor" ? "bg-primary text-white" : "hover:bg-slate-800"
              )}
            >
              <Plus className="h-5 w-5" />
              <span>{tCommon("nav.newInvoice")}</span>
            </a>
          </li>
          <li>
            <a
              href="/templates"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === "/templates" ? "bg-primary text-white" : "hover:bg-slate-800"
              )}
            >
              <Clipboard className="h-5 w-5" />
              <span>{tCommon("nav.templates")}</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>{tCommon("nav.clients")}</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>{tCommon("nav.items")}</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>{tCommon("nav.history")}</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <button
          type="button"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer w-full text-left"
          onClick={openSettings}
          aria-label="Change language"
        >
          <Settings className="h-5 w-5" />
          <span>{tCommon("nav.settings")}</span>
        </button>
        <LanguageSwitcher />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        title={tCommon('settings.modal.title') || 'Settings'}
      >
        <LanguageSettings />
      </SettingsModal>
    </aside>
  );
}
