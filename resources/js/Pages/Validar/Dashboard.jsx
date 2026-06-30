import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Upload, Calendar, Check, X } from 'lucide-react';

/* ─── helpers ─── */
const PASTEL = ['#e7dcf2','#dfe6f4','#d6e8e0','#f0d6d6','#f3e2cf','#fde68a'];
const initials = (name) =>
    name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';
const pastel = (i) => PASTEL[i % PASTEL.length];

/* ─── inline SVGs ─── */
const DblCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#2b3340" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 13 6 17.5 13.5 8"/>
        <path d="M10.5 15.5 12 17l8.5-9.5"/>
    </svg>
);

const ThreeDots = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#aab2bf">
        <circle cx="5" cy="12" r="1.9"/>
        <circle cx="12" cy="12" r="1.9"/>
        <circle cx="19" cy="12" r="1.9"/>
    </svg>
);

const PlusCircle = () => (
    <div style={{
        width:'42px', height:'42px', borderRadius:'50%',
        border:'1px solid #eef0f5', background:'#fbfcfe',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
        <Plus size={18} color="#9aa4b3" strokeWidth={2}/>
    </div>
);

const CalCircle = () => (
    <div style={{
        width:'36px', height:'36px', borderRadius:'50%',
        border:'1.5px solid #e6e9f0', background:'white',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
        <Calendar size={14} color="#7b8595" strokeWidth={1.8}/>
    </div>
);

const AvatarCircle = ({ label, bg, size = 42, fontSize = 13 }) => (
    <div style={{
        width:`${size}px`, height:`${size}px`, borderRadius:'50%',
        background: bg, display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, fontSize:`${fontSize}px`, fontWeight:700, color:'#3a4250',
    }}>
        {label}
    </div>
);

const StatusPill = ({ status }) => {
    const cfg = {
        pending:   { bg:'#fbeaea', color:'#CE6969', label:'Pendiente' },
        approved:  { bg:'#e6f7ed', color:'#2a7a4b', label:'Aprobado'  },
        rejected:  { bg:'#f3f4f8', color:'#64748b', label:'Rechazado' },
        duplicate: { bg:'#eff6ff', color:'#3b6eb5', label:'Duplicado' },
    };
    const c = cfg[status] || cfg.pending;
    return (
        <span style={{
            display:'inline-block', padding:'3px 10px',
            borderRadius:'999px', fontSize:'11px', fontWeight:600,
            background: c.bg, color: c.color,
        }}>
            {c.label}
        </span>
    );
};

const Donut = ({ value, pct, color, label }) => (
    <div style={{ textAlign:'center' }}>
        <div style={{ position:'relative', width:'118px', height:'118px', margin:'0 auto' }}>
            <div style={{
                width:'118px', height:'118px', borderRadius:'50%',
                background:`conic-gradient(${color} 0% ${pct}, #eef1f6 ${pct} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
            }}>
                <div style={{
                    width:'84px', height:'84px', borderRadius:'50%', background:'white',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'26px', fontWeight:700, color:'#2b3340',
                }}>
                    {value}
                </div>
            </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginTop:'10px' }}>
            <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:color }}/>
            <span style={{ fontSize:'13px', fontWeight:600, color:'#5b6677' }}>{label}</span>
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ValidarDashboard({
    admin_email,
    pending_children,
    pending_engineers,
    pending_zones,
    pending_cases,
    pending_volunteers,
    pending_adoptions,
}) {
    const [activeTab, setActiveTab] = useState('cases');

    const safeCases      = pending_cases      ?? [];
    const safeVolunteers = pending_volunteers ?? [];
    const safeChildren   = pending_children   ?? [];
    const safeEngineers  = pending_engineers  ?? [];
    const safeZones      = pending_zones      ?? [];
    const safeAdoptions  = pending_adoptions  ?? [];

    const totalPending =
        safeChildren.length + safeEngineers.length + safeZones.length +
        safeCases.length + safeVolunteers.length + safeAdoptions.length;

    const approvedVal = 47;
    const pendingPct  = `${Math.min(99, Math.round((totalPending / Math.max(1, totalPending + approvedVal)) * 100))}%`;
    const approvedPct = '84%';

    const act = (action, type, id) => {
        router.post(`/validar/${action}`, { type, id }, { preserveScroll: true });
    };

    const TABS = [
        { key: 'cases',      label: 'Casos',       count: safeCases.length,      type: 'support_case'   },
        { key: 'adoptions',  label: 'Padrinos',    count: safeAdoptions.length,  type: 'adoption'       },
        { key: 'engineers',  label: 'Ingenieros',  count: safeEngineers.length,  type: 'engineer'       },
        { key: 'zones',      label: 'Zonas',       count: safeZones.length,      type: 'zone'           },
        { key: 'volunteers', label: 'Voluntarios', count: safeVolunteers.length, type: 'case_volunteer' },
        { key: 'children',   label: 'Personas',    count: safeChildren.length,   type: 'child'          },
    ];

    const activeTabCfg = TABS.find((t) => t.key === activeTab);
    const activeItems = {
        cases: safeCases, engineers: safeEngineers, zones: safeZones,
        volunteers: safeVolunteers, children: safeChildren,
        adoptions: safeAdoptions,
    }[activeTab] || [];

    const actAdoption = (action, id) => {
        const path = action === 'approve' ? 'aprobar' : 'rechazar';
        router.post(`/validar/padrinos/${id}/${path}`, {}, { preserveScroll: true });
    };

    const boardAvatars = safeCases.slice(0, 5).length
        ? safeCases.slice(0, 5).map((c, i) => ({ label: initials(c.family_name || c.name || '?'), bg: pastel(i) }))
        : [{ label:'MA', bg:'#e7dcf2' }, { label:'CR', bg:'#dfe6f4' }, { label:'FP', bg:'#d6e8e0' }];

    const itemName = (item, key) => {
        if (key === 'cases') return item.family_name || item.name || 'Sin nombre';
        if (key === 'zones') return item.zone_name   || item.name || 'Sin nombre';
        return item.name || 'Sin nombre';
    };

    const fmtDate = (d) => {
        if (!d) return '—';
        const dt = new Date(d);
        return isNaN(dt) ? d : dt.toLocaleDateString('es-VE', { day:'2-digit', month:'short' });
    };

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* ── Título ── */}
                <div>
                    <h1 style={{ margin:0, fontSize:28, fontWeight:800, letterSpacing:'-1px', color:'#1a2230' }}>
                        Panel de validación
                    </h1>
                    <p style={{ margin:'4px 0 0', fontSize:13, color:'#7b8595' }}>
                        {totalPending > 0
                            ? `${totalPending} elemento${totalPending !== 1 ? 's' : ''} pendiente${totalPending !== 1 ? 's' : ''} de revisión`
                            : 'Todo al día — sin pendientes'}
                    </p>
                </div>

                {/* ── Journey Board ── */}
                <div style={{
                    background:'linear-gradient(180deg,#fafbfd,#edeff5)',
                    border:'1px solid #e6e9f0', borderRadius:28, padding:24,
                    boxShadow:'0 24px 60px -28px rgba(16,24,40,.2)',
                }}>
                    {/* Board header */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
                        <span style={{ fontSize:18, fontWeight:700, color:'#2b3340', paddingTop:6 }}>
                            Recorrido del caso
                        </span>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                            {/* Avatar stack */}
                            <div style={{ display:'flex', alignItems:'center' }}>
                                {boardAvatars.map((av, i) => (
                                    <div key={i} style={{
                                        width:48, height:48, borderRadius:'50%', background:av.bg,
                                        border:'3px solid white', marginLeft: i===0?0:'-10px',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:14, fontWeight:700, color:'#3a4250',
                                        zIndex: boardAvatars.length - i, position:'relative',
                                    }}>
                                        {av.label}
                                    </div>
                                ))}
                            </div>
                            {[<Plus size={18}/>, <Upload size={17}/>, <Calendar size={17}/>].map((icon, i) => (
                                <div key={i} style={{
                                    width:46, height:46, borderRadius:'50%',
                                    background:'white', border:'1px solid #e6e9f0',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor:'pointer', color:'#5b6677',
                                }}>
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Board columns */}
                    <div style={{ display:'flex', gap:24, marginTop:24, overflowX:'auto', paddingBottom:8, alignItems:'flex-start' }}>

                        {/* Recepción */}
                        <div style={{ flexShrink:0, width:252 }}>
                            <div style={{ background:'white', borderRadius:22, padding:16, boxShadow:'0 14px 34px rgba(16,24,40,.07)' }}>
                                {[0, 1].map((idx) => (
                                    <div key={idx}>
                                        {idx > 0 && <div style={{ height:1, background:'#f0f2f6', margin:'18px 0' }}/>}
                                        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'space-between' }}>
                                            <AvatarCircle label={safeCases[idx] ? initials(safeCases[idx].family_name || safeCases[idx].name) : ['MA','CR'][idx]} bg={pastel(idx)} size={46} fontSize={14}/>
                                            <div style={{ display:'flex', alignItems:'center', gap:8 }}><DblCheck/><CalCircle/></div>
                                        </div>
                                        <p style={{ fontSize:13.5, fontWeight:500, color:'#3a4250', marginTop:18, marginBottom:0 }}>
                                            {idx === 0 ? 'Asignar caso a validador' : 'Confirmar recepción a la familia'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:13.5, fontWeight:500, color:'#7b8595', marginTop:16 }}>Recepción</p>
                        </div>

                        {/* Verificación */}
                        <div style={{ flexShrink:0, width:300 }}>
                            <div style={{ background:'white', borderRadius:22, padding:'8px 14px', boxShadow:'0 14px 34px rgba(16,24,40,.07)' }}>
                                {[
                                    { label:'CR', bg:'#f3e2cf', text:'Verificar identidad',           done:true  },
                                    { label:'FP', bg:'#dfe6f4', text:'Verificar urgencia',             done:true  },
                                    { label:'ML', bg:'#d6e8e0', text:'Verificar ubicación',            done:true  },
                                    { label:null, bg:null,      text:'Asignar a equipo de zona',       done:false, bold:true },
                                    { label:null, bg:null,      text:'Avisar estimación a la familia', done:false, bold:true },
                                ].map((row, i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 4px', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                        {row.label ? <AvatarCircle label={row.label} bg={row.bg} size={42} fontSize={13}/> : <PlusCircle/>}
                                        <span style={{ flex:1, fontSize:13.5, color:'#3a4250', fontWeight: row.bold?700:400 }}>{row.text}</span>
                                        {row.done ? <div style={{ display:'flex', alignItems:'center', gap:6 }}><DblCheck/><CalCircle/></div> : <ThreeDots/>}
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:13.5, fontWeight:500, color:'#7b8595', marginTop:16 }}>Verificación</p>
                        </div>

                        {/* Asignación */}
                        <div style={{ flexShrink:0, width:300 }}>
                            <div style={{ background:'white', borderRadius:22, padding:'8px 14px', boxShadow:'0 14px 34px rgba(16,24,40,.07)' }}>
                                {[
                                    { label:null,  bg:null,      text:'Buscar padrino',             bold:false },
                                    { label:null,  bg:null,      text:'Confirmar disponibilidad',   bold:false },
                                    { label:'AM',  bg:'#e7dcf2', text:'Estimar tiempo',             bold:true  },
                                    { label:'LR',  bg:'#fde68a', text:'Compartir contacto privado', bold:true  },
                                    { label:null,  bg:null,      text:'Marcar como apadrinado',     bold:true  },
                                ].map((row, i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 4px', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                        {row.label ? <AvatarCircle label={row.label} bg={row.bg} size={42} fontSize={13}/> : <PlusCircle/>}
                                        <span style={{ flex:1, fontSize:13.5, color:'#3a4250', fontWeight: row.bold?700:400 }}>{row.text}</span>
                                        <ThreeDots/>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:13.5, fontWeight:500, color:'#7b8595', marginTop:16 }}>Asignación</p>
                        </div>

                        {/* Seguimiento */}
                        <div style={{ flexShrink:0, width:320 }}>
                            <div style={{ position:'relative', height:48 }}>
                                <svg width="40" height="60" viewBox="0 0 40 60" fill="none" style={{ position:'absolute', left:'-30px', top:6 }}>
                                    <path d="M2 4c16 2 20 24 34 24" stroke="#2b3340" strokeWidth="2" fill="none" strokeLinecap="round"/>
                                    <path d="M33 24l5 4-6 2.5" fill="#2b3340"/>
                                </svg>
                                <div style={{
                                    position:'absolute', left:0, top:0, width:138, height:84,
                                    background:'#0f172a', borderRadius:20, color:'white',
                                    display:'flex', alignItems:'center', padding:'0 18px',
                                    fontSize:14.5, fontWeight:600, lineHeight:1.25,
                                    boxShadow:'0 18px 34px -10px rgba(2,6,23,.55)',
                                }}>
                                    En revisión
                                </div>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
                                {[
                                    { text:'Entrega confirmada',        check:true  },
                                    { text:'Comunicación con familia',  check:true  },
                                    { text:'Notificación a la familia', check:true  },
                                    { text:'Caso resuelto',             check:true  },
                                    { text:'Verificación en campo',     check:false },
                                    { text:'Cierre y reporte',          check:false },
                                ].map((card, i) => (
                                    <div key={i} style={{ background:'white', borderRadius:16, padding:14, minHeight:90, display:'flex', flexDirection:'column', gap:11, boxShadow:'0 12px 28px rgba(16,24,40,.06)' }}>
                                        {card.check ? (
                                            <div style={{ width:34, height:34, borderRadius:'50%', background:'#e6ecf6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                <Check size={15} color="#4b6aa0" strokeWidth={2.2}/>
                                            </div>
                                        ) : (
                                            <div style={{ width:34, height:34, borderRadius:'50%', border:'1px solid #eef0f5', background:'#fbfcfe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                <Plus size={14} color="#9aa4b3" strokeWidth={2}/>
                                            </div>
                                        )}
                                        <span style={{ fontSize:12.5, fontWeight:500, color:'#3a4250', lineHeight:1.35 }}>{card.text}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:13.5, fontWeight:500, color:'#7b8595', marginTop:16 }}>Seguimiento</p>
                        </div>

                    </div>
                </div>

                {/* ── Fila inferior: Cola + Estado ── */}
                <div className="va-validar-bottom">

                    {/* Cola de validación */}
                    <div style={{ padding:'20px 22px', background:'white', border:'1px solid #e9ebf1', borderRadius:24 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:12 }}>
                            <span style={{ fontSize:16, fontWeight:700, color:'#2b3340' }}>Cola de validación</span>
                            <div style={{ display:'flex', gap:8 }}>
                                {[<Plus size={14}/>, <Upload size={14}/>].map((icon, i) => (
                                    <div key={i} style={{ width:34, height:34, borderRadius:'50%', border:'1px solid #e6e9f0', background:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#5b6677' }}>
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:4 }}>
                            {TABS.map((tab) => {
                                const isA = activeTab === tab.key;
                                return (
                                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                        display:'flex', alignItems:'center', gap:5,
                                        padding:'5px 11px', borderRadius:999, border:'none',
                                        cursor:'pointer', fontSize:12, fontWeight:600,
                                        background: isA ? '#0f172a' : '#f3f4f8',
                                        color:      isA ? 'white'   : '#64748b',
                                        transition:'all .15s', fontFamily:'inherit',
                                    }}>
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span style={{ fontSize:10, fontWeight:700, background: isA?'rgba(255,255,255,.22)':'#fef3c7', color: isA?'white':'#92400e', padding:'1px 6px', borderRadius:999 }}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Table header */}
                        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr .8fr', padding:'16px 6px 10px', fontSize:11, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', color:'#9aa4b3' }}>
                            {activeTab === 'adoptions'
                                ? <span>Padrino → Caso</span>
                                : <span>Nombre</span>}
                            <span>Estado</span><span>Recibido</span><span>Acciones</span>
                        </div>

                        {/* Rows */}
                        {activeItems.length === 0 ? (
                            <p style={{ textAlign:'center', color:'#9aa4b3', fontSize:13, padding:'20px 0' }}>Sin elementos pendientes.</p>
                        ) : activeTab === 'adoptions' ? (
                            safeAdoptions.map((item) => (
                                <div key={item.id} style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr .8fr', alignItems:'center', padding:'11px 6px', borderTop:'1px solid #f3f4f8' }}>
                                    <div style={{ paddingRight:8, minWidth:0 }}>
                                        <span style={{ fontSize:13, fontWeight:600, color:'#2b3340', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {item.volunteer?.name || 'Sin nombre'}
                                        </span>
                                        <span style={{ fontSize:11, color:'#94a3b8', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            → {item.support_case?.is_anonymous ? 'Familia anónima' : (item.support_case?.family_name || 'Caso')}
                                            {item.support_case?.zone ? ` · ${item.support_case.zone}` : ''}
                                        </span>
                                    </div>
                                    <StatusPill status={item.status === 'active' ? 'approved' : item.status}/>
                                    <span style={{ fontSize:12.5, color:'#7b8595' }}>{fmtDate(item.created_at)}</span>
                                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                        <button title="Aprobar" onClick={() => actAdoption('approve', item.id)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #d1fae5', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                                            <Check size={14} color="#16a34a" strokeWidth={2.2}/>
                                        </button>
                                        <button title="Rechazar" onClick={() => actAdoption('reject', item.id)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #e2e8f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                                            <X size={14} color="#64748b" strokeWidth={2.2}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            activeItems.map((item) => (
                                <div key={item.id} style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr .8fr', alignItems:'center', padding:'11px 6px', borderTop:'1px solid #f3f4f8' }}>
                                    <span style={{ fontSize:13, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>
                                        {itemName(item, activeTab)}
                                    </span>
                                    <StatusPill status={item.validation_status || 'pending'}/>
                                    <span style={{ fontSize:12.5, color:'#7b8595' }}>{fmtDate(item.created_at)}</span>
                                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                        <button title="Aprobar" onClick={() => act('approve', activeTabCfg?.type, item.id)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #d1fae5', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                                            <Check size={14} color="#16a34a" strokeWidth={2.2}/>
                                        </button>
                                        <button title="Rechazar" onClick={() => act('reject', activeTabCfg?.type, item.id)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #e2e8f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                                            <X size={14} color="#64748b" strokeWidth={2.2}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Estado de la cola */}
                    <div style={{ padding:'20px 22px', background:'white', border:'1px solid #e9ebf1', borderRadius:24 }}>
                        <span style={{ fontSize:16, fontWeight:700, color:'#2b3340' }}>Estado de la cola</span>
                        <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-start', gap:14, marginTop:20, flexWrap:'wrap' }}>
                            <Donut value={approvedVal} pct={approvedPct} color="#83A2DB" label="Validados"/>
                            <Donut value={totalPending} pct={pendingPct} color="#CE6969" label="Pendientes"/>
                        </div>
                        <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:8 }}>
                            {TABS.map((tab) => tab.count > 0 && (
                                <div key={tab.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12.5 }}>
                                    <span style={{ color:'#5b6677' }}>{tab.label}</span>
                                    <span style={{ fontWeight:700, color:'#2b3340', background:'#f3f4f8', borderRadius:999, padding:'2px 10px', fontSize:12 }}>{tab.count}</span>
                                </div>
                            ))}
                            {totalPending === 0 && <p style={{ textAlign:'center', color:'#9aa4b3', fontSize:13, marginTop:8 }}>Todo al día ✓</p>}
                        </div>
                    </div>

                </div>

            </div>
        </MainLayout>
    );
}
