import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FiUpload, FiSearch, FiCamera, FiMapPin, FiUsers, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HospitalesIndex({ lists, filters }) {
    const [hospital, setHospital] = useState(filters.hospital || '');

    const search = (e) => {
        e?.preventDefault();
        router.get('/hospitales', { hospital }, { preserveScroll: true, replace: true });
    };

    const clear = () => {
        setHospital('');
        router.get('/hospitales', {}, { preserveScroll: true, replace: true });
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hospitales</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Busca a tu familiar entre los pacientes atendidos</p>
                </div>
                <Link href="/hospitales/subir"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiUpload className="w-4 h-4" /> Subir lista
                </Link>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-blue-700">
                    <strong>Para voluntarios en hospitales:</strong> fotografía la lista de pacientes y subela aquí.
                    Las familias podran buscar a sus seres queridos hospital por hospital.
                </p>
            </div>

            {/* Search */}
            <form onSubmit={search} className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        placeholder="Buscar por nombre de hospital..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>
                <button type="submit"
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors">
                    Buscar
                </button>
                {filters.hospital && (
                    <button type="button" onClick={clear}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors">
                        Limpiar
                    </button>
                )}
            </form>

            {/* List */}
            {lists.data.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiCamera className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-slate-600">
                        {filters.hospital ? `Sin resultados para "${filters.hospital}"` : 'Aun no hay listas subidas'}
                    </p>
                    <p className="text-sm mt-2 text-slate-400">
                        Si estas en un hospital, sube la lista de pacientes para ayudar a las familias.
                    </p>
                    <Link href="/hospitales/subir"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiUpload className="w-4 h-4" /> Subir lista
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {lists.data.map((item, i) => (
                        <motion.div key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}>
                            <Link href={`/hospitales/${item.id}`}
                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block">

                                {/* Thumbnail primera foto */}
                                {item.photo_paths?.[0] ? (
                                    <div className="h-36 bg-slate-100 overflow-hidden">
                                        <img
                                            src={`/storage/${item.photo_paths[0]}`}
                                            alt={item.hospital_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-36 bg-slate-100 flex items-center justify-center">
                                        <FiCamera className="w-8 h-8 text-slate-300" />
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900 leading-tight mb-1">
                                        {item.hospital_name}
                                    </h3>

                                    <div className="flex items-center gap-1 mb-2">
                                        <FiMapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        <p className="text-xs text-slate-500">
                                            {item.zone}{item.state ? `, ${item.state}` : ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <FiImage className="w-3.5 h-3.5" />
                                            {item.photo_paths?.length || 0} foto(s)
                                        </span>
                                        {item.patient_count_approx && (
                                            <span className="flex items-center gap-1">
                                                <FiUsers className="w-3.5 h-3.5" />
                                                ~{item.patient_count_approx} pacientes
                                            </span>
                                        )}
                                    </div>

                                    {item.list_date && (
                                        <p className="text-xs text-slate-400 mt-1.5">
                                            Lista del {new Date(item.list_date).toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {lists.links && (
                <div className="flex justify-center gap-2 flex-wrap">
                    {lists.links.map((link, i) => (
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
