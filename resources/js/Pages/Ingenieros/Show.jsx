import { useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import {
    ArrowLeft, MapPin, Clock, Home, Building, Wrench,
    Phone, Lock, AlertTriangle, ClipboardList, User, CheckCircle,
} from 'lucide-react';

// ─── Design tokens (idénticos a las otras páginas Show) ───────────────────────
const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '18px 20px' };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const URGENCY = {
    normal:   { label: 'Normal',  bg: '#f1f4f9', color: '#475569' },
    urgent:   { label: 'Urgente', bg: '#fef3e2', color: '#b45309' },
    critical: { label: 'Crítico', bg: '#fef2f2', color: '#CE6969' },
};

const STATUS_MAP = {
    pending:   { label: 'Sin asignar',        bg: '#eef1fa', color: '#4263ac' },
    assigned:  { label: 'Ingeniero asignado', bg: '#fef3e2', color: '#b45309' },
    completed: { label: 'Completada',         bg: '#dcfce7', color: '#16a34a' },
};

const STRUCT = {
    house:      { label: 'Casa / Vivienda',    Icon: Home     },
    apartment:  { label: 'Apartamento',        Icon: Building },
    building:   { label: 'Edificio',           Icon: Building },
    commercial: { label: 'Local comercial',    Icon: Home     },
    other:      { label: 'Otro',               Icon: Wrench   },
};

function daysAgo(d) {
    return Math.max(0, Math.floor((Date.now() - new Date(d)) / 86400000));
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function InspeccionShow({ inspectionRequest: req }) {
    const { props } = usePage();
    const flash  = props.flash ?? {};

    const urg    = URGENCY[req.urgency]       ?? URGENCY.normal;
    const status = STATUS_MAP[req.status]     ?? STATUS_MAP.pending;
    const struct = STRUCT[req.structure_type] ?? null;
    const days   = daysAgo(req.created_at);
    const done   = req.status === 'completed';

    const [claiming, setClaiming] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/ingenieros/solicitud/${req.id}/postular`, {
            onSuccess: () => { setClaiming(false); reset(); },
        });
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Back */}
                <Link href="/ingenieros" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none' }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Ingenieros
                </Link>

                {/* Flash */}
                {flash.success && (
                    <div style={{ background: '#dcfce7', color: '#15803d', borderRadius: 11, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                        {flash.success}
                    </div>
                )}

                <div className="va-show-grid">

                    {/* ── Columna izquierda: información de la solicitud ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={CARD}>

                            {/* Header con ícono + título */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 14 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ClipboardList size={20} color="#b45309" strokeWidth={2}/>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-.4px', lineHeight: 1.2 }}>
                                        Inspección estructural
                                    </h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                        <MapPin size={10} color="#94a3b8" strokeWidth={2}/>
                                        <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
                                            {[req.zone, req.state].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chips de estado y urgencia */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                                <span style={{ background: status.bg, color: status.color, fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{status.label}</span>
                                <span style={{ background: urg.bg, color: urg.color, fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{urg.label}</span>
                                {struct && (
                                    <span style={{ background: '#f1f4f9', color: '#475569', fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>
                                        {struct.label}
                                    </span>
                                )}
                            </div>

                            {/* Dirección */}
                            <p style={{ ...SEC, marginBottom: 6 }}>Dirección</p>
                            <p style={{ margin: '0 0 14px', fontSize: 13.5, color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>{req.address}</p>

                            {/* Descripción */}
                            {req.description && (
                                <>
                                    <div style={DIV}/>
                                    <p style={{ ...SEC, margin: '12px 0 6px' }}>Descripción del daño</p>
                                    <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{req.description}</p>
                                </>
                            )}

                            {/* Stats: días + completada */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Clock size={12} color="#94a3b8" strokeWidth={2}/>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                                        {days === 0 ? 'Registrada hoy' : `Hace ${days} día${days !== 1 ? 's' : ''}`}
                                    </span>
                                </div>
                                {done && (
                                    <div style={{ flex: 1, background: '#dcfce7', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <CheckCircle size={12} color="#16a34a" strokeWidth={2}/>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d' }}>
                                            Completada {fmtDate(req.completed_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Solicitante */}
                        <div style={CARD}>
                            <p style={{ ...SEC, marginBottom: 10 }}>Solicitante</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <User size={13} color="#94a3b8" strokeWidth={2}/>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b' }}>{req.requester_name}</span>
                                </div>
                                {flash.contact_phone ? (
                                    <a href={`tel:${flash.contact_phone}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#eef1fa', color: '#4263ac', fontSize: 12, fontWeight: 700, padding: '7px 12px', borderRadius: 10, textDecoration: 'none' }}>
                                        <Phone size={12} color="#4263ac" strokeWidth={2}/> {flash.contact_phone}
                                    </a>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f1f4f9', color: '#94a3b8', fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 10 }}>
                                        <Lock size={11} color="#94a3b8" strokeWidth={2}/> Visible al postularte
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Columna derecha: postulación / ingeniero asignado ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Ingeniero asignado */}
                        {req.engineer && (
                            <div style={CARD}>
                                <p style={{ ...SEC, marginBottom: 12 }}>Ingeniero asignado</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ede9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Wrench size={18} color="#7c3aed" strokeWidth={2}/>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{req.engineer.name}</div>
                                        {req.engineer.specialty && (
                                            <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginTop: 2 }}>{req.engineer.specialty}</div>
                                        )}
                                        {req.engineer.phone && (
                                            <a href={`tel:${req.engineer.phone}`}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#4263ac', fontWeight: 600, textDecoration: 'none', marginTop: 4 }}>
                                                <Phone size={11} color="#4263ac" strokeWidth={2}/> {req.engineer.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulario de postulación */}
                        {req.status === 'pending' && (
                            <div style={CARD}>
                                <p style={{ ...SEC, marginBottom: 12 }}>¿Puedes atender esta inspección?</p>

                                {errors.general && (
                                    <p style={{ fontSize: 12, color: '#CE6969', fontWeight: 600, margin: '0 0 10px' }}>{errors.general}</p>
                                )}

                                <div style={{ background: '#fff7ed', border: '1px solid #fde7c6', borderRadius: 12, padding: '11px 13px', display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 14 }}>
                                    <AlertTriangle size={14} color="#b45309" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
                                    <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.55 }}>
                                        Solo ingenieros ya registrados y validados por el equipo pueden postularse.
                                    </p>
                                </div>

                                {!claiming ? (
                                    <button onClick={() => setClaiming(true)}
                                        style={{ width: '100%', padding: '11px', borderRadius: 12, background: '#f8fafc', border: '1.5px dashed #cbd5e1', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <Wrench size={14} color="#475569" strokeWidth={2}/> Soy ingeniero, me postulo
                                    </button>
                                ) : (
                                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                        <div>
                                            <input
                                                style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${errors.phone ? '#CE6969' : '#e2e8f0'}`, borderRadius: 11, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b', outline: 'none' }}
                                                type="tel"
                                                placeholder="Tu teléfono registrado *"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                required
                                            />
                                            {errors.phone && <p style={{ fontSize: 11.5, color: '#CE6969', margin: '3px 0 0' }}>{errors.phone}</p>}
                                        </div>
                                        <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8' }}>
                                            ¿Aún no estás registrado? <Link href="/ingenieros/registrar" style={{ color: '#4263ac', fontWeight: 700, textDecoration: 'none' }}>Regístrate aquí</Link>
                                        </p>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                                            <button type="button" onClick={() => { setClaiming(false); reset(); }}
                                                style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#f1f4f9', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>
                                                Cancelar
                                            </button>
                                            <button type="submit" disabled={processing}
                                                style={{ flex: 2, padding: '10px', borderRadius: 11, background: processing ? '#83A2DB' : '#4263ac', border: 'none', fontSize: 13, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#fff' }}>
                                                {processing ? 'Verificando…' : 'Confirmar postulación'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Aviso si ya está completada */}
                        {done && (
                            <div style={{ ...CARD, background: '#dcfce7', border: '1px solid #bbf7d0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                    <CheckCircle size={20} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0 }}/>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#15803d', lineHeight: 1.4 }}>
                                        Inspección completada.<br/>
                                        <span style={{ fontWeight: 500 }}>Gracias por tu servicio voluntario.</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
