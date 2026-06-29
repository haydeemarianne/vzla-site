import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Truck, FileText, ArrowRight, Plus, MapPin } from 'lucide-react';

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
    { href: '/casos',        icon: Heart,    bg: '#eef1fa', color: '#4263ac', label: 'Apadrinar' },
    { href: '/casos/publicar', icon: Plus,   bg: '#fef3e2', color: '#b45309', label: 'Publicar caso' },
    { href: '/ingenieros',   icon: Wrench,   bg: '#f3eeff', color: '#7c3aed', label: 'Ingenieros' },
    { href: '/limpieza',     icon: Trash2,   bg: '#e8f5e9', color: '#16a34a', label: 'Limpieza' },
    { href: '/transporte',   icon: Truck,    bg: '#fef3e2', color: '#b45309', label: 'Transporte' },
    { href: '/materiales',   icon: FileText, bg: '#fef9c3', color: '#92600e', label: 'Materiales' },
];

export default function Dashboard({ stats, recent_cases, recent_cleaning }) {
    const s = stats ?? {};
    const cases  = recent_cases  ?? [];
    const cleaning = recent_cleaning ?? [];

    const KPIS = [
        { value: s.cases_open    ?? 0, label: 'Sin apadrinar', color: '#4263ac', bg: '#eef1fa' },
        { value: s.cases_adopted ?? 0, label: 'Apadrinados',   color: '#16a34a', bg: '#e8f5e9' },
        { value: s.engineers     ?? 0, label: 'Ingenieros',    color: '#7c3aed', bg: '#f3eeff' },
        { value: s.cleaning_points ?? 0, label: 'Limpieza',    color: '#b45309', bg: '#fef3e2' },
    ];

    return (
        <MainLayout>
            <div style={{ padding: '18px 20px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>

                {/* ── Chip + título ── */}
                <div style={{ marginBottom: 18 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#fbeaea', color: '#b04b4b',
                        padding: '5px 11px', borderRadius: 999,
                        fontSize: 10.5, fontWeight: 700, letterSpacing: '.4px',
                        marginBottom: 12,
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#CE6969',
                            display: 'inline-block', animation: 'vaPulse 1.6s infinite',
                        }} />
                        RESPUESTA AL TERREMOTO M7.5
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                            <h1 style={{
                                margin: 0, fontSize: 22, fontWeight: 800,
                                letterSpacing: '-.5px', color: '#1e293b', lineHeight: 1.15,
                            }}>
                                Ayuda directa,<br />
                                <span style={{ color: '#83A2DB' }}>familia por familia.</span>
                            </h1>
                            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>
                                Sin intermediarios. Contacto directo con la familia.
                            </p>
                        </div>
                        <Link
                            href="/casos/publicar"
                            style={{
                                flexShrink: 0,
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: '#4263ac', color: '#fff',
                                padding: '9px 13px', borderRadius: 11,
                                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                            }}
                        >
                            <Plus size={13} color="#fff" strokeWidth={2.5} />
                            Caso
                        </Link>
                    </div>
                </div>

                {/* ── KPIs ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {KPIS.map(({ value, label, color, bg }) => (
                        <div key={label} style={{
                            background: '#fff', borderRadius: 14, padding: '12px 10px',
                            textAlign: 'center', boxShadow: '0 4px 14px rgba(16,24,40,.05)',
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-.5px' }}>
                                {value}
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 2, lineHeight: 1.2 }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Casos recientes ── */}
                {cases.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: 12,
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
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
                                            display: 'flex', alignItems: 'center', gap: 11,
                                        }}
                                    >
                                        <div style={{
                                            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                                            background: PASTEL[i % PASTEL.length],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#3a4250' }}>
                                                {initials(c.family_name, c.is_anonymous)}
                                            </span>
                                        </div>

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

                {/* ── Acciones ── */}
                <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', letterSpacing: '-.2px', display: 'block', marginBottom: 12 }}>
                        ¿Cómo quieres ayudar?
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
                        {ACCIONES.map(({ href, icon: Icon, bg, color, label }) => (
                            <Link
                                key={href} href={href}
                                style={{
                                    textDecoration: 'none',
                                    background: '#fff', borderRadius: 14,
                                    boxShadow: '0 4px 14px rgba(16,24,40,.05)',
                                    padding: '14px 10px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 8, textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={17} color={color} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Limpieza reciente ── */}
                {cleaning.length > 0 && (
                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
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
                                <div key={p.id} style={{
                                    background: '#fff', borderRadius: 12, padding: '11px 13px',
                                    boxShadow: '0 4px 12px rgba(16,24,40,.05)',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: 9, background: '#e8f5e9', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Trash2 size={16} color="#16a34a" strokeWidth={2} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.zone_name}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                                            {p.state} · {p.helpers_count ?? 0} voluntarios
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: '#16a34a',
                                        background: '#e8f5e9', padding: '3px 9px', borderRadius: 999,
                                    }}>
                                        Activa
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
