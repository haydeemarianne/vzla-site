import MainLayout from '@/Layouts/MainLayout';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Trash2, MapPin, User, Phone, CheckCircle,
    Circle, Car, Navigation, Clock, Users, ChevronRight
} from 'lucide-react';

const TYPE_LABEL  = { domestic: 'Basura doméstica', debris: 'Escombros', both: 'Basura + Escombros' };
const VOL_LABEL   = { low: 'Poco volumen', medium: 'Volumen medio', high: 'Alto volumen' };
const VOL_COLOR   = { low: '#16a34a', medium: '#b45309', high: '#CE6969' };

const VOL_STATUS = {
    confirmed:  { label: 'Confirmado', color: '#4263ac', bg: '#eef1fa', Icon: Clock      },
    on_the_way: { label: 'En camino',  color: '#b45309', bg: '#fef3e2', Icon: Car        },
    arrived:    { label: 'En zona',    color: '#0e7490', bg: '#e0f2fe', Icon: Navigation },
    done:       { label: 'Terminó',    color: '#16a34a', bg: '#dcfce7', Icon: CheckCircle },
};
const NEXT_STATUS = { confirmed: 'on_the_way', on_the_way: 'arrived', arrived: 'done', done: null };
const NEXT_LABEL  = { confirmed: 'En camino →', on_the_way: 'Ya llegué →', arrived: 'Terminé →' };

const POINT_STATUS = {
    pending:    { bg: '#eef1fa', color: '#4263ac', label: 'Sin equipo'  },
    in_process: { bg: '#fef3e2', color: '#b45309', label: 'En proceso'  },
    resolved:   { bg: '#dcfce7', color: '#15803d', label: 'Completado'  },
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];
const CARD   = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '18px 20px' };
const SEC    = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };

function initials(name) {
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export default function LimpiezaShow({ point, volunteers, tasks }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const [signing, setSigning] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ name: '', phone: '' });

    const submit = (e) => {
        e.preventDefault();
        post(`/limpieza/${point.id}/voluntario`, { onSuccess: () => { reset(); setSigning(false); } });
    };

    const updateStatus = (volunteer, next) => {
        router.patch(`/limpieza/${point.id}/voluntario/${volunteer.id}/status`, { status: next });
    };

    const confirmed  = volunteers.filter(v => v.status === 'confirmed').length;
    const onWay      = volunteers.filter(v => v.status === 'on_the_way').length;
    const arrived    = volunteers.filter(v => v.status === 'arrived').length;
    const done       = volunteers.filter(v => v.status === 'done').length;
    const target     = 10;
    const pct        = Math.min(100, (volunteers.length / target) * 100);
    const pStatus    = POINT_STATUS[point.status] || POINT_STATUS.pending;
    const volColor   = VOL_COLOR[point.volume] || '#b45309';
    const resolved   = point.status === 'resolved';

    const MINI_STATS = [
        { Icon: Clock,       label: 'Confirmados', count: confirmed,  color: '#4263ac' },
        { Icon: Car,         label: 'En camino',   count: onWay,      color: '#b45309' },
        { Icon: Navigation,  label: 'En zona',     count: arrived,    color: '#0e7490' },
        { Icon: CheckCircle, label: 'Terminaron',  count: done,       color: '#16a34a' },
    ];

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Back */}
                <Link href="/limpieza" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none' }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Limpieza
                </Link>

                {/* Flash */}
                {flash.success && (
                    <div style={{ background: '#dcfce7', color: '#15803d', borderRadius: 11, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                        {flash.success}
                    </div>
                )}

                <div className="va-show-grid">

                    {/* ── Columna izquierda: info del punto ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={CARD}>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 14 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Trash2 size={20} color="#16a34a" strokeWidth={2}/>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-.4px', lineHeight: 1.2 }}>
                                        {point.zone_name}
                                    </h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                        <MapPin size={10} color="#94a3b8" strokeWidth={2}/>
                                        <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
                                            {[point.city, point.state].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chips */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                                <span style={{ background: pStatus.bg, color: pStatus.color, fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{pStatus.label}</span>
                                <span style={{ background: '#fef3e2', color: '#b45309', fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{TYPE_LABEL[point.type] ?? point.type}</span>
                                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#f1f4f9', color: volColor }}>{VOL_LABEL[point.volume] ?? point.volume}</span>
                            </div>

                            {/* Notas */}
                            {point.notes && (
                                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{point.notes}</p>
                            )}

                            {/* Foto */}
                            {point.photo_path && (
                                <img src={`/storage/${point.photo_path}`} alt="Punto de limpieza"
                                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 13, border: '1px solid #e9ebf1', marginBottom: 14 }}/>
                            )}

                            <div style={{ height: 1, background: '#f3f4f8', marginBottom: 12 }}/>
                            <p style={{ ...SEC, marginBottom: 9 }}>Reportado por</p>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <User size={11} color="#94a3b8" strokeWidth={2}/>
                                    <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600 }}>{point.reporter_name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Phone size={11} color="#94a3b8" strokeWidth={2}/>
                                    <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600 }}>{point.reporter_phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Columna derecha ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Plan de trabajo — 2 cols compacto */}
                        <div style={CARD}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <p style={SEC}>Plan de trabajo</p>
                                {resolved && (
                                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 999 }}>
                                        Completado
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
                                {tasks.map((task, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 10, background: resolved ? '#f8fafc' : '#fafbfc', border: '1px solid #f1f4f9' }}>
                                        {resolved
                                            ? <CheckCircle size={13} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0 }}/>
                                            : <Circle size={13} color="#cbd5e1" strokeWidth={2} style={{ flexShrink: 0 }}/>
                                        }
                                        <span style={{ fontSize: 11.5, fontWeight: 600, color: resolved ? '#94a3b8' : '#334155', lineHeight: 1.3, textDecoration: resolved ? 'line-through' : 'none' }}>
                                            {i + 1}. {task}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cuadrilla */}
                        <div style={CARD}>
                            {/* Header + barra */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <p style={SEC}>Cuadrilla</p>
                                <span style={{ background: '#eef1fa', color: '#4263ac', fontSize: 13, fontWeight: 800, padding: '3px 11px', borderRadius: 9 }}>
                                    {volunteers.length}/{target}
                                </span>
                            </div>
                            <div style={{ height: 4, borderRadius: 999, background: '#f1f4f9', overflow: 'hidden', marginBottom: 12 }}>
                                <div style={{ height: '100%', background: pct >= 100 ? '#16a34a' : '#4263ac', borderRadius: 999, width: `${pct}%`, transition: 'width .4s' }}/>
                            </div>

                            {/* Mini stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 14 }}>
                                {MINI_STATS.map(({ Icon, label, count, color }) => (
                                    <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 6px', textAlign: 'center', border: '1px solid #f1f4f9' }}>
                                        <Icon size={13} color={count > 0 ? color : '#cbd5e1'} strokeWidth={2} style={{ display: 'block', margin: '0 auto 4px' }}/>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: count > 0 ? color : '#cbd5e1', lineHeight: 1 }}>{count}</div>
                                        <div style={{ fontSize: 9.5, fontWeight: 600, color: '#94a3b8', marginTop: 2, lineHeight: 1.2 }}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Lista compacta */}
                            {volunteers.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '14px 0', color: '#94a3b8', fontSize: 13 }}>
                                    <Users size={24} color="#e2e8f0" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 6px' }}/>
                                    Sé el primero en apuntarte
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                                    {volunteers.map((v, i) => {
                                        const st   = VOL_STATUS[v.status] ?? VOL_STATUS.confirmed;
                                        const next = NEXT_STATUS[v.status];
                                        return (
                                            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 10, background: '#f8fafc', border: '1px solid #f1f4f9' }}>
                                                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: PASTEL[i % PASTEL.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#3a4250' }}>{initials(v.name)}</span>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>{v.name}</span>
                                                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>{v.phone}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                                    <span style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                        <st.Icon size={9} color={st.color} strokeWidth={2}/> {st.label}
                                                    </span>
                                                    {next && (
                                                        <button onClick={() => updateStatus(v, next)} style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: '#4263ac', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                                                            {NEXT_LABEL[v.status]} <ChevronRight size={10} color="#4263ac"/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Apuntarse */}
                            {!resolved && (
                                signing ? (
                                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <input style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b' }}
                                            type="text" placeholder="Tu nombre completo *"
                                            value={data.name} onChange={e => setData('name', e.target.value)} required/>
                                        {errors.name && <p style={{ fontSize: 11, color: '#CE6969', margin: 0 }}>{errors.name}</p>}
                                        <input style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1e293b' }}
                                            type="tel" placeholder="Tu teléfono *"
                                            value={data.phone} onChange={e => setData('phone', e.target.value)} required/>
                                        {errors.phone && <p style={{ fontSize: 11, color: '#CE6969', margin: 0 }}>{errors.phone}</p>}
                                        <div style={{ display: 'flex', gap: 7 }}>
                                            <button type="button" onClick={() => setSigning(false)} style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#f1f4f9', border: 'none', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>
                                                Cancelar
                                            </button>
                                            <button type="submit" disabled={processing} style={{ flex: 2, padding: '10px', borderRadius: 11, background: processing ? '#83A2DB' : '#4263ac', border: 'none', fontWeight: 700, fontSize: 12.5, cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: 'white' }}>
                                                {processing ? 'Apuntando…' : 'Confirmar apunte'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setSigning(true)} style={{ width: '100%', padding: '10px', borderRadius: 11, background: '#0f172a', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: 'white', fontFamily: 'inherit' }}>
                                        Me apunto a esta jornada
                                    </button>
                                )
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
