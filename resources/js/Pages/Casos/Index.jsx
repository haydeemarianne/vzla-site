import { Link, router } from '@inertiajs/react';
import { FiMapPin, FiUsers, FiHeart, FiUserCheck, FiPlus } from 'react-icons/fi';
import MainLayout from '@/Layouts/MainLayout';

const NEED_LABELS = {
    food:       'Alimentacion',
    water:      'Agua',
    medicine:   'Medicamentos',
    clothing:   'Ropa',
    furniture:  'Mobiliario',
    baby:       'Bebe',
    tools:      'Herramientas',
    documents:  'Documentos',
    shelter:    'Refugio',
    other:      'Otro',
};

const NEED_FILTER_CHIPS = [
    { value: '',          label: 'Todos' },
    { value: 'food',      label: 'Alimentacion' },
    { value: 'water',     label: 'Agua' },
    { value: 'medicine',  label: 'Medicamentos' },
    { value: 'clothing',  label: 'Ropa' },
    { value: 'furniture', label: 'Mobiliario' },
    { value: 'baby',      label: 'Bebe' },
    { value: 'tools',     label: 'Herramientas' },
    { value: 'documents', label: 'Documentos' },
    { value: 'shelter',   label: 'Refugio' },
];

const STATUS_BADGE = {
    open:     'bg-blue-50 text-blue-700 border border-blue-200',
    adopted:  'bg-amber-50 text-amber-700 border border-amber-200',
    resolved: 'bg-green-50 text-green-700 border border-green-200',
};

const STATUS_LABEL = {
    open:     'Abierto',
    adopted:  'Apadrinado',
    resolved: 'Resuelto',
};

export default function CasosIndex({ cases, filters, counts }) {
    const activeNeed = filters?.need ?? '';

    const handleNeedFilter = (need) => {
        router.get('/casos', need ? { need } : {}, { preserveScroll: false });
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                    Casos que necesitan apoyo
                </h1>
                <div className="flex gap-2 flex-wrap">
                    <Link
                        href="/casos/publicar"
                        className="flex items-center gap-1.5 border border-blue-700 text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                        <FiPlus className="w-4 h-4" />
                        Publicar mi caso
                    </Link>
                    <Link
                        href="/voluntarios/registrar"
                        className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors">
                        <FiUserCheck className="w-4 h-4" />
                        Quiero ser voluntario
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700 leading-tight">{counts?.open ?? 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">Abiertos</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600 leading-tight">{counts?.adopted ?? 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">Apadrinados</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 leading-tight">{counts?.resolved ?? 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">Resueltos</p>
                </div>
            </div>

            {/* Need filter chips */}
            <div className="flex flex-wrap gap-2 mb-6">
                {NEED_FILTER_CHIPS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => handleNeedFilter(value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                            activeNeed === value
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                        }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Cases grid */}
            {cases.data.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiHeart className="w-7 h-7 text-blue-400" />
                    </div>
                    <p className="text-base font-bold text-slate-900">No hay casos</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                        {activeNeed
                            ? 'No hay casos con esa necesidad en este momento.'
                            : 'No hay casos publicados aun.'}
                    </p>
                    <Link
                        href="/casos/publicar"
                        className="inline-flex items-center gap-1.5 mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" />
                        Publicar el primer caso
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cases.data.map((supportCase, i) => {
                        const needs = Array.isArray(supportCase.needs)
                            ? supportCase.needs
                            : (supportCase.needs ? JSON.parse(supportCase.needs) : []);

                        return (
                            <div
                                key={supportCase.id}
                                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3"
                                style={{
                                    opacity: 0,
                                    animation: `fadeUp 0.4s ease-out ${i * 0.06}s forwards`,
                                }}>
                                {/* Header row */}
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-bold text-slate-900 text-base leading-snug flex-1 min-w-0">
                                        {supportCase.family_name}
                                    </p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[supportCase.status] ?? STATUS_BADGE.open}`}>
                                        {STATUS_LABEL[supportCase.status] ?? supportCase.status}
                                    </span>
                                </div>

                                {/* Needs chips */}
                                {needs.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {needs.map((need) => (
                                            <span
                                                key={need}
                                                className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                                                {NEED_LABELS[need] ?? need}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Location & people */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 leading-snug">
                                        <FiMapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                        <span>{supportCase.zone}{supportCase.state ? `, ${supportCase.state}` : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 leading-snug">
                                        <FiUsers className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                        <span>{supportCase.people_count} persona{supportCase.people_count !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                {/* Special chips */}
                                {(supportCase.has_children || supportCase.has_elderly) && (
                                    <div className="flex flex-wrap gap-1">
                                        {supportCase.has_children && (
                                            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                                                Tiene ninos
                                            </span>
                                        )}
                                        {supportCase.has_elderly && (
                                            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                                                Tiene adultos mayores
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto pt-1">
                                    <Link
                                        href={`/casos/${supportCase.id}`}
                                        className="flex-1 text-center border border-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        Ver caso
                                    </Link>
                                    {supportCase.status === 'open' && (
                                        <Link
                                            href={`/casos/${supportCase.id}`}
                                            className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors">
                                            Apadrinar
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </MainLayout>
    );
}
