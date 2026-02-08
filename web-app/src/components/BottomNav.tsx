
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, PlusCircle, User } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light pb-[env(safe-area-inset-bottom)] pt-2 px-6 flex justify-between items-center z-50 h-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-text-soft'}`}>
                <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
                <span className="text-xs font-medium">广场</span>
            </Link>

            <Link href="/shopping" className={`flex flex-col items-center gap-1 ${isActive('/shopping') ? 'text-primary' : 'text-text-soft'}`}>
                <ClipboardList size={24} strokeWidth={isActive('/shopping') ? 2.5 : 2} />
                <span className="text-xs font-medium">备菜</span>
            </Link>

            <Link href="/create" className={`flex flex-col items-center gap-1 ${isActive('/create') ? 'text-primary' : 'text-text-soft'}`}>
                <PlusCircle size={32} strokeWidth={isActive('/create') ? 2.5 : 2} />
                <span className="text-xs font-medium">创作</span>
            </Link>

            <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-text-soft'}`}>
                <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className="text-xs font-medium">我的</span>
            </Link>
        </div>
    );
}
