import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import {
    FiUsers, FiAlertTriangle, FiActivity, FiTool,
    FiGift, FiFileText, FiMapPin, FiPlus, FiUser, FiCheckCircle,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut', delay },
});

const URGENCY_CFG = {
    critical: { label: 'Critico', badge: 'bg-red-100 text-red-700 border border-red-200',    card: 'border-red-200 bg-red-50/40' },
    high:     { label: 'Alto',    badge: 'bg-amber-100 text-amber-700 border border-amber-200', card: 'border-amber-200 bg-amber-50/40' },
    normal:   { label: 'Normal',  badge: 'bg-slate-100 text-slate-600 border border-slate-200', card: 'border-slate-200 bg-white' },
};

const NEED_LABELS = {
    water: 'Agua', food: 'Comida', medical: 'Atencion medica',
    rescue: 'Rescate', shelter: 'Refugio', electricity: 'Electricidad',
    communication: 'Comunicacion', other: 'Otro',
};

const TYPE_LABEL = { child: 'Nino', adult: 'Adulto' };

export default function Dashboard({ stats, critical_zones, recent_missing, recent_hospitals }) {
    const totalMissing = stats.missing_children + stats.missing_adults;

    return (
        <MainLayout>

            {/* Header de emergencia */}
            <motion.div {...fade(0)} className="bg-blue-900 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                        EMERGENCIA ACTIVA
                    </span>
                </div>
                <h1 className="text-2xl font-bold mb-1">Venezuela Ayuda</h1>
                <p className="text-blue-200 text-sm mb-5">
                    Terremoto del 24 de junio de 2026 — Magnitud 7.5 — Coordinacion humanitaria
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Desaparecidos',    value: totalMissing,          href: '/personas',              warn: true },
                        { label: 'Encontrados',       value: stats.found,           href: '/personas?status=found', warn: false },
                        { label: 'Zonas criticas',    value: stats.critical_zones,  href: '/zonas?urgency=critical', warn: stats.critical_zones > 0 },
                        { label: 'Listas hospitales', value: stats.hospital_lists,  href: '/hospitales',            warn: false },
                    ].map(({ label, value, href, warn }) => (
                        <Link key={label} href={href}
                            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors">
                            <p className={`text-3xl font-bold ${warn && value > 0 ? 'text-amber-300' : 'text-white'}`}>
                                {value}
                            </p>
                            <p className="text-blue-200 text-xs mt-0.5">{label}</p>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Stats detalladas */}
            <motion.div {...fade(0.05)} className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {[
                    { label: 'Ninos desap.',  value: stats.missing_children, href: '/personas?type=child',    color: 'text-amber-600' },
                    { label: 'Adultos desap.',value: stats.missing_adults,   href: '/personas?type=adult',    color: 'text-amber-600' },
                    { label: 'Difuntos',      value: stats.deceased,         href: '/personas?type=deceased', color: 'text-slate-500' },
                    { label: 'Ingenieros',    value: stats.volunteer_engineers, href: '/ingenieros',          color: 'text-blue-600' },
                    { label: 'Donantes',      value: stats.donor_companies,  href: '/donantes',               color: 'text-blue-600' },
                    { label: 'Materiales',    value: stats.materials,        href: '/materiales',             color: 'text-blue-600' },
                ].map(({ label, value, href, color }) => (
                    <Link key={label} href={href}
                        className="bg-white border border-slate-200 rounded-2xl p-3 text-center hover:shadow-sm transition-shadow">
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</p>
                    </Link>
                ))}
            </motion.div>

            {/* Boton Estoy a salvo */}
            <motion.div {...fade(0.1)} className="mb-4">
                <Link href="/personas/salvo"
                    className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 transition-colors group">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiCheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold leading-tight">Estoy a salvo</p>
                        <p className="text-green-100 text-xs mt-0.5">Registrate para que tu familia sepa que estas bien</p>
                    </div>
                    <span className="text-white/60 font-semibold group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </motion.div>

            {/* Acciones rapidas */}
            <motion.div {...fade(0.15)} className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {[
                    { href: '/personas/registrar?type=child',  label: 'Reportar nino desaparecido', icon: FiUsers },
                    { href: '/personas/registrar?type=adult',  label: 'Reportar adulto desaparecido', icon: FiUser },
                    { href: '/hospitales/subir',               label: 'Subir lista de hospital',     icon: FiActivity },
                    { href: '/zonas/reportar',                 label: 'Reportar zona sin atencion',  icon: FiAlertTriangle },
                    { href: '/ingenieros/registrar',           label: 'Registrarme como ingeniero',  icon: FiTool },
                    { href: '/donantes/registrar',             label: 'Registrar donacion',          icon: FiGift },
                ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}
                        className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-blue-700" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 leading-tight">{label}</span>
                    </Link>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">

                {/* Zonas criticas */}
                <motion.div {...fade(0.15)} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <FiAlertTriangle className="w-4 h-4 text-amber-500" />
                            Zonas criticas sin atencion
                        </h2>
                        <Link href="/zonas" className="text-xs text-blue-600 hover:underline font-medium">Ver todas</Link>
                    </div>

                    {critical_zones.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p className="text-sm">No hay zonas criticas reportadas.</p>
                            <Link href="/zonas/reportar"
                                className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium">
                                <FiPlus className="w-3.5 h-3.5" /> Reportar zona
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {critical_zones.map((zone) => {
                                const cfg = URGENCY_CFG[zone.urgency_level] || URGENCY_CFG.normal;
                                return (
                                    <div key={zone.id} className={`border rounded-xl p-3 ${cfg.card}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-sm text-slate-900">{zone.zone_name}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1.5">{zone.state}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {(zone.needs || []).map((need) => (
                                                <span key={need}
                                                    className="text-[10px] bg-white/80 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                                    {NEED_LABELS[need] || need}
                                                </span>
                                            ))}
                                        </div>
                                        {zone.estimated_people && (
                                            <p className="text-[10px] mt-1 text-slate-400">
                                                ~{zone.estimated_people} personas afectadas
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Link href="/zonas/reportar"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl py-2.5 transition-colors font-medium">
                        <FiMapPin className="w-4 h-4" /> Reportar zona sin atencion
                    </Link>
                </motion.div>

                {/* Personas desaparecidas recientes */}
                <motion.div {...fade(0.2)} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <FiUsers className="w-4 h-4 text-blue-600" />
                            Desaparecidos recientes
                        </h2>
                        <Link href="/personas" className="text-xs text-blue-600 hover:underline font-medium">Ver todos</Link>
                    </div>

                    {recent_missing.length === 0 ? (
                        <p className="text-slate-400 text-sm py-8 text-center">No hay reportes registrados aun.</p>
                    ) : (
                        <div className="space-y-1.5">
                            {recent_missing.map((person) => (
                                <Link key={person.id} href={`/personas/${person.id}`}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {person.photo_path
                                            ? <img src={`/storage/${person.photo_path}`} alt={person.name} className="w-full h-full object-cover" />
                                            : <FiUser className="text-slate-400 w-4 h-4" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-slate-900 truncate">{person.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {TYPE_LABEL[person.type]}{person.age ? ` · ${person.age} anos` : ''} · {person.zone}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                        Desaparecido
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link href="/personas/registrar?type=child"
                            className="flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                            <FiPlus className="w-3.5 h-3.5" /> Reportar nino
                        </Link>
                        <Link href="/personas/registrar?type=adult"
                            className="flex items-center justify-center gap-1.5 border border-blue-700 text-blue-700 hover:bg-blue-50 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                            <FiPlus className="w-3.5 h-3.5" /> Reportar adulto
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Hospitales + Recursos */}
            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div {...fade(0.25)} className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <FiActivity className="w-4 h-4 text-blue-600" />
                            Listas de hospitales recientes
                        </h2>
                        <Link href="/hospitales" className="text-xs text-blue-600 hover:underline font-medium">Ver todas</Link>
                    </div>

                    {recent_hospitals.length === 0 ? (
                        <p className="text-slate-400 text-sm py-6 text-center">Aun no se han subido listas de hospitales.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {recent_hospitals.map((hospital) => (
                                <Link key={hospital.id} href={`/hospitales/${hospital.id}`}
                                    className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                                    <p className="font-semibold text-sm text-slate-900">{hospital.hospital_name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <FiMapPin className="w-3 h-3" /> {hospital.zone}
                                    </p>
                                    {hospital.patient_count_approx && (
                                        <p className="text-xs text-blue-600 mt-1.5 font-medium">
                                            ~{hospital.patient_count_approx} pacientes en lista
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    <Link href="/hospitales/subir"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl py-2.5 transition-colors font-medium">
                        <FiActivity className="w-4 h-4" /> Subir lista de hospital
                    </Link>
                </motion.div>

                <motion.div {...fade(0.3)} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FiFileText className="w-4 h-4 text-blue-600" />
                        Recursos
                    </h2>
                    <div className="space-y-1">
                        {[
                            { label: 'Ingenieros voluntarios',  value: stats.volunteer_engineers, href: '/ingenieros' },
                            { label: 'Empresas donantes',       value: stats.donor_companies,     href: '/donantes' },
                            { label: 'Materiales para imprimir',value: stats.materials,           href: '/materiales' },
                            { label: 'Zonas sin atencion',      value: stats.unattended_zones,    href: '/zonas' },
                        ].map(({ label, value, href }) => (
                            <Link key={label} href={href}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="text-sm text-slate-600">{label}</span>
                                <span className="text-xl font-bold text-blue-700">{value}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
