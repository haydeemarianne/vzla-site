import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { FiTruck, FiPlus, FiMapPin, FiPhone, FiPackage, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CARGO_LABEL = { supplies: 'Insumos', debris: 'Escombros', people: 'Personas' };
const CARGO_ICON  = { supplies: FiPackage, debris: FiTruck, people: FiUsers };

const VEHICLE_LABEL = { moto: 'Moto', car: 'Carro', pickup: 'Camioneta', truck: 'Camion' };
const AVAIL_CFG = {
    available:   { label: 'Disponible', cls: 'bg-green-50 text-green-700 border border-green-200' },
    busy:        { label: 'Ocupado',    cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    unavailable: { label: 'No disponible', cls: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

const STATUS_CFG = {
    open:      { label: 'Abierto',    cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
    taken:     { label: 'En camino',  cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    completed: { label: 'Completado', cls: 'bg-green-50 text-green-700 border border-green-200' },
};

const take = (id) => {
    router.post(`/transporte/solicitudes/${id}/tomar`, {}, {
        preserveScroll: true,
        onSuccess: () => toast.success('Viaje tomado. Contacta al solicitante.'),
    });
};

const complete = (id) => {
    router.post(`/transporte/solicitudes/${id}/completar`, {}, {
        preserveScroll: true,
        onSuccess: () => toast.success('¡Viaje completado! Gracias.'),
    });
};

export default function TransporteIndex({ requests, drivers, filters, counts }) {
    const activeTab = filters.tab || 'requests';

    const switchTab = (tab) => {
        router.get('/transporte', { tab }, { preserveScroll: true, replace: true });
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Transporte solidario</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Conductores voluntarios que mueven insumos, escombros o personas</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/transporte/registrar"
                        className="flex items-center gap-1.5 border border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors">
                        <FiTruck className="w-4 h-4" /> Soy conductor
                    </Link>
                    <Link href="/transporte/solicitar"
                        className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Necesito transporte
                    </Link>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                    { label: 'Solicitudes abiertas', value: counts.open,      color: 'text-blue-700' },
                    { label: 'En camino',             value: counts.taken,     color: 'text-amber-600' },
                    { label: 'Completados',           value: counts.completed, color: 'text-green-600' },
                    { label: 'Conductores activos',   value: counts.drivers,   color: 'text-slate-700' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-2xl p-3 text-center">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
                {[
                    { key: 'requests', label: 'Solicitudes' },
                    { key: 'drivers',  label: 'Conductores' },
                ].map(({ key, label }) => (
                    <button key={key} onClick={() => switchTab(key)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            activeTab === key
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Solicitudes */}
            {activeTab === 'requests' && (
                <>
                    {requests.data.length === 0 ? (
                        <div className="text-center py-14 text-slate-400">
                            <FiTruck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-slate-600 text-sm">No hay solicitudes abiertas</p>
                            <Link href="/transporte/solicitar"
                                className="mt-3 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                                <FiPlus className="w-4 h-4" /> Publicar solicitud
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3 mb-6">
                            {requests.data.map((req, i) => {
                                const CargoIcon = CARGO_ICON[req.cargo_type] || FiPackage;
                                const statusCfg = STATUS_CFG[req.status] || STATUS_CFG.open;
                                const isUrgent  = req.urgency === 'urgent';

                                return (
                                    <motion.div key={req.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                                        className={`bg-white border rounded-2xl p-4 ${isUrgent && req.status === 'open' ? 'border-amber-200' : 'border-slate-200'}`}>

                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <CargoIcon className="w-4 h-4 text-blue-700" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm leading-tight">
                                                        {CARGO_LABEL[req.cargo_type]}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">{req.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 flex-shrink-0">
                                                {isUrgent && req.status === 'open' && (
                                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                                        Urgente
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                                                    {statusCfg.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ruta */}
                                        <div className="flex items-center gap-2 mb-3 text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                                            <FiMapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                            <span className="truncate font-medium">{req.origin_zone}</span>
                                            <span className="text-slate-400 flex-shrink-0">→</span>
                                            <span className="truncate font-medium">{req.destination_zone}</span>
                                        </div>

                                        {req.notes && (
                                            <p className="text-xs text-slate-500 mb-3 line-clamp-1">{req.notes}</p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <a href={`tel:${req.requester_phone}`}
                                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 transition-colors">
                                                <FiPhone className="w-3.5 h-3.5" />
                                                {req.requester_name} · {req.requester_phone}
                                            </a>

                                            {req.status === 'open' && (
                                                <button onClick={() => take(req.id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition-colors">
                                                    <FiTruck className="w-3.5 h-3.5" /> Tomar viaje
                                                </button>
                                            )}
                                            {req.status === 'taken' && (
                                                <button onClick={() => complete(req.id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                                                    <FiCheckCircle className="w-3.5 h-3.5" /> Completar
                                                </button>
                                            )}
                                            {req.status === 'completed' && (
                                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <FiCheckCircle className="w-3.5 h-3.5" /> Completado
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Conductores */}
            {activeTab === 'drivers' && (
                <>
                    {drivers.data.length === 0 ? (
                        <div className="text-center py-14 text-slate-400">
                            <FiTruck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-slate-600 text-sm">No hay conductores registrados</p>
                            <Link href="/transporte/registrar"
                                className="mt-3 inline-flex items-center gap-2 border border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                                <FiTruck className="w-4 h-4" /> Registrarme
                            </Link>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                            {drivers.data.map((driver, i) => {
                                const availCfg = AVAIL_CFG[driver.availability] || AVAIL_CFG.available;
                                return (
                                    <motion.div key={driver.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col">

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FiTruck className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm truncate">{driver.name}</p>
                                                <p className="text-xs text-slate-500">{VEHICLE_LABEL[driver.vehicle_type]}</p>
                                            </div>
                                        </div>

                                        {driver.capacity && (
                                            <p className="text-xs text-slate-500 mb-2">Capacidad: {driver.capacity}</p>
                                        )}

                                        {driver.zones?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {driver.zones.map((zone) => (
                                                    <span key={zone}
                                                        className="flex items-center gap-1 text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                                        <FiMapPin className="w-2.5 h-2.5" /> {zone}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between">
                                            <a href={`tel:${driver.phone}`}
                                                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-700 transition-colors">
                                                <FiPhone className="w-3.5 h-3.5" /> {driver.phone}
                                            </a>
                                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${availCfg.cls}`}>
                                                {availCfg.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    );
}
