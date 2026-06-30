import { useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import {
    ArrowLeft, Check, CheckCircle, Circle, Phone, MessageCircle,
    Utensils, Droplets, Pill, Shirt, Home, Baby, Wrench,
    FileText, Package, MapPin, Users, Clock, User, Lock,
} from 'lucide-react';

/* ─── Metadatos por tipo de necesidad ───────────────────────────────── */
const NEED_META = {
    food:      { label: 'Alimentos',    Icon: Utensils,  bg: '#fef3e2', icon: '#b45309', urgency: 'Crítica',  ubg: '#fef3e2', ucol: '#b45309' },
    water:     { label: 'Agua',         Icon: Droplets,  bg: '#e0f2fe', icon: '#0369a1', urgency: 'Crítica',  ubg: '#fef3e2', ucol: '#b45309' },
    medicine:  { label: 'Medicamentos', Icon: Pill,      bg: '#fce7f3', icon: '#9d174d', urgency: 'Crítica',  ubg: '#fef3e2', ucol: '#b45309' },
    shelter:   { label: 'Refugio',      Icon: Home,      bg: '#dcfce7', icon: '#15803d', urgency: 'Alta',     ubg: '#fef9c3', ucol: '#92600e' },
    clothing:  { label: 'Ropa',         Icon: Shirt,     bg: '#f3e8ff', icon: '#7e22ce', urgency: 'Alta',     ubg: '#fef9c3', ucol: '#92600e' },
    baby:      { label: 'Bebé',         Icon: Baby,      bg: '#fef9c3', icon: '#92600e', urgency: 'Crítica',  ubg: '#fef3e2', ucol: '#b45309' },
    tools:     { label: 'Herramientas', Icon: Wrench,    bg: '#f1f5f9', icon: '#475569', urgency: 'Normal',   ubg: '#f1f4f9', ucol: '#64748b' },
    documents: { label: 'Documentos',  Icon: FileText,  bg: '#eff6ff', icon: '#1d4ed8', urgency: 'Normal',   ubg: '#f1f4f9', ucol: '#64748b' },
    furniture: { label: 'Mobiliario',  Icon: Package,   bg: '#f8fafc', icon: '#94a3b8', urgency: 'Normal',   ubg: '#f1f4f9', ucol: '#64748b' },
    other:     { label: 'Otro',         Icon: Package,   bg: '#f8fafc', icon: '#64748b', urgency: 'Normal',   ubg: '#f1f4f9', ucol: '#64748b' },
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

function initials(name = '') {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function daysAgo(dateStr) {
    return Math.max(1, Math.floor((Date.now() - new Date(dateStr)) / 86400000));
}

/* ─── Tarjeta de tarea ──────────────────────────────────────────────── */
function TaskCard({ task, caseId, familyPhone, idx }) {
    const meta  = NEED_META[task.need_key] ?? NEED_META.other;
    const { Icon, bg, icon, urgency, ubg, ucol } = meta;
    const [claiming, setClaiming] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        volunteer_name:  '',
        volunteer_phone: '',
    });

    const claim = (e) => {
        e.preventDefault();
        post(`/casos/${caseId}/tareas/${task.id}/tomar`, {
            onSuccess: () => { reset(); setClaiming(false); setRevealed(true); },
        });
    };

    const complete = () => {
        router.patch(`/casos/${caseId}/tareas/${task.id}/completar`);
    };

    const isDone    = task.status === 'done';
    const isClaimed = task.status === 'claimed';
    const isPending = task.status === 'pending';

    return (
        <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(16,24,40,.06)',
            padding: '14px 15px',
            opacity: isDone ? 0.7 : 1,
            border: isDone ? '1.5px solid #dcfce7' : '1.5px solid transparent',
        }}>
            {/* Fila principal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                {/* Ícono */}
                <div style={{
                    width: 40, height: 40, borderRadius: 11, background: bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {isDone
                        ? <CheckCircle size={20} color="#16a34a" strokeWidth={2} />
                        : <Icon size={20} color={icon} strokeWidth={2} />
                    }
                </div>

                {/* Título + urgencia */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDone ? '#94a3b8' : '#1e293b', lineHeight: 1.3 }}>
                        {task.title}
                    </div>
                    {task.description && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, lineHeight: 1.4 }}>
                            {task.description}
                        </div>
                    )}
                </div>

                {/* Urgencia */}
                <span style={{
                    background: ubg, color: ucol,
                    fontSize: 10, fontWeight: 700,
                    padding: '3px 9px', borderRadius: 999, flexShrink: 0,
                }}>
                    {urgency}
                </span>
            </div>

            {/* Estado del padrino */}
            {(isClaimed || isDone) && (
                <div style={{
                    marginTop: 11, padding: '9px 12px',
                    background: isDone ? '#f0fdf4' : '#f8fafc',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', gap: 9,
                }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: PASTEL[idx % PASTEL.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#3a4250' }}>
                            {initials(task.volunteer_name)}
                        </span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>
                            {task.volunteer_name}
                        </div>
                        <div style={{ fontSize: 11, color: isDone ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                            {isDone ? '✓ Tarea completada' : 'Se encargó de esta tarea'}
                        </div>
                    </div>
                    {isClaimed && (
                        <button
                            onClick={complete}
                            style={{
                                padding: '7px 12px', borderRadius: 9,
                                background: '#0f172a', border: 'none',
                                fontSize: 11.5, fontWeight: 700, color: '#fff',
                                cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                            }}
                        >
                            Marcar lista ✓
                        </button>
                    )}
                </div>
            )}

            {/* Contacto de la familia (cuando el padrino acaba de tomar la tarea) */}
            {revealed && familyPhone && (
                <div style={{
                    marginTop: 10, padding: '11px 13px',
                    background: '#eef1fa', borderRadius: 11,
                }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4263ac', marginBottom: 8 }}>
                        Contacto de la familia (solo para ti)
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <a
                            href={`https://wa.me/${familyPhone?.replace(/\D/g, '')}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                flex: 1, background: '#16a34a', color: '#fff',
                                borderRadius: 10, padding: '9px 0',
                                fontSize: 12.5, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                textDecoration: 'none',
                            }}
                        >
                            <MessageCircle size={14} color="#fff" /> WhatsApp
                        </a>
                        <a
                            href={`tel:${familyPhone}`}
                            style={{
                                flex: 1, background: '#fff', color: '#1e293b',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: 10, padding: '9px 0',
                                fontSize: 12.5, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                textDecoration: 'none',
                            }}
                        >
                            <Phone size={14} color="#1e293b" /> Llamar
                        </a>
                    </div>
                </div>
            )}

            {/* Formulario de tomar tarea */}
            {isPending && (
                <div style={{ marginTop: 11 }}>
                    {claiming ? (
                        <form onSubmit={claim} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{
                                background: '#fef9c3', borderRadius: 9, padding: '8px 11px',
                                fontSize: 12, color: '#92600e', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                <Lock size={12} color="#92600e" />
                                Al confirmar verás el teléfono de la familia
                            </div>
                            <input
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    border: '1.5px solid #e2e8f0', borderRadius: 11,
                                    padding: '10px 13px', fontSize: 13.5,
                                    fontFamily: 'inherit', color: '#1e293b',
                                }}
                                type="text" placeholder="Tu nombre completo *"
                                value={data.volunteer_name}
                                onChange={e => setData('volunteer_name', e.target.value)}
                                required
                            />
                            <input
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    border: '1.5px solid #e2e8f0', borderRadius: 11,
                                    padding: '10px 13px', fontSize: 13.5,
                                    fontFamily: 'inherit', color: '#1e293b',
                                }}
                                type="tel" placeholder="Tu teléfono *"
                                value={data.volunteer_phone}
                                onChange={e => setData('volunteer_phone', e.target.value)}
                                required
                            />
                            {(errors.volunteer_name || errors.volunteer_phone) && (
                                <p style={{ fontSize: 11.5, color: '#CE6969', margin: 0 }}>
                                    {errors.volunteer_name || errors.volunteer_phone}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button type="button" onClick={() => setClaiming(false)} style={{
                                    flex: 1, padding: '10px', borderRadius: 11,
                                    background: '#f1f4f9', border: 'none',
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: 'inherit', color: '#64748b',
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} style={{
                                    flex: 2, padding: '10px', borderRadius: 11,
                                    background: processing ? '#83A2DB' : '#4263ac', border: 'none',
                                    fontSize: 13, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                                    fontFamily: 'inherit', color: '#fff',
                                }}>
                                    {processing ? 'Confirmando…' : 'Me encargo de esta tarea'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setClaiming(true)} style={{
                            width: '100%', padding: '11px', borderRadius: 11,
                            background: '#f8fafc', border: '1.5px dashed #cbd5e1',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'inherit', color: '#475569',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}>
                            <Circle size={14} color="#475569" strokeWidth={2} />
                            Yo me encargo de esto
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Página principal ──────────────────────────────────────────────── */
export default function CasosShow({ supportCase, tasks }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const days        = daysAgo(supportCase.created_at);
    const displayName = supportCase.family_name ?? 'Familia';
    const avatarBg    = PASTEL[displayName.charCodeAt(0) % PASTEL.length];

    const taskList   = tasks ?? [];
    const totalTasks = taskList.length;
    const doneTasks  = taskList.filter(t => t.status === 'done').length;
    const takenTasks = taskList.filter(t => t.status !== 'pending').length;
    const progress   = totalTasks ? Math.round((takenTasks / totalTasks) * 100) : 0;

    // family phone exposed only via flash (claimed task)
    const familyPhone = flash.contact_phone ?? null;

    return (
        <MainLayout>
            <div style={{ padding: '14px 16px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>

                {/* Back */}
                <Link href="/casos" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none',
                    marginBottom: 16,
                }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5} />
                    Tablero
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

                {/* ── Encabezado ── */}
                <div style={{
                    background: '#fff', borderRadius: 18,
                    boxShadow: '0 8px 22px rgba(16,24,40,.06)',
                    padding: 16, marginBottom: 14,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                        {supportCase.photo_path ? (
                            <img src={supportCase.photo_path} alt="Foto" style={{
                                width: 56, height: 56, borderRadius: '50%',
                                objectFit: 'cover', flexShrink: 0,
                            }} />
                        ) : (
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                                background: avatarBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, fontWeight: 700, color: '#3a4250',
                            }}>
                                {initials(displayName)}
                            </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-.4px' }}>
                                {displayName}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                                <MapPin size={11} color="#94a3b8" strokeWidth={2} />
                                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                    {[supportCase.zone, supportCase.state].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                        {/* Status badge */}
                        <span style={{
                            flexShrink: 0,
                            background: supportCase.status === 'resolved' ? '#dcfce7' :
                                        supportCase.status === 'adopted'  ? '#eef1fa' : '#fef3e2',
                            color:      supportCase.status === 'resolved' ? '#15803d' :
                                        supportCase.status === 'adopted'  ? '#4263ac' : '#b45309',
                            fontSize: 11, fontWeight: 700,
                            padding: '4px 10px', borderRadius: 999,
                        }}>
                            {supportCase.status === 'resolved' ? 'Resuelto' :
                             supportCase.status === 'adopted'  ? 'En proceso' : 'Necesita ayuda'}
                        </span>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
                        {[
                            { icon: Users, value: `${supportCase.people_count ?? '?'} personas` },
                            { icon: Clock, value: `${days}d sin ayuda` },
                            { icon: Check, value: `${doneTasks}/${totalTasks} tareas` },
                        ].map(({ icon: Icon, value }) => (
                            <div key={value} style={{
                                flex: 1, background: '#f8fafc', borderRadius: 10,
                                padding: '8px 10px', textAlign: 'center',
                            }}>
                                <Icon size={14} color="#94a3b8" strokeWidth={2} style={{ display: 'block', margin: '0 auto 3px' }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Situación ── */}
                {supportCase.description && (
                    <div style={{
                        background: '#fff', borderRadius: 16,
                        boxShadow: '0 4px 14px rgba(16,24,40,.05)',
                        padding: '14px 16px', marginBottom: 14,
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 8 }}>
                            Su Situación
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.65 }}>
                            {supportCase.description}
                        </p>
                    </div>
                )}

                {/* ── Tareas ── */}
                {taskList.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                                Tareas ({takenTasks}/{totalTasks} tomadas)
                            </span>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                                {progress}% cubierto
                            </span>
                        </div>

                        {/* Barra de progreso */}
                        <div style={{ height: 6, borderRadius: 999, background: '#f1f4f9', marginBottom: 12, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 999,
                                background: progress === 100 ? '#16a34a' : '#4263ac',
                                width: `${progress}%`, transition: 'width .4s ease',
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {taskList.map((task, i) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    caseId={supportCase.id}
                                    familyPhone={familyPhone}
                                    idx={i}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Mensaje admin/coordinador ── */}
                <div style={{
                    background: '#eef1fa', borderRadius: 14, padding: '12px 14px', marginBottom: 14,
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                    <User size={14} color="#4263ac" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: 12, color: '#4263ac', lineHeight: 1.5 }}>
                        Los coordinadores y administradores supervisan que las tareas sean cumplidas por los padrinos.
                        Al tomar una tarea recibes el contacto directo de la familia.
                    </p>
                </div>

            </div>
        </MainLayout>
    );
}
