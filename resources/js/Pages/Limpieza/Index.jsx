import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { MapPin, Plus, Users, Trash2 } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────

const CARD_H  = 168;
const VISIBLE = 4;

const COLUMNS = [
    { key: 'pending',    label: 'Sin equipo',  color: '#4263ac', bg: '#eef1fa', dot: '#4263ac' },
    { key: 'in_process', label: 'En proceso',  color: '#b45309', bg: '#fef3e2', dot: '#f59e0b' },
    { key: 'resolved',   label: 'Completados', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
];

const TYPE_BADGE = {
    debris:   { bg: '#fef3e2', color: '#b45309', label: 'Escombros' },
    domestic: { bg: '#f1f4f9', color: '#475569', label: 'Basura'    },
    both:     { bg: '#eef2fa', color: '#4263ac', label: 'Mixto'     },
};

const VOL_DOT = { low: '#16a34a', medium: '#b45309', high: '#CE6969' };
const VOL_LABEL = { low: 'Poco', medium: 'Bastante', high: 'Mucho' };

// ─── Tarjeta ──────────────────────────────────────────────────────────────────

function PointCard({ point }) {
    const badge  = TYPE_BADGE[point.type] || TYPE_BADGE.domestic;
    const dotCol = VOL_DOT[point.volume]  || '#b45309';
    const volLbl = VOL_LABEL[point.volume]|| 'Bastante';
    const pct    = Math.min(100, ((point.helpers_count || 0) / 10) * 100);

    return (
        <div
            onClick={() => router.visit(`/limpieza/${point.id}`)}
            style={{
                background: 'white', borderRadius: 12,
                boxShadow: '0 1px 6px rgba(16,24,40,.06)',
                padding: '10px 12px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
            }}
        >
            {/* Nombre + ubicación */}
            <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-.2px' }}>
                    {point.zone_name}{point.city ? `, ${point.city}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <MapPin size={9} color="#94a3b8" strokeWidth={2}/>
                    <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{point.state || 'Venezuela'}</span>
                </div>
            </div>

            {/* Chips tipo + volumen */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ background: badge.bg, color: badge.color, fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
                    {badge.label}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, fontWeight: 700, color: dotCol }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotCol, display: 'inline-block' }}/>
                    {volLbl}
                </span>
            </div>

            {/* Notas */}
            {point.notes && (
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {point.notes}
                </p>
            )}

            {/* Voluntarios + barra */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <Users size={10} color="#94a3b8" strokeWidth={2}/>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                        {point.helpers_count || 0}/10 voluntarios
                    </span>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: '#f1f4f9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: pct >= 100 ? '#16a34a' : '#4263ac', borderRadius: 999, width: `${pct}%`, transition: 'width .4s' }}/>
                </div>
            </div>

            {/* CTA */}
            <Link href={`/limpieza/${point.id}`} onClick={e => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px', borderRadius: 9, background: '#0f172a', color: 'white', fontWeight: 700, fontSize: 11.5, textDecoration: 'none', marginTop: 1 }}>
                Ver jornada y apuntarme
            </Link>
        </div>
    );
}

// ─── Columna ──────────────────────────────────────────────────────────────────

function Column({ col, points }) {
    return (
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', background: col.bg, borderRadius: 11, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, fontWeight: 700, color: col.color, flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: col.color, minWidth: 20, height: 20, borderRadius: '50%', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {points.length}
                </span>
            </div>

            {/* Cards con scroll */}
            <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                overflowY: 'auto', overflowX: 'hidden',
                maxHeight: VISIBLE * CARD_H,
                paddingRight: 2, flex: 1,
                scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent',
            }}>
                {points.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 12, padding: '20px 13px', textAlign: 'center', boxShadow: '0 1px 5px rgba(16,24,40,.04)' }}>
                        <Trash2 size={18} color="#e2e8f0" strokeWidth={2} style={{ display: 'block', margin: '0 auto 5px' }}/>
                        <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: 0, fontWeight: 500 }}>Ningún punto</p>
                    </div>
                ) : (
                    points.map(p => <PointCard key={p.id} point={p}/>)
                )}
            </div>
        </div>
    );
}

// ─── Mapa decorativo ─────────────────────────────────────────────────────────

function MapDecorativo({ total }) {
    return (
        <div style={{ height: 130, borderRadius: 20, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg,#dbe4f3,#eef2f8)', border: '1px solid #e2e8f2', flexShrink: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 360 130" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                <path d="M0 80 Q90 55 180 82 T360 70" stroke="#c2cfe4" strokeWidth="2" fill="none"/>
                <path d="M-10 36 Q120 64 200 26 T380 50" stroke="#cdd9eb" strokeWidth="1.5" fill="none"/>
            </svg>
            <div style={{ position: 'absolute', left: 64,  top: 44, width: 13, height: 13, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#4263ac', boxShadow: '0 0 0 4px rgba(66,99,172,.18)' }}/>
            <div style={{ position: 'absolute', left: 188, top: 68, width: 13, height: 13, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#f59e0b', boxShadow: '0 0 0 4px rgba(245,158,11,.2)' }}/>
            <div style={{ position: 'absolute', left: 264, top: 36, width: 13, height: 13, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#4263ac', boxShadow: '0 0 0 4px rgba(66,99,172,.18)' }}/>
            <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'white', padding: '4px 10px', borderRadius: 8, boxShadow: '0 2px 8px rgba(16,24,40,.08)', fontSize: 11, fontWeight: 700, color: '#475569' }}>
                {total} punto{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function LimpiezaIndex({ by_status }) {
    const pending    = by_status?.pending    ?? [];
    const in_process = by_status?.in_process ?? [];
    const resolved   = by_status?.resolved   ?? [];
    const total      = pending.length + in_process.length + resolved.length;

    const byKey = { pending, in_process, resolved };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '16px 0 0' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12, flexShrink: 0 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: '#1e293b' }}>Limpieza comunitaria</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            {pending.length} sin equipo · {total} en total
                        </p>
                    </div>
                    <Link href="/limpieza/reportar" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#4263ac', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0 }}>
                        <Plus size={13} color="white" strokeWidth={2.5}/> Reportar
                    </Link>
                </div>

                {/* Mapa */}
                <div style={{ padding: '0 20px', marginBottom: 12, flexShrink: 0 }}>
                    <MapDecorativo total={total}/>
                </div>

                {/* Kanban */}
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 20px 20px', flex: 1, alignItems: 'flex-start', scrollbarWidth: 'none' }}>
                    {COLUMNS.map(col => (
                        <Column key={col.key} col={col} points={byKey[col.key] ?? []}/>
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
