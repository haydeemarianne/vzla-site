import { Link, useForm } from '@inertiajs/react';
import { FiMapPin, FiUsers, FiPhone, FiChevronRight, FiClock } from 'react-icons/fi';
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

const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5 leading-snug';

function AdoptForm({ caseId }) {
    const { data, setData, post, processing, errors } = useForm({
        volunteer_phone: '',
        message:         '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/casos/${caseId}/apadrinar`);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <h2 className="text-base font-bold text-slate-900 mb-4 leading-tight">Apadrinar este caso</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={labelClass}>
                        Tu teléfono registrado como voluntario <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={data.volunteer_phone}
                        onChange={(e) => setData('volunteer_phone', e.target.value)}
                        placeholder="Ej: 0412-1234567"
                        className={inputClass} />
                    {errors.volunteer_phone && (
                        <p className="text-xs text-red-600 mt-1 leading-snug">{errors.volunteer_phone}</p>
                    )}
                </div>
                <div>
                    <label className={labelClass}>Mensaje para la familia (opcional)</label>
                    <textarea
                        rows={3}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Cuéntales quién eres y cómo los vas a ayudar..."
                        className={`${inputClass} resize-none`} />
                    {errors.message && (
                        <p className="text-xs text-red-600 mt-1 leading-snug">{errors.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {processing ? 'Procesando...' : 'Apadrinar este caso'}
                </button>
            </form>
        </div>
    );
}

function UpdateForm({ caseId }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        author_name:  '',
        content:      '',
        author_type:  'family',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/casos/${caseId}/actualizar`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 leading-snug">Agregar actualizacion</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="text"
                        value={data.author_name}
                        onChange={(e) => setData('author_name', e.target.value)}
                        placeholder="Tu nombre"
                        className={inputClass} />
                    {errors.author_name && (
                        <p className="text-xs text-red-600 mt-1 leading-snug">{errors.author_name}</p>
                    )}
                </div>
                <div>
                    <textarea
                        rows={3}
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Cuenta cómo va la situacion..."
                        className={`${inputClass} resize-none`} />
                    {errors.content && (
                        <p className="text-xs text-red-600 mt-1 leading-snug">{errors.content}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {processing ? 'Enviando...' : 'Publicar actualizacion'}
                </button>
            </form>
        </div>
    );
}

export default function CasosShow({ supportCase, updates, contactPhone }) {
    const needs = Array.isArray(supportCase.needs)
        ? supportCase.needs
        : (supportCase.needs ? JSON.parse(supportCase.needs) : []);

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-4">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-slate-400 leading-snug">
                    <Link href="/casos" className="hover:text-blue-700 transition-colors">Casos</Link>
                    <FiChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{supportCase.family_name}</span>
                </nav>

                {/* Main card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            {supportCase.family_name}
                        </h1>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_BADGE[supportCase.status] ?? STATUS_BADGE.open}`}>
                            {STATUS_LABEL[supportCase.status] ?? supportCase.status}
                        </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{supportCase.description}</p>

                    {/* Needs chips */}
                    {needs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {needs.map((need) => (
                                <span
                                    key={need}
                                    className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                                    {NEED_LABELS[need] ?? need}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500 leading-snug">
                            <FiMapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            <span>{supportCase.zone}{supportCase.state ? `, ${supportCase.state}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 leading-snug">
                            <FiUsers className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            <span>{supportCase.people_count} persona{supportCase.people_count !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Special chips */}
                    {(supportCase.has_children || supportCase.has_elderly) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {supportCase.has_children && (
                                <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">
                                    Tiene ninos
                                </span>
                            )}
                            {supportCase.has_elderly && (
                                <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">
                                    Tiene adultos mayores
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Volunteer contact card — only when user is the assigned volunteer */}
                {contactPhone && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                        <p className="text-sm font-bold text-green-800 mb-2 leading-snug">Eres el voluntario de este caso</p>
                        <p className="text-sm text-green-700 mb-3 leading-relaxed">
                            Puedes contactar a la familia directamente por teléfono.
                        </p>
                        <a
                            href={`tel:${contactPhone}`}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
                            <FiPhone className="w-4 h-4" />
                            Llamar: {contactPhone}
                        </a>
                    </div>
                )}

                {/* Adopt section */}
                {supportCase.status === 'open' && !contactPhone && (
                    <AdoptForm caseId={supportCase.id} />
                )}

                {/* Already adopted by someone else */}
                {supportCase.status === 'adopted' && !contactPhone && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-amber-800 leading-snug">Este caso ya tiene voluntario asignado</p>
                        <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                            Otro voluntario está ayudando a esta familia. Puedes buscar otros casos que necesiten apoyo.
                        </p>
                        <Link
                            href="/casos"
                            className="inline-block mt-3 text-sm font-semibold text-amber-800 underline hover:no-underline">
                            Ver todos los casos
                        </Link>
                    </div>
                )}

                {/* Updates timeline */}
                {updates && updates.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h2 className="text-base font-bold text-slate-900 mb-4 leading-tight">Actualizaciones</h2>
                        <div className="space-y-4">
                            {updates.map((update) => (
                                <div key={update.id} className="flex gap-3">
                                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                        <FiClock className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-semibold text-slate-800 leading-snug">{update.author_name}</span>
                                            {update.author_type && (
                                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                                    {update.author_type === 'family' ? 'Familia' : 'Voluntario'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{update.content}</p>
                                        {update.created_at && (
                                            <p className="text-xs text-slate-400 mt-1 leading-snug">{update.created_at}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add update form */}
                <UpdateForm caseId={supportCase.id} />

            </div>
        </MainLayout>
    );
}
