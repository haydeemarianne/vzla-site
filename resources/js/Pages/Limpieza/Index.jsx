import MainLayout from '@/Layouts/MainLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FiTrash2, FiPlus, FiUsers, FiMapPin, FiCamera, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TYPE_LABEL  = { domestic: 'Basura domestica', debris: 'Escombros y basura', both: 'Ambos tipos' };
const VOLUME_LABEL = { low: 'Poco', medium: 'Bastante', high: 'Mucho' };
const VOLUME_COLOR = { low: 'text-slate-500', medium: 'text-amber-600', high: 'text-red-600' };

const STATUS_CFG = {
    pending:    { label: 'Pendiente',   badge: 'bg-amber-50 text-amber-700 border border-amber-200',  card: 'border-slate-200' },
    in_process: { label: 'En proceso',  badge: 'bg-blue-50 text-blue-700 border border-blue-200',     card: 'border-blue-200' },
    resolved:   { label: 'Resuelto',    badge: 'bg-green-50 text-green-700 border border-green-200',  card: 'border-green-200 opacity-70' },
};

function ResolveModal({ point, onClose }) {
    const { data, setData, post, processing } = useForm({ photo: null });
    const [preview, setPreview] = useState(null);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/limpieza/${point.id}/resolver`, {
            forceFormData: true,
            onSuccess: () => { toast.success('¡Punto resuelto!'); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-slate-900 mb-1">Marcar como resuelto</h3>
                <p className="text-sm text-slate-500 mb-4">Opcional: sube una foto del "despues" para mostrar el avance.</p>
                <form onSubmit={submit} className="space-y-4">
                    {preview ? (
                        <img src={preview} className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                    ) : (
                        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-green-400 transition-colors">
                            <FiCamera className="w-6 h-6 text-slate-400" />
                            <span className="text-sm text-slate-500">Foto del despues (opcional)</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                        </label>
                    )}
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <FiCheckCircle className="w-4 h-4" /> Confirmar
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function LimpiezaIndex({ points, filters, counts }) {
    const [search, setSearch] = useState(filters.search || '');
    const [resolvePoint, setResolvePoint] = useState(null);

    const go = (params) => {
        router.get('/limpieza', { ...filters, ...params }, { preserveScroll: true, replace: true });
    };

    const volunteer = (id) => {
        router.post(`/limpieza/${id}/voluntario`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('¡Gracias! Tu ayuda queda registrada.'),
        });
    };

    const total = counts.pending + counts.in_process + counts.resolved;

    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Limpieza comunitaria</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Puntos de basura y escombros que necesitan atencion</p>
                </div>
                <Link href="/limpieza/reportar"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiPlus className="w-4 h-4" /> Reportar punto
                </Link>
            </div>

            {/* Filtros / stats */}
            <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                    { key: '',           label: 'Todos',       count: total,              active: !filters.status },
                    { key: 'pending',    label: 'Pendiente',   count: counts.pending,     active: filters.status === 'pending' },
                    { key: 'in_process', label: 'En proceso',  count: counts.in_process,  active: filters.status === 'in_process' },
                    { key: 'resolved',   label: 'Resueltos',   count: counts.resolved,    active: filters.status === 'resolved' },
                ].map(({ key, label, count, active }) => (
                    <button key={key} onClick={() => go({ status: key })}
                        className={`rounded-2xl p-3 text-center transition-all border ${
                            active ? 'bg-blue-700 text-white border-blue-700' : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}>
                        <p className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-900'}`}>{count}</p>
                        <p className={`text-[10px] mt-0.5 ${active ? 'text-blue-100' : 'text-slate-500'}`}>{label}</p>
                    </button>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); go({ search }); }} className="flex gap-2 mb-5">
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por zona, ciudad o estado..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                <button type="submit"
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors">
                    Buscar
                </button>
            </form>

            {points.data.length === 0 ? (
                <div className="text-center py-14 text-slate-400">
                    <FiTrash2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-600 text-sm">No hay puntos reportados</p>
                    <Link href="/limpieza/reportar"
                        className="mt-3 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Reportar el primero
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    {points.data.map((point, i) => {
                        const cfg = STATUS_CFG[point.status] || STATUS_CFG.pending;
                        return (
                            <motion.div key={point.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                                className={`bg-white border rounded-2xl overflow-hidden ${cfg.card}`}>

                                {/* Foto */}
                                {point.photo_path && (
                                    <img src={`/storage/${point.photo_path}`}
                                        alt="Punto de limpieza"
                                        className="w-full h-40 object-cover" />
                                )}

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 leading-tight">{point.zone_name}</h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <FiMapPin className="w-3 h-3" />
                                                {point.city ? `${point.city}, ` : ''}{point.state}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                                            {TYPE_LABEL[point.type] || point.type}
                                        </span>
                                        <span className={`text-xs font-semibold ${VOLUME_COLOR[point.volume]}`}>
                                            Volumen: {VOLUME_LABEL[point.volume]}
                                        </span>
                                    </div>

                                    {point.notes && (
                                        <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{point.notes}</p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <FiUsers className="w-3.5 h-3.5" />
                                            {point.helpers_count} {point.helpers_count === 1 ? 'voluntario' : 'voluntarios'}
                                        </span>

                                        {point.status !== 'resolved' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => volunteer(point.id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold border border-blue-700 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    <FiUsers className="w-3.5 h-3.5" /> Voy a ayudar
                                                </button>
                                                <button onClick={() => setResolvePoint(point)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                                                    <FiCheckCircle className="w-3.5 h-3.5" /> Resuelto
                                                </button>
                                            </div>
                                        )}

                                        {point.status === 'resolved' && point.resolved_photo_path && (
                                            <a href={`/storage/${point.resolved_photo_path}`} target="_blank"
                                                className="text-xs text-green-700 hover:underline font-medium">
                                                Ver foto del despues
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {points.links && (
                <div className="flex justify-center gap-2 flex-wrap">
                    {points.links.map((link, i) => (
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

            {/* Modal resolver */}
            <AnimatePresence>
                {resolvePoint && (
                    <ResolveModal point={resolvePoint} onClose={() => setResolvePoint(null)} />
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
