import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { MapPin, Plus, Users, Trash2 } from 'lucide-react';

const TYPE_BADGE = {
    debris:   { bg: '#fef3e2', color: '#b45309', label: 'Escombros' },
    domestic: { bg: '#f1f4f9', color: '#475569', label: 'Basura'    },
    both:     { bg: '#eef2fa', color: '#4263ac', label: 'Mixto'     },
};

const VOL_DOT = {
    low:    '#16a34a',
    medium: '#b45309',
    high:   '#CE6969',
};

const STATUS_CFG = {
    pending:    { bg: '#eef1fa', color: '#4263ac', label: 'Sin equipo'  },
    in_process: { bg: '#fef3e2', color: '#b45309', label: 'En proceso'  },
    resolved:   { bg: '#dcfce7', color: '#15803d', label: 'Completado'  },
};

const CARD  = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 18, padding: '16px' };
const SEC   = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };

function PointCard({ point }) {
    const badge  = TYPE_BADGE[point.type]   || TYPE_BADGE.domestic;
    const dotCol = VOL_DOT[point.volume]    || VOL_DOT.medium;
    const status = STATUS_CFG[point.status] || STATUS_CFG.pending;
    const pct    = Math.min(100, ((point.helpers_count || 0) / 10) * 100);

    return (
        <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }}
            onClick={() => router.visit(`/limpieza/${point.id}`)}>

            {/* Top: nombre + status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a', letterSpacing: '-.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {point.zone_name}{point.city ? `, ${point.city}` : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                        <MapPin size={10} color="#94a3b8" strokeWidth={2}/>
                        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 500 }}>{point.state || 'Venezuela'}</span>
                    </div>
                </div>
                <span style={{ ...status, fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {status.label}
                </span>
            </div>

            {/* Chips: tipo + volumen */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ background: badge.bg, color: badge.color, fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>
                    {badge.label}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, color: dotCol }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotCol, display: 'inline-block' }}/>
                    {point.volume === 'low' ? 'Poco' : point.volume === 'high' ? 'Mucho' : 'Bastante'}
                </span>
            </div>

            {/* Notas */}
            {point.notes && (
                <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {point.notes}
                </p>
            )}

            {/* Voluntarios */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                        <Users size={11} color="#94a3b8" strokeWidth={2}/>
                        {point.helpers_count || 0}/10 voluntarios
                    </span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: '#f1f4f9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: pct >= 100 ? '#16a34a' : '#4263ac', borderRadius: 999, width: `${pct}%`, transition: 'width .4s' }}/>
                </div>
            </div>

            {/* CTA */}
            <Link href={`/limpieza/${point.id}`} onClick={e => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px', borderRadius: 12, background: '#0f172a', color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', marginTop: 2 }}>
                Ver jornada y apuntarme
            </Link>
        </div>
    );
}

const FILTER_TABS = [
    { key: null,         label: 'Todos'       },
    { key: 'pending',    label: 'Sin equipo'  },
    { key: 'in_process', label: 'En proceso'  },
    { key: 'resolved',   label: 'Completados' },
];

function MapDecorativo({ points }) {
    const active = points.filter(p => p.status !== 'resolved');
    return (
        <div style={{ height: 140, borderRadius: 20, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg,#dbe4f3,#eef2f8)', border: '1px solid #e2e8f2' }}>
            <svg width="100%" height="100%" viewBox="0 0 360 140" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                <path d="M0 90 Q90 60 180 92 T360 80" stroke="#c2cfe4" strokeWidth="2" fill="none"/>
                <path d="M-10 40 Q120 70 200 30 T380 55" stroke="#cdd9eb" strokeWidth="1.5" fill="none"/>
            </svg>
            <div style={{ position: 'absolute', left: 64,  top: 48, width: 14, height: 14, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#4263ac', boxShadow: '0 0 0 4px rgba(66,99,172,.18)' }}/>
            <div style={{ position: 'absolute', left: 188, top: 74, width: 14, height: 14, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#f59e0b', boxShadow: '0 0 0 4px rgba(245,158,11,.2)' }}/>
            <div style={{ position: 'absolute', left: 264, top: 40, width: 14, height: 14, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#4263ac', boxShadow: '0 0 0 4px rgba(66,99,172,.18)' }}/>
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'white', padding: '5px 11px', borderRadius: 9, boxShadow: '0 2px 8px rgba(16,24,40,.08)', fontSize: 11, fontWeight: 700, color: '#475569' }}>
                {active.length} punto{active.length !== 1 ? 's' : ''} activo{active.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

export default function LimpiezaIndex({ points, filters, counts }) {
    const activeStatus = filters?.status ?? null;

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>Limpieza comunitaria</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#7b8595' }}>
                            {counts.pending || 0} sin equipo · {counts.in_process || 0} en proceso · {counts.resolved || 0} completados
                        </p>
                    </div>
                    <Link href="/limpieza/reportar" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#4263ac', color: 'white', padding: '9px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                        <Plus size={14} color="white" strokeWidth={2.5}/> Reportar punto
                    </Link>
                </div>

                {/* Mapa decorativo */}
                <MapDecorativo points={points.data}/>

                {/* Filtros */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {FILTER_TABS.map(tab => {
                        const isA = activeStatus === tab.key;
                        const cnt = tab.key ? (counts[tab.key] || 0) : null;
                        return (
                            <button key={String(tab.key)}
                                onClick={() => router.get('/limpieza', tab.key ? { status: tab.key } : {}, { preserveState: true })}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                                    background: isA ? '#0f172a' : '#f3f4f8',
                                    color:      isA ? 'white'   : '#64748b' }}>
                                {tab.label}
                                {cnt !== null && cnt > 0 && (
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 999,
                                        background: isA ? 'rgba(255,255,255,.2)' : '#e2e8f0',
                                        color:      isA ? 'white' : '#64748b' }}>
                                        {cnt}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Grid de cards */}
                {points.data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '56px 0' }}>
                        <Trash2 size={40} color="#cbd5e1" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 10px' }}/>
                        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, margin: '0 0 4px' }}>No hay puntos reportados</p>
                        <p style={{ fontSize: 12.5, color: '#94a3b8', margin: '0 0 14px' }}>Sé el primero en reportar un punto de limpieza</p>
                        <Link href="/limpieza/reportar" style={{ background: '#0f172a', color: 'white', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 12, textDecoration: 'none' }}>
                            Reportar el primero
                        </Link>
                    </div>
                ) : (
                    <div className="va-limpieza-grid">
                        {points.data.map(point => <PointCard key={point.id} point={point}/>)}
                    </div>
                )}

                {/* Paginación */}
                {points.links && points.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
                        {points.links.map((link, i) =>
                            link.url ? (
                                <Link key={i} href={link.url} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: link.active ? 700 : 500, background: link.active ? '#4263ac' : 'white', color: link.active ? 'white' : '#475569', border: link.active ? 'none' : '1px solid #e2e6ee', textDecoration: 'none' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}/>
                            ) : (
                                <span key={i} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 13, color: '#cbd5e1' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}/>
                            )
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
