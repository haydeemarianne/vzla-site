import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiPhone, FiUser, FiMapPin } from 'react-icons/fi';

export default function NinoShow({ child }) {
    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <Link href="/ninos" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm">
                    <FiArrowLeft /> Volver a la lista
                </Link>

                <div className="card">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-40 h-40 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {child.photo_path
                                ? <img src={`/storage/${child.photo_path}`} alt={child.name} className="w-full h-full object-cover" />
                                : <FiUser className="w-16 h-16 text-gray-300" />
                            }
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h1 className="text-2xl font-bold text-gray-900">{child.name}</h1>
                                {child.status === 'missing'
                                    ? <span className="badge-urgent flex-shrink-0">Desaparecido</span>
                                    : <span className="badge-ok flex-shrink-0">Encontrado</span>
                                }
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                {child.age && <p><span className="font-medium text-gray-700">Edad:</span> {child.age} años</p>}
                                {child.gender && <p><span className="font-medium text-gray-700">Género:</span> {child.gender === 'male' ? 'Masculino' : child.gender === 'female' ? 'Femenino' : 'No especificado'}</p>}
                                <p className="flex items-center gap-1.5">
                                    <FiMapPin className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium text-gray-700">Zona:</span> {child.zone}{child.state ? `, ${child.state}` : ''}
                                </p>
                                {child.last_seen_place && (
                                    <p><span className="font-medium text-gray-700">Último lugar visto:</span> {child.last_seen_place}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {child.description && (
                        <div className="mt-6 pt-6 border-t">
                            <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{child.description}</p>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t">
                        <h2 className="font-semibold text-gray-900 mb-3">Contacto para información</h2>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                            <p className="font-medium text-gray-900">{child.reporter_name}</p>
                            {child.reporter_relation && <p className="text-sm text-gray-500">{child.reporter_relation}</p>}
                            <a href={`tel:${child.reporter_phone}`}
                                className="flex items-center gap-2 mt-2 text-red-700 font-semibold hover:text-red-800">
                                <FiPhone className="w-4 h-4" /> {child.reporter_phone}
                            </a>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        Reportado el {new Date(child.created_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">¿Tiene información sobre este niño?</p>
                    <a href={`tel:${child.reporter_phone}`}
                        className="mt-2 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                        <FiPhone /> Llamar al familiar que reportó
                    </a>
                </div>
            </div>
        </MainLayout>
    );
}
