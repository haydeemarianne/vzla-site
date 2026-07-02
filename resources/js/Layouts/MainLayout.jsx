import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Heart, Sparkles, Wrench, Home, Truck,
    ArrowLeft, Share2, Plus, Users, Settings, BarChart2,
    Search, RotateCw, MapPin,
} from 'lucide-react';

/* ─── Navegación ──────────────────────────────── */
const TOP_NAV = [
    { href: '/casos',         label: 'Casos'         },
    { href: '/limpieza',      label: 'Limpieza'      },
    { href: '/ingenieros',    label: 'Ingenieros'    },
    { href: '/transporte',    label: 'Transporte'    },
    { href: '/materiales',    label: 'Recursos'      },
];

const BOTTOM_NAV = [
    { href: '/',           Icon: Home,      label: 'Inicio'     },
    { href: '/casos',      Icon: Heart,     label: 'Casos'      },
    { href: '/limpieza',   Icon: Sparkles,  label: 'Limpieza'   },
    { href: '/ingenieros', Icon: Wrench,    label: 'Ingenieros' },
    { href: '/transporte', Icon: Truck,     label: 'Transporte' },
];

/* Sidebar: acciones rápidas — icono semántico por función */
const SIDEBAR_ACTIONS = [
    { id: 'back',     Icon: ArrowLeft,  label: 'Volver atrás',         href: null,              onClick: () => window.history.back() },
    { id: 'casos',    Icon: Users,      label: 'Ver todos los casos',  href: '/casos',          onClick: null                        },
    { id: 'nuevo',    Icon: Plus,       label: 'Publicar caso nuevo',  href: '/casos/publicar', onClick: null                        },
    { id: 'limpieza', Icon: Sparkles,   label: 'Jornadas de limpieza', href: '/limpieza',       onClick: null                        },
    { id: 'stats',    Icon: BarChart2,  label: 'Estadísticas',         href: '/estadisticas',   onClick: null                        },
    { id: 'share',    Icon: Share2,     label: 'Compartir esta página',href: null,              onClick: sharePage                   },
];

/* ─── Estilos reutilizables ────────────────────── */
/* Círculo flotante — mismo patrón que ValidarDashboard RailCircle */
const CIRCLE = {
    width: 42, height: 42, borderRadius: '50%',
    background: 'white',
    boxShadow: '0 3px 10px rgba(16,24,40,.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, position: 'relative',
    border: 'none', textDecoration: 'none',
};

/* ─── Helpers ──────────────────────────────────── */
const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

function sharePage() {
    const url = window.location.href;
    const text = 'Plataforma de ayuda humanitaria post-terremoto Venezuela 2026';
    if (navigator.share) {
        navigator.share({ url, title: 'Venezuela Site', text }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url)
            .then(() => alert('Enlace copiado al portapapeles'))
            .catch(() => alert(url));
    }
}

/* ─── Sub-componentes ──────────────────────────── */
/* Botón del sidebar (círculo) */
function SideBtn({ href, onClick, title, children, dark = false }) {
    const cls = `va-sidebar-btn${dark ? ' va-sidebar-btn--dark' : ''}`;
    if (href) return <Link href={href} className={cls} data-tip={title}>{children}</Link>;
    return <button onClick={onClick} className={cls} data-tip={title}>{children}</button>;
}

/* Círculo de acción en el header (igual estilo que sidebar) */
function HeaderCircle({ onClick, title, children, href, notif = false }) {
    const inner = (
        <div style={{ ...CIRCLE, color: '#5b6677', transition: 'box-shadow .15s' }} title={title} onClick={onClick}>
            {children}
            {notif && (
                <div style={{
                    position: 'absolute', top: 9, right: 9,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#CE6969', border: '1.5px solid white',
                }}/>
            )}
        </div>
    );
    if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>;
    return inner;
}

/* Tiempo relativo en español, ej. "hace 3 min" */
function relativeTime(ts) {
    if (!ts) return null;
    const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diff < 10) return 'justo ahora';
    if (diff < 60) return `hace ${diff} seg`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `hace ${min} min`;
    const h = Math.floor(min / 60);
    return `hace ${h} h`;
}

/* Botón "Actualizar" — recuerda y muestra la última vez que se refrescó */
function RefreshButton() {
    const [lastUpdated, setLastUpdated] = useState(() => {
        const stored = Number(localStorage.getItem('va_last_updated'));
        return stored || Date.now();
    });
    const [, forceTick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => forceTick(t => t + 1), 15000);
        return () => clearInterval(id);
    }, []);

    const refresh = () => {
        const now = Date.now();
        localStorage.setItem('va_last_updated', String(now));
        setLastUpdated(now);
        router.reload();
    };

    return (
        <HeaderCircle title={`Actualizar · Última vez: ${relativeTime(lastUpdated)}`} onClick={refresh}>
            <RotateCw size={16} color="#5b6677" strokeWidth={1.9} />
        </HeaderCircle>
    );
}

/* Buscador de casos — campo desplegable + resultados en vivo */
function CaseSearchBox() {
    const [open, setOpen] = useState(false);
    const [q, setQ]       = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open]);

    useEffect(() => {
        if (q.trim().length < 2) { setResults([]); return; }
        setLoading(true);
        const id = setTimeout(() => {
            fetch(`/casos/buscar?q=${encodeURIComponent(q)}`)
                .then(r => r.json())
                .then(setResults)
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(id);
    }, [q]);

    const goTo = (id) => {
        setOpen(false);
        setQ('');
        setResults([]);
        router.visit(`/casos/${id}`);
    };

    return (
        <div ref={boxRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {open && (
                <div style={{
                    position: 'absolute', right: 46, top: '50%', transform: 'translateY(-50%)',
                    width: 240, animation: 'va-search-expand .15s ease-out',
                }}>
                    <input
                        autoFocus
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Buscar caso por nombre o zona…"
                        style={{
                            width: '100%', boxSizing: 'border-box', padding: '9px 13px',
                            borderRadius: 999, border: '1.5px solid #e2e8f0', outline: 'none',
                            fontSize: 12.5, fontFamily: 'inherit', color: '#1e293b',
                            background: 'white', boxShadow: '0 4px 14px rgba(16,24,40,.08)',
                        }}
                    />
                    {q.trim().length >= 2 && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                            background: 'white', borderRadius: 14, border: '1px solid #e9ebf1',
                            boxShadow: '0 12px 30px rgba(16,24,40,.12)', overflow: 'hidden', zIndex: 50,
                        }}>
                            {loading ? (
                                <div style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>Buscando…</div>
                            ) : results.length === 0 ? (
                                <div style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>Sin resultados.</div>
                            ) : (
                                results.map(c => (
                                    <div key={c.id} onClick={() => goTo(c.id)} style={{
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        padding: '9px 14px', cursor: 'pointer', borderBottom: '1px solid #f7f8fb',
                                    }}>
                                        <MapPin size={11} color="#94a3b8" strokeWidth={2} style={{ flexShrink: 0 }} />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {c.is_anonymous ? 'Familia anónima' : (c.family_name || 'Familia')}
                                            </div>
                                            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                                                {[c.zone, c.city].filter(Boolean).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            <HeaderCircle title="Buscar casos" onClick={() => setOpen(v => !v)}>
                <Search size={17} color="#5b6677" strokeWidth={1.9} />
            </HeaderCircle>
        </div>
    );
}

/* ─── Layout principal ─────────────────────────── */
export default function MainLayout({ children }) {
    const { url, props } = usePage();
    const isAdmin = props.auth?.is_admin;

    return (
        <div className="va-app">

            {/* ══ SIDEBAR — círculos flotantes, sin panel (desktop) ══ */}
            <aside className="va-sidebar">

                {/* Logo */}
                <Link href="/" className="va-sidebar-logo" title="Venezuela Site">
                    <Heart size={17} color="#fff" fill="#fff" />
                </Link>

                {/* Acciones — "Atrás" se oculta en el home */}
                <nav className="va-sidebar-nav">
                    {SIDEBAR_ACTIONS.filter(({ id }) => id !== 'back' || url !== '/').map(({ id, Icon, label, href, onClick }) => (
                        <SideBtn key={id} href={href} onClick={onClick} title={label}>
                            <Icon size={18} color="#5b6677" strokeWidth={1.9} />
                        </SideBtn>
                    ))}
                </nav>

                {/* Usuarios — solo si está logueado */}
                {isAdmin && (
                    <SideBtn href="/validar/usuarios" title="Gestión de usuarios">
                        <Users size={18} color="#5b6677" strokeWidth={1.9} />
                    </SideBtn>
                )}

                {/* Admin — círculo negro al fondo */}
                <SideBtn dark onClick={() => router.visit(isAdmin ? '/validar' : '/admin/login')} title={isAdmin ? 'Panel de validación' : 'Panel de administración'}>
                    <Settings size={18} color="white" strokeWidth={1.9} />
                </SideBtn>

            </aside>

            {/* ══ ÁREA PRINCIPAL ══ */}
            <div className="va-main-area">

                {/* ── Header ── */}
                <header className="va-header">

                    {/* Logo — mobile */}
                    <Link
                        href="/"
                        className="va-mobile-only"
                        style={{ alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}
                    >
                        <div style={{
                            width: 32, height: 32, borderRadius: 10, background: '#4263ac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(66,99,172,.30)',
                        }}>
                            <Heart size={15} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px', color: '#1a2230' }}>
                            Venezuela <span style={{ color: '#83A2DB' }}>Site</span>
                        </span>
                    </Link>

                    {/* Logo — desktop */}
                    <div className="va-desktop-only" style={{ alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2230', letterSpacing: '-.3px' }}>
                            Venezuela <span style={{ color: '#83A2DB' }}>Site</span>
                        </span>
                    </div>

                    {/* Nav pills — desktop, centrado */}
                    <nav className="va-desktop-only" style={{ alignItems: 'center', gap: 2, marginLeft: 12, flex: 1, justifyContent: 'center' }}>
                        {TOP_NAV.map(({ href, label }) => {
                            const active = isActive(href, url);
                            return (
                                <Link key={href} href={href} style={{
                                    textDecoration: 'none', fontSize: 12, fontWeight: 600,
                                    padding: '7px 13px', borderRadius: 999, border: 'none',
                                    background: active ? '#0f172a' : 'transparent',
                                    color: active ? '#fff' : '#5b6677',
                                    boxShadow: active ? '0 6px 18px rgba(2,6,23,.28)' : 'none',
                                    whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all .15s',
                                }}>
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Acciones del header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>

                        {/* Actualizar */}
                        <RefreshButton />

                        {/* Búsqueda */}
                        <CaseSearchBox />

                        {/* Compartir — solo mobile */}
                        <span className="va-mobile-only" style={{ display: 'flex' }}>
                            <HeaderCircle title="Compartir esta página" onClick={sharePage}>
                                <Share2 size={17} color="#5b6677" strokeWidth={1.9} />
                            </HeaderCircle>
                        </span>

                    </div>

                </header>

                {/* ── Contenido ── */}
                <main>
                    <div className="va-content">
                        {children}
                    </div>
                </main>

            </div>

            {/* ══ BOTTOM NAV (mobile) ══ */}
            <nav className="va-bottomnav">
                {BOTTOM_NAV.map(({ href, Icon, label }) => {
                    const active = isActive(href, url);
                    return (
                        <Link key={href} href={href} style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 3, padding: '6px 0',
                            color: active ? '#4263ac' : '#94a3b8', textDecoration: 'none',
                        }}>
                            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
                        </Link>
                    );
                })}
            </nav>

        </div>
    );
}
