import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import {
    FiHeart, FiUserCheck, FiTrash2, FiTool, FiGift, FiFileText,
    FiMapPin, FiUsers, FiAlertTriangle, FiPlus,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut', delay },
});

const NEED_LABELS = {
    food: 'Alimentacion', water: 'Agua', medicine: 'Medicamentos',
    clothing: 'Ropa', furniture: 'Mobiliario', baby: 'Bebe',
    tools: 'Herramientas', documents: 'Documentos', shelter: 'Refugio', other: 'Otro',
};

const STATUS_BADGE = {
    open:    'bg-blue-50 text-blue-700 border border-blue-200',
    adopted: 'bg-amber-50 text-amber-700 border border-amber-200',
};
const STATUS_LABEL = { open: 'Abierto', adopted: 'Apadrinado' };

export default function Dashboard({ stats, recent_cases, recent_cleaning }) {
    const QUICK_ACTIONS = [
        { href: '/casos/publicar',        label: 'Publicar mi caso',         icon: FiHeart,     primary: true },
        { href: '/voluntarios/registrar', label: 'Ser voluntario',           icon: FiUserCheck, primary: false },
        { href: '/limpieza/reportar',     label: 'Reportar limpieza',        icon: FiTrash2,    primary: false },
        { href: '/ingenieros/registrar',  label: 'Registrar ingeniero',      icon: FiTool,      primary: false },
        { href: '/donantes/registrar',    label: 'Registrar donante',        icon: FiGift,      primary: false },
        { href: '/materiales/subir',      label: 'Subir material',           icon: FiFileText,  primary: false },
    ];

    return (
        <MainLayout>
            {/* Header emergencia */}
            <motion.div {...fade(0)} className="bg-blue-900 rounded-2xl p-5 text-white mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                        EMERGENCIA ACTIVA
                    </span>
                </div>
                <h1 className="text-xl font-bold mb-0.5">Venezuela Ayuda</h1>
                <p className="text-blue-200 text-xs mb-5">
                    Terremoto · 24 jun 2026 · M7.5 — Coordinacion humanitaria voluntaria
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Casos abiertos',   value: stats.cases_open,     warn: true,  href: '/casos' },
                        { label: 'Apadrinados',       value: stats.cases_adopted,  warn: false, href: '/casos' },
                        { label: 'Resueltos',         value: stats.cases_resolved, warn: false, href: '/casos' },
                        { label: 'Voluntarios',       value: stats.volunteers,     warn: false, href: '/voluntarios/registrar' },
                    ].map(({ label, value, warn, href }) => (
                        <Link key={label} href={href}
                            className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
                            <p className={`text-2xl font-bold leading-tight ${warn && value > 0 ? 'text-amber-300' : 'text-white'}`}>
                                {value}
                            </p>
                            <p className="text-blue-200 text-xs mt-0.5 leading-snug">{label}</p>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Acciones rapidas */}
            <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
                {QUICK_ACTIONS.map(({ href, label, icon: Icon, primary }) => (
                    <Link key={href} href={href}
                        className={`flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center text-xs font-semibold transition-colors leading-snug ${
                            primary
                                ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/30'
                        }`}>
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {label}
                    </Link>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Casos recientes — ocupa 2/3 */}
                <motion.div {...fade(0.1)} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <FiHeart className="w-4 h-4 text-blue-600" />
                            Casos recientes
                        </h2>
                        <Link href="/casos" className="text-xs text-blue-600 hover:underline font-medium">Ver todos</Link>
                    </div>

                    {recent_cases.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p className="text-sm mb-3">No hay casos publicados aun.</p>
                            <Link href="/casos/publicar"
                                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                                <FiPlus className="w-3.5 h-3.5" /> Publicar el primero
                            </Link>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {recent_cases.map((supportCase) => {
                                const needs = Array.isArray(supportCase.needs)
                                    ? supportCase.needs
                                    : (supportCase.needs ? JSON.parse(supportCase.needs) : []);
                                return (
                                    <Link key={supportCase.id} href={`/casos/${supportCase.id}`}
                                        className="border border-slate-100 rounded-xl p-3 hover:border-blue-200 hover:bg-blue-50/20 transition-colors flex flex-col gap-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-semibold text-sm text-slate-900 leading-tight flex-1 min-w-0 truncate">
                                                {supportCase.is_anonymous ? 'Familia anonima' : supportCase.family_name}
                                            </p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[supportCase.status]}`}>
                                                {STATUS_LABEL[supportCase.status]}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <FiMapPin className="w-3 h-3" />
                                            <span className="truncate">{supportCase.zone}{supportCase.state ? `, ${supportCase.state}` : ''}</span>
                                        </div>
                                        {needs.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {needs.slice(0, 3).map((need) => (
                                                    <span key={need}
                                                        className="text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full">
                                                        {NEED_LABELS[need] ?? need}
                                                    </span>
                                                ))}
                                                {needs.length > 3 && (
                                                    <span className="text-[9px] text-slate-400">+{needs.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <Link href="/casos/publicar"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl py-2.5 transition-colors font-medium">
                        <FiHeart className="w-4 h-4" /> Publicar mi caso
                    </Link>
                </motion.div>

                {/* Panel lateral 1/3 */}
                <div className="flex flex-col gap-4">
                    {/* Stats secundarios */}
                    <motion.div {...fade(0.12)} className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-900 mb-3 text-sm">Recursos disponibles</h2>
                        <div className="space-y-0.5">
                            {[
                                { label: 'Puntos de limpieza', value: stats.cleaning_points, href: '/limpieza',   icon: FiTrash2 },
                                { label: 'Ingenieros',          value: stats.engineers,       href: '/ingenieros', icon: FiTool },
                                { label: 'Donantes',            value: stats.donors,          href: '/donantes',   icon: FiGift },
                                { label: 'Materiales',          value: stats.materials,       href: '/materiales', icon: FiFileText },
                            ].map(({ label, value, href, icon: Icon }) => (
                                <Link key={label} href={href}
                                    className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-slate-600 flex-1">{label}</span>
                                    <span className="text-lg font-bold text-blue-700">{value}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Limpieza reciente */}
                    <motion.div {...fade(0.16)} className="bg-white border border-slate-200 rounded-2xl p-5 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <FiTrash2 className="w-4 h-4 text-blue-600" />
                                Limpieza activa
                            </h2>
                            <Link href="/limpieza" className="text-xs text-blue-600 hover:underline font-medium">Ver</Link>
                        </div>

                        {recent_cleaning.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No hay puntos reportados.</p>
                        ) : (
                            <div className="space-y-2">
                                {recent_cleaning.map((point) => (
                                    <div key={point.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FiTrash2 className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate leading-tight">{point.zone_name}</p>
                                            <p className="text-[10px] text-slate-400">{point.state} · {point.helpers_count ?? 0} ayudantes</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link href="/limpieza/reportar"
                            className="mt-3 flex items-center justify-center gap-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 transition-colors font-semibold">
                            <FiPlus className="w-3.5 h-3.5" /> Reportar punto
                        </Link>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
