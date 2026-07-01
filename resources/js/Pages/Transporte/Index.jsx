import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Truck, MapPin, Phone, Package, Users, CheckCircle, Clock, Plus } from 'lucide-react';

// ─── Config ────────────────────────────────────────────────────────────────────

const REQ_CARD_H = 172;
const DRV_CARD_H = 120;
const VISIBLE    = 4;

const REQ_COLS = [
    { key: 'open',      label: 'Abiertas',   color: '#4263ac', bg: '#eef1fa', dot: '#4263ac' },
    { key: 'taken',     label: 'En camino',  color: '#b45309', bg: '#fef3e2', dot: '#f59e0b' },
    { key: 'completed', label: 'Completadas',color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
];

const DRV_COLS = [
    { key: 'available', label: 'Disponibles', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
    { key: 'busy',      label: 'Ocupados',    color: '#b45309', bg: '#fef3e2', dot: '#f59e0b' },
];

const CARGO_LABEL = { supplies: 'Insumos', debris: 'Escombros', people: 'Personas' };
const CARGO_ICON  = { supplies: Package, debris: Truck, people: Users };

const VEHICLE_LABEL = { moto: 'Moto', car: 'Carro', pickup: 'Camioneta', truck: 'Camión' };

const PASTEL = ['#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#e7dcf2'];

function initials(name) {
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
}

// ─── Tarjeta solicitud ─────────────────────────────────────────────────────────

function RequestCard({ req }) {
    const CargoIcon = CARGO_ICON[req.cargo_type] || Package;
    const isUrgent  = req.urgency === 'urgent';
    const days      = Math.floor((Date.now() - new Date(req.created_at)) / 86400000);

    const takeReq     = (e) => { e.stopPropagation(); router.post(`/transporte/solicitudes/${req.id}/tomar`,     {}, { preserveScroll: true }); };
    const completeReq = (e) => { e.stopPropagation(); router.post(`/transporte/solicitudes/${req.id}/completar`, {}, { preserveScroll: true }); };

    return (
        <div onClick={() => router.visit(`/transporte/solicitudes/${req.id}`)} style={{
            background: 'white', borderRadius: 12,
            boxShadow: '0 1px 6px rgba(16,24,40,.06)',
            padding: '10px 12px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
        }}>
            {/* Tipo + urgencia */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CargoIcon size={12} color="#4263ac" strokeWidth={2}/>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0f172a', flex: 1 }}>
                    {CARGO_LABEL[req.cargo_type]}
                </span>
                {isUrgent && req.status === 'open' && (
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: '#fef3e2', color: '#b45309', padding: '2px 7px', borderRadius: 999, flexShrink: 0 }}>Urgente</span>
                )}
            </div>

            {/* Descripción */}
            {req.description && (
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {req.description}
                </p>
            )}

            {/* Ruta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f8fafc', borderRadius: 8, padding: '5px 8px' }}>
                <MapPin size={9} color="#94a3b8" strokeWidth={2} style={{ flexShrink: 0 }}/>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.origin_zone}</span>
                <span style={{ fontSize: 10, color: '#cbd5e1', flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.destination_zone}</span>
            </div>

            {/* Solicitante + fecha */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Phone size={9} color="#94a3b8" strokeWidth={2}/>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{req.requester_name}</span>
                </div>
                <span style={{ fontSize: 9.5, color: days > 3 ? '#CE6969' : '#94a3b8' }}>{days}d</span>
            </div>

            {/* Acción */}
            {req.status === 'open' && (
                <button onClick={takeReq} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '6px', borderRadius: 9, background: '#0f172a', border: 'none',
                    color: 'white', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                    <Truck size={11} color="white" strokeWidth={2}/> Tomar viaje
                </button>
            )}
            {req.status === 'taken' && (
                <button onClick={completeReq} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '6px', borderRadius: 9, background: '#16a34a', border: 'none',
                    color: 'white', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                    <CheckCircle size={11} color="white" strokeWidth={2}/> Marcar completado
                </button>
            )}
            {req.status === 'completed' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10.5, color: '#16a34a', fontWeight: 600 }}>
                    <CheckCircle size={10} color="#16a34a" strokeWidth={2}/> Completado {fmtDate(req.completed_at)}
                </div>
            )}
        </div>
    );
}

// ─── Tarjeta conductor ─────────────────────────────────────────────────────────

function DriverCard({ driver, idx }) {
    const zones = Array.isArray(driver.zones) ? driver.zones : [];

    return (
        <div style={{
            background: '#f8fafc', borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
        }}>
            {/* Avatar + nombre + teléfono derecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: PASTEL[idx % PASTEL.length], flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#3a4250' }}>{initials(driver.name)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{driver.name}</div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#475569', background: '#e2e8f0', padding: '1px 6px', borderRadius: 999 }}>
                        {VEHICLE_LABEL[driver.vehicle_type] || driver.vehicle_type}
                    </span>
                </div>
                {driver.phone && (
                    <a href={`tel:${driver.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#e2e8f0', color: '#475569', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}>
                        <Phone size={9} color="#475569" strokeWidth={2}/> {driver.phone}
                    </a>
                )}
            </div>

            {zones.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    <MapPin size={9} color="#94a3b8" strokeWidth={2}/>
                    {zones.slice(0, 2).map(z => (
                        <span key={z} style={{ fontSize: 9.5, fontWeight: 600, color: '#475569', background: '#e2e8f0', padding: '1px 6px', borderRadius: 4 }}>{z}</span>
                    ))}
                    {zones.length > 2 && <span style={{ fontSize: 9.5, color: '#94a3b8' }}>+{zones.length - 2}</span>}
                </div>
            )}
        </div>
    );
}

// ─── Columna ──────────────────────────────────────────────────────────────────

function Column({ col, items, cardH, renderCard, emptyIcon: EmptyIcon, emptyLabel }) {
    return (
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', background: col.bg, borderRadius: 11, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, fontWeight: 700, color: col.color, flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: col.color, minWidth: 20, height: 20, borderRadius: '50%', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {items.length}
                </span>
            </div>
            <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                overflowY: 'auto', overflowX: 'hidden',
                maxHeight: VISIBLE * cardH,
                paddingRight: 2, flex: 1,
                scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent',
            }}>
                {items.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 12, padding: '20px 13px', textAlign: 'center', boxShadow: '0 1px 5px rgba(16,24,40,.04)' }}>
                        <EmptyIcon size={18} color="#e2e8f0" strokeWidth={2} style={{ display: 'block', margin: '0 auto 5px' }}/>
                        <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: 0, fontWeight: 500 }}>{emptyLabel}</p>
                    </div>
                ) : items.map((item, i) => renderCard(item, i))}
            </div>
        </div>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function TransporteIndex({ by_status, drivers }) {
    const reqs = {
        open:      by_status?.open      ?? [],
        taken:     by_status?.taken     ?? [],
        completed: by_status?.completed ?? [],
    };
    const drvs = {
        available: drivers?.available ?? [],
        busy:      drivers?.busy      ?? [],
    };

    const totalReqs = reqs.open.length + reqs.taken.length + reqs.completed.length;
    const totalDrvs = drvs.available.length + drvs.busy.length;

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '16px 0 0' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14, flexShrink: 0, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: '#1e293b' }}>Transporte solidario</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            {reqs.open.length} solicitud{reqs.open.length !== 1 ? 'es' : ''} abierta{reqs.open.length !== 1 ? 's' : ''} · {drvs.available.length} conductor{drvs.available.length !== 1 ? 'es' : ''} disponible{drvs.available.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href="/transporte/solicitar" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#4263ac', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0 }}>
                            <Plus size={12} color="white" strokeWidth={2.5}/> Necesito transporte
                        </Link>
                        <Link href="/transporte/registrar" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', color: '#4263ac', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0, border: '1.5px solid #4263ac' }}>
                            <Truck size={12} color="#4263ac" strokeWidth={2.5}/> Soy conductor
                        </Link>
                    </div>
                </div>

                {/* Kanban */}
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 20px 20px', flex: 1, alignItems: 'flex-start', scrollbarWidth: 'none' }}>

                    {REQ_COLS.map(col => (
                        <Column key={col.key} col={col} items={reqs[col.key]} cardH={REQ_CARD_H}
                            renderCard={(item) => <RequestCard key={item.id} req={item}/>}
                            emptyIcon={Truck} emptyLabel="Sin solicitudes"
                        />
                    ))}

                    <div style={{ width: 1, flexShrink: 0, alignSelf: 'stretch', background: '#e2e8f0', margin: '0 6px' }}/>

                    {DRV_COLS.map(col => (
                        <Column key={col.key} col={col} items={drvs[col.key]} cardH={DRV_CARD_H}
                            renderCard={(item, i) => <DriverCard key={item.id} driver={item} idx={i}/>}
                            emptyIcon={Truck} emptyLabel="Ninguno"
                        />
                    ))}
                </div>
            </div>

            <style>{`
                div::-webkit-scrollbar { width: 4px; height: 4px; }
                div::-webkit-scrollbar-track { background: transparent; }
                div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
            `}</style>
        </MainLayout>
    );
}
