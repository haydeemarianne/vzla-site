import { useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowLeft, MapPin, Clock, AlertTriangle, Home, Building, Wrench, Phone, Lock } from 'lucide-react';

const URGENCY = {
    normal:   { label: 'Normal',  bg: '#f1f4f9', color: '#475569' },
    urgent:   { label: 'Urgente', bg: '#fef3e2', color: '#b45309' },
    critical: { label: 'Crítico', bg: '#fef2f2', color: '#CE6969' },
};

const STATUS = {
    pending:   { label: 'Pendiente de asignación', bg: '#eef1fa', color: '#4263ac' },
    assigned:  { label: 'Ingeniero asignado',       bg: '#fef3e2', color: '#b45309' },
    completed: { label: 'Completada',               bg: '#dcfce7', color: '#16a34a' },
};

const STRUCT = {
    house:      { label: 'Casa',          Icon: Home },
    apartment:  { label: 'Apartamento',   Icon: Building },
    building:   { label: 'Edificio',      Icon: Building },
    commercial: { label: 'Local comercial', Icon: Home },
    other:      { label: 'Otro',          Icon: Wrench },
};

function daysAgo(d) {
    return Math.max(0, Math.floor((Date.now() - new Date(d)) / 86400000));
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 16, padding: '18px' };

export default function InspeccionShow({ inspectionRequest: req }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const urg    = URGENCY[req.urgency]          ?? URGENCY.normal;
    const status = STATUS[req.status]            ?? STATUS.pending;
    const struct = STRUCT[req.structure_type]    ?? null;
    const days   = daysAgo(req.created_at);

    const [claiming, setClaiming] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:           '',
        phone:          '',
        license_number: '',
        specialty:      '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/ingenieros/solicitud/${req.id}/postular`, {
            onSuccess: () => { setClaiming(false); reset(); },
        });
    };

    return (
        <MainLayout>
            <div style={{ padding: '0 4px 40px', fontFamily: "'Onest', system-ui, sans-serif", maxWidth: 560, margin: '0 auto' }}>

                <Link href="/ingenieros" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none', marginBottom: 16 }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Tablero
                </Link>

                {flash.success && (
                    <div style={{ background: '#dcfce7', color: '#15803d', borderRadius: 11, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                        {flash.success}
                    </div>
                )}

                {/* ─── Encabezado ─── */}
                <div style={{ ...CARD, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-.4px' }}>
                                Inspección estructural
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                                <MapPin size={11} color="#94a3b8" strokeWidth={2}/>
                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                                    {[req.zone, req.state].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                        <span style={{ flexShrink: 0, background: urg.bg, color: urg.color, fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
                            {urg.label}
                        </span>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
                            <Clock size={13} color="#94a3b8" strokeWidth={2} style={{ display: 'block', margin: '0 auto 3px' }}/>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b' }}>
                                {days === 0 ? 'Hoy' : `${days}d`}
                            </span>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
                            {struct ? (
                                <>
                                    <struct.Icon size={13} color="#94a3b8" strokeWidth={2} style={{ display: 'block', margin: '0 auto 3px' }}/>
                                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b' }}>{struct.label}</span>
                                </>
                            ) : (
                                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8' }}>—</span>
                            )}
                        </div>
                        <div style={{ background: status.bg, borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: status.color, lineHeight: 1.3 }}>{status.label}</span>
                        </div>
                    </div>
                </div>

                {/* ─── Dirección + descripción ─── */}
                <div style={{ ...CARD, marginBottom: 12 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8' }}>Dirección</p>
                    <p style={{ margin: '0 0 14px', fontSize: 13.5, color: '#1e293b', fontWeight: 600 }}>{req.address}</p>

                    {req.description && (
                        <>
                            <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8' }}>Descripción del daño</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.55 }}>{req.description}</p>
                        </>
                    )}
                </div>

                {/* ─── Solicitante ─── */}
                <div style={{ ...CARD, marginBottom: 12 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8' }}>Solicitante</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{req.requester_name}</span>
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

                {/* ─── Ingeniero asignado ─── */}
                {req.engineer && (
                    <div style={{ ...CARD, marginBottom: 12, border: '1px solid #ede9ff' }}>
                        <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8' }}>Ingeniero asignado</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ede9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Wrench size={16} color="#7c3aed" strokeWidth={2}/>
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{req.engineer.name}</div>
                                {req.engineer.specialty && (
                                    <div style={{ fontSize: 11.5, color: '#7c3aed', fontWeight: 600 }}>{req.engineer.specialty}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Postulación ─── */}
                {req.status === 'pending' && (
                    <div style={CARD}>
                        <p style={{ margin: '0 0 12px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8' }}>¿Puedes atender esta inspección?</p>

                        {errors.general && (
                            <p style={{ fontSize: 12, color: '#CE6969', fontWeight: 600, margin: '0 0 10px' }}>{errors.general}</p>
                        )}

                        {!claiming ? (
                            <button onClick={() => setClaiming(true)}
                                style={{ width: '100%', padding: '11px', borderRadius: 12, background: '#f8fafc', border: '1.5px dashed #cbd5e1', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Wrench size={14} color="#475569" strokeWidth={2}/> Soy ingeniero, me postulo
                            </button>
                        ) : (
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                <div style={{ background: '#fef9c3', borderRadius: 9, padding: '8px 11px', fontSize: 12, color: '#92600e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Lock size={12} color="#92600e"/> Al confirmar verás el teléfono del solicitante
                                </div>
                                <input
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b', outline: 'none' }}
                                    type="text" placeholder="Tu nombre completo *"
                                    value={data.name} onChange={e => setData('name', e.target.value)} required/>
                                <input
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b', outline: 'none' }}
                                    type="tel" placeholder="Tu teléfono *"
                                    value={data.phone} onChange={e => setData('phone', e.target.value)} required/>
                                <input
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b', outline: 'none' }}
                                    type="text" placeholder="Especialidad (opcional)"
                                    value={data.specialty} onChange={e => setData('specialty', e.target.value)}/>
                                <input
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b', outline: 'none' }}
                                    type="text" placeholder="Nro. de colegiatura (opcional)"
                                    value={data.license_number} onChange={e => setData('license_number', e.target.value)}/>
                                {(errors.name || errors.phone) && (
                                    <p style={{ fontSize: 11.5, color: '#CE6969', margin: 0 }}>{errors.name || errors.phone}</p>
                                )}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" onClick={() => { setClaiming(false); reset(); }}
                                        style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#f1f4f9', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={processing}
                                        style={{ flex: 2, padding: '10px', borderRadius: 11, background: processing ? '#83A2DB' : '#4263ac', border: 'none', fontSize: 13, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#fff' }}>
                                        {processing ? 'Enviando…' : 'Confirmar postulación'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {req.status === 'completed' && (
                    <div style={{ ...CARD, background: '#dcfce7', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                            Inspección completada el {fmtDate(req.completed_at)}
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
