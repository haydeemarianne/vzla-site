import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FiCheck, FiX, FiCopy, FiUser, FiMapPin, FiTool, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const URGENCY_LABEL = { critical: 'Critico', high: 'Alto', normal: 'Normal' };
const URGENCY_BADGE = {
    critical: 'bg-red-100 text-red-700 border border-red-200',
    high:     'bg-amber-100 text-amber-700 border border-amber-200',
    normal:   'bg-slate-100 text-slate-600 border border-slate-200',
};

const StatusBadge = ({ status }) => {
    const cfg = {
        pending:   'bg-amber-50 text-amber-700 border border-amber-200',
        approved:  'bg-green-50 text-green-700 border border-green-200',
        rejected:  'bg-slate-100 text-slate-500 border border-slate-200',
        duplicate: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
    const labels = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', duplicate: 'Duplicado' };
    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg[status] || cfg.pending}`}>
            {labels[status] || status}
        </span>
    );
};

const ActionButtons = ({ type, id, token, duplicateOf, onAction }) => {
    const act = (action, body = {}) => {
        router.post(`/validar/${token}/${action}`, { type, id, ...body }, {
            onSuccess: () => { toast.success('Accion aplicada.'); onAction?.(); },
            preserveScroll: true,
        });
    };

    return (
        <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => act('approve')}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                <FiCheck className="w-3.5 h-3.5" /> Aprobar
            </button>
            <button onClick={() => act('reject')}
                className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                <FiX className="w-3.5 h-3.5" /> Rechazar
            </button>
            {duplicateOf && (
                <button onClick={() => act('duplicate', { duplicate_of: duplicateOf })}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    <FiCopy className="w-3.5 h-3.5" /> Duplicado
                </button>
            )}
        </div>
    );
};

const TABS = [
    { key: 'children',  label: 'Personas',   icon: FiUser,   countKey: 'pending_children' },
    { key: 'engineers', label: 'Ingenieros', icon: FiTool,   countKey: 'pending_engineers' },
    { key: 'zones',     label: 'Zonas',      icon: FiMapPin, countKey: 'pending_zones' },
];

export default function ValidarDashboard({ validator, token, pending_children, pending_engineers, pending_zones }) {
    const [activeTab, setActiveTab] = useState('children');

    const counts = {
        pending_children:  pending_children.length,
        pending_engineers: pending_engineers.length,
        pending_zones:     pending_zones.length,
    };

    const total = counts.pending_children + counts.pending_engineers + counts.pending_zones;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
                            <FiShield className="text-white w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">Panel de validacion</p>
                            <p className="text-xs text-slate-400 leading-tight">{validator.name}</p>
                        </div>
                    </div>
                    {total > 0 && (
                        <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
                            {total} pendiente{total !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">

                {total === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiCheck className="w-7 h-7 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-900">Todo al dia</p>
                        <p className="text-slate-400 text-sm mt-1">No hay registros pendientes de validacion.</p>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
                            {TABS.map(({ key, label, icon: Icon, countKey }) => (
                                <button key={key} onClick={() => setActiveTab(key)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        activeTab === key
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}>
                                    <Icon className="w-4 h-4" />
                                    {label}
                                    {counts[countKey] > 0 && (
                                        <span className={`text-xs font-bold ${activeTab === key ? 'text-blue-700' : 'text-slate-400'}`}>
                                            {counts[countKey]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Personas pendientes */}
                        {activeTab === 'children' && (
                            <div className="space-y-3">
                                {pending_children.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8 text-sm">Sin personas pendientes.</p>
                                ) : pending_children.map((person) => (
                                    <div key={person.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {person.photo_path
                                                    ? <img src={`/storage/${person.photo_path}`} alt={person.name} className="w-full h-full object-cover" />
                                                    : <FiUser className="w-5 h-5 text-slate-300" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="font-semibold text-slate-900 text-sm">{person.name}</p>
                                                    <StatusBadge status={person.validation_status} />
                                                    {person.duplicate_score > 0 && (
                                                        <span className="text-xs text-amber-600 font-medium">
                                                            Similitud: {person.duplicate_score}%
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {person.type === 'child' ? 'Nino' : 'Adulto'}
                                                    {person.age ? ` · ${person.age} anos` : ''} · {person.zone}
                                                </p>
                                                {person.description && (
                                                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{person.description}</p>
                                                )}
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Reportado por: {person.reporter_name} · {person.reporter_phone}
                                                </p>
                                            </div>
                                        </div>
                                        <ActionButtons type="child" id={person.id} token={token}
                                            duplicateOf={person.possible_duplicate_of} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Ingenieros pendientes */}
                        {activeTab === 'engineers' && (
                            <div className="space-y-3">
                                {pending_engineers.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8 text-sm">Sin ingenieros pendientes.</p>
                                ) : pending_engineers.map((engineer) => (
                                    <div key={engineer.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="font-semibold text-slate-900 text-sm">{engineer.name}</p>
                                                    <StatusBadge status={engineer.validation_status} />
                                                </div>
                                                <p className="text-xs text-slate-500">{engineer.specialty}</p>
                                                {engineer.license_number && (
                                                    <p className="text-xs text-slate-400 mt-0.5">Matricula: {engineer.license_number}</p>
                                                )}
                                                <p className="text-xs text-slate-600 mt-1">{engineer.email} · {engineer.phone}</p>
                                                {engineer.zones_available?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {engineer.zones_available.map((zone) => (
                                                            <span key={zone}
                                                                className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                                                                {zone}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ActionButtons type="engineer" id={engineer.id} token={token} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Zonas pendientes */}
                        {activeTab === 'zones' && (
                            <div className="space-y-3">
                                {pending_zones.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8 text-sm">Sin zonas pendientes.</p>
                                ) : pending_zones.map((zone) => (
                                    <div key={zone.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="font-semibold text-slate-900 text-sm">{zone.zone_name}</p>
                                                    <StatusBadge status={zone.validation_status} />
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${URGENCY_BADGE[zone.urgency_level] || URGENCY_BADGE.normal}`}>
                                                        {URGENCY_LABEL[zone.urgency_level] || zone.urgency_level}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">{zone.city ? `${zone.city}, ` : ''}{zone.state}</p>
                                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{zone.description}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Reportado por: {zone.reporter_name} · {zone.reporter_phone}
                                                </p>
                                            </div>
                                        </div>
                                        <ActionButtons type="zone" id={zone.id} token={token} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
