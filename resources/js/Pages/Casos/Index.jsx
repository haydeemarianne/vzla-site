import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowRight, Heart, MapPin, Share2, Plus } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────

const NEED_LABELS = {
    food: 'Alimentación', water: 'Agua', medicine: 'Medicamentos',
    clothing: 'Ropa', furniture: 'Mobiliario', baby: 'Bebé',
    tools: 'Herramientas', documents: 'Documentos', shelter: 'Refugio', other: 'Otro',
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

const COLUMNS = [
    { key: 'open',    label: 'Sin apadrinar', color: '#4263ac', bg: '#eef1fa', dot: '#4263ac' },
    { key: 'adopted', label: 'Apadrinados',   color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name, anon) {
    if (anon) return 'FA';
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function daysSince(date) {
    if (!date) return 1;
    return Math.max(1, Math.floor((Date.now() - new Date(date)) / 86400000));
}

function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

function shareCase(c) {
    const url  = `${window.location.origin}/casos/${c.id}`;
    const name = c.is_anonymous ? 'Una familia' : c.family_name;
    const text = `${name} necesita apoyo urgente. Apadrínalos directamente en Venezuela Ayuda — sin intermediarios.`;
    if (navigator.share) {
        navigator.share({ title: `${name} — Venezuela Ayuda`, text, url }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url).then(() => alert('¡Enlace copiado!')).catch(() => {});
    }
}

// ─── Tarjeta ──────────────────────────────────────────────────────────────────

function CaseCard({ c, idx }) {
    const needs    = parseNeeds(c.needs);
    const days     = daysSince(c.created_at);
    const name     = c.is_anonymous ? 'Familia anónima' : (c.family_name ?? 'Familia');
    const isOpen   = c.status === 'open';

    return (
        <div
            onClick={() => router.visit(`/casos/${c.id}`)}
            style={{
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 4px 14px rgba(16,24,40,.07)',
                padding: '12px 13px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                opacity: isOpen ? 1 : 0.72,
            }}
        >
            {/* Avatar + nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {c.photo_path ? (
                    <img src={c.photo_path} alt="Foto" style={{
                        width: 36, height: 36, borderRadius: '50%',
                        objectFit: 'cover', flexShrink: 0,
                    }} />
                ) : (
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: PASTEL[idx % PASTEL.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3a4250' }}>
                        {initials(c.family_name, c.is_anonymous)}
                    </span>
                </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: 13, fontWeight: 700, color: '#1e293b',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                        <MapPin size={10} color="#94a3b8" strokeWidth={2} />
                        <span style={{
                            fontSize: 11, color: '#94a3b8',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {[c.zone, c.state].filter(Boolean).join(', ')}
                            {c.people_count ? ` · ${c.people_count}p` : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Necesidades (max 3) */}
            {needs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {needs.slice(0, 3).map(n => (
                        <span key={n} style={{
                            background: '#f1f4f9', color: '#334155',
                            fontSize: 10, fontWeight: 600,
                            padding: '2px 7px', borderRadius: 5,
                        }}>
                            {NEED_LABELS[n] ?? n}
                        </span>
                    ))}
                    {needs.length > 3 && (
                        <span style={{
                            background: '#f1f4f9', color: '#94a3b8',
                            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                        }}>
                            +{needs.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid #f1f4f9', paddingTop: 7, marginTop: 1,
            }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8' }}>
                    {days}d sin ayuda
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <button
                        onClick={e => { e.stopPropagation(); shareCase(c); }}
                        style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: '#f1f4f9', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Share2 size={11} color="#64748b" strokeWidth={2} />
                    </button>
                    {isOpen && (
                        <Link
                            href={`/casos/${c.id}`}
                            onClick={e => e.stopPropagation()}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 2,
                                fontSize: 11.5, fontWeight: 700,
                                color: '#4263ac', textDecoration: 'none',
                            }}
                        >
                            Apadrinar <ArrowRight size={12} color="#4263ac" strokeWidth={2.5} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Columna ──────────────────────────────────────────────────────────────────

function Column({ col, cases }) {
    return (
        <div style={{ minWidth: 258, maxWidth: 258, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {/* Cabecera */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 11px', background: col.bg, borderRadius: 11,
            }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: col.color, flex: 1 }}>
                    {col.label}
                </span>
                <span style={{
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    background: col.color,
                    minWidth: 20, height: 20, borderRadius: '50%', padding: '0 4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {cases.length}
                </span>
            </div>

            {/* Tarjetas */}
            {cases.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 14,
                    padding: '20px 13px', textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(16,24,40,.04)',
                }}>
                    <Heart size={20} color="#e2e8f0" strokeWidth={2} style={{ display: 'block', margin: '0 auto 5px' }} />
                    <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: 0, fontWeight: 500 }}>
                        Ningún caso
                    </p>
                </div>
            ) : (
                cases.map((c, i) => <CaseCard key={c.id} c={c} idx={i} />)
            )}
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CasosIndex({ by_status }) {
    const open    = by_status?.open    ?? [];
    const adopted = by_status?.adopted ?? [];
    const total   = open.length + adopted.length;

    return (
        <MainLayout>
            <div style={{ padding: '16px 0 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>
                {/* ── Encabezado ── */}
                <div style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    padding: '0 20px', marginBottom: 14,
                }}>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 20, fontWeight: 700,
                            letterSpacing: '-0.4px', color: '#1e293b',
                        }}>
                            Tablero de casos
                        </h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            {open.length} sin apadrinar · {total} en total
                        </p>
                    </div>
                    <Link
                        href="/casos/publicar"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            background: '#4263ac', color: '#fff',
                            fontSize: 12, fontWeight: 700,
                            padding: '8px 13px', borderRadius: 11,
                            textDecoration: 'none', flexShrink: 0,
                        }}
                    >
                        <Plus size={13} color="#fff" strokeWidth={2.5} />
                        Publicar
                    </Link>
                </div>

                {/* ── Kanban (scroll horizontal con snap) ── */}
                <div style={{
                    display: 'flex', gap: 10,
                    overflowX: 'auto',
                    padding: '2px 20px 6px',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                }}>
                    {COLUMNS.map(col => (
                        <div key={col.key} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                            <Column
                                col={col}
                                cases={col.key === 'open' ? open : adopted}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </MainLayout>
    );
}
