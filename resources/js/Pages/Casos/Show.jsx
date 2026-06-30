import { useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import {
    ArrowLeft, Check, CheckCircle, Circle, Phone, MessageCircle,
    Utensils, Droplets, Pill, Shirt, Home, Baby, Wrench,
    FileText, Package, MapPin, Users, Clock, User, Lock, ShieldAlert,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:20, padding:'20px' };
const SEC  = { margin:'0 0 12px', fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' };
const DIV  = { height:1, background:'#f3f4f8', margin:'14px 0' };

// ─── Necesidades ──────────────────────────────────────────────────────────────
const NEED_META = {
    food:      { label:'Alimentos',    Icon:Utensils, bg:'#fef3e2', icon:'#b45309', urgency:'Crítica',  ubg:'#fef3e2', ucol:'#b45309' },
    water:     { label:'Agua',         Icon:Droplets, bg:'#e0f2fe', icon:'#0369a1', urgency:'Crítica',  ubg:'#fef3e2', ucol:'#b45309' },
    medicine:  { label:'Medicamentos', Icon:Pill,     bg:'#fce7f3', icon:'#9d174d', urgency:'Crítica',  ubg:'#fef3e2', ucol:'#b45309' },
    shelter:   { label:'Refugio',      Icon:Home,     bg:'#dcfce7', icon:'#15803d', urgency:'Alta',     ubg:'#fef9c3', ucol:'#92600e' },
    clothing:  { label:'Ropa',         Icon:Shirt,    bg:'#f3e8ff', icon:'#7e22ce', urgency:'Alta',     ubg:'#fef9c3', ucol:'#92600e' },
    baby:      { label:'Bebé',         Icon:Baby,     bg:'#fef9c3', icon:'#92600e', urgency:'Crítica',  ubg:'#fef3e2', ucol:'#b45309' },
    tools:     { label:'Herramientas', Icon:Wrench,   bg:'#f1f5f9', icon:'#475569', urgency:'Normal',   ubg:'#f1f4f9', ucol:'#64748b' },
    documents: { label:'Documentos',  Icon:FileText, bg:'#eff6ff', icon:'#1d4ed8', urgency:'Normal',   ubg:'#f1f4f9', ucol:'#64748b' },
    furniture: { label:'Mobiliario',  Icon:Package,  bg:'#f8fafc', icon:'#94a3b8', urgency:'Normal',   ubg:'#f1f4f9', ucol:'#64748b' },
    other:     { label:'Otro',         Icon:Package,  bg:'#f8fafc', icon:'#64748b', urgency:'Normal',   ubg:'#f1f4f9', ucol:'#64748b' },
};

const NEED_LABEL = { food:'Alimentación', water:'Agua', medicine:'Medicamentos', clothing:'Ropa', furniture:'Mobiliario', baby:'Bebé', tools:'Herramientas', documents:'Documentos', shelter:'Refugio', other:'Otro' };

const STATUS_MAP = {
    open:      { label:'Necesita ayuda', bg:'#fef3e2', col:'#b45309' },
    in_review: { label:'En evaluación',  bg:'#fef9c3', col:'#92600e' },
    adopted:   { label:'Apadrinado',     bg:'#eef1fa', col:'#4263ac' },
    resolved:  { label:'Cerrado',        bg:'#dcfce7', col:'#16a34a' },
    rejected:  { label:'Rechazado',      bg:'#f1f5f9', col:'#94a3b8' },
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

function initials(name = '') {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}
function daysAgo(dateStr) {
    return Math.max(1, Math.floor((Date.now() - new Date(dateStr)) / 86400000));
}
function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
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

    const complete = () => router.patch(`/casos/${caseId}/tareas/${task.id}/completar`);

    const isDone    = task.status === 'done';
    const isClaimed = task.status === 'claimed';
    const isPending = task.status === 'pending';

    return (
        <div style={{
            background: isDone ? '#f9fafb' : 'white',
            border: `1px solid ${isDone ? '#e2e8f0' : '#e9ebf1'}`,
            borderRadius: 16, padding:'14px 15px',
            opacity: isDone ? 0.75 : 1,
        }}>
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:bg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {isDone ? <CheckCircle size={18} color="#16a34a" strokeWidth={2}/> : <Icon size={18} color={icon} strokeWidth={2}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color: isDone ? '#94a3b8' : '#1e293b' }}>{task.title}</div>
                    {task.description && <div style={{ fontSize:11.5, color:'#94a3b8', marginTop:2 }}>{task.description}</div>}
                </div>
                <span style={{ background:ubg, color:ucol, fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:999, flexShrink:0 }}>{urgency}</span>
            </div>

            {(isClaimed || isDone) && (
                <div style={{ marginTop:11, padding:'9px 12px', background: isDone ? '#f0fdf4' : '#f8fafc', borderRadius:10, display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:PASTEL[idx % PASTEL.length], display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:10, fontWeight:700, color:'#3a4250' }}>{initials(task.volunteer_name)}</span>
                    </div>
                    <div style={{ flex:1 }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:'#1e293b' }}>{task.volunteer_name}</div>
                        <div style={{ fontSize:11, color: isDone ? '#16a34a' : '#94a3b8', fontWeight:600 }}>
                            {isDone ? '✓ Completada' : 'Se encargó'}
                        </div>
                    </div>
                    {isClaimed && (
                        <button onClick={complete} style={{ padding:'7px 12px', borderRadius:9, background:'#0f172a', border:'none', fontSize:11.5, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
                            Marcar lista ✓
                        </button>
                    )}
                </div>
            )}

            {revealed && familyPhone && (
                <div style={{ marginTop:10, padding:'11px 13px', background:'#eef1fa', borderRadius:11 }}>
                    <div style={{ fontSize:11.5, fontWeight:700, color:'#4263ac', marginBottom:8 }}>Contacto de la familia</div>
                    <div style={{ display:'flex', gap:8 }}>
                        <a href={`https://wa.me/${familyPhone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            style={{ flex:1, background:'#16a34a', color:'#fff', borderRadius:10, padding:'9px 0', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5, textDecoration:'none' }}>
                            <MessageCircle size={13} color="#fff"/> WhatsApp
                        </a>
                        <a href={`tel:${familyPhone}`}
                            style={{ flex:1, background:'#fff', color:'#1e293b', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'9px 0', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5, textDecoration:'none' }}>
                            <Phone size={13} color="#1e293b"/> Llamar
                        </a>
                    </div>
                </div>
            )}

            {isPending && (
                <div style={{ marginTop:11 }}>
                    {claiming ? (
                        <form onSubmit={claim} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                            <div style={{ background:'#fef9c3', borderRadius:9, padding:'8px 11px', fontSize:12, color:'#92600e', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                                <Lock size={12} color="#92600e"/> Al confirmar verás el teléfono de la familia
                            </div>
                            <input style={{ width:'100%', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:11, padding:'10px 13px', fontSize:13, fontFamily:'inherit', color:'#1e293b', outline:'none' }}
                                type="text" placeholder="Tu nombre completo *" value={data.volunteer_name} onChange={e => setData('volunteer_name', e.target.value)} required/>
                            <input style={{ width:'100%', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:11, padding:'10px 13px', fontSize:13, fontFamily:'inherit', color:'#1e293b', outline:'none' }}
                                type="tel" placeholder="Tu teléfono *" value={data.volunteer_phone} onChange={e => setData('volunteer_phone', e.target.value)} required/>
                            {(errors.volunteer_name || errors.volunteer_phone) && (
                                <p style={{ fontSize:11.5, color:'#CE6969', margin:0 }}>{errors.volunteer_name || errors.volunteer_phone}</p>
                            )}
                            <div style={{ display:'flex', gap:8 }}>
                                <button type="button" onClick={() => setClaiming(false)} style={{ flex:1, padding:'10px', borderRadius:11, background:'#f1f4f9', border:'none', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', color:'#64748b' }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} style={{ flex:2, padding:'10px', borderRadius:11, background: processing ? '#83A2DB' : '#4263ac', border:'none', fontSize:13, fontWeight:700, cursor: processing ? 'not-allowed' : 'pointer', fontFamily:'inherit', color:'#fff' }}>
                                    {processing ? 'Confirmando…' : 'Me encargo de esta tarea'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setClaiming(true)} style={{ width:'100%', padding:'10px', borderRadius:11, background:'#f8fafc', border:'1.5px dashed #cbd5e1', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', color:'#475569', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            <Circle size={13} color="#475569" strokeWidth={2}/> Yo me encargo de esto
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function CasosShow({ supportCase, tasks }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const days        = daysAgo(supportCase.created_at);
    const displayName = supportCase.family_name ?? 'Familia';
    const avatarBg    = PASTEL[displayName.charCodeAt(0) % PASTEL.length];
    const status      = STATUS_MAP[supportCase.status] ?? STATUS_MAP.open;

    const taskList   = tasks ?? [];
    const totalTasks = taskList.length;
    const doneTasks  = taskList.filter(t => t.status === 'done').length;
    const takenTasks = taskList.filter(t => t.status !== 'pending').length;
    const progress   = totalTasks ? Math.round((takenTasks / totalTasks) * 100) : 0;

    const familyPhone = flash.contact_phone ?? null;
    const needs       = parseNeeds(supportCase.needs);

    return (
        <MainLayout>
            <div style={{ padding:'0 4px 40px', fontFamily:"'Onest', system-ui, sans-serif" }}>

                {/* Back */}
                <Link href="/casos" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:'#64748b', textDecoration:'none', marginBottom:16 }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Tablero
                </Link>

                {flash.success && (
                    <div style={{ background:'#dcfce7', color:'#15803d', borderRadius:11, padding:'10px 13px', fontSize:13, fontWeight:600, marginBottom:14 }}>
                        {flash.success}
                    </div>
                )}

                {/* ─── Layout 2 columnas ─── */}
                <div className="va-show-grid">

                    {/* Columna izquierda — Perfil + Situación */}
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

                        {/* Perfil */}
                        <div style={CARD}>
                            <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                                {supportCase.photo_path ? (
                                    <img src={`/storage/${supportCase.photo_path}`} alt="" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                                ) : (
                                    <div style={{ width:52, height:52, borderRadius:'50%', flexShrink:0, background:avatarBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#3a4250' }}>
                                        {initials(displayName)}
                                    </div>
                                )}
                                <div style={{ flex:1, minWidth:0 }}>
                                    <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:'#1e293b', letterSpacing:'-.4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                        {displayName}
                                    </h1>
                                    <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
                                        <MapPin size={11} color="#94a3b8" strokeWidth={2}/>
                                        <span style={{ fontSize:11.5, color:'#94a3b8' }}>
                                            {[supportCase.zone, supportCase.state].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                </div>
                                <span style={{ flexShrink:0, background:status.bg, color:status.col, fontSize:10.5, fontWeight:700, padding:'4px 10px', borderRadius:999 }}>
                                    {status.label}
                                </span>
                            </div>

                            {/* Stats rápidos */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:14 }}>
                                {[
                                    { Icon:Users, val:`${supportCase.people_count ?? '?'} pers.` },
                                    { Icon:Clock, val:`${days}d sin ayuda`                        },
                                    { Icon:Check, val:`${doneTasks}/${totalTasks} tareas`         },
                                ].map(({ Icon, val }) => (
                                    <div key={val} style={{ background:'#f8fafc', borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
                                        <Icon size={13} color="#94a3b8" strokeWidth={2} style={{ display:'block', margin:'0 auto 3px' }}/>
                                        <span style={{ fontSize:10.5, fontWeight:700, color:'#64748b' }}>{val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Barra de progreso */}
                            {totalTasks > 0 && (
                                <div style={{ marginTop:12 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                                        <span style={{ fontSize:10.5, color:'#7b8595', fontWeight:600 }}>Progreso</span>
                                        <span style={{ fontSize:10.5, color: progress===100 ? '#16a34a' : '#4263ac', fontWeight:700 }}>{progress}%</span>
                                    </div>
                                    <div style={{ height:5, borderRadius:999, background:'#f1f4f9', overflow:'hidden' }}>
                                        <div style={{ height:'100%', borderRadius:999, background: progress===100 ? '#16a34a' : '#4263ac', width:`${progress}%`, transition:'width .4s' }}/>
                                    </div>
                                </div>
                            )}

                            {/* Condiciones */}
                            <div style={{ ...DIV }}/>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                {supportCase.case_type === 'personal' && (
                                    <span style={{ fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:999, background:'#f3e8ff', color:'#7e22ce' }}>Personal</span>
                                )}
                                {supportCase.has_children && (
                                    <span style={{ fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:999, background:'#fef9c3', color:'#92600e', display:'flex', alignItems:'center', gap:4 }}>
                                        <Baby size={11} strokeWidth={2}/> Hay niños
                                    </span>
                                )}
                                {supportCase.has_elderly && (
                                    <span style={{ fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:999, background:'#dfe6f4', color:'#4263ac', display:'flex', alignItems:'center', gap:4 }}>
                                        <Users size={11} strokeWidth={2}/> Adultos mayores
                                    </span>
                                )}
                                {supportCase.has_risk && (
                                    <span style={{ fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:999, background:'#fce7f3', color:'#9d174d', display:'flex', alignItems:'center', gap:4 }}>
                                        <ShieldAlert size={11} strokeWidth={2}/> Situación de riesgo
                                    </span>
                                )}
                            </div>

                            {/* Necesidades */}
                            {needs.length > 0 && (
                                <>
                                    <div style={DIV}/>
                                    <p style={SEC}>¿Qué necesitan?</p>
                                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                        {needs.map(n => (
                                            <span key={n} style={{ background:'#f1f4f9', color:'#334155', fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:999 }}>
                                                {NEED_LABEL[n] ?? n}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Situación */}
                        {supportCase.description && (
                            <div style={CARD}>
                                <p style={SEC}>Su situación</p>
                                <p style={{ margin:0, fontSize:13.5, color:'#334155', lineHeight:1.65 }}>
                                    {supportCase.description}
                                </p>
                            </div>
                        )}

                        {/* Info coordinadores */}
                        <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'11px 14px', background:'#eef1fa', borderRadius:14, border:'1px solid #d0d9f0' }}>
                            <User size={13} color="#4263ac" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
                            <p style={{ margin:0, fontSize:11.5, color:'#4263ac', lineHeight:1.5 }}>
                                Los coordinadores supervisan las tareas. Al tomarla recibes el contacto de la familia.
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha — Tareas */}
                    <div>
                        {/* Header */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                            <span style={{ fontSize:15, fontWeight:700, color:'#1e293b' }}>
                                Tareas ({takenTasks}/{totalTasks} tomadas)
                            </span>
                            <span style={{ fontSize:11.5, color:'#94a3b8', fontWeight:600 }}>{progress}% cubierto</span>
                        </div>

                        {/* Mini estado — 3 chips */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
                            {[
                                { key:'pending', label:'Sin hacer',  color:'#64748b', bg:'#f1f5f9', dot:'#94a3b8' },
                                { key:'claimed', label:'Haciendo',   color:'#4263ac', bg:'#eef1fa', dot:'#4263ac' },
                                { key:'done',    label:'Terminadas', color:'#16a34a', bg:'#dcfce7', dot:'#16a34a' },
                            ].map(({ key, label, color, bg, dot }) => {
                                const count = taskList.filter(t => t.status === key).length;
                                const items = taskList.filter(t => t.status === key);
                                return (
                                    <div key={key} style={{ background:bg, borderRadius:14, padding:'12px 13px' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: items.length ? 8 : 0 }}>
                                            <div style={{ width:7, height:7, borderRadius:'50%', background:dot, flexShrink:0 }}/>
                                            <span style={{ fontSize:11, fontWeight:700, color, flex:1, textTransform:'uppercase', letterSpacing:'.4px' }}>{label}</span>
                                            <span style={{ fontSize:13, fontWeight:800, color }}>{count}</span>
                                        </div>
                                        {items.map(t => (
                                            <div key={t.id} style={{ fontSize:11, fontWeight:600, color, padding:'4px 8px', background:'rgba(255,255,255,.6)', borderRadius:7, marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                                {t.title}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tarjetas — 2 columnas */}
                        {taskList.length === 0 ? (
                            <div style={{ ...CARD, textAlign:'center', color:'#94a3b8', fontSize:13 }}>
                                No hay tareas aún.
                            </div>
                        ) : (
                            <div className="va-tasks-2col">
                                {taskList.map((task, i) => (
                                    <TaskCard key={task.id} task={task} caseId={supportCase.id} familyPhone={familyPhone} idx={i}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
