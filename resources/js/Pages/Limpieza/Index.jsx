import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

const TYPE_BADGE = {
    debris:   { bg: '#fef3e2', color: '#b45309', label: 'Escombros' },
    domestic: { bg: '#f1f4f9', color: '#334155', label: 'Basura' },
    both:     { bg: '#eef2fa', color: '#4263ac', label: 'Drenaje' },
};

const PASTEL_AVATARS = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

function AvatarStack({ count }) {
    const shown = Math.min(count || 0, 4);
    const initials = ['JR', 'ML', 'CA', 'PS'];
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
                {Array.from({ length: shown }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: PASTEL_AVATARS[i % PASTEL_AVATARS.length],
                            border: '2px solid #fff',
                            marginLeft: i === 0 ? 0 : -8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 9,
                            fontWeight: 700,
                            color: '#475569',
                            zIndex: shown - i,
                            position: 'relative',
                        }}
                    >
                        {initials[i] || '?'}
                    </div>
                ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                {count || 0}/10 voluntarios
            </span>
        </div>
    );
}

function PointCard({ point }) {
    const badge = TYPE_BADGE[point.type] || TYPE_BADGE.domestic;
    const meta = 10;
    const progress = Math.min(100, ((point.helpers_count || 0) / meta) * 100);

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 18,
                padding: 15,
                boxShadow: '0 10px 26px rgba(16,24,40,.06)',
                fontFamily: "'Onest', system-ui, sans-serif",
            }}
        >
            {/* Fila top: lugar + badge tipo */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span
                    style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.2px',
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {point.zone_name}
                    {point.city ? `, ${point.city}` : ''}
                </span>
                <span
                    style={{
                        background: badge.bg,
                        color: badge.color,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 999,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    {badge.label}
                </span>
            </div>

            {/* Fecha/hora */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                <Clock size={12} color="#94a3b8" />
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                    {point.state || 'Venezuela'}
                </span>
            </div>

            {/* Descripción */}
            {point.notes && (
                <p
                    style={{
                        fontSize: 12.5,
                        color: '#475569',
                        lineHeight: 1.5,
                        marginTop: 9,
                    }}
                >
                    {point.notes}
                </p>
            )}

            {/* Avatares + conteo */}
            <div style={{ marginTop: 13 }}>
                <AvatarStack count={point.helpers_count} />
            </div>

            {/* Barra de progreso */}
            <div
                style={{
                    marginTop: 11,
                    height: 7,
                    borderRadius: 999,
                    background: '#eef0f3',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        borderRadius: 999,
                        background: '#4263ac',
                        width: `${progress}%`,
                        transition: 'width .4s ease',
                    }}
                />
            </div>

            {/* Botón Ver jornada */}
            <Link
                href={`/limpieza/${point.id}`}
                style={{
                    marginTop: 13,
                    width: '100%',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    padding: '12px 0',
                    borderRadius: 13,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Onest', system-ui, sans-serif",
                    letterSpacing: '-0.1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                }}
            >
                Ver jornada y apuntarme <ArrowRight size={14} color="#fff" strokeWidth={2.5} />
            </Link>
        </div>
    );
}

function MapDecorativo({ activeCount }) {
    return (
        <div
            style={{
                marginTop: 13,
                height: 138,
                borderRadius: 18,
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(135deg, #dbe4f3, #eef2f8)',
                border: '1px solid #e2e8f2',
            }}
        >
            {/* SVG decorativo */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 360 140"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0 }}
            >
                <path
                    d="M0 90 Q90 60 180 92 T360 80"
                    stroke="#c2cfe4"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M-10 40 Q120 70 200 30 T380 55"
                    stroke="#cdd9eb"
                    strokeWidth="1.5"
                    fill="none"
                />
            </svg>

            {/* Pin 1 */}
            <div
                style={{
                    position: 'absolute',
                    left: 64,
                    top: 48,
                    width: 14,
                    height: 14,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    background: '#4263ac',
                    boxShadow: '0 0 0 4px rgba(29,78,216,.18)',
                }}
            />
            {/* Pin 2 */}
            <div
                style={{
                    position: 'absolute',
                    left: 188,
                    top: 74,
                    width: 14,
                    height: 14,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    background: '#f59e0b',
                    boxShadow: '0 0 0 4px rgba(245,158,11,.2)',
                }}
            />
            {/* Pin 3 */}
            <div
                style={{
                    position: 'absolute',
                    left: 264,
                    top: 40,
                    width: 14,
                    height: 14,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    background: '#4263ac',
                    boxShadow: '0 0 0 4px rgba(29,78,216,.18)',
                }}
            />

            {/* Label activos */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: '#fff',
                    padding: '5px 10px',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(16,24,40,.08)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#475569',
                }}
            >
                {activeCount} puntos activos cerca
            </div>
        </div>
    );
}

export default function LimpiezaIndex({ points, filters, counts }) {
    const activeCount = (counts.pending || 0) + (counts.in_process || 0);

    return (
        <MainLayout>
            <div
                style={{
                    padding: '6px 20px 100px',
                    fontFamily: "'Onest', system-ui, sans-serif",
                }}
            >
                {/* Header */}
                <h1
                    style={{
                        fontSize: 21,
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.4px',
                        margin: 0,
                    }}
                >
                    Limpieza comunitaria
                </h1>
                <p
                    style={{
                        fontSize: 12.5,
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginTop: 1,
                        marginBottom: 0,
                    }}
                >
                    Súmate a una jornada cerca de ti
                </p>

                {/* Mapa decorativo */}
                <MapDecorativo activeCount={activeCount} />

                {/* Lista de tarjetas */}
                {points.data.length === 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: 56,
                            gap: 12,
                        }}
                    >
                        <MapPin size={40} color="#cbd5e1" />
                        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, margin: 0 }}>
                            No hay puntos reportados
                        </p>
                        <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0 }}>
                            Se el primero en reportar un punto de limpieza
                        </p>
                        <Link
                            href="/limpieza/reportar"
                            style={{
                                marginTop: 4,
                                background: '#0f172a',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: 14,
                                padding: '12px 24px',
                                borderRadius: 13,
                                textDecoration: 'none',
                                display: 'inline-block',
                            }}
                        >
                            Reportar el primero
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                        {points.data.map((point) => (
                            <PointCard key={point.id} point={point} />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {points.links && points.links.length > 3 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginTop: 24,
                        }}
                    >
                        {points.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 10,
                                        fontSize: 13,
                                        fontWeight: link.active ? 700 : 500,
                                        background: link.active ? '#4263ac' : '#fff',
                                        color: link.active ? '#fff' : '#475569',
                                        border: link.active ? 'none' : '1px solid #e2e6ee',
                                        textDecoration: 'none',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 10,
                                        fontSize: 13,
                                        color: '#cbd5e1',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
