import { Link, usePage } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Home, Settings } from 'lucide-react';

const BOTTOM_NAV = [
    { href: '/',           label: 'Inicio',      Icon: Home },
    { href: '/casos',      label: 'Casos',       Icon: Heart },
    { href: '/limpieza',   label: 'Limpieza',    Icon: Trash2 },
    { href: '/ingenieros', label: 'Ingenieros',  Icon: Wrench },
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
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 30,
                background: '#fff',
                borderBottom: '1px solid #eef0f3',
                padding: '0 20px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '9px',
                        background: '#4263ac',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Heart size={15} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-.3px' }}>
                        Venezuela Site
                    </span>
                </div>

                <button style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: '#fff', border: 0,
                    boxShadow: '0 4px 12px rgba(16,24,40,.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                }}>
                    <Settings size={17} color="#475569" />
                </button>
            </header>

            {/* Page content */}
            <main style={{ paddingBottom: '72px' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>

            {/* Bottom tab bar */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff',
                borderTop: '1px solid #eef0f3',
                display: 'flex',
                padding: '9px 8px 12px',
                zIndex: 40,
            }}>
                {BOTTOM_NAV.map(({ href, label, Icon }) => {
                    const active = isActive(href, url);
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                flex: 1, border: 0, background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '4px',
                                padding: '4px 0',
                                color: active ? '#4263ac' : '#94a3b8',
                                textDecoration: 'none',
                                fontFamily: 'inherit',
                            }}>
                            <Icon size={20} strokeWidth={active ? 2.2 : 1.9} />
                            <span style={{ fontSize: '10.5px', fontWeight: 700 }}>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
