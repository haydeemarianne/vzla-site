import MainLayout from '@/Layouts/MainLayout';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Trash2, MapPin, User, Phone, CheckCircle,
    Circle, Car, Navigation, Clock, Users
} from 'lucide-react';

const TYPE_LABEL  = { domestic: 'Basura doméstica', debris: 'Escombros', both: 'Basura + Escombros' };
const VOL_LABEL   = { low: 'Bajo volumen', medium: 'Volumen medio', high: 'Alto volumen' };
const STATUS_LABEL = {
    confirmed:  { label: 'Confirmado',  color: '#4263ac', bg: '#eef1fa', icon: Clock },
    on_the_way: { label: 'En camino',   color: '#b45309', bg: '#fef3e2', icon: Car },
    arrived:    { label: 'Llegó',       color: '#16a34a', bg: '#dcfce7', icon: Navigation },
    done:       { label: 'Terminó',     color: '#64748b', bg: '#f1f4f9', icon: CheckCircle },
};
const NEXT_STATUS = {
    confirmed:  'on_the_way',
    on_the_way: 'arrived',
    arrived:    'done',
    done:       null,
};
const NEXT_LABEL = {
    confirmed:  'Ya voy en camino →',
    on_the_way: 'Ya llegué →',
    arrived:    'Terminé mi parte →',
    done:       null,
};
const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

function initials(name) {
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export default function LimpiezaShow({ point, volunteers, tasks }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const [signing, setSigning] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:  '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/limpieza/${point.id}/voluntario`, {
            onSuccess: () => { reset(); setSigning(false); },
        });
    };

    const updateStatus = (volunteer, next) => {
        router.patch(`/limpieza/${point.id}/voluntario/${volunteer.id}/status`, { status: next });
    };

    const onWay    = volunteers.filter(v => v.status === 'on_the_way').length;
    const arrived  = volunteers.filter(v => v.status === 'arrived').length;
    const done     = volunteers.filter(v => v.status === 'done').length;
    const target   = 10;
    const progress = Math.min(100, (volunteers.length / target) * 100);

    return (
        <MainLayout>
            <div style={{ padding: '14px 20px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>

                {/* Back */}
                <Link href="/limpieza" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none',
                    marginBottom: 16,
                }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5} />
                    Limpieza
                </Link>

                {/* Flash */}
                {flash.success && (
                    <div style={{
                        background: '#dcfce7', color: '#15803d', borderRadius: 11,
                        padding: '10px 13px', fontSize: 13, fontWeight: 600, marginBottom: 14,
                    }}>
                        {flash.success}
                    </div>
                )}

                {/* Header card */}
                <div style={{
                    background: '#fff', borderRadius: 18, padding: 16,
                    boxShadow: '0 8px 22px rgba(16,24,40,.06)', marginBottom: 14,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 11, background: '#e8f5e9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Trash2 size={20} color="#16a34a" strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-.4px' }}>
                                {point.zone_name}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                                <MapPin size={11} color="#94a3b8" strokeWidth={2} />
                                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                    {[point.city, point.state].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chips tipo/volumen */}
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
                        <span style={{
                            background: '#fef3e2', color: '#b45309',
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        }}>
                            {TYPE_LABEL[point.type] ?? point.type}
                        </span>
                        <span style={{
                            background: '#f1f4f9', color: '#64748b',
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        }}>
                            {VOL_LABEL[point.volume] ?? point.volume}
                        </span>
                        <span style={{
                            background: point.status === 'resolved' ? '#f1f4f9' : '#eef1fa',
                            color: point.status === 'resolved' ? '#64748b' : '#4263ac',
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        }}>
                            {point.status === 'pending' ? 'Sin equipo' :
                             point.status === 'in_process' ? 'En proceso' : 'Completado'}
                        </span>
                    </div>

                    {/* Notas */}
                    {point.notes && (
                        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                            {point.notes}
                        </p>
                    )}

                    {/* Reportado por */}
                    <div style={{
                        background: '#f8fafc', borderRadius: 10, padding: '9px 12px',
                        display: 'flex', gap: 14,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <User size={12} color="#94a3b8" strokeWidth={2} />
                            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{point.reporter_name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Phone size={12} color="#94a3b8" strokeWidth={2} />
                            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{point.reporter_phone}</span>
                        </div>
                    </div>
                </div>

                {/* ── Cuadrilla ── */}
                <div style={{
                    background: '#fff', borderRadius: 18, padding: 16,
                    boxShadow: '0 8px 22px rgba(16,24,40,.06)', marginBottom: 14,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', display: 'block' }}>
                                Cuadrilla
                            </span>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                {volunteers.length}/{target} voluntarios · {onWay} en camino · {arrived} en zona
                            </span>
                        </div>
                        <div style={{
                            background: '#eef1fa', color: '#4263ac',
                            fontSize: 15, fontWeight: 800, padding: '5px 12px', borderRadius: 10,
                        }}>
                            {volunteers.length}
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div style={{ height: 6, borderRadius: 999, background: '#f1f4f9', marginBottom: 14, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 999, background: '#4263ac',
                            width: `${progress}%`, transition: 'width .4s ease',
                        }} />
                    </div>

                    {/* Lista de voluntarios */}
                    {volunteers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: 13 }}>
                            <Users size={28} color="#e2e8f0" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 8px' }} />
                            Sé el primero en apuntarte
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                            {volunteers.map((v, i) => {
                                const st = STATUS_LABEL[v.status] ?? STATUS_LABEL.confirmed;
                                const StIcon = st.icon;
                                const next = NEXT_STATUS[v.status];
                                return (
                                    <div key={v.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: '#f8fafc', borderRadius: 12, padding: '10px 12px',
                                    }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                            background: PASTEL[i % PASTEL.length],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#3a4250' }}>
                                                {initials(v.name)}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                                                {v.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{v.phone}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                            <span style={{
                                                background: st.bg, color: st.color,
                                                fontSize: 10.5, fontWeight: 700,
                                                padding: '3px 8px', borderRadius: 999,
                                                display: 'flex', alignItems: 'center', gap: 3,
                                            }}>
                                                <StIcon size={10} color={st.color} strokeWidth={2} />
                                                {st.label}
                                            </span>
                                            {next && (
                                                <button
                                                    onClick={() => updateStatus(v, next)}
                                                    style={{
                                                        fontSize: 10, fontWeight: 700, color: '#4263ac',
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        padding: 0, fontFamily: 'inherit',
                                                    }}
                                                >
                                                    {NEXT_LABEL[v.status]}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Formulario de apuntarse */}
                    {point.status !== 'resolved' && (
                        signing ? (
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        border: '1.5px solid #e2e8f0', borderRadius: 12,
                                        padding: '10px 13px', fontSize: 14,
                                        fontFamily: 'inherit', color: '#1e293b',
                                    }}
                                    type="text" placeholder="Tu nombre completo *"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p style={{ fontSize: 11.5, color: '#CE6969', margin: 0 }}>{errors.name}</p>}
                                <input
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        border: '1.5px solid #e2e8f0', borderRadius: 12,
                                        padding: '10px 13px', fontSize: 14,
                                        fontFamily: 'inherit', color: '#1e293b',
                                    }}
                                    type="tel" placeholder="Tu teléfono *"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    required
                                />
                                {errors.phone && <p style={{ fontSize: 11.5, color: '#CE6969', margin: 0 }}>{errors.phone}</p>}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => setSigning(false)}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: 12,
                                            background: '#f1f4f9', border: 'none', fontWeight: 700,
                                            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b',
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            flex: 2, padding: '12px', borderRadius: 12,
                                            background: processing ? '#83A2DB' : '#4263ac',
                                            border: 'none', fontWeight: 700, fontSize: 13,
                                            cursor: processing ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit', color: '#fff',
                                        }}
                                    >
                                        {processing ? 'Apuntando…' : 'Confirmar apunte'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setSigning(true)}
                                style={{
                                    width: '100%', padding: '13px', borderRadius: 13,
                                    background: '#0f172a', border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: 14, color: '#fff',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Me apunto a esta jornada
                            </button>
                        )
                    )}
                </div>

                {/* ── Tareas de la jornada ── */}
                <div style={{
                    background: '#fff', borderRadius: 18, padding: 16,
                    boxShadow: '0 8px 22px rgba(16,24,40,.06)',
                }}>
                    <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', display: 'block' }}>
                            Plan de trabajo
                        </span>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                            Secuencia de tareas para completar la jornada
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {tasks.map((task, i) => {
                            const isDone = point.status === 'resolved';
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 12px', borderRadius: 11,
                                    background: isDone ? '#f8fafc' : '#fff',
                                    border: '1.5px solid #f1f4f9',
                                }}>
                                    {isDone
                                        ? <CheckCircle size={17} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0 }} />
                                        : <Circle size={17} color="#cbd5e1" strokeWidth={2} style={{ flexShrink: 0 }} />
                                    }
                                    <span style={{
                                        fontSize: 13, fontWeight: 600,
                                        color: isDone ? '#94a3b8' : '#1e293b',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                    }}>
                                        {i + 1}. {task}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
