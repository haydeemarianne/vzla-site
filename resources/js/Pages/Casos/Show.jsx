import { Link, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import {
    ArrowLeft, Heart, Info, Check, MessageCircle, Phone, Lock,
    Utensils, Droplets, Pill, Shirt, Home, Baby, Wrench, FileText, Package, MessageSquare
} from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────────────────────── */
const PRIMARY   = '#4263ac';
const CARD_SHADOW = '0 8px 22px rgba(16,24,40,.06)';
const PASTEL_AVATARS = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

/* ─── Need metadata ──────────────────────────────────────────────────── */
const NEED_META = {
    food:      { label: 'Alimentación',  Icon: Utensils,  pastel: '#fef3e2', icon: '#b45309' },
    water:     { label: 'Agua',          Icon: Droplets,  pastel: '#e0f2fe', icon: '#0369a1' },
    medicine:  { label: 'Medicamentos',  Icon: Pill,      pastel: '#fce7f3', icon: '#9d174d' },
    clothing:  { label: 'Ropa',          Icon: Shirt,     pastel: '#f3e8ff', icon: '#7e22ce' },
    shelter:   { label: 'Refugio',       Icon: Home,      pastel: '#dcfce7', icon: '#15803d' },
    baby:      { label: 'Bebé',          Icon: Baby,      pastel: '#fef9c3', icon: '#92600e' },
    tools:     { label: 'Herramientas',  Icon: Wrench,    pastel: '#f1f5f9', icon: '#475569' },
    documents: { label: 'Documentos',   Icon: FileText,  pastel: '#eff6ff', icon: '#1d4ed8' },
    other:     { label: 'Otro',          Icon: Package,   pastel: '#f8fafc', icon: '#64748b' },
};

const NEED_LABELS = Object.fromEntries(Object.entries(NEED_META).map(([k, v]) => [k, v.label]));

/* ─── Helpers ────────────────────────────────────────────────────────── */
function initials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function pastelFor(name = '') {
    const idx = name.charCodeAt(0) % PASTEL_AVATARS.length;
    return PASTEL_AVATARS[idx];
}

function daysAgo(dateStr) {
    return Math.max(1, Math.floor((Date.now() - new Date(dateStr)) / 86400000));
}

/* ─── Contact card ───────────────────────────────────────────────────── */
function ContactCard({ familyName, phone }) {
    const bg = pastelFor(familyName);
    return (
        <div style={{
            background: '#fff',
            boxShadow: CARD_SHADOW,
            borderRadius: 18,
            padding: '16px',
            marginTop: 14,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 700, color: '#3a4250', flexShrink: 0,
                }}>
                    {initials(familyName)}
                </div>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{familyName}</div>
                    <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13.5,
                        color: '#334155',
                        marginTop: 2,
                        letterSpacing: '0.02em',
                    }}>{phone}</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
                <a
                    href={`https://wa.me/${phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        flex: 1,
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 13,
                        padding: '11px 0',
                        fontWeight: 700,
                        fontSize: 13.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}>
                    <MessageCircle size={16} color="#fff" />
                    WhatsApp
                </a>
                <a
                    href={`tel:${phone}`}
                    style={{
                        flex: 1,
                        background: '#fff',
                        color: '#0f172a',
                        border: '1px solid #e2e6ee',
                        borderRadius: 13,
                        padding: '11px 0',
                        fontWeight: 700,
                        fontSize: 13.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}>
                    <Phone size={16} color="#0f172a" />
                    Llamar
                </a>
            </div>
        </div>
    );
}

/* ─── Step 1 ─────────────────────────────────────────────────────────── */
function Step1({ familyName, name, setName, phone, setPhone, onNext }) {
    const [nameFocus, setNameFocus] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    return (
        <div style={{ padding: '8px 0 0' }}>
            <h2 style={{
                fontSize: 22, fontWeight: 700, color: '#0f172a',
                letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: 8,
            }}>
                Apadrinas a {familyName}
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.55, marginBottom: 28 }}>
                No necesitas cuenta. Te identificamos por tu teléfono y te conectamos directamente con la familia.
            </p>

            {/* Nombre */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Tu nombre
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)}
                    placeholder="Ej: María González"
                    style={{
                        width: '100%',
                        border: `1.5px solid ${nameFocus ? PRIMARY : '#e2e6ee'}`,
                        borderRadius: 13,
                        padding: '14px',
                        fontSize: 15,
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                        boxShadow: nameFocus ? `0 0 0 3px #dde6f5` : 'none',
                        transition: 'border-color .15s, box-shadow .15s',
                    }}
                />
            </div>

            {/* Teléfono */}
            <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Tu teléfono
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e6ee',
                        borderRadius: 13,
                        padding: '14px 14px',
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#475569',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        🇻🇪 +58
                    </div>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        onFocus={() => setPhoneFocus(true)}
                        onBlur={() => setPhoneFocus(false)}
                        placeholder="4121234567"
                        maxLength={10}
                        style={{
                            flex: 1,
                            border: `1.5px solid ${phoneFocus ? PRIMARY : '#e2e6ee'}`,
                            borderRadius: 13,
                            padding: '14px',
                            fontSize: 15,
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box',
                            boxShadow: phoneFocus ? `0 0 0 3px #dde6f5` : 'none',
                            transition: 'border-color .15s, box-shadow .15s',
                        }}
                    />
                </div>
            </div>

            {/* Privacidad */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 28 }}>
                <Lock size={13} color="#94a3b8" style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                    Tu número solo se comparte con la familia que apadrinas. No lo publicamos ni lo cedemos a terceros.
                </span>
            </div>

            <button
                onClick={onNext}
                disabled={!name.trim() || phone.length < 10}
                style={{
                    width: '100%',
                    background: name.trim() && phone.length >= 10 ? PRIMARY : '#c7d2e8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 15,
                    padding: '15px',
                    fontSize: 15.5,
                    fontWeight: 700,
                    cursor: name.trim() && phone.length >= 10 ? 'pointer' : 'default',
                    transition: 'background .15s',
                }}>
                Enviarme el código
            </button>
        </div>
    );
}

/* ─── Step 2 ─────────────────────────────────────────────────────────── */
const DEMO_CODE = '482193';

function Step2({ caseId, phone, name, code, setCode, onSuccess }) {
    const inputRef = useRef(null);
    const digits = code.padEnd(6, ' ').split('');
    const codeReady = code.length === 6;

    const { post, processing } = useForm({});

    const handleVerify = () => {
        if (!codeReady) return;
        post(`/casos/${caseId}/apadrinar`, {
            data: { volunteer_phone: phone, volunteer_name: name },
            onSuccess,
        });
    };

    return (
        <div style={{ padding: '8px 0 0' }}>
            {/* Icon tile */}
            <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: '#eef2fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
            }}>
                <MessageSquare size={26} color={PRIMARY} />
            </div>

            <h2 style={{
                fontSize: 22, fontWeight: 700, color: '#0f172a',
                letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: 8,
            }}>
                Verifica tu teléfono
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.55, marginBottom: 24 }}>
                Enviamos un código de 6 dígitos a +58&nbsp;{phone}
            </p>

            {/* 6-cell code display */}
            <div
                style={{ position: 'relative', marginBottom: 18, cursor: 'text' }}
                onClick={() => inputRef.current?.focus()}
            >
                <div style={{ display: 'flex', gap: 8 }}>
                    {digits.map((d, i) => {
                        const filled = i < code.length;
                        return (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: 54,
                                    borderRadius: 14,
                                    border: filled ? `2px solid ${PRIMARY}` : '1px solid #e2e6ee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    background: '#fff',
                                    transition: 'border-color .12s',
                                }}>
                                {filled ? d : ''}
                            </div>
                        );
                    })}
                </div>
                {/* Hidden input */}
                <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        opacity: 0,
                        pointerEvents: 'auto',
                        cursor: 'text',
                        fontSize: 1,
                    }}
                />
            </div>

            {/* Demo autofill */}
            <button
                onClick={() => setCode(DEMO_CODE)}
                style={{
                    width: '100%',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 12,
                    background: 'transparent',
                    color: PRIMARY,
                    fontSize: 12.5,
                    fontWeight: 700,
                    padding: '10px',
                    cursor: 'pointer',
                    marginBottom: 16,
                }}>
                Autorrellenar: 482 193
            </button>

            {/* Resend */}
            <p style={{ fontSize: 12.5, color: '#94a3b8', textAlign: 'center', marginBottom: 24 }}>
                ¿No llegó? Reenviar en <span style={{ color: PRIMARY, fontWeight: 700 }}>0:28</span>
            </p>

            <button
                onClick={handleVerify}
                disabled={!codeReady || processing}
                style={{
                    width: '100%',
                    background: codeReady ? PRIMARY : '#c7d2e8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 15,
                    padding: '15px',
                    fontSize: 15.5,
                    fontWeight: 700,
                    cursor: codeReady ? 'pointer' : 'default',
                    transition: 'background .15s',
                }}>
                {processing ? 'Verificando…' : 'Verificar y apadrinar'}
            </button>
        </div>
    );
}

/* ─── Step 3 ─────────────────────────────────────────────────────────── */
function Step3({ familyName, contactPhone, phone }) {
    const displayPhone = contactPhone || `+58${phone}`;
    return (
        <div style={{ padding: '8px 0 0', textAlign: 'center' }}>
            {/* Green check circle */}
            <div style={{
                width: 66, height: 66, borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
            }}>
                <Check size={34} color="#16a34a" strokeWidth={2.6} />
            </div>

            <h2 style={{
                fontSize: 22, fontWeight: 700, color: '#0f172a',
                letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: 8,
            }}>
                ¡Caso asignado a ti!
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.55, marginBottom: 20, textAlign: 'center' }}>
                Ahora eres el padrino de <strong>{familyName}</strong>
            </p>

            {/* Contact card */}
            <div style={{ textAlign: 'left' }}>
                <ContactCard familyName={familyName} phone={displayPhone} />
            </div>

            {/* Commitment card */}
            <div style={{
                background: '#fff',
                boxShadow: CARD_SHADOW,
                borderRadius: 18,
                padding: '16px',
                marginTop: 14,
                textAlign: 'left',
            }}>
                <div style={{
                    fontSize: 12, fontWeight: 700, color: '#94a3b8',
                    letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 14,
                }}>
                    Tu Compromiso
                </div>
                {[
                    'Contáctate con la familia en las próximas 24 horas',
                    'Ayuda a cubrir sus necesidades hasta resolverlas',
                    'Actualiza el estado del caso cuando haya avances',
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                        <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            background: '#eff6ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: 1,
                        }}>
                            <Check size={11} color={PRIMARY} strokeWidth={2.8} />
                        </div>
                        <span style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>{item}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => router.visit('/casos')}
                style={{
                    width: '100%',
                    background: '#fff',
                    color: '#0f172a',
                    border: '1.5px solid #e2e6ee',
                    borderRadius: 15,
                    padding: '15px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 18,
                }}>
                Ver más casos
            </button>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function CasosShow({ supportCase, updates, contactPhone }) {
    const needs = Array.isArray(supportCase.needs)
        ? supportCase.needs
        : (supportCase.needs ? JSON.parse(supportCase.needs) : []);

    const days = daysAgo(supportCase.created_at);
    const avatarBg = pastelFor(supportCase.family_name || '');
    const displayName = supportCase.is_anonymous ? 'Familia Anónima' : (supportCase.family_name || 'Familia');

    /* Adopt flow state */
    const [mode, setMode]       = useState('detail'); // 'detail' | 'adopt'
    const [apStep, setApStep]   = useState(1);
    const [phone, setPhone]     = useState('');
    const [code, setCode]       = useState('');
    const [name, setName]       = useState('');

    /* ── ADOPT MODE ─────────────────────────────────────────────────── */
    if (mode === 'adopt') {
        return (
            <MainLayout>
                <div style={{ padding: '4px 20px 28px', maxWidth: 480, margin: '0 auto' }}>
                    {/* Header row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                    }}>
                        <button
                            onClick={() => {
                                if (apStep === 1) { setMode('detail'); }
                                else { setApStep(s => s - 1); }
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                border: '1px solid #e7e9ee',
                                borderRadius: 999,
                                background: '#fff',
                                padding: '7px 14px',
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer',
                            }}>
                            <ArrowLeft size={15} />
                            Atrás
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
                            Paso {apStep} de 3
                        </span>
                    </div>

                    {/* Progress bars */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                style={{
                                    flex: 1,
                                    height: 4,
                                    borderRadius: 999,
                                    background: s <= apStep ? PRIMARY : '#dde3ee',
                                    transition: 'background .25s',
                                }}
                            />
                        ))}
                    </div>

                    {/* Steps */}
                    {apStep === 1 && (
                        <Step1
                            familyName={displayName}
                            name={name}
                            setName={setName}
                            phone={phone}
                            setPhone={setPhone}
                            onNext={() => setApStep(2)}
                        />
                    )}
                    {apStep === 2 && (
                        <Step2
                            caseId={supportCase.id}
                            phone={phone}
                            name={name}
                            code={code}
                            setCode={setCode}
                            onSuccess={() => setApStep(3)}
                        />
                    )}
                    {apStep === 3 && (
                        <Step3
                            familyName={displayName}
                            contactPhone={contactPhone}
                            phone={phone}
                        />
                    )}
                </div>
            </MainLayout>
        );
    }

    /* ── DETAIL MODE ────────────────────────────────────────────────── */
    return (
        <MainLayout>
            <div style={{ paddingBottom: 104, maxWidth: 480, margin: '0 auto' }}>

                {/* Back button */}
                <div style={{ padding: '4px 18px 0' }}>
                    <button
                        onClick={() => router.visit('/casos')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            border: '1px solid #e7e9ee',
                            borderRadius: 999,
                            background: '#fff',
                            padding: '7px 14px',
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer',
                        }}>
                        <ArrowLeft size={15} />
                        Volver
                    </button>
                </div>

                {/* Header */}
                <div style={{ padding: '16px 20px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {/* Avatar */}
                        <div style={{
                            width: 62, height: 62, borderRadius: '50%',
                            background: avatarBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 21, fontWeight: 700, color: '#3a4250',
                            flexShrink: 0,
                        }}>
                            {initials(displayName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 20, fontWeight: 700, color: '#0f172a',
                                letterSpacing: '-0.4px', lineHeight: 1.2,
                            }}>
                                {displayName}
                            </div>
                            {/* Badges */}
                            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                {contactPhone ? (
                                    <span style={{
                                        background: '#dcfce7', color: '#15803d',
                                        fontSize: 11.5, fontWeight: 700,
                                        padding: '3px 10px', borderRadius: 999,
                                    }}>Apadrinado</span>
                                ) : (
                                    <span style={{
                                        background: '#eef2f6', color: '#475569',
                                        fontSize: 11.5, fontWeight: 700,
                                        padding: '3px 10px', borderRadius: 999,
                                    }}>Abierto</span>
                                )}
                            </div>
                            {/* Subtitle */}
                            <div style={{
                                fontSize: 12.5, color: '#94a3b8', fontWeight: 600,
                                marginTop: 5, lineHeight: 1.3,
                            }}>
                                {supportCase.zone || supportCase.state || 'Venezuela'} · publicado hace {days} {days === 1 ? 'día' : 'días'}
                            </div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: 9, marginTop: 18 }}>
                        {[
                            { value: supportCase.people_count ?? '—', label: 'Personas' },
                            { value: supportCase.has_children ? 'Sí' : 'No', label: 'Niños' },
                            { value: `${days}d`, label: 'Sin ayuda' },
                        ].map(({ value, label }) => (
                            <div key={label} style={{
                                flex: 1,
                                background: '#fff',
                                boxShadow: CARD_SHADOW,
                                borderRadius: 15,
                                padding: 12,
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    fontSize: 19, fontWeight: 700, color: '#0f172a',
                                    letterSpacing: '-0.4px',
                                }}>{value}</div>
                                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Situación card */}
                    <div style={{
                        background: '#fff',
                        boxShadow: CARD_SHADOW,
                        borderRadius: 18,
                        padding: 16,
                        marginTop: 18,
                    }}>
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: '#94a3b8',
                            letterSpacing: '0.4px', textTransform: 'uppercase',
                        }}>
                            Su Situación
                        </div>
                        <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, marginTop: 9, marginBottom: 0 }}>
                            {supportCase.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {/* Needs card */}
                    {needs.length > 0 && (
                        <div style={{ marginTop: 14 }}>
                            <div style={{
                                fontSize: 12, fontWeight: 700, color: '#94a3b8',
                                letterSpacing: '0.4px', textTransform: 'uppercase',
                                marginBottom: 10,
                            }}>
                                Qué Necesitan Ahora
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {needs.map((need) => {
                                    const meta = NEED_META[need] || NEED_META.other;
                                    const { Icon, label, pastel, icon: iconColor } = meta;
                                    return (
                                        <div key={need} style={{
                                            background: '#fff',
                                            boxShadow: CARD_SHADOW,
                                            borderRadius: 14,
                                            padding: '12px 14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                        }}>
                                            <div style={{
                                                width: 34, height: 34,
                                                borderRadius: 10,
                                                background: pastel,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Icon size={17} color={iconColor} />
                                            </div>
                                            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#334155', flex: 1 }}>
                                                {label}
                                            </span>
                                            {(need === 'food' || need === 'medicine' || need === 'water') && (
                                                <span style={{
                                                    background: '#fef3e2', color: '#b45309',
                                                    fontSize: 11, fontWeight: 700,
                                                    padding: '3px 9px', borderRadius: 999,
                                                }}>Crítica</span>
                                            )}
                                            {(need === 'clothing' || need === 'shelter') && (
                                                <span style={{
                                                    background: '#fef9c3', color: '#92600e',
                                                    fontSize: 11, fontWeight: 700,
                                                    padding: '3px 9px', borderRadius: 999,
                                                }}>Alta</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Info box */}
                    <div style={{
                        background: '#eff6ff',
                        border: '1px solid #dde6f5',
                        borderRadius: 14,
                        padding: '13px 14px',
                        marginTop: 14,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                    }}>
                        <Info size={18} color="#4263ac" style={{ flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: 12, color: '#33508c', lineHeight: 1.5, margin: 0 }}>
                            Al apadrinar recibes el <strong>teléfono privado</strong> de la familia. El compromiso es 1 a 1 hasta cubrir su necesidad.
                        </p>
                    </div>

                    {/* Contact card if already godfather */}
                    {contactPhone && (
                        <ContactCard familyName={displayName} phone={contactPhone} />
                    )}

                    {/* Updates timeline */}
                    {updates && updates.length > 0 && (
                        <div style={{
                            background: '#fff',
                            boxShadow: CARD_SHADOW,
                            borderRadius: 18,
                            padding: 16,
                            marginTop: 18,
                        }}>
                            <div style={{
                                fontSize: 12, fontWeight: 700, color: '#94a3b8',
                                letterSpacing: '0.4px', textTransform: 'uppercase',
                                marginBottom: 14,
                            }}>
                                Actualizaciones
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {updates.map((update) => (
                                    <div key={update.id} style={{ display: 'flex', gap: 12 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: '#f1f5f9',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                            fontSize: 13, fontWeight: 700, color: '#64748b',
                                        }}>
                                            {initials(update.author_name || '?')}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
                                                    {update.author_name}
                                                </span>
                                                {update.author_type && (
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 600,
                                                        background: '#f1f5f9', color: '#64748b',
                                                        padding: '2px 7px', borderRadius: 999,
                                                    }}>
                                                        {update.author_type === 'family' ? 'Familia' : 'Voluntario'}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.55, margin: 0 }}>
                                                {update.content}
                                            </p>
                                            {update.created_at && (
                                                <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                                                    {update.created_at}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed bottom bar — hidden if already godfather */}
                {!contactPhone && (
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, #f4f5f7 72%, rgba(244,245,247,0))',
                        padding: '14px 20px 20px',
                        display: 'flex',
                        gap: 10,
                        zIndex: 50,
                    }}>
                        {/* Heart button */}
                        <button style={{
                            width: 52, height: 52,
                            border: '1.5px solid #e2e6ee',
                            background: '#fff',
                            borderRadius: 15,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}>
                            <Heart size={22} color="#64748b" />
                        </button>
                        {/* Adopt button */}
                        <button
                            onClick={() => setMode('adopt')}
                            style={{
                                flex: 1,
                                background: PRIMARY,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 15,
                                padding: '15px',
                                fontSize: 15.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 12px 24px -8px rgba(29,78,216,.6)',
                            }}>
                            Apadrinar a esta familia
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
