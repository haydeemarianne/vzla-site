import { Link, router, usePage } from '@inertiajs/react';
import {
    Heart, Trash2, Wrench, Home, Truck,
    ArrowLeft, Share2, Plus, ClipboardList, Calendar, Bell,
    Search, Settings,
} from 'lucide-react';

const TOP_NAV = [
    { href: '/',           label: 'Inicio' },
    { href: '/casos',      label: 'Casos' },
    { href: '/limpieza',   label: 'Limpieza' },
    { href: '/ingenieros', label: 'Ingenieros' },
    { href: '/transporte', label: 'Transporte' },
    { href: '/validar',    label: 'Validación' },
];

const BOTTOM_NAV = [
    { href: '/',           Icon: Home,    label: 'Inicio' },
    { href: '/casos',      Icon: Heart,   label: 'Casos' },
    { href: '/limpieza',   Icon: Trash2,  label: 'Limpieza' },
    { href: '/ingenieros', Icon: Wrench,  label: 'Ingenieros' },
    { href: '/transporte', Icon: Truck,   label: 'Transporte' },
];

const isActive = (href, url) =>
    href === '/' ? url === '/' : url.startsWith(href);

function sharePage() {
    const url  = window.location.href;
    const text = 'Venezuela Ayuda — respuesta al terremoto M7.5';
    if (navigator.share) {
        navigator.share({ url, title: text }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url)
            .then(() => alert('Enlace copiado'))
            .catch(() => {});
    }
}

/* Botón del sidebar — puede ser <Link> o <button> */
function SideBtn({ href, onClick, title, children }) {
    const cls = 'va-sidebar-btn';
    if (href) {
        return <Link href={href} className={cls} title={title}>{children}</Link>;
    }
    return <button onClick={onClick} className={cls} title={title}>{children}</button>;
}

export default function MainLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="va-app">

            {/* ══ SIDEBAR — acciones rápidas (desktop) ══ */}
            <aside className="va-sidebar">

                {/* Logo */}
                <Link href="/" className="va-sidebar-logo" title="Inicio — Venezuela Site">
                    <Heart size={17} color="#fff" fill="#fff" />
                </Link>

                {/* Acciones */}
                <nav className="va-sidebar-nav">
                    <SideBtn onClick={() => window.history.back()} title="Volver atrás">
                        <ArrowLeft size={19} strokeWidth={1.8} />
                    </SideBtn>

                    <SideBtn onClick={sharePage} title="Compartir esta página">
                        <Share2 size={19} strokeWidth={1.8} />
                    </SideBtn>

                    <SideBtn href="/casos/publicar" title="Publicar nuevo caso">
                        <Plus size={19} strokeWidth={1.8} />
                    </SideBtn>

                    <SideBtn href="/casos" title="Ver todos los casos">
                        <ClipboardList size={19} strokeWidth={1.8} />
                    </SideBtn>

                    <SideBtn href="/limpieza" title="Jornadas de limpieza">
                        <Calendar size={19} strokeWidth={1.8} />
                    </SideBtn>

                    <SideBtn href="/validar" title="Validación y alertas">
                        <Bell size={19} strokeWidth={1.8} />
                    </SideBtn>
                </nav>

                {/* Admin — al fondo */}
                <SideBtn onClick={() => router.visit('/admin/login')} title="Panel de administración">
                    <Settings size={19} strokeWidth={1.8} />
                </SideBtn>

            </aside>

            {/* ══ ÁREA PRINCIPAL ══ */}
            <div className="va-main-area">

                {/* ── Header ── */}
                <header className="va-header">

                    {/* Logo + nombre — mobile */}
                    <Link
                        href="/"
                        className="va-mobile-only"
                        style={{ alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}
                    >
                        <div style={{
                            width: 30, height: 30, borderRadius: 9, background: '#4263ac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Heart size={14} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px', color: '#0f172a' }}>
                            <span style={{ color: '#4263ac' }}>Venezuela</span> Site
                        </span>
                    </Link>

                    {/* Logo — desktop */}
                    <Link
                        href="/"
                        className="va-desktop-only"
                        style={{ alignItems: 'center', gap: 7, textDecoration: 'none', flexShrink: 0 }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px', color: '#0f172a' }}>
                            <span style={{ color: '#4263ac' }}>Venezuela</span> Site
                        </span>
                    </Link>

                    {/* Nav tabs — desktop */}
                    <nav
                        className="va-desktop-only"
                        style={{ alignItems: 'center', gap: 2, marginLeft: 10 }}
                    >
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

                    {/* Acciones del header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Búsqueda */}
                        <button
                            className="va-icon-btn"
                            title="Buscar"
                            style={{ border: 'none' }}
                            onClick={() => {
                                const q = prompt('Buscar en Venezuela Ayuda:');
                                if (q) router.visit(`/casos?search=${encodeURIComponent(q)}`);
                            }}
                        >
                            <Search size={15} color="#475569" />
                        </button>

                        {/* Admin — solo mobile (en desktop está en el sidebar) */}
                        <button
                            onClick={() => router.visit('/admin/login')}
                            className="va-icon-btn va-mobile-only"
                            title="Admin"
                            style={{ border: 'none' }}
                        >
                            <Settings size={15} color="#475569" />
                        </button>

                        {/* Avatar VA */}
                        <div
                            onClick={() => router.visit('/admin/login')}
                            title="Administración"
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: '#4263ac',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0,
                                fontSize: 11, fontWeight: 800, color: '#fff',
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
