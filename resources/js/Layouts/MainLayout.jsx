import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Home, Settings, Plus, Truck, ShieldCheck } from 'lucide-react';

const NAV = [
    { href: '/',           Icon: Home,         label: 'Inicio' },
    { href: '/casos',      Icon: Heart,        label: 'Casos' },
    { href: '/limpieza',   Icon: Trash2,       label: 'Limpieza' },
    { href: '/ingenieros', Icon: Wrench,       label: 'Ingenieros' },
    { href: '/transporte', Icon: Truck,        label: 'Transporte' },
    { href: '/validar',    Icon: ShieldCheck,  label: 'Validación' },
];

const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

export default function MainLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="va-app">

            {/* ── Sidebar (desktop) ── */}
            <aside className="va-sidebar">
                {/* Logo */}
                <Link href="/" className="va-sidebar-logo" title="Venezuela Site">
                    <Heart size={17} color="#fff" fill="#fff" />
                </Link>

                {/* Nav */}
                <nav className="va-sidebar-nav">
                    {NAV.map(({ href, Icon, label }) => {
                        const active = isActive(href, url);
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={label}
                                className={`va-sidebar-btn${active ? ' va-sidebar-btn--active' : ''}`}
                            >
                                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin al fondo */}
                <button
                    onClick={() => router.visit('/admin/login')}
                    className="va-sidebar-btn"
                    title="Panel de administración"
                >
                    <Settings size={19} strokeWidth={1.8} />
                </button>
            </aside>

            {/* ── Área principal ── */}
            <div className="va-main-area">

                {/* Header */}
                <header className="va-header">

                    {/* Logo — solo mobile */}
                    <Link
                        href="/"
                        className="va-mobile-only"
                        style={{
                            alignItems: 'center', gap: 8,
                            textDecoration: 'none', flexShrink: 0,
                        }}
                    >
                        <div style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: '#4263ac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Heart size={14} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px', color: '#0f172a' }}>
                            <span style={{ color: '#4263ac' }}>Venezuela</span> Site
                        </span>
                    </Link>

                    {/* Título sección — solo desktop */}
                    <span
                        className="va-desktop-only"
                        style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', letterSpacing: '-.2px' }}
                    >
                        <span style={{ color: '#4263ac' }}>Venezuela</span> Site
                    </span>

                    {/* Tabs desktop — muestra sección activa */}
                    <nav
                        className="va-desktop-only"
                        style={{ alignItems: 'center', gap: 2, marginLeft: 8 }}
                    >
                        {NAV.filter(n => n.href !== '/validar').map(({ href, label }) => {
                            const active = isActive(href, url);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: 13,
                                        fontWeight: active ? 700 : 500,
                                        padding: '5px 12px',
                                        borderRadius: 999,
                                        background: active ? '#0f172a' : 'transparent',
                                        color: active ? '#fff' : '#64748b',
                                        whiteSpace: 'nowrap',
                                        transition: 'background .13s, color .13s',
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div style={{ flex: 1 }} />

                    {/* Acciones */}
                    <Link href="/casos/publicar" className="va-icon-btn" title="Publicar caso">
                        <Plus size={15} color="#475569" strokeWidth={2.5} />
                    </Link>
                    <button
                        onClick={() => router.visit('/admin/login')}
                        className="va-icon-btn va-mobile-only"
                        title="Admin"
                        style={{ border: 'none' }}
                    >
                        <Settings size={15} color="#475569" />
                    </button>
                </header>

                {/* Contenido */}
                <main>
                    <div className="va-content">
                        {children}
                    </div>
                </main>
            </div>

            {/* ── Bottom nav (mobile) ── */}
            <nav className="va-bottomnav">
                {NAV.slice(0, 5).map(({ href, Icon, label }) => {
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
