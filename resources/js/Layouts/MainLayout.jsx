import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Home, Settings, Plus, Truck } from 'lucide-react';

const TOP_NAV = [
    { href: '/',           label: 'Inicio' },
    { href: '/casos',      label: 'Casos' },
    { href: '/limpieza',   label: 'Limpieza' },
    { href: '/ingenieros', label: 'Ingenieros' },
    { href: '/transporte', label: 'Transporte' },
    { href: '/validar',    label: 'Validación' },
];

const BOTTOM_NAV = [
    { href: '/',           label: 'Inicio',      Icon: Home },
    { href: '/casos',      label: 'Casos',       Icon: Heart },
    { href: '/limpieza',   label: 'Limpieza',    Icon: Trash2 },
    { href: '/ingenieros', label: 'Ingenieros',  Icon: Wrench },
    { href: '/transporte', label: 'Transporte',  Icon: Truck },
];

const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

export default function MainLayout({ children }) {
    const { url } = usePage();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg,#eef0f4 0%,#e3e6ee 100%)',
            fontFamily: "'Onest', system-ui, sans-serif",
            color: '#0f172a',
        }}>
            {/* ── Header ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 30,
                background: '#fff',
                borderBottom: '1px solid #eef0f3',
            }}>
                <div style={{
                    height: 56,
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    maxWidth: 1280,
                    margin: '0 auto',
                }}>
                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        textDecoration: 'none', flexShrink: 0,
                    }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: '#4263ac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Heart size={15} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px' }}>
                            <span style={{ color: '#4263ac' }}>Venezuela</span>{' '}
                            <span style={{ color: '#0f172a' }}>Site</span>
                        </span>
                    </Link>

                    {/* ── Nav desktop (píldoras) ── */}
                    <nav className="va-topnav">
                        {TOP_NAV.map(({ href, label }) => {
                            const active = isActive(href, url);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: 13,
                                        fontWeight: active ? 700 : 500,
                                        padding: '5px 13px',
                                        borderRadius: 999,
                                        background: active ? '#0f172a' : 'transparent',
                                        color: active ? '#fff' : '#64748b',
                                        whiteSpace: 'nowrap',
                                        transition: 'background .15s, color .15s',
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* ── Acciones ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {/* + Publicar */}
                        <Link
                            href="/casos/publicar"
                            title="Publicar caso"
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                border: '1.5px solid #e2e8f0',
                                background: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                textDecoration: 'none',
                                flexShrink: 0,
                            }}
                        >
                            <Plus size={15} color="#475569" strokeWidth={2.5} />
                        </Link>

                        {/* Validar / Admin */}
                        <button
                            onClick={() => router.visit('/admin/login')}
                            title="Panel de administración"
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                border: '1.5px solid #e2e8f0',
                                background: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Settings size={15} color="#475569" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Contenido ── */}
            <main className="va-main">
                <div className="va-content">
                    {children}
                </div>
            </main>

            {/* ── Bottom tabs (mobile) ── */}
            <nav className="va-bottomnav">
                {BOTTOM_NAV.map(({ href, label, Icon }) => {
                    const active = isActive(href, url);
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                flex: 1,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: 3,
                                padding: '6px 0',
                                color: active ? '#4263ac' : '#94a3b8',
                                textDecoration: 'none',
                            }}
                        >
                            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
