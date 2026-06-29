import { Link, usePage } from '@inertiajs/react';
import {
    FiHome, FiUsers, FiActivity, FiMapPin, FiTool,
    FiFileText, FiGift, FiAlertTriangle, FiGrid, FiTrash2, FiTruck,
} from 'react-icons/fi';
import { useState } from 'react';

const NAV_ITEMS = [
    { href: '/',           label: 'Inicio',       icon: FiHome },
    { href: '/personas',   label: 'Personas',     icon: FiUsers },
    { href: '/hospitales', label: 'Hospitales',   icon: FiActivity },
    { href: '/zonas',      label: 'Zonas',        icon: FiMapPin },
    { href: '/ingenieros', label: 'Ingenieros',   icon: FiTool },
    { href: '/materiales', label: 'Materiales',   icon: FiFileText },
    { href: '/donantes',   label: 'Donantes',     icon: FiGift },
    { href: '/limpieza',   label: 'Limpieza',     icon: FiTrash2 },
    { href: '/transporte', label: 'Transporte',   icon: FiTruck },
];

// Bottom nav muestra solo 4 + "Mas"
const BOTTOM_NAV = [
    { href: '/',           label: 'Inicio',       icon: FiHome },
    { href: '/personas',   label: 'Personas',     icon: FiUsers },
    { href: '/hospitales', label: 'Hospitales',   icon: FiActivity },
    { href: '/zonas',      label: 'Zonas',        icon: FiMapPin },
];

const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* Alert strip */}
            <div className="bg-blue-900 text-white text-center text-xs font-medium py-1.5 px-4 flex items-center justify-center gap-2">
                <FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Emergencia activa — Terremoto Venezuela 24 jun 2026 — Magnitude 7.5
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar — solo desktop */}
                <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
                    {/* Logo */}
                    <div className="px-5 py-5 border-b border-slate-100">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiUsers className="text-white w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm leading-tight">Venezuela</p>
                                <p className="font-bold text-blue-700 text-sm leading-tight">Ayuda</p>
                            </div>
                        </Link>
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 px-3 py-4 space-y-0.5">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href, url);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}>
                                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer sidebar */}
                    <div className="px-5 py-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Plataforma voluntaria.<br />
                            Informacion puede no ser oficial.
                        </p>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Header mobile */}
                    <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
                        <div className="flex items-center px-4 h-14">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
                                    <FiUsers className="text-white w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm">Venezuela Ayuda</span>
                            </Link>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
                        {children}
                    </main>

                    {/* Footer — solo desktop */}
                    <footer className="hidden md:block bg-white border-t border-slate-200 py-4">
                        <div className="px-8 text-xs text-slate-400 text-center">
                            Venezuela Ayuda — Plataforma humanitaria voluntaria · Informacion puede no ser oficial
                        </div>
                    </footer>
                </div>
            </div>

            {/* Bottom nav — solo mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-pb">
                <div className="flex">
                    {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href, url);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                                    active ? 'text-blue-700' : 'text-slate-400'
                                }`}>
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium leading-none">{label}</span>
                            </Link>
                        );
                    })}

                    {/* Boton "Mas" */}
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                            moreOpen ? 'text-blue-700' : 'text-slate-400'
                        }`}>
                        <FiGrid className="w-5 h-5" />
                        <span className="text-[10px] font-medium leading-none">Mas</span>
                    </button>
                </div>

                {/* Drawer "Mas" */}
                {moreOpen && (
                    <div className="absolute bottom-full left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-4 py-3 grid grid-cols-3 gap-2">
                        {NAV_ITEMS.slice(4).map(({ href, label, icon: Icon }) => {
                            const active = isActive(href, url);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMoreOpen(false)}
                                    className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-colors ${
                                        active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
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
