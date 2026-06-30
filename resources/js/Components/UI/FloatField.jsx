/**
 * Componentes de formulario con label flotante (Material Design-inspired).
 * Usar en TODAS las páginas para mantener consistencia visual.
 *
 * Exports:
 *   FloatInput   — input texto, email, tel, number, url, password
 *   FloatTextarea — textarea
 *   FloatSelect  — select con flecha personalizada
 */

import { useState } from 'react';

const BLUE   = '#4263ac';
const BORDER = '#e2e8f0';
const RED    = '#CE6969';

const LABEL_BASE = {
    position: 'absolute',
    background: '#fff',
    pointerEvents: 'none',
    transition: 'all .18s cubic-bezier(.4,0,.2,1)',
    zIndex: 2,
    lineHeight: 1,
};

function labelStyle(floated, focused, error, leftOffset = 14) {
    return {
        ...LABEL_BASE,
        left: floated ? leftOffset - 2 : leftOffset,
        top: floated ? -8 : '50%',
        transform: floated ? 'none' : 'translateY(-50%)',
        padding: floated ? '0 4px' : '0',
        fontSize: floated ? 11 : 14,
        fontWeight: floated ? 700 : 400,
        letterSpacing: floated ? '.4px' : 0,
        color: focused ? BLUE : floated ? '#64748b' : '#94a3b8',
    };
}

function inputStyle(focused, error, paddingLeft = 14) {
    return {
        width: '100%', boxSizing: 'border-box',
        border: `1.5px solid ${focused ? BLUE : error ? RED : BORDER}`,
        borderRadius: 13,
        padding: `13px 14px 13px ${paddingLeft}px`,
        fontFamily: "'Onest', system-ui, sans-serif",
        fontSize: 14, color: '#1e293b', background: '#fff',
        outline: 'none',
        boxShadow: focused
            ? `0 0 0 3px rgba(66,99,172,.09)`
            : error
            ? `0 0 0 3px rgba(206,105,105,.09)`
            : 'none',
        transition: 'border-color .18s, box-shadow .18s',
        appearance: 'none',
        WebkitAppearance: 'none',
    };
}

function ErrorMsg({ msg }) {
    if (!msg) return null;
    return <p style={{ margin: '4px 0 0', fontSize: 11.5, color: RED, fontWeight: 500 }}>{msg}</p>;
}

/** Input con label flotante + ícono opcional a la izquierda */
export function FloatInput({ label, value, type = 'text', error, icon: Icon, ...props }) {
    const [focused, setFocused] = useState(false);
    const floated = focused || (value !== '' && value !== undefined && value !== null);
    const pl = Icon ? 40 : 14;

    return (
        <div style={{ position: 'relative' }}>
            {Icon && (
                <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', zIndex: 3, display: 'flex',
                }}>
                    <Icon size={15} color={focused ? BLUE : '#94a3b8'} style={{ transition: 'color .18s' }} />
                </span>
            )}
            <label style={labelStyle(floated, focused, error, Icon ? 40 : 14)}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={inputStyle(focused, error, pl)}
                {...props}
            />
            <ErrorMsg msg={error} />
        </div>
    );
}

/** Textarea con label flotante */
export function FloatTextarea({ label, value, error, rows = 4, ...props }) {
    const [focused, setFocused] = useState(false);
    const floated = focused || (value !== '' && value !== undefined);

    return (
        <div style={{ position: 'relative' }}>
            <label style={{
                ...LABEL_BASE,
                left: floated ? 12 : 14,
                top: floated ? -8 : 16,
                padding: floated ? '0 4px' : '0',
                fontSize: floated ? 11 : 14,
                fontWeight: floated ? 700 : 400,
                letterSpacing: floated ? '.4px' : 0,
                color: focused ? BLUE : floated ? '#64748b' : '#94a3b8',
            }}>
                {label}
            </label>
            <textarea
                value={value}
                rows={rows}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    ...inputStyle(focused, error, 14),
                    resize: 'none', lineHeight: 1.65, paddingTop: 16,
                }}
                {...props}
            />
            <ErrorMsg msg={error} />
        </div>
    );
}

/** Select con label flotante y flecha customizada */
export function FloatSelect({ label, value, error, children, ...props }) {
    const [focused, setFocused] = useState(false);
    const floated = focused || (value !== '' && value !== undefined);

    const chevron = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${focused ? '#4263ac' : '#94a3b8'}" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`
    );

    return (
        <div style={{ position: 'relative' }}>
            <label style={labelStyle(floated, focused, error, 14)}>
                {label}
            </label>
            <select
                value={value}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    ...inputStyle(focused, error, 14),
                    cursor: 'pointer',
                    color: value ? '#1e293b' : '#94a3b8',
                    backgroundImage: `url("data:image/svg+xml,${chevron}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: 38,
                }}
                {...props}
            >
                {children}
            </select>
            <ErrorMsg msg={error} />
        </div>
    );
}
