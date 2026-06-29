import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Search, ArrowRight, Heart, MapPin } from 'lucide-react';

// ── Constantes de diseño ────────────────────────────────────────────────────

const NEED_LABELS = {
    food:       'Alimentación',
    water:      'Agua',
    medicine:   'Medicamentos',
    clothing:   'Ropa',
    furniture:  'Mobiliario',
    baby:       'Bebé',
    tools:      'Herramientas',
    documents:  'Documentos',
    shelter:    'Refugio',
    other:      'Otro',
};

const FILTER_CHIPS = [
    { value: '',         label: 'Todos' },
    { value: 'critical', label: 'Críticos' },
    { value: 'children', label: 'Con niños' },
    { value: 'elderly',  label: 'Con adultos mayores' },
];

const AVATAR_PASTELS = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(familyName, isAnonymous) {
    if (isAnonymous) return 'FA';
    if (!familyName) return '?';
    return familyName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

function getDaysSince(createdAt, fallbackIndex) {
    if (createdAt) {
        return Math.max(1, Math.floor((Date.now() - new Date(createdAt)) / 86400000));
    }
    return fallbackIndex * 3 + 1;
}

function parseNeeds(rawNeeds) {
    if (Array.isArray(rawNeeds)) return rawNeeds;
    if (typeof rawNeeds === 'string' && rawNeeds.trim()) {
        try { return JSON.parse(rawNeeds); } catch { return []; }
    }
    return [];
}

// ── Badge de urgencia ────────────────────────────────────────────────────────

function UrgencyBadge({ status, hasChildren }) {
    if (status === 'adopted') {
        return (
            <span style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                flexShrink: 0,
            }}>
                Apadrinado
            </span>
        );
    }
    if (status === 'open') {
        return (
            <span style={{
                background: '#fef3e2',
                color: '#b45309',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                flexShrink: 0,
            }}>
                Crítica
            </span>
        );
    }
    if (hasChildren) {
        return (
            <span style={{
                background: '#fef9c3',
                color: '#92600e',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                flexShrink: 0,
            }}>
                Alta
            </span>
        );
    }
    return (
        <span style={{
            background: '#eef2f6',
            color: '#475569',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            flexShrink: 0,
        }}>
            Media
        </span>
    );
}

// ── Tarjeta de caso ──────────────────────────────────────────────────────────

function CaseCard({ supportCase, index }) {
    const needs      = parseNeeds(supportCase.needs);
    const initials   = getInitials(supportCase.family_name, supportCase.is_anonymous);
    const avatarBg   = AVATAR_PASTELS[index % AVATAR_PASTELS.length];
    const days       = getDaysSince(supportCase.created_at, index);
    const displayName = supportCase.is_anonymous ? 'Familia anónima' : (supportCase.family_name ?? 'Familia');

    return (
        <div
            onClick={() => router.visit(`/casos/${supportCase.id}`)}
            style={{
                background: '#ffffff',
                borderRadius: 20,
                boxShadow: '0 10px 26px rgba(16,24,40,.06)',
                padding: 15,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                opacity: 0,
                animation: `fadeUp 0.4s ease-out ${index * 0.07}s forwards`,
            }}
        >
            {/* Fila top: avatar + nombre + zona */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {/* Avatar */}
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#3a4250' }}>
                        {initials}
                    </span>
                </div>

                {/* Nombre + badge + zona */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: 14.5,
                            fontWeight: 700,
                            color: '#1e293b',
                            lineHeight: 1.2,
                            wordBreak: 'break-word',
                        }}>
                            {displayName}
                        </span>
                        <UrgencyBadge status={supportCase.status} hasChildren={supportCase.has_children} />
                    </div>

                    {/* Zona · personas */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 4,
                    }}>
                        <MapPin size={12} color="#94a3b8" strokeWidth={2} />
                        <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1 }}>
                            {[supportCase.zone, supportCase.state].filter(Boolean).join(', ')}
                            {supportCase.people_count ? ` · ${supportCase.people_count} personas` : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chips de necesidades */}
            {needs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {needs.map((need) => (
                        <span key={need} style={{
                            background: '#f1f4f9',
                            color: '#334155',
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 8,
                        }}>
                            {NEED_LABELS[need] ?? need}
                        </span>
                    ))}
                </div>
            )}

            {/* Chips especiales niños / adultos mayores */}
            {(supportCase.has_children || supportCase.has_elderly) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {supportCase.has_children && (
                        <span style={{
                            background: '#fef9c3',
                            color: '#92600e',
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 8,
                        }}>
                            Con niños
                        </span>
                    )}
                    {supportCase.has_elderly && (
                        <span style={{
                            background: '#fef3e2',
                            color: '#b45309',
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 8,
                        }}>
                            Con adultos mayores
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #f1f4f9',
                paddingTop: 10,
                marginTop: 2,
            }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#94a3b8' }}>
                    {days} {days === 1 ? 'día' : 'días'} sin ayuda
                </span>
                <Link
                    href={`/casos/${supportCase.id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#4263ac',
                        textDecoration: 'none',
                    }}
                >
                    Apadrinar
                    <ArrowRight size={15} color="#4263ac" strokeWidth={2.5} />
                </Link>
            </div>
        </div>
    );
}

// ── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyState({ activeFilter }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: 12,
            textAlign: 'center',
        }}>
            <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#eef2fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
            }}>
                <Heart size={28} color="#4263ac" strokeWidth={2} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                No hay casos
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
                {activeFilter
                    ? 'No hay casos con ese filtro en este momento.'
                    : 'Aún no hay casos publicados.'}
            </p>
            <Link
                href="/casos/publicar"
                style={{
                    marginTop: 8,
                    background: '#4263ac',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '10px 22px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    display: 'inline-block',
                }}
            >
                Publicar el primer caso
            </Link>
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function CasosIndex({ cases, filters, counts }) {
    const activeFilter = filters?.need ?? '';

    const handleFilter = (value) => {
        router.get('/casos', value ? { need: value } : {}, { preserveScroll: false });
    };

    return (
        <MainLayout>
            <div style={{
                padding: '6px 20px 100px',
                fontFamily: "'Onest', system-ui, sans-serif",
            }}>
                {/* ── Header ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 18,
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: 21,
                            fontWeight: 700,
                            letterSpacing: '-0.4px',
                            color: '#1e293b',
                            lineHeight: 1.2,
                        }}>
                            Casos apadrinados
                        </h1>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: '#94a3b8',
                            lineHeight: 1.3,
                        }}>
                            {counts?.open ?? 0} familias esperan apoyo 1:1
                        </p>
                    </div>

                    {/* Botón buscar */}
                    <button
                        aria-label="Buscar casos"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#ffffff',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(16,24,40,.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <Search size={18} color="#475569" strokeWidth={2} />
                    </button>
                </div>

                {/* ── Filtros (scroll horizontal) ── */}
                <div style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 4,
                    marginBottom: 18,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}>
                    {FILTER_CHIPS.map(({ value, label }) => {
                        const isActive = activeFilter === value;
                        return (
                            <button
                                key={value}
                                onClick={() => handleFilter(value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 999,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    border: isActive ? 'none' : '1px solid #e2e6ee',
                                    background: isActive ? '#4263ac' : '#ffffff',
                                    color: isActive ? '#ffffff' : '#334155',
                                    transition: 'background 0.15s, color 0.15s',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Listado / vacío ── */}
                {cases.data.length === 0 ? (
                    <EmptyState activeFilter={activeFilter} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {cases.data.map((supportCase, i) => (
                            <CaseCard key={supportCase.id} supportCase={supportCase} index={i} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Animación fadeUp ── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                /* Ocultar scrollbar en filtros (webkit) */
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </MainLayout>
    );
}
