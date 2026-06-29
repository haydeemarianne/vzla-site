import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FiArrowLeft, FiZoomIn, FiX, FiMapPin, FiUsers, FiUser, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HospitalShow({ list }) {
    const [lightbox, setLightbox] = useState(null); // index of selected photo

    const photos = list.photo_paths || [];

    const prev = () => setLightbox((i) => (i > 0 ? i - 1 : photos.length - 1));
    const next = () => setLightbox((i) => (i < photos.length - 1 ? i + 1 : 0));

    const handleKey = (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'Escape') setLightbox(null);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <Link href="/hospitales"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
                    <FiArrowLeft className="w-4 h-4" /> Volver a hospitales
                </Link>

                {/* Info card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{list.hospital_name}</h1>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                            <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                            {list.zone}{list.state ? `, ${list.state}` : ''}
                        </span>
                        {list.patient_count_approx && (
                            <span className="flex items-center gap-1">
                                <FiUsers className="w-3.5 h-3.5 text-slate-400" />
                                ~{list.patient_count_approx} pacientes en lista
                            </span>
                        )}
                    </div>

                    {list.address && (
                        <p className="text-sm text-slate-500 mb-2">{list.address}</p>
                    )}
                    {list.description && (
                        <p className="text-sm text-slate-700 leading-relaxed">{list.description}</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <FiUser className="w-3.5 h-3.5" />
                            Subido por <span className="font-medium text-slate-700">{list.uploaded_by}</span>
                            {list.list_date && (
                                <span>· {new Date(list.list_date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            )}
                        </div>
                        {list.uploader_phone && (
                            <a href={`tel:${list.uploader_phone}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors">
                                <FiPhone className="w-4 h-4" /> {list.uploader_phone}
                            </a>
                        )}
                    </div>
                </div>

                {/* Photos */}
                <div className="mb-6">
                    <h2 className="font-bold text-slate-900 mb-1">
                        Lista de pacientes — {photos.length} imagen{photos.length !== 1 ? 'es' : ''}
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                        Toca cada imagen para ampliarla y buscar a tu familiar.
                    </p>

                    {photos.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl">
                            <p>No hay fotos disponibles aun.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {photos.map((path, i) => (
                                <button key={i}
                                    onClick={() => setLightbox(i)}
                                    className="relative group rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50 text-left">
                                    <img
                                        src={`/storage/${path}`}
                                        alt={`Lista pacientes ${i + 1}`}
                                        className="w-full object-contain max-h-80"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                            <FiZoomIn className="w-4 h-4" /> Ampliar
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                                        {i + 1} / {photos.length}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={() => setLightbox(null)}
                    onKeyDown={handleKey}
                    tabIndex={0}>

                    <button
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                        onClick={() => setLightbox(null)}>
                        <FiX className="w-5 h-5" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <img
                        src={`/storage/${photos[lightbox]}`}
                        alt="Lista ampliada"
                        className="max-w-full max-h-full object-contain rounded-lg px-16"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                        {lightbox + 1} de {photos.length}
                    </p>
                </div>
            )}
        </MainLayout>
    );
}
