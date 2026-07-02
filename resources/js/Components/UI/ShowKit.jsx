/**
 * Componentes compartidos para páginas de detalle (Show).
 * Extraídos del patrón de Casos/Show — usar en TODAS las páginas de detalle
 * para que ninguna se vea "diseñada distinto".
 */

export const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

export function initials(name = '') {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

/** Tarjeta blanca estándar — usar para cada sección de una página de detalle */
export function Card({ children, style, ...props }) {
    return (
        <div
            style={{
                background: 'white', border: '1px solid #e9ebf1', borderRadius: 20,
                padding: '20px', display: 'flex', flexDirection: 'column', gap: 14,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

/** Título de sección — mayúsculas, gris, uppercase */
export function SectionLabel({ children, style }) {
    return (
        <p style={{
            margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px',
            textTransform: 'uppercase', color: '#7b8595', ...style,
        }}>
            {children}
        </p>
    );
}

/** Separador horizontal fino */
export function Divider({ style }) {
    return <div style={{ height: 1, background: '#f3f4f8', ...style }} />;
}

/** Avatar circular con iniciales — color pastel determinístico por índice o nombre */
export function Avatar({ name, idx = 0, size = 42, fontSize = 14 }) {
    const bg = PASTEL[(typeof idx === 'number' ? idx : (name || '?').charCodeAt(0)) % PASTEL.length];
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <span style={{ fontSize, fontWeight: 700, color: '#3a4250' }}>{initials(name)}</span>
        </div>
    );
}

/** Pill/badge de color — para estados, categorías, urgencia, etc. */
export function Badge({ label, bg = '#eef1fa', color = '#4263ac', size = 'md' }) {
    const sizes = {
        sm: { fontSize: 10, padding: '2px 9px' },
        md: { fontSize: 11, padding: '4px 10px' },
    };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: bg, color, fontWeight: 700, borderRadius: 999,
            ...sizes[size],
        }}>
            {label}
        </span>
    );
}

/** Encabezado estándar de página Show: back-link + ícono + título + subtítulo + acción a la derecha */
export function ShowHeader({ backHref, backLabel, icon, iconBg = '#f8fafc', title, subtitle, badge, action }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {backHref && (
                <a href={backHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none', width: 'fit-content' }}>
                    ← {backLabel}
                </a>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {icon && (
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, border: '1px solid #e9ebf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a2230', letterSpacing: '-.4px', lineHeight: 1.2 }}>{title}</h1>
                        {(subtitle || badge) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5, flexWrap: 'wrap' }}>
                                {badge}
                                {subtitle && <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{subtitle}</span>}
                            </div>
                        )}
                    </div>
                </div>
                {action}
            </div>
        </div>
    );
}
