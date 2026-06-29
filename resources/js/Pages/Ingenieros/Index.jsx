import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { FiTool, FiPlus, FiPhone, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function IngenierosIndex({ engineers, total }) {
    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ingenieros voluntarios</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {total} ingeniero{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''} para inspecciones gratuitas
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link href="/ingenieros/registrar"
                        className="flex items-center gap-2 border border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Soy ingeniero
                    </Link>
                    <Link href="/ingenieros/solicitar"
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiTool className="w-4 h-4" /> Solicitar inspeccion
                    </Link>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                    <strong>No entres a una estructura danada</strong> hasta que un profesional la evalúe.
                    Solicita una inspeccion gratuita — puede salvar tu vida.
                </p>
            </div>

            {engineers.data.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiTool className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-slate-600">Aun no hay ingenieros registrados</p>
                    <Link href="/ingenieros/registrar"
                        className="mt-4 inline-flex items-center gap-2 border border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Ser el primero en registrarse
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {engineers.data.map((engineer, i) => (
                        <motion.div key={engineer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                            className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col">

                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FiTool className="text-blue-700 w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 leading-tight truncate">{engineer.name}</p>
                                    <p className="text-xs text-slate-500">{engineer.specialty}</p>
                                </div>
                            </div>

                            {engineer.license_number && (
                                <p className="text-xs text-slate-400 mb-2">Matricula: {engineer.license_number}</p>
                            )}

                            {engineer.zones_available?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {engineer.zones_available.map((zone) => (
                                        <span key={zone}
                                            className="flex items-center gap-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                                            <FiMapPin className="w-2.5 h-2.5" /> {zone}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {engineer.available_until && (
                                <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                                    <FiCalendar className="w-3.5 h-3.5" />
                                    Disponible hasta {new Date(engineer.available_until).toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                                </p>
                            )}

                            <div className="border-t border-slate-100 pt-3 mt-auto space-y-2">
                                <a href={`tel:${engineer.phone}`}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 transition-colors">
                                    <FiPhone className="w-3.5 h-3.5 flex-shrink-0" /> {engineer.phone}
                                </a>
                                <a href={`mailto:${engineer.email}`}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition-colors truncate">
                                    <FiMail className="w-3.5 h-3.5 flex-shrink-0" /> {engineer.email}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
