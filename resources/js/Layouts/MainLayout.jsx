import { Link, usePage } from '@inertiajs/react';
import {
    FiHome, FiUsers, FiTool,
    FiFileText, FiGift, FiAlertTriangle, FiGrid, FiTrash2, FiTruck,
    FiHeart, FiUserCheck,
} from 'react-icons/fi';
import { useState } from 'react';

const NAV_ITEMS = [
    { href: '/',                      label: 'Inicio',          icon: FiHome },
    { href: '/casos',                 label: 'Casos',           icon: FiHeart },
    { href: '/ingenieros',            label: 'Ingenieros',      icon: FiTool },
    { href: '/materiales',            label: 'Materiales',      icon: FiFileText },
    { href: '/donantes',              label: 'Donantes',        icon: FiGift },
    { href: '/limpieza',              label: 'Limpieza',        icon: FiTrash2 },
    { href: '/transporte',            label: 'Transporte',      icon: FiTruck },
    { href: '/voluntarios/registrar', label: 'Ser voluntario',  icon: FiUserCheck },
];

const BOTTOM_NAV = [
    { href: '/',          label: 'Inicio',     icon: FiHome },
    { href: '/casos',     label: 'Casos',      icon: FiHeart },
    { href: '/limpieza',  label: 'Limpieza',   icon: FiTrash2 },
    { href: '/materiales', label: 'Materiales', icon: FiFileText },
];

const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

function NavIcon({ href, label, icon: Icon, active }) {
    return (
        <div className="relative group flex justify-center">
            <Link
                href={href}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}>
                <Icon className="w-5 h-5" />
            </Link>
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
                            opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-200">
                <div className="bg-gray-900 border border-white/10 text-white text-xs font-semibold
                                px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4
                                    border-transparent border-r-gray-900" />
                </div>
            </div>
        </div>
    );
}

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">

            {/* Alert strip */}
            <div className="bg-blue-700 text-white text-center text-[11px] font-semibold py-2 px-4
                            flex items-center justify-center gap-2 tracking-wide flex-shrink-0">
                <FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Emergencia activa — Terremoto Venezuela 24 jun 2026 — Magnitud 7.5
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar — solo desktop */}
                <aside className="hidden md:flex flex-col w-16 bg-gray-900 sticky top-0 h-[calc(100vh-32px)]
                                  flex-shrink-0 py-4 gap-2 items-center border-r border-white/5">
                    {/* Logo */}
                    <Link href="/" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center
                                               shadow-lg shadow-blue-900/40 mb-3 flex-shrink-0 hover:bg-blue-500 transition-colors">
                        <FiUsers className="text-white w-5 h-5" />
                    </Link>

                    {/* Divider */}
                    <div className="w-6 h-px bg-white/10 mb-1" />

                    {/* Nav items */}
                    <nav className="flex flex-col gap-1 flex-1 items-center w-full px-3">
                        {NAV_ITEMS.map(({ href, label, icon }) => (
                            <NavIcon
                                key={href}
                                href={href}
                                label={label}
                                icon={icon}
                                active={isActive(href, url)} />
                        ))}
                    </nav>

                    {/* Footer info */}
                    <div className="w-6 h-px bg-white/10 mt-1" />
                    <p className="text-[9px] text-slate-600 text-center leading-relaxed px-1 mt-2">
                        VZ<br />Ayuda
                    </p>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Header mobile */}
                    <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                        <div className="flex items-center px-4 h-14 gap-3">
                            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
                                <FiUsers className="text-white w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm tracking-tight">Venezuela Ayuda</span>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
                        <div className="max-w-5xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Bottom nav — solo mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
                <div className="flex">
                    {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href, url);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                                    active ? 'text-blue-700' : 'text-slate-400'
                                }`}>
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-semibold leading-none">{label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                            moreOpen ? 'text-blue-700' : 'text-slate-400'
                        }`}>
                        <FiGrid className="w-5 h-5" />
                        <span className="text-[10px] font-semibold leading-none">Mas</span>
                    </button>
                </div>

                {moreOpen && (
                    <div className="absolute bottom-full left-0 right-0 bg-white border-t border-slate-200
                                    shadow-xl px-4 py-3 grid grid-cols-4 gap-2">
                        {NAV_ITEMS.slice(4).map(({ href, label, icon: Icon }) => {
                            const active = isActive(href, url);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMoreOpen(false)}
                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-semibold transition-colors ${
                                        active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

        </div>
    );
}
