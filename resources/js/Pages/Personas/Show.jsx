import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiPhone, FiUser, FiMapPin, FiAlertTriangle } from 'react-icons/fi';

const GENDER_LABEL = { male: 'Masculino', female: 'Femenino', unknown: 'No especificado' };

const STATUS_CONFIG = {
    missing:  { label: 'Desaparecido',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
    found:    { label: 'Encontrado',    bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
    deceased: { label: 'Difunto',       bg: 'bg-slate-100', text: 'text-slate-600',  border: 'border-slate-200' },
};

const TYPE_LABEL = { child: 'Nino desaparecido', adult: 'Adulto desaparecido', deceased: 'Persona fallecida' };

export default function PersonasShow({ person }) {
    const status = STATUS_CONFIG[person.status] || STATUS_CONFIG.missing;
    const isDeceased = person.type === 'deceased';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <Link href={`/personas?type=${person.type}`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
                    <FiArrowLeft className="w-4 h-4" /> Volver
                </Link>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Header card */}
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-5">
                            {/* Foto */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {person.photo_path
                                    ? <img src={`/storage/${person.photo_path}`} alt={person.name} className="w-full h-full object-cover" />
                                    : <FiUser className="w-10 h-10 text-slate-300" />
                                }
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 mb-0.5">{TYPE_LABEL[person.type]}</p>
                                        <h1 className="text-xl font-bold text-slate-900">{person.name}</h1>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex-shrink-0 ${status.bg} ${status.text} ${status.border}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-sm text-slate-600">
                                    {person.age && (
                                        <p>
                                            <span className="font-medium text-slate-700">Edad: </span>
                                            {person.age} anos
                                            {person.gender && ` · ${GENDER_LABEL[person.gender] || ''}`}
                                        </p>
                                    )}
                                    <p className="flex items-center gap-1.5">
                                        <FiMapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        {person.zone}{person.state ? `, ${person.state}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Descripcion */}
                        {person.description && (
                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Descripcion</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{person.description}</p>
                            </div>
                        )}

                        {/* Campos por tipo */}
                        {!isDeceased && person.last_seen_place && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Ultimo lugar visto</p>
                                <p className="text-sm text-slate-700">{person.last_seen_place}</p>
                            </div>
                        )}

                        {isDeceased && (
                            <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
                                {person.found_location && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Lugar donde fue encontrado</p>
                                        <p className="text-sm text-slate-700">{person.found_location}</p>
                                    </div>
                                )}
                                {person.cause_of_death && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Causa aparente</p>
                                        <p className="text-sm text-slate-700">{person.cause_of_death}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contact panel */}
                    <div className="border-t border-slate-100 bg-slate-50 p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            {isDeceased ? 'Quien registro este caso' : 'Contacto para informacion'}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-slate-900">{person.reporter_name}</p>
                                {person.reporter_relation && (
                                    <p className="text-sm text-slate-500">{person.reporter_relation}</p>
                                )}
                            </div>
                            <a href={`tel:${person.reporter_phone}`}
                                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                                <FiPhone className="w-4 h-4" /> {person.reporter_phone}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Alerta de verificacion */}
                {!isDeceased && (
                    <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <FiAlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            Si tienes informacion sobre esta persona, llama directamente al numero de contacto.
                            No compartas datos sensibles en redes sociales sin verificar.
                        </p>
                    </div>
                )}

                <p className="text-center text-xs text-slate-400 mt-4">
                    Reportado el {new Date(person.created_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
        </MainLayout>
    );
}
