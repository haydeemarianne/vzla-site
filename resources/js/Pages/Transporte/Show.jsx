import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { Truck, MapPin, Phone, Package, Users, CheckCircle, ArrowRight, Clock } from 'lucide-react';

const CARGO_LABEL = { supplies: 'Insumos', debris: 'Escombros', people: 'Personas' };
const CARGO_ICON  = { supplies: Package, debris: Truck, people: Users };

const STATUS_CFG = {
    open:      { label: 'Abierta',    color: '#4263ac', bg: '#eef1fa' },
    taken:     { label: 'En camino',  color: '#b45309', bg: '#fef3e2' },
    completed: { label: 'Completada', color: '#16a34a', bg: '#dcfce7' },
};

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function days(d) {
    return Math.floor((Date.now() - new Date(d)) / 86400000);
}

export default function TransporteShow({ request: req }) {
    const CargoIcon = CARGO_ICON[req.cargo_type] || Truck;
    const status    = STATUS_CFG[req.status] || STATUS_CFG.open;
    const isUrgent  = req.urgency === 'urgent';
    const d         = days(req.created_at);

    const take     = () => router.post(`/transporte/solicitudes/${req.id}/tomar`,     {}, { preserveScroll: true });
    const complete = () => router.post(`/transporte/solicitudes/${req.id}/completar`, {}, { preserveScroll: true });

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 13, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CargoIcon size={22} color="#4263ac" strokeWidth={2}/>
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a2230', letterSpacing: '-.4px' }}>
                                Solicitud de transporte — {CARGO_LABEL[req.cargo_type]}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, background: status.bg, color: status.color, padding: '2px 10px', borderRadius: 999 }}>
                                    {status.label}
                                </span>
                                {isUrgent && req.status === 'open' && (
                                    <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3e2', color: '#b45309', padding: '2px 10px', borderRadius: 999 }}>
                                        Urgente
                                    </span>
                                )}
                                <span style={{ fontSize: 11, color: d > 3 ? '#CE6969' : '#94a3b8' }}>
                                    Publicada hace {d}d
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    {req.status === 'open' && (
                        <button onClick={take} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Truck size={14} color="white" strokeWidth={2}/> Tomar este viaje
                        </button>
                    )}
                    {req.status === 'taken' && (
                        <button onClick={complete} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: 'none', background: '#16a34a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <CheckCircle size={14} color="white" strokeWidth={2}/> Marcar como completado
                        </button>
                    )}
                </div>

                <div className="va-show-grid">

                    {/* Columna izquierda — Ruta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={CARD}>
                            <p style={SEC}>Ruta</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                        <MapPin size={12} color="#4263ac" strokeWidth={2}/>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.4px' }}>Origen</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{req.origin_zone}</p>
                                        {req.origin_state && <p style={{ margin: '1px 0 0', fontSize: 11.5, color: '#94a3b8' }}>{req.origin_state}</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
                                    <div style={{ width: 1, height: 24, background: '#e2e8f0' }}/>
                                    <ArrowRight size={13} color="#94a3b8" strokeWidth={2}/>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                        <MapPin size={12} color="#16a34a" strokeWidth={2}/>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.4px' }}>Destino</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{req.destination_zone}</p>
                                        {req.destination_state && <p style={{ margin: '1px 0 0', fontSize: 11.5, color: '#94a3b8' }}>{req.destination_state}</p>}
                                    </div>
                                </div>
                            </div>
                            <div style={DIV}/>
                            <p style={SEC}>Descripción</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{req.description}</p>
                            {req.notes && (
                                <>
                                    <div style={DIV}/>
                                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{req.notes}</p>
                                </>
                            )}
                        </div>

                        {/* Timeline */}
                        <div style={CARD}>
                            <p style={SEC}>Historial</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4263ac', flexShrink: 0 }}/>
                                    <span style={{ fontSize: 12, color: '#475569' }}>Publicada — {fmtDate(req.created_at)}</span>
                                </div>
                                {req.taken_at && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#b45309', flexShrink: 0 }}/>
                                        <span style={{ fontSize: 12, color: '#475569' }}>Conductor asignado — {fmtDate(req.taken_at)}</span>
                                    </div>
                                )}
                                {req.completed_at && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }}/>
                                        <span style={{ fontSize: 12, color: '#475569' }}>Completada — {fmtDate(req.completed_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha — Contacto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={CARD}>
                            <p style={SEC}>Solicitante</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{req.requester_name}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#94a3b8' }}>Quien solicita el traslado</p>
                                </div>
                                <a href={`tel:${req.requester_phone}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: '#eef1fa', color: '#4263ac', borderRadius: 11,
                                    padding: '8px 14px', textDecoration: 'none', fontWeight: 700, fontSize: 13, flexShrink: 0,
                                }}>
                                    <Phone size={13} color="#4263ac" strokeWidth={2}/> {req.requester_phone}
                                </a>
                            </div>
                        </div>

                        <div style={CARD}>
                            <p style={SEC}>Detalle de la carga</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, background: '#eef1fa', color: '#4263ac', padding: '4px 12px', borderRadius: 999 }}>
                                    {CARGO_LABEL[req.cargo_type]}
                                </span>
                                {isUrgent && (
                                    <span style={{ fontSize: 12, fontWeight: 700, background: '#fef3e2', color: '#b45309', padding: '4px 12px', borderRadius: 999 }}>
                                        Urgente — necesitan hoy
                                    </span>
                                )}
                            </div>
                            {req.description && (
                                <p style={{ margin: 0, fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>{req.description}</p>
                            )}
                        </div>

                        {req.status === 'open' && (
                            <div style={{ background: '#f8fafc', border: '1px solid #e9ebf1', borderRadius: 16, padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <Clock size={14} color="#94a3b8" strokeWidth={2}/>
                                    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Esta solicitud lleva {d} día{d !== 1 ? 's' : ''} esperando un conductor.</p>
                                </div>
                                <button onClick={take} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <Truck size={14} color="white" strokeWidth={2}/> Soy conductor — tomar este viaje
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
