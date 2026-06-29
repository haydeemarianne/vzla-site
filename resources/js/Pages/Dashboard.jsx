import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Heart, Trash2, Wrench, Truck, FileText, ArrowRight } from 'lucide-react';

const PASTEL = ['#dfe6f4', '#e7dcf2', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

const MODULOS = [
    {
        href: '/casos',
        icon: Heart,
        bg: '#dfe6f4',
        iconColor: '#4263ac',
        title: 'Casos apadrinados',
        desc: 'Acompaña una familia hasta resolver su situación',
    },
    {
        href: '/limpieza',
        icon: Trash2,
        bg: '#d6e8e0',
        iconColor: '#16a34a',
        title: 'Limpieza comunitaria',
        desc: 'Súmate a jornadas de limpieza cerca de ti',
    },
    {
        href: '/ingenieros',
        icon: Wrench,
        bg: '#e7dcf2',
        iconColor: '#7c3aed',
        title: 'Ingenieros voluntarios',
        desc: 'Evaluación estructural gratuita de edificaciones',
    },
    {
        href: '/transporte',
        icon: Truck,
        bg: '#f3e2cf',
        iconColor: '#b45309',
        title: 'Transporte solidario',
        desc: 'Ofrece o solicita traslado de personas y recursos',
    },
    {
        href: '/materiales',
        icon: FileText,
        bg: '#fef9c3',
        iconColor: '#92600e',
        title: 'Materiales imprimibles',
        desc: 'Carteles, formularios y recursos para imprimir',
    },
];

export default function Dashboard({ stats, recent_cases }) {
    const casosActivos = stats?.cases_open ?? 0;
    const apadrinados  = stats?.cases_adopted ?? 0;
    const voluntarios  = stats?.volunteers ?? 0;

    const KPIS = [
        { value: casosActivos, label: 'casos activos',  color: '#4263ac' },
        { value: apadrinados,  label: 'apadrinados',    color: '#16a34a' },
        { value: voluntarios,  label: 'voluntarios',    color: '#0f172a' },
    ];

    return (
        <MainLayout>
            <div style={{ padding: '6px 22px 22px' }}>

                {/* Hero card */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '22px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 18px 40px -18px rgba(16,24,40,.22)',
                    marginTop: '18px',
                }}>
                    {/* Chip urgencia */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        background: '#fbeaea', color: '#b04b4b',
                        padding: '6px 12px', borderRadius: '999px',
                        fontSize: '11px', fontWeight: 600, letterSpacing: '.3px',
                    }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#CE6969',
                            animation: 'vaPulse 1.6s infinite',
                            display: 'inline-block',
                        }} />
                        RESPUESTA AL TERREMOTO M7.5
                    </div>

                    {/* Título */}
                    <div style={{
                        fontSize: '26px', fontWeight: 700,
                        lineHeight: 1.18, marginTop: '14px',
                        letterSpacing: '-.6px', color: '#2b3340',
                    }}>
                        Ayuda directa,<br />
                        <span style={{ color: '#83A2DB' }}>familia por familia.</span>
                    </div>

                    <div style={{
                        fontSize: '13.5px', color: '#7b8595',
                        marginTop: '10px', lineHeight: 1.5,
                    }}>
                        Sin intermediarios. Apadrina un caso real y recibe el contacto de la familia.
                    </div>

                    <Link href="/casos" style={{
                        display: 'block', marginTop: '18px',
                        width: '100%', border: 0,
                        background: '#0f172a', color: '#fff',
                        fontWeight: 600, fontSize: '15px',
                        padding: '15px', borderRadius: '14px',
                        fontFamily: 'inherit', cursor: 'pointer',
                        textAlign: 'center', textDecoration: 'none',
                        boxSizing: 'border-box',
                    }}>
                        Ver casos urgentes
                    </Link>
                </div>

                {/* KPIs */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    {KPIS.map(({ value, label, color }) => (
                        <div key={label} style={{
                            flex: 1, background: '#fff',
                            borderRadius: '16px', padding: '13px 12px',
                            textAlign: 'center',
                            boxShadow: '0 8px 22px rgba(16,24,40,.05)',
                        }}>
                            <div style={{
                                fontSize: '21px', fontWeight: 700,
                                letterSpacing: '-.5px', color,
                            }}>
                                {value}
                            </div>
                            <div style={{
                                fontSize: '11px', color: '#94a3b8',
                                fontWeight: 600, marginTop: '2px',
                            }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ¿Cómo quieres ayudar? */}
                <div style={{
                    marginTop: '22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-.3px' }}>
                        ¿Cómo quieres ayudar?
                    </span>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '11px', marginTop: '13px',
                }}>
                    {MODULOS.map(({ href, icon: Icon, bg, iconColor, title, desc }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                textDecoration: 'none',
                                textAlign: 'left',
                                background: '#fff',
                                borderRadius: '18px',
                                padding: '15px',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', gap: '9px',
                                boxShadow: '0 8px 22px rgba(16,24,40,.05)',
                                border: '1px solid transparent',
                                transition: 'border-color .15s, box-shadow .15s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#cdd6e6';
                                e.currentTarget.style.boxShadow = '0 8px 22px rgba(16,24,40,.07)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.boxShadow = '0 8px 22px rgba(16,24,40,.05)';
                            }}>
                            <span style={{
                                width: '38px', height: '38px', borderRadius: '11px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: bg, flexShrink: 0,
                            }}>
                                <Icon size={18} color={iconColor} strokeWidth={2} />
                            </span>
                            <span style={{
                                fontSize: '13.5px', fontWeight: 700,
                                lineHeight: 1.25, color: '#0f172a',
                            }}>
                                {title}
                            </span>
                            <span style={{
                                fontSize: '11.5px', color: '#94a3b8',
                                fontWeight: 500, lineHeight: 1.4,
                            }}>
                                {desc}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Espacio para tab bar */}
                <div style={{ height: '80px' }} />
            </div>
        </MainLayout>
    );
}
