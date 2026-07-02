import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Wrench, ClipboardList, MapPin, Phone, UserPlus, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

// ─── Config ────────────────────────────────────────────────────────────────────

const CARD_H  = 145;
const VISIBLE = 5;

const REQ_COLS = [
    { key: 'pending',   label: 'Pendientes',  color: '#4263ac', bg: '#eef1fa', dot: '#4263ac' },
    { key: 'assigned',  label: 'Asignadas',   color: '#b45309', bg: '#fef3e2', dot: '#f59e0b' },
    { key: 'completed', label: 'Completadas', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
];

const ENG_COLS = [
    { key: 'pending',  label: 'Por verificar', color: '#64748b', bg: '#f1f4f9', dot: '#94a3b8' },
    { key: 'approved', label: 'Aprobados',     color: '#7c3aed', bg: '#f3eeff', dot: '#7c3aed' },
];

const URGENCY = {
    normal:   { label: 'Normal',  bg: '#f1f4f9', color: '#475569' },
    urgent:   { label: 'Urgente', bg: '#fef3e2', color: '#b45309' },
    critical: { label: 'Crítico', bg: '#fef2f2', color: '#CE6969' },
};

const STRUCT = {
    house:      'Casa',
    apartment:  'Apartamento',
    building:   'Edificio',
    commercial: 'Local',
    other:      'Otro',
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

function initials(name) {
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function parseZones(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
}

// ─── Tarjeta Solicitud ─────────────────────────────────────────────────────────

function RequestCard({ req }) {
    const urg  = URGENCY[req.urgency] || URGENCY.normal;
    const days = Math.floor((Date.now() - new Date(req.created_at)) / 86400000);

    return (
        <div onClick={() => router.visit(`/ingenieros/solicitud/${req.id}`)} style={{
            background: 'white', borderRadius: 12,
            boxShadow: '0 1px 6px rgba(16,24,40,.06)',
            padding: '10px 12px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
        }}>
            {/* Zona + urgencia */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, letterSpacing: '-.2px' }}>
                    {req.zone}{req.state ? `, ${req.state.split(' ')[0]}` : ''}
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: urg.bg, color: urg.color, flexShrink: 0 }}>
                    {urg.label}
                </span>
            </div>

            {/* Dirección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={9} color="#94a3b8" strokeWidth={2}/>
                <span style={{ fontSize: 10.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.address}</span>
            </div>

            {/* Solicitante + estructura en una línea */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {req.requester_name}
                </span>
                {req.structure_type && (
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: '#f1f4f9', color: '#475569', padding: '2px 7px', borderRadius: 4, flexShrink: 0 }}>
                        {STRUCT[req.structure_type] || req.structure_type}
                    </span>
                )}
            </div>

            {/* Ingeniero asignado (si aplica) */}
            {req.engineer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f3eeff', borderRadius: 8, padding: '4px 8px' }}>
                    <Wrench size={9} color="#7c3aed" strokeWidth={2}/>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed' }}>{req.engineer.name}</span>
                </div>
            )}

            {/* Fecha + días + flecha */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f4f9', paddingTop: 5, marginTop: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={9} color="#cbd5e1" strokeWidth={2}/>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>
                        {fmtDate(req.created_at)} · <span style={{ color: days > 7 ? '#CE6969' : '#94a3b8' }}>{days}d</span>
                    </span>
                </div>
                <ChevronRight size={12} color="#cbd5e1" strokeWidth={2}/>
            </div>
        </div>
    );
}

// ─── Tarjeta Ingeniero ─────────────────────────────────────────────────────────

function EngineerCard({ eng, idx }) {
    const zones = parseZones(eng.zones_available);
    const count = eng.inspection_requests_count ?? 0;

    return (
        <div style={{
            background: 'white', borderRadius: 12,
            border: '1px solid #ede9ff',
            padding: '11px 12px',
            display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0,
        }}>
            {/* Avatar + nombre + especialidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: PASTEL[idx % PASTEL.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#3a4250' }}>{initials(eng.name)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eng.name}</div>
                    <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {eng.specialty || 'Ingeniero'}
                        {count > 0 && <span style={{ color: '#b45309', fontWeight: 700 }}> · {count} insp.</span>}
                    </div>
                </div>
            </div>

            {/* Zonas — texto plano, sin chips */}
            {zones.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={9} color="#a78bfa" strokeWidth={2} style={{ flexShrink: 0 }}/>
                    <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {zones.join(', ')}
                    </span>
                </div>
            )}

            {/* Teléfono */}
            {eng.phone && (
                <a href={`tel:${eng.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#f3eeff', color: '#7c3aed', fontSize: 11.5, fontWeight: 700, padding: '7px', borderRadius: 9, textDecoration: 'none' }}>
                    <Phone size={11} color="#7c3aed" strokeWidth={2}/> {eng.phone}
                </a>
            )}
        </div>
    );
}

// ─── Columna genérica ──────────────────────────────────────────────────────────

function Column({ col, items, renderCard, emptyIcon: EmptyIcon, emptyLabel }) {
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
                maxHeight: VISIBLE * CARD_H,
                paddingRight: 2, flex: 1,
                scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent',
            }}>
                {items.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 12, padding: '20px 13px', textAlign: 'center', boxShadow: '0 1px 5px rgba(16,24,40,.04)' }}>
                        <EmptyIcon size={18} color="#e2e8f0" strokeWidth={2} style={{ display: 'block', margin: '0 auto 5px' }}/>
                        <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: 0, fontWeight: 500 }}>{emptyLabel}</p>
                    </div>
                ) : (
                    items.map((item, i) => renderCard(item, i))
                )}
            </div>
        </div>
    );
}

// ─── Separador de grupo ────────────────────────────────────────────────────────

function GroupDivider() {
    return (
        <div style={{ width: 1, flexShrink: 0, alignSelf: 'stretch', background: '#e2e8f0', margin: '0 6px' }}/>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function IngenierosIndex({ requests, engineers }) {
    const req = {
        pending:   requests?.pending   ?? [],
        assigned:  requests?.assigned  ?? [],
        completed: requests?.completed ?? [],
    };
    const eng = {
        pending:  engineers?.pending  ?? [],
        approved: engineers?.approved ?? [],
    };

    const totalReqs = req.pending.length + req.assigned.length + req.completed.length;
    const totalEngs = eng.pending.length + eng.approved.length;

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '16px 0 0' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14, flexShrink: 0, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: '#1e293b' }}>Ingenieros voluntarios</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            {totalReqs} solicitud{totalReqs !== 1 ? 'es' : ''} · {totalEngs} ingeniero{totalEngs !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href="/ingenieros/solicitar" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#4263ac', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0 }}>
                            <AlertTriangle size={12} color="white" strokeWidth={2.5}/> Solicitar inspección
                        </Link>
                        <Link href="/ingenieros/registrar" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', color: '#4263ac', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0, border: '1.5px solid #4263ac' }}>
                            <UserPlus size={12} color="#4263ac" strokeWidth={2.5}/> Soy ingeniero
                        </Link>
                    </div>
                </div>

                {/* Kanban horizontal */}
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 20px 20px', flex: 1, alignItems: 'flex-start', scrollbarWidth: 'none' }}>

                    {/* Solicitudes de inspección */}
                    {REQ_COLS.map(col => (
                        <Column
                            key={col.key}
                            col={col}
                            items={req[col.key]}
                            renderCard={(item) => <RequestCard key={item.id} req={item}/>}
                            emptyIcon={ClipboardList}
                            emptyLabel="Sin solicitudes"
                        />
                    ))}

                    {/* Divisor */}
                    <GroupDivider/>

                    {/* Ingenieros */}
                    {ENG_COLS.map(col => (
                        <Column
                            key={col.key}
                            col={col}
                            items={eng[col.key]}
                            renderCard={(item, i) => <EngineerCard key={item.id} eng={item} idx={i}/>}
                            emptyIcon={Wrench}
                            emptyLabel="Ninguno"
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
