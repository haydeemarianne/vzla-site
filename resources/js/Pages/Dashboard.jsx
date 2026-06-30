import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Truck, FileText, ArrowRight, Plus, MapPin, Users } from 'lucide-react';

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

function initials(name, anon) {
    if (anon) return 'FA';
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

const NEED_LABELS = {
    food: 'Alimentación', water: 'Agua', medicine: 'Medicamentos',
    shelter: 'Refugio', clothing: 'Ropa', baby: 'Bebé',
    documents: 'Documentos', tools: 'Herramientas', other: 'Otro',
};

const ACCIONES = [
    { href: '/casos',          icon: Heart,    bg: '#eef1fa', color: '#4263ac', label: 'Apadrinar' },
    { href: '/casos/publicar', icon: Plus,     bg: '#fef3e2', color: '#b45309', label: 'Publicar caso' },
    { href: '/ingenieros',     icon: Wrench,   bg: '#f3eeff', color: '#7c3aed', label: 'Ingenieros' },
    { href: '/limpieza',       icon: Trash2,   bg: '#e8f5e9', color: '#16a34a', label: 'Limpieza' },
    { href: '/transporte',     icon: Truck,    bg: '#fef3e2', color: '#b45309', label: 'Transporte' },
    { href: '/materiales',     icon: FileText, bg: '#fef9c3', color: '#92600e', label: 'Materiales' },
];

export default function Dashboard({ stats, recent_cases, recent_cleaning }) {
    const s = stats ?? {};
    const cases    = recent_cases    ?? [];
    const cleaning = recent_cleaning ?? [];

    const KPIS = [
        { value: s.cases_open      ?? 0, label: 'Sin apadrinar', color: '#4263ac', bg: '#eef1fa' },
        { value: s.cases_adopted   ?? 0, label: 'Apadrinados',   color: '#16a34a', bg: '#e8f5e9' },
        { value: s.engineers       ?? 0, label: 'Ingenieros',    color: '#7c3aed', bg: '#f3eeff' },
        { value: s.cleaning_points ?? 0, label: 'Limpieza',      color: '#b45309', bg: '#fef3e2' },
    ];

    return (
        <MainLayout>
            <div style={{ padding: '18px 16px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>

                {/* ── Chip + titular ── */}
                <div className="va-dashboard-full" style={{ marginBottom: 18 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#fbeaea', color: '#b04b4b',
                        padding: '5px 12px', borderRadius: 999,
                        fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px',
                        marginBottom: 12,
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#CE6969',
                            display: 'inline-block', animation: 'vaPulse 1.6s infinite',
                        }} />
                        RESPUESTA AL TERREMOTO M7.5
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div>
                            <h1 style={{
                                margin: 0, fontSize: 24, fontWeight: 800,
                                letterSpacing: '-.6px', color: '#1e293b', lineHeight: 1.15,
                            }}>
                                Ayuda directa,<br />
                                <span style={{ color: '#83A2DB' }}>familia por familia.</span>
                            </h1>
                            <p style={{ margin: '7px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                                Sin intermediarios. Contacto directo.
                            </p>
                        </div>
                        <Link
                            href="/casos/publicar"
                            style={{
                                flexShrink: 0,
                                display: 'flex', alignItems: 'center', gap: 5,
                                background: '#4263ac', color: '#fff',
                                padding: '10px 14px', borderRadius: 12,
                                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                            }}
                        >
                            <Plus size={14} color="#fff" strokeWidth={2.5} />
                            Caso
                        </Link>
                    </div>
                </div>

                {/* ── KPIs — 2x2 mobile, 4x1 desktop ── */}
                <div className="va-kpi-grid va-dashboard-full">
                    {KPIS.map(({ value, label, color, bg }) => (
                        <div key={label} style={{
                            background: '#fff', borderRadius: 16, padding: '14px 12px',
                            textAlign: 'center', boxShadow: '0 4px 14px rgba(16,24,40,.06)',
                        }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-.5px', lineHeight: 1 }}>
                                {value}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="va-dashboard-body">

                    {/* ── Casos urgentes ── */}
                    {cases.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 11,
                            }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', letterSpacing: '-.2px' }}>
                                    Casos urgentes
                                </span>
                                <Link href="/casos" style={{
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    fontSize: 12, fontWeight: 700, color: '#4263ac', textDecoration: 'none',
                                }}>
                                    Ver todos <ArrowRight size={13} color="#4263ac" strokeWidth={2.5} />
                                </Link>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {cases.slice(0, 4).map((c, i) => {
                                    const needs = parseNeeds(c.needs).slice(0, 2);
                                    const name  = c.is_anonymous ? 'Familia anónima' : (c.family_name ?? 'Familia');
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => router.visit(`/casos/${c.id}`)}
                                            style={{
                                                background: '#fff', borderRadius: 14,
                                                boxShadow: '0 4px 14px rgba(16,24,40,.06)',
                                                padding: '12px 13px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 10,
                                            }}
                                        >
                                            {c.photo_path ? (
                                                <img src={c.photo_path} alt="Foto" style={{
                                                    width: 38, height: 38, borderRadius: '50%',
                                                    objectFit: 'cover', flexShrink: 0,
                                                }} />
                                            ) : (
                                                <div style={{
                                                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                                                    background: PASTEL[i % PASTEL.length],
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                                    <MapPin size={10} color="#94a3b8" strokeWidth={2} />
                                                    <span style={{
                                                        fontSize: 11, color: '#94a3b8',
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {[c.zone, c.state].filter(Boolean).join(', ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                                                {needs.map(n => (
                                                    <span key={n} style={{
                                                        background: '#f1f4f9', color: '#334155',
                                                        fontSize: 10, fontWeight: 600,
                                                        padding: '2px 7px', borderRadius: 5,
                                                    }}>
                                                        {NEED_LABELS[n] ?? n}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Jornadas de limpieza ── */}
                    {cleaning.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11,
                            }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', letterSpacing: '-.2px' }}>
                                    Jornadas activas
                                </span>
                                <Link href="/limpieza" style={{
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    fontSize: 12, fontWeight: 700, color: '#16a34a', textDecoration: 'none',
                                }}>
                                    Ver todas <ArrowRight size={13} color="#16a34a" strokeWidth={2.5} />
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {cleaning.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => router.visit(`/limpieza/${p.id}`)}
                                        style={{
                                            background: '#fff', borderRadius: 13, padding: '11px 13px',
                                            boxShadow: '0 4px 12px rgba(16,24,40,.05)',
                                            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 9, background: '#e8f5e9', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Trash2 size={16} color="#16a34a" strokeWidth={2} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: 13, fontWeight: 700, color: '#1e293b',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>
                                                {p.zone_name}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Users size={10} color="#94a3b8" strokeWidth={2} />
                                                {p.helpers_count ?? 0} voluntarios · {p.state}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 10.5, fontWeight: 700, color: '#16a34a',
                                            background: '#e8f5e9', padding: '3px 9px', borderRadius: 999, flexShrink: 0,
                                        }}>
                                            Activa
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* ── ¿Cómo quieres ayudar? ── */}
                <div>
                    <span style={{
                        fontSize: 15, fontWeight: 700, color: '#1e293b',
                        letterSpacing: '-.2px', display: 'block', marginBottom: 11,
                    }}>
                        ¿Cómo quieres ayudar?
                    </span>
                    <div className="va-action-grid">
                        {ACCIONES.map(({ href, icon: Icon, bg, color, label }) => (
                            <Link
                                key={href} href={href}
                                style={{
                                    textDecoration: 'none',
                                    background: '#fff', borderRadius: 14,
                                    boxShadow: '0 4px 14px rgba(16,24,40,.05)',
                                    padding: '14px 8px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 7, textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    width: 38, height: 38, borderRadius: 11,
                                    background: bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={18} color={color} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1e293b', lineHeight: 1.25 }}>
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
