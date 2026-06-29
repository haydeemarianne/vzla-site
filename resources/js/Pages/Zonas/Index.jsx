import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FiAlertTriangle, FiPlus, FiMapPin, FiPhone, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const URGENCY = {
    critical: { label: 'Critico',  badge: 'bg-red-100 text-red-700 border border-red-200',    card: 'border-red-200 bg-red-50/40' },
    high:     { label: 'Alto',     badge: 'bg-amber-100 text-amber-700 border border-amber-200', card: 'border-amber-200 bg-amber-50/40' },
    normal:   { label: 'Normal',   badge: 'bg-slate-100 text-slate-600 border border-slate-200', card: 'border-slate-200 bg-white' },
};

const NEED_LABELS = {
    water: 'Agua', food: 'Comida', medical: 'Atencion medica',
    rescue: 'Rescate', shelter: 'Refugio', electricity: 'Electricidad',
    communication: 'Comunicacion', other: 'Otro',
};

export default function ZonasIndex({ zones, filters, counts }) {
    const [urgency, setUrgency] = useState(filters.urgency || '');

    const filter = (value) => {
        setUrgency(value);
        router.get('/zonas', { urgency: value }, { preserveScroll: true, replace: true });
    };

    const total = counts.critical + counts.high + counts.normal;

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Zonas sin atencion</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Areas que necesitan ayuda urgente
                    </p>
                </div>
                <Link href="/zonas/reportar"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiPlus className="w-4 h-4" /> Reportar zona
                </Link>
            </div>

            {/* Stats + filtros */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                    { key: '',         label: 'Todas',    count: total,           active: urgency === '' },
                    { key: 'critical', label: 'Criticas', count: counts.critical, active: urgency === 'critical' },
                    { key: 'high',     label: 'Altas',    count: counts.high,     active: urgency === 'high' },
                    { key: 'normal',   label: 'Normales', count: counts.normal,   active: urgency === 'normal' },
                ].map(({ key, label, count, active }) => (
                    <button key={key} onClick={() => filter(key)}
                        className={`rounded-2xl p-3 text-center transition-all border ${
                            active
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}>
                        <p className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-900'}`}>{count}</p>
                        <p className={`text-xs mt-0.5 ${active ? 'text-blue-100' : 'text-slate-500'}`}>{label}</p>
                    </button>
                ))}
            </div>

            {/* Lista de zonas */}
            {zones.data.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiMapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-slate-600">No hay zonas reportadas en esta categoria</p>
                    <Link href="/zonas/reportar"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Reportar la primera
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    {zones.data.map((zone, i) => {
                        const cfg = URGENCY[zone.urgency_level] || URGENCY.normal;
                        return (
                            <motion.div key={zone.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                                className={`border rounded-2xl p-5 ${cfg.card}`}>

                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 leading-tight">{zone.zone_name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {zone.city ? `${zone.city}, ` : ''}{zone.state}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
                                        {cfg.label}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-700 leading-relaxed mb-3">{zone.description}</p>

                                {/* Necesidades */}
                                {zone.needs?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {zone.needs.map((need) => (
                                            <span key={need}
                                                className="text-xs bg-white/80 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                                {NEED_LABELS[need] || need}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                    {zone.estimated_people && (
                                        <span className="flex items-center gap-1">
                                            <FiUsers className="w-3.5 h-3.5" />
                                            ~{zone.estimated_people} personas afectadas
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <FiPhone className="w-3.5 h-3.5" />
                                        {zone.reporter_name}
                                        {zone.reporter_role ? ` (${zone.reporter_role})` : ''} · {zone.reporter_phone}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {zones.links && (
                <div className="flex justify-center gap-2 flex-wrap">
                    {zones.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm text-slate-300"
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
