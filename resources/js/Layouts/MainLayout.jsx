import { Link, router, usePage } from '@inertiajs/react';
import {
    Heart, Sparkles, Wrench, Home, Truck,
    ArrowLeft, Share2, Plus, Users, ShieldCheck, Settings,
    Search, Bell,
} from 'lucide-react';

/* ─── Navegación ──────────────────────────────── */
const TOP_NAV = [
    { href: '/',           label: 'Inicio'     },
    { href: '/casos',      label: 'Casos'      },
    { href: '/limpieza',   label: 'Limpieza'   },
    { href: '/ingenieros', label: 'Ingenieros' },
    { href: '/transporte', label: 'Transporte' },
    { href: '/materiales', label: 'Recursos'   },
    { href: '/validar',    label: 'Validación' },
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
    { id: 'back',     Icon: ArrowLeft,   label: 'Volver atrás',        href: null,            onClick: () => window.history.back()              },
    { id: 'share',    Icon: Share2,      label: 'Compartir esta página',href: null,            onClick: sharePage                                },
    { id: 'nuevo',    Icon: Plus,        label: 'Publicar caso nuevo',  href: '/casos/publicar',onClick: null                                   },
    { id: 'casos',    Icon: Users,       label: 'Ver todos los casos',  href: '/casos',        onClick: null                                     },
    { id: 'limpieza', Icon: Sparkles,    label: 'Jornadas de limpieza', href: '/limpieza',     onClick: null                                     },
    { id: 'validar',  Icon: ShieldCheck, label: 'Panel de validación',  href: '/validar',      onClick: null                                     },
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
    if (navigator.share) {
        navigator.share({ url, title: 'Venezuela Ayuda' }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url)
            .then(() => alert('Enlace copiado'))
            .catch(() => {});
    }
}

/* ─── Sub-componentes ──────────────────────────── */
/* Botón del sidebar (círculo) */
function SideBtn({ href, onClick, title, children, dark = false }) {
    const cls = `va-sidebar-btn${dark ? ' va-sidebar-btn--dark' : ''}`;
    if (href) return <Link href={href} className={cls} title={title}>{children}</Link>;
    return <button onClick={onClick} className={cls} title={title}>{children}</button>;
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

/* ─── Layout principal ─────────────────────────── */
export default function MainLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="va-app">

            {/* ══ SIDEBAR — círculos flotantes, sin panel (desktop) ══ */}
            <aside className="va-sidebar">

                {/* Logo */}
                <Link href="/" className="va-sidebar-logo" title="Venezuela Site">
                    <Heart size={17} color="#fff" fill="#fff" />
                </Link>

                {/* Acciones */}
                <nav className="va-sidebar-nav">
                    {SIDEBAR_ACTIONS.map(({ id, Icon, label, href, onClick }) => (
                        <SideBtn key={id} href={href} onClick={onClick} title={label}>
                            <Icon size={18} color="#5b6677" strokeWidth={1.9} />
                        </SideBtn>
                    ))}
                </nav>

                {/* Admin — círculo negro al fondo */}
                <SideBtn dark onClick={() => router.visit('/admin/login')} title="Panel de administración">
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
                        }}>
                            <Heart size={15} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px', color: '#1a2230' }}>
                            Venezuela <span style={{ color: '#83A2DB' }}>Site</span>
                        </span>
                    </Link>

                    {/* Logo — desktop (igual que ValidarDashboard) */}
                    <div className="va-desktop-only" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10, background: '#83A2DB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Heart size={18} color="white" strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2230', letterSpacing: '-.3px' }}>
                            Venezuela <span style={{ color: '#83A2DB' }}>Site</span>
                        </span>
                    </div>

                    {/* Nav pills — desktop (mismo estilo que ValidarDashboard) */}
                    <nav className="va-desktop-only" style={{ alignItems: 'center', gap: 2, marginLeft: 8 }}>
                        {TOP_NAV.map(({ href, label }) => {
                            const active = isActive(href, url);
                            return (
                                <Link key={href} href={href} style={{
                                    textDecoration: 'none',
                                    fontSize: 12, fontWeight: 600,
                                    padding: '8px 14px', borderRadius: 999,
                                    border: 'none',
                                    background: active ? '#0f172a' : 'transparent',
                                    color: active ? '#fff' : '#5b6677',
                                    boxShadow: active ? '0 18px 34px -10px rgba(2,6,23,.45)' : 'none',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all .15s',
                                }}>
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div style={{ flex: 1 }} />

                    {/* Acciones del header — círculos iguales que sidebar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>

                        {/* Búsqueda */}
                        <HeaderCircle
                            title="Buscar"
                            onClick={() => {
                                const q = prompt('Buscar:');
                                if (q) router.visit(`/casos?search=${encodeURIComponent(q)}`);
                            }}
                        >
                            <Search size={17} color="#5b6677" strokeWidth={1.9} />
                        </HeaderCircle>

                        {/* Alertas — solo mobile */}
                        <div className="va-mobile-only">
                            <HeaderCircle href="/validar" title="Validación" notif>
                                <Bell size={17} color="#5b6677" strokeWidth={1.9} />
                            </HeaderCircle>
                        </div>

                        {/* Admin — solo mobile (desktop lo tiene el sidebar) */}
                        <div className="va-mobile-only">
                            <HeaderCircle onClick={() => router.visit('/admin/login')} title="Admin">
                                <Settings size={17} color="#5b6677" strokeWidth={1.9} />
                            </HeaderCircle>
                        </div>

                        {/* Avatar */}
                        <div
                            onClick={() => router.visit('/admin/login')}
                            title="Administración"
                            style={{
                                ...CIRCLE,
                                background: '#e7dcf2',
                                fontSize: 13, fontWeight: 700, color: '#3a4250',
                                userSelect: 'none',
                            }}
                        >
                            VA
                        </div>
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
