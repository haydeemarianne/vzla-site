import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { Truck, MapPin, Phone, Package, Users, CheckCircle, Clock } from 'lucide-react';

const CARGO_LABEL = { supplies: 'Insumos', debris: 'Escombros', people: 'Personas' };
const CARGO_ICON  = { supplies: Package, debris: Truck, people: Users };

const STATUS_CFG = {
    open:      { label: 'Abierta',    color: '#4263ac', bg: '#eef1fa' },
    taken:     { label: 'En camino',  color: '#b45309', bg: '#fef3e2' },
    completed: { label: 'Completada', color: '#16a34a', bg: '#dcfce7' },
};

const STAGES = [
    { key: 'open',      label: 'Publicada'  },
    { key: 'taken',     label: 'Conductor asignado' },
    { key: 'completed', label: 'Completada' },
];

const STAGE_IDX = { open: 0, taken: 1, completed: 2 };

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
}

export default function TransporteShow({ request: req }) {
    const CargoIcon  = CARGO_ICON[req.cargo_type] || Truck;
    const status     = STATUS_CFG[req.status] || STATUS_CFG.open;
    const isUrgent   = req.urgency === 'urgent';
    const currentIdx = STAGE_IDX[req.status] ?? 0;
    const d          = Math.floor((Date.now() - new Date(req.created_at)) / 86400000);

    const take     = () => router.post(`/transporte/solicitudes/${req.id}/tomar`,     {}, { preserveScroll: true });
    const complete = () => router.post(`/transporte/solicitudes/${req.id}/completar`, {}, { preserveScroll: true });

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 13, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CargoIcon size={20} color="#4263ac" strokeWidth={2}/>
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#1a2230', letterSpacing: '-.4px' }}>
                                {CARGO_LABEL[req.cargo_type]} · {req.origin_zone} → {req.destination_zone}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, background: status.bg, color: status.color, padding: '2px 10px', borderRadius: 999 }}>
                                    {status.label}
                                </span>
                                {isUrgent && req.status === 'open' && (
                                    <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3e2', color: '#b45309', padding: '2px 10px', borderRadius: 999 }}>Urgente</span>
                                )}
                                <span style={{ fontSize: 11, color: d > 3 ? '#CE6969' : '#94a3b8' }}>Publicada hace {d}d</span>
                            </div>
                        </div>
                    </div>
                    {req.status === 'open' && (
                        <button onClick={take} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Truck size={14} color="white" strokeWidth={2}/> Tomar este viaje
                        </button>
                    )}
                    {req.status === 'taken' && (
                        <button onClick={complete} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: 'none', background: '#16a34a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <CheckCircle size={14} color="white" strokeWidth={2}/> Marcar completado
                        </button>
                    )}
                </div>

                {/* 2 columnas — info principal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                    {/* Col izq — Solicitante */}
                    <div style={CARD}>
                        <p style={SEC}>Solicitante</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{req.requester_name}</p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>Quien solicita el traslado</p>
                            </div>
                            <a href={`tel:${req.requester_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#eef1fa', color: '#4263ac', borderRadius: 11, padding: '8px 14px', textDecoration: 'none', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                <Phone size={13} color="#4263ac" strokeWidth={2}/> {req.requester_phone}
                            </a>
                        </div>
                        {req.description && (
                            <>
                                <div style={DIV}/>
                                <p style={{ margin: 0, fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>{req.description}</p>
                            </>
                        )}
                        {req.notes && (
                            <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>{req.notes}</p>
                        )}
                    </div>

                    {/* Col der — Carga */}
                    <div style={CARD}>
                        <p style={SEC}>Detalle de la carga</p>
                        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, background: '#eef1fa', color: '#4263ac', padding: '4px 12px', borderRadius: 999 }}>
                                {CARGO_LABEL[req.cargo_type]}
                            </span>
                            {isUrgent && (
                                <span style={{ fontSize: 12, fontWeight: 700, background: '#fef3e2', color: '#b45309', padding: '4px 12px', borderRadius: 999 }}>
                                    Urgente · necesitan hoy
                                </span>
                            )}
                        </div>
                        {req.status === 'open' && (
                            <>
                                <div style={DIV}/>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    <Clock size={13} color="#94a3b8" strokeWidth={2}/>
                                    <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8' }}>
                                        Esperando conductor hace {d} día{d !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <button onClick={take} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 11, border: 'none', background: '#0f172a', color: 'white', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <Truck size={13} color="white" strokeWidth={2}/> Soy conductor — tomar viaje
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Recorrido con escalas — barra de progreso */}
                <div style={CARD}>
                    <p style={SEC}>Recorrido</p>

                    {/* Origen → Destino visual */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
                        {/* Origen */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 80 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef1fa', border: '2px solid #4263ac', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={15} color="#4263ac" strokeWidth={2}/>
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: 11.5, fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>{req.origin_zone}</p>
                            {req.origin_state && <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>{req.origin_state}</p>}
                        </div>

                        {/* Línea de progreso */}
                        <div style={{ flex: 1, position: 'relative', height: 6, margin: '0 12px', marginBottom: 28 }}>
                            <div style={{ height: '100%', background: '#f1f4f9', borderRadius: 999 }}/>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 999, background: req.status === 'completed' ? '#16a34a' : req.status === 'taken' ? '#b45309' : '#4263ac', width: req.status === 'completed' ? '100%' : req.status === 'taken' ? '50%' : '8%', transition: 'width .5s ease' }}/>
                            {/* Punto medio — "en camino" */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: req.status === 'completed' || req.status === 'taken' ? '#b45309' : '#e2e8f0', border: '2px solid white' }}/>
                        </div>

                        {/* Destino */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 80 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: req.status === 'completed' ? '#dcfce7' : '#f8fafc', border: `2px solid ${req.status === 'completed' ? '#16a34a' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={15} color={req.status === 'completed' ? '#16a34a' : '#94a3b8'} strokeWidth={2}/>
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: 11.5, fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>{req.destination_zone}</p>
                            {req.destination_state && <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>{req.destination_state}</p>}
                        </div>
                    </div>

                    <div style={DIV}/>

                    {/* Escalas / etapas */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                        {STAGES.map((stage, i) => {
                            const done    = i <= currentIdx;
                            const current = i === currentIdx;
                            const isLast  = i === STAGES.length - 1;
                            return (
                                <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 0 : 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                                        <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? (current && req.status !== 'completed' ? '#4263ac' : '#16a34a') : '#f1f4f9', border: `2px solid ${done ? (current && req.status !== 'completed' ? '#4263ac' : '#16a34a') : '#e2e8f0'}`, transition: 'all .3s' }}>
                                            {done && !current && <CheckCircle size={11} color="white" strokeWidth={2.5}/>}
                                            {current && req.status !== 'completed' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }}/>}
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: 10.5, fontWeight: current ? 700 : 500, color: done ? '#1e293b' : '#94a3b8', whiteSpace: 'nowrap' }}>{stage.label}</p>
                                            {i === 0 && req.created_at && <p style={{ margin: '1px 0 0', fontSize: 9.5, color: '#94a3b8' }}>{fmtDate(req.created_at)}</p>}
                                            {i === 1 && req.taken_at    && <p style={{ margin: '1px 0 0', fontSize: 9.5, color: '#94a3b8' }}>{fmtDate(req.taken_at)}</p>}
                                            {i === 2 && req.completed_at && <p style={{ margin: '1px 0 0', fontSize: 9.5, color: '#94a3b8' }}>{fmtDate(req.completed_at)}</p>}
                                        </div>
                                    </div>
                                    {!isLast && (
                                        <div style={{ flex: 1, height: 2, background: i < currentIdx ? '#16a34a' : '#f1f4f9', margin: '10px 6px 0', borderRadius: 999, transition: 'background .3s' }}/>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
