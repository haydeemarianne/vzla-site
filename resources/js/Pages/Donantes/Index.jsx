import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { FiGift, FiPlus, FiPhone, FiMail, FiGlobe, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DONATION_LABELS = {
    money: 'Dinero', food: 'Alimentos', water: 'Agua',
    medicine: 'Medicamentos', equipment: 'Equipos', clothing: 'Ropa',
    tools: 'Herramientas', vehicles: 'Vehiculos', other: 'Otro',
};

export default function DonantesIndex({ donors }) {
    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Donantes</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {donors.total} empresa{donors.total !== 1 ? 's' : ''} y organizacion{donors.total !== 1 ? 'es' : ''} listas para ayudar
                    </p>
                </div>
                <Link href="/donantes/registrar"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiPlus className="w-4 h-4" /> Registrar donacion
                </Link>
            </div>

            {donors.data.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiGift className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-slate-600">Aun no hay donantes registrados</p>
                    <Link href="/donantes/registrar"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Ser el primero
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donors.data.map((donor, i) => (
                        <motion.div key={donor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                            className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col">

                            <div className="mb-3">
                                <h3 className="font-bold text-slate-900 leading-tight">{donor.company_name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <FiMapPin className="w-3 h-3 text-slate-400" />
                                    <p className="text-xs text-slate-500">
                                        {donor.country}{donor.zones_available ? ` · ${donor.zones_available}` : ''}
                                    </p>
                                </div>
                            </div>

                            {donor.donation_types?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {donor.donation_types.map((type) => (
                                        <span key={type}
                                            className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-medium">
                                            {DONATION_LABELS[type] || type}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {donor.description && (
                                <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{donor.description}</p>
                            )}

                            <div className="border-t border-slate-100 pt-3 mt-auto space-y-2">
                                <p className="text-sm font-semibold text-slate-800">{donor.contact_person}</p>
                                <a href={`tel:${donor.phone}`}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition-colors">
                                    <FiPhone className="w-3.5 h-3.5 flex-shrink-0" /> {donor.phone}
                                </a>
                                <a href={`mailto:${donor.email}`}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition-colors truncate">
                                    <FiMail className="w-3.5 h-3.5 flex-shrink-0" /> {donor.email}
                                </a>
                                {donor.website && (
                                    <a href={donor.website} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors truncate">
                                        <FiGlobe className="w-3.5 h-3.5 flex-shrink-0" /> Sitio web
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
