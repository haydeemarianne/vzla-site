import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Share2, Upload, Star, Plus, Smartphone, Database,
    Calendar, Send, AlertTriangle, Settings, Heart, Search, Mail,
    Bell, Check, X,
} from 'lucide-react';

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

/* ─── CalCircle: small calendar circle used in board rows ─── */
const CalCircle = () => (
    <div style={{
        width:'36px', height:'36px', borderRadius:'50%',
        border:'1.5px solid #e6e9f0', background:'white',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
        <Calendar size={14} color="#7b8595" strokeWidth={1.8}/>
    </div>
);

/* ─── Avatar circle for board ─── */
const AvatarCircle = ({ label, bg, size = 42, fontSize = 13 }) => (
    <div style={{
        width:`${size}px`, height:`${size}px`, borderRadius:'50%',
        background: bg, display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, fontSize:`${fontSize}px`, fontWeight:700, color:'#3a4250',
    }}>
        {label}
    </div>
);

/* ─── Status pill for validation table ─── */
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

/* ─── Donut chart ─── */
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

/* ─── Icon rail circle ─── */
const RailCircle = ({ children, dark = false, style = {} }) => (
    <div style={{
        width:'42px', height:'42px', borderRadius:'50%',
        background: dark ? '#0f172a' : 'white',
        boxShadow: dark ? 'none' : '0 3px 10px rgba(16,24,40,.05)',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, position:'relative', cursor:'pointer',
        ...style,
    }}>
        {children}
    </div>
);

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ValidarDashboard({
    validator,
    token,
    pending_children,
    pending_engineers,
    pending_zones,
    pending_cases,
    pending_volunteers,
}) {
    const [activeTab, setActiveTab] = useState('cases');

    const safeCases      = pending_cases      ?? [];
    const safeVolunteers = pending_volunteers ?? [];
    const safeChildren   = pending_children   ?? [];
    const safeEngineers  = pending_engineers  ?? [];
    const safeZones      = pending_zones      ?? [];

    const totalPending =
        safeChildren.length + safeEngineers.length + safeZones.length +
        safeCases.length + safeVolunteers.length;

    const approvedVal = 47; // visual placeholder
    const pendingPct  = `${Math.min(99, Math.round((totalPending / Math.max(1, totalPending + approvedVal)) * 100))}%`;
    const approvedPct = '84%';

    /* action helper */
    const act = (action, type, id, body = {}) => {
        router.post(`/validar/${token}/${action}`, { type, id, ...body }, { preserveScroll: true });
    };

    /* tab config */
    const TABS = [
        { key: 'cases',      label: 'Casos',       count: safeCases.length,      type: 'support_case' },
        { key: 'engineers',  label: 'Ingenieros',  count: safeEngineers.length,  type: 'engineer'     },
        { key: 'zones',      label: 'Zonas',       count: safeZones.length,      type: 'zone'         },
        { key: 'volunteers', label: 'Voluntarios', count: safeVolunteers.length, type: 'case_volunteer'},
        { key: 'children',   label: 'Personas',    count: safeChildren.length,   type: 'child'        },
    ];

    const activeTabCfg = TABS.find((t) => t.key === activeTab);
    const activeItems = {
        cases:      safeCases,
        engineers:  safeEngineers,
        zones:      safeZones,
        volunteers: safeVolunteers,
        children:   safeChildren,
    }[activeTab] || [];

    /* board avatar stack — up to 5 from pending_cases */
    const boardAvatars = safeCases.slice(0, 5).length
        ? safeCases.slice(0, 5).map((c, i) => ({ label: initials(c.family_name || c.name || '?'), bg: pastel(i) }))
        : [
            { label: 'MA', bg: '#e7dcf2' },
            { label: 'CR', bg: '#dfe6f4' },
            { label: 'FP', bg: '#d6e8e0' },
          ];

    /* helper: get display name for an item */
    const itemName = (item, key) => {
        if (key === 'cases')      return item.family_name || item.name || 'Sin nombre';
        if (key === 'zones')      return item.zone_name || item.name  || 'Sin nombre';
        return item.name || 'Sin nombre';
    };

    /* helper: format date */
    const fmtDate = (d) => {
        if (!d) return '—';
        const dt = new Date(d);
        if (isNaN(dt)) return d;
        return dt.toLocaleDateString('es-VE', { day:'2-digit', month:'short' });
    };

    const validatorInitials = initials(validator?.name || 'V');

    /* ── render ── */
    return (
        <div style={{
            minHeight:'100vh',
            background:'linear-gradient(180deg,#eef0f4,#e3e6ee)',
            display:'flex',
            gap:'16px',
            padding:'20px 26px 36px',
            fontFamily:"'Onest',system-ui,sans-serif",
            color:'#0f172a',
        }}>

            {/* ════════ ICON RAIL ════════ */}
            <div style={{
                display:'flex', flexDirection:'column', alignItems:'center',
                gap:'13px', paddingTop:'4px', flexShrink:0,
            }}>
                <RailCircle><ArrowLeft size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Share2   size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Upload   size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Star     size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Plus     size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Smartphone size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Database   size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Calendar   size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>
                <RailCircle><Send       size={18} color="#5b6677" strokeWidth={1.9}/></RailCircle>

                {/* AlertTriangle with coral dot */}
                <RailCircle>
                    <AlertTriangle size={18} color="#5b6677" strokeWidth={1.9}/>
                    <div style={{
                        position:'absolute', top:'8px', right:'9px',
                        width:'7px', height:'7px', borderRadius:'50%',
                        background:'#CE6969', border:'1.5px solid white',
                    }}/>
                </RailCircle>

                {/* spacer */}
                <div style={{ flex:1 }}/>

                {/* Settings — black circle */}
                <RailCircle dark>
                    <Settings size={18} color="white" strokeWidth={1.9}/>
                </RailCircle>
            </div>

            {/* ════════ CONTENT COLUMN ════════ */}
            <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>

                {/* ── TOP NAV ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px' }}>

                    {/* Logo */}
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                        <div style={{
                            width:'34px', height:'34px', borderRadius:'10px', background:'#83A2DB',
                            display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                            <Heart size={18} color="white" strokeWidth={2}/>
                        </div>
                        <span style={{ fontSize:'16px', fontWeight:700, color:'#1a2230', letterSpacing:'-0.3px' }}>
                            Venezuela <span style={{ color:'#83A2DB' }}>Site</span>
                        </span>
                    </div>

                    {/* Nav pills */}
                    <div style={{ display:'flex', alignItems:'center', gap:'2px' }}>
                        {['Casos','Limpieza','Ingenieros','Transporte','Validación','Reportes'].map((nav) => {
                            const active = nav === 'Validación';
                            return (
                                <button key={nav} style={{
                                    fontSize:'12px', fontWeight:600,
                                    padding:'8px 14px', borderRadius:'999px',
                                    border:'none', cursor:'pointer',
                                    background: active ? '#0f172a' : 'transparent',
                                    color: active ? 'white' : '#5b6677',
                                    boxShadow: active ? '0 18px 34px -10px rgba(2,6,23,.55)' : 'none',
                                    transition:'all .15s',
                                }}>
                                    {nav}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right actions */}
                    <div style={{ display:'flex', alignItems:'center', gap:'9px', flexShrink:0 }}>
                        {/* Search */}
                        <div style={{
                            width:'42px', height:'42px', borderRadius:'50%', background:'white',
                            boxShadow:'0 3px 10px rgba(16,24,40,.05)',
                            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                        }}>
                            <Search size={17} color="#5b6677" strokeWidth={1.9}/>
                        </div>

                        {/* Mail with dot */}
                        <div style={{
                            width:'42px', height:'42px', borderRadius:'50%', background:'white',
                            boxShadow:'0 3px 10px rgba(16,24,40,.05)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', position:'relative',
                        }}>
                            <Mail size={17} color="#5b6677" strokeWidth={1.9}/>
                            <div style={{
                                position:'absolute', top:'9px', right:'9px',
                                width:'8px', height:'8px', borderRadius:'50%',
                                background:'#CE6969', border:'1.5px solid white',
                            }}/>
                        </div>

                        {/* Bell with dot */}
                        <div style={{
                            width:'42px', height:'42px', borderRadius:'50%', background:'white',
                            boxShadow:'0 3px 10px rgba(16,24,40,.05)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', position:'relative',
                        }}>
                            <Bell size={17} color="#5b6677" strokeWidth={1.9}/>
                            <div style={{
                                position:'absolute', top:'9px', right:'9px',
                                width:'8px', height:'8px', borderRadius:'50%',
                                background:'#CE6969', border:'1.5px solid white',
                            }}/>
                        </div>

                        {/* Avatar */}
                        <div style={{
                            width:'42px', height:'42px', borderRadius:'50%', background:'#e7dcf2',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'14px', fontWeight:700, color:'#3a4250', cursor:'pointer',
                            flexShrink:0,
                        }}>
                            {validatorInitials}
                        </div>
                    </div>
                </div>

                {/* ── TITLE ── */}
                <h1 style={{
                    fontSize:'34px', fontWeight:700, letterSpacing:'-1px',
                    color:'#1a2230', marginTop:'20px', marginBottom:0,
                }}>
                    Recorrido del caso
                </h1>

                {/* ── JOURNEY BOARD ── */}
                <div style={{
                    background:'linear-gradient(180deg,#fafbfd,#edeff5)',
                    border:'1px solid #e6e9f0',
                    borderRadius:'28px',
                    padding:'24px',
                    boxShadow:'0 24px 60px -28px rgba(16,24,40,.2)',
                    marginTop:'16px',
                }}>

                    {/* Board header */}
                    <div style={{
                        display:'flex', alignItems:'flex-start', justifyContent:'space-between',
                        gap:'16px', flexWrap:'wrap',
                    }}>
                        <span style={{ fontSize:'18px', fontWeight:700, color:'#2b3340', paddingTop:'6px' }}>
                            Gestión de casos nuevos
                        </span>

                        {/* Right: avatars + buttons */}
                        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                            {/* Avatar stack */}
                            <div style={{ display:'flex', alignItems:'center' }}>
                                {boardAvatars.map((av, i) => (
                                    <div key={i} style={{
                                        width:'48px', height:'48px', borderRadius:'50%',
                                        background: av.bg,
                                        border:'3px solid white',
                                        marginLeft: i === 0 ? 0 : '-10px',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:'14px', fontWeight:700, color:'#3a4250',
                                        zIndex: boardAvatars.length - i,
                                        position:'relative',
                                    }}>
                                        {av.label}
                                    </div>
                                ))}
                            </div>

                            {/* 3 icon buttons */}
                            {[<Plus size={18}/>, <Upload size={17}/>, <Calendar size={17}/>].map((icon, i) => (
                                <div key={i} style={{
                                    width:'46px', height:'46px', borderRadius:'50%',
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
                    <div style={{
                        display:'flex', gap:'24px', marginTop:'24px',
                        overflowX:'auto', paddingBottom:'8px', alignItems:'flex-start',
                    }}>

                        {/* ── COLUMNA 1: Recepción ── */}
                        <div style={{ flexShrink:0, width:'252px' }}>
                            <div style={{
                                background:'white', borderRadius:'22px', padding:'16px',
                                boxShadow:'0 14px 34px rgba(16,24,40,.07)',
                            }}>
                                {/* Row 1 */}
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'space-between' }}>
                                    <AvatarCircle
                                        label={safeCases[0] ? initials(safeCases[0].family_name || safeCases[0].name) : 'MA'}
                                        bg={pastel(0)}
                                        size={46} fontSize={14}
                                    />
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                        <DblCheck/>
                                        <CalCircle/>
                                    </div>
                                </div>
                                <p style={{ fontSize:'13.5px', fontWeight:500, color:'#3a4250', marginTop:'18px' }}>
                                    Asignar caso a validador
                                </p>

                                <div style={{ height:'1px', background:'#f0f2f6', margin:'18px 0' }}/>

                                {/* Row 2 */}
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'space-between' }}>
                                    <AvatarCircle
                                        label={safeCases[1] ? initials(safeCases[1].family_name || safeCases[1].name) : 'CR'}
                                        bg={pastel(1)}
                                        size={46} fontSize={14}
                                    />
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                        <DblCheck/>
                                        <CalCircle/>
                                    </div>
                                </div>
                                <p style={{ fontSize:'13.5px', fontWeight:500, color:'#3a4250', marginTop:'18px' }}>
                                    Confirmar recepción a la familia
                                </p>
                            </div>
                            <p style={{ textAlign:'center', fontSize:'13.5px', fontWeight:500, color:'#7b8595', marginTop:'16px' }}>
                                Recepción
                            </p>
                        </div>

                        {/* ── COLUMNA 2: Verificación ── */}
                        <div style={{ flexShrink:0, width:'300px' }}>
                            <div style={{
                                background:'white', borderRadius:'22px', padding:'8px 14px',
                                boxShadow:'0 14px 34px rgba(16,24,40,.07)',
                            }}>
                                {[
                                    { label:'CR', bg:'#f3e2cf', text:'Verificar identidad',         done:true  },
                                    { label:'FP', bg:'#dfe6f4', text:'Verificar urgencia',           done:true  },
                                    { label:'ML', bg:'#d6e8e0', text:'Verificar ubicación',          done:true  },
                                    { label:null, bg:null,      text:'Asignar a equipo de zona',     done:false, bold:true },
                                    { label:null, bg:null,      text:'Avisar estimación a la familia', done:false, bold:true },
                                ].map((row, i) => (
                                    <div key={i} style={{
                                        display:'flex', alignItems:'center', gap:'11px',
                                        padding:'11px 4px',
                                        borderTop: i === 0 ? 'none' : '1px solid #f3f4f8',
                                    }}>
                                        {row.label
                                            ? <AvatarCircle label={row.label} bg={row.bg} size={42} fontSize={13}/>
                                            : <PlusCircle/>
                                        }
                                        <span style={{
                                            flex:1, fontSize:'13.5px', color:'#3a4250',
                                            fontWeight: row.bold ? 700 : 400,
                                        }}>
                                            {row.text}
                                        </span>
                                        {row.done ? (
                                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                                                <DblCheck/><CalCircle/>
                                            </div>
                                        ) : (
                                            <ThreeDots/>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:'13.5px', fontWeight:500, color:'#7b8595', marginTop:'16px' }}>
                                Verificación
                            </p>
                        </div>

                        {/* ── COLUMNA 3: Asignación ── */}
                        <div style={{ flexShrink:0, width:'300px' }}>
                            <div style={{
                                background:'white', borderRadius:'22px', padding:'8px 14px',
                                boxShadow:'0 14px 34px rgba(16,24,40,.07)',
                            }}>
                                {[
                                    { label:null,  bg:null,      text:'Buscar padrino',              bold:false },
                                    { label:null,  bg:null,      text:'Confirmar disponibilidad',    bold:false },
                                    { label:'AM',  bg:'#e7dcf2', text:'Estimar tiempo',              bold:true  },
                                    { label:'LR',  bg:'#fde68a', text:'Compartir contacto privado',  bold:true  },
                                    { label:null,  bg:null,      text:'Marcar como apadrinado',      bold:true  },
                                ].map((row, i) => (
                                    <div key={i} style={{
                                        display:'flex', alignItems:'center', gap:'11px',
                                        padding:'11px 4px',
                                        borderTop: i === 0 ? 'none' : '1px solid #f3f4f8',
                                    }}>
                                        {row.label
                                            ? <AvatarCircle label={row.label} bg={row.bg} size={42} fontSize={13}/>
                                            : <PlusCircle/>
                                        }
                                        <span style={{
                                            flex:1, fontSize:'13.5px', color:'#3a4250',
                                            fontWeight: row.bold ? 700 : 400,
                                        }}>
                                            {row.text}
                                        </span>
                                        <ThreeDots/>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:'13.5px', fontWeight:500, color:'#7b8595', marginTop:'16px' }}>
                                Asignación
                            </p>
                        </div>

                        {/* ── COLUMNA 4: Seguimiento ── */}
                        <div style={{ flexShrink:0, width:'320px' }}>
                            {/* Curved arrow + black pill */}
                            <div style={{ position:'relative', height:'48px' }}>
                                <svg width="40" height="60" viewBox="0 0 40 60" fill="none"
                                    style={{ position:'absolute', left:'-30px', top:'6px' }}>
                                    <path d="M2 4c16 2 20 24 34 24" stroke="#2b3340" strokeWidth="2"
                                        fill="none" strokeLinecap="round"/>
                                    <path d="M33 24l5 4-6 2.5" fill="#2b3340"/>
                                </svg>
                                <div style={{
                                    position:'absolute', left:0, top:0,
                                    width:'138px', height:'84px',
                                    background:'#0f172a', borderRadius:'20px',
                                    color:'white', display:'flex', alignItems:'center',
                                    padding:'0 18px', fontSize:'14.5px', fontWeight:600,
                                    lineHeight:1.25,
                                    boxShadow:'0 18px 34px -10px rgba(2,6,23,.55)',
                                }}>
                                    En revisión
                                </div>
                            </div>

                            {/* 2x3 grid */}
                            <div style={{
                                display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px',
                                marginTop:'14px',
                            }}>
                                {[
                                    { text:'Entrega confirmada',         check:true  },
                                    { text:'Comunicación con familia',   check:true  },
                                    { text:'Notificación a la familia',  check:true  },
                                    { text:'Caso resuelto',              check:true  },
                                    { text:'Verificación en campo',      check:false },
                                    { text:'Cierre y reporte',           check:false },
                                ].map((card, i) => (
                                    <div key={i} style={{
                                        background:'white', borderRadius:'16px', padding:'14px',
                                        minHeight:'90px', display:'flex', flexDirection:'column',
                                        gap:'11px', boxShadow:'0 12px 28px rgba(16,24,40,.06)',
                                    }}>
                                        {card.check ? (
                                            <div style={{
                                                width:'34px', height:'34px', borderRadius:'50%',
                                                background:'#e6ecf6',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                <Check size={15} color="#4b6aa0" strokeWidth={2.2}/>
                                            </div>
                                        ) : (
                                            <div style={{
                                                width:'34px', height:'34px', borderRadius:'50%',
                                                border:'1px solid #eef0f5', background:'#fbfcfe',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                <Plus size={14} color="#9aa4b3" strokeWidth={2}/>
                                            </div>
                                        )}
                                        <span style={{
                                            fontSize:'12.5px', fontWeight:500, color:'#3a4250', lineHeight:1.35,
                                        }}>
                                            {card.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign:'center', fontSize:'13.5px', fontWeight:500, color:'#7b8595', marginTop:'16px' }}>
                                Seguimiento
                            </p>
                        </div>

                    </div>{/* end board columns */}
                </div>{/* end Journey Board */}

                {/* ── BOTTOM ROW ── */}
                <div style={{ display:'grid', gridTemplateColumns:'1.55fr 1fr', gap:'16px', marginTop:'18px' }}>

                    {/* ── Cola de validación ── */}
                    <div style={{
                        padding:'20px 22px', background:'white',
                        border:'1px solid #e9ebf1', borderRadius:'24px',
                    }}>
                        {/* Header */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
                            <span style={{ fontSize:'16px', fontWeight:700, color:'#2b3340' }}>
                                Cola de validación
                            </span>
                            <div style={{ display:'flex', gap:'8px' }}>
                                {[<Plus size={14}/>, <Upload size={14}/>].map((icon, i) => (
                                    <div key={i} style={{
                                        width:'34px', height:'34px', borderRadius:'50%',
                                        border:'1px solid #e6e9f0', background:'white',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        cursor:'pointer', color:'#5b6677',
                                    }}>
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display:'flex', gap:'4px', marginTop:'12px', flexWrap:'wrap' }}>
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            display:'flex', alignItems:'center', gap:'5px',
                                            padding:'5px 11px', borderRadius:'999px', border:'none',
                                            cursor:'pointer', fontSize:'12px', fontWeight:600,
                                            background: isActive ? '#0f172a' : '#f3f4f8',
                                            color:      isActive ? 'white'    : '#64748b',
                                            transition:'all .15s',
                                        }}>
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span style={{
                                                fontSize:'10px', fontWeight:700,
                                                background: isActive ? 'rgba(255,255,255,.22)' : '#fef3c7',
                                                color:      isActive ? 'white' : '#92400e',
                                                padding:'1px 6px', borderRadius:'999px',
                                            }}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Table header */}
                        <div style={{
                            display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr .8fr',
                            padding:'16px 6px 10px',
                            fontSize:'11px', fontWeight:600, letterSpacing:'.4px',
                            textTransform:'uppercase', color:'#9aa4b3',
                        }}>
                            <span>Nombre</span>
                            <span>Estado</span>
                            <span>Recibido</span>
                            <span>Acciones</span>
                        </div>

                        {/* Table rows */}
                        {activeItems.length === 0 ? (
                            <p style={{ textAlign:'center', color:'#9aa4b3', fontSize:'13px', padding:'20px 0' }}>
                                Sin elementos pendientes.
                            </p>
                        ) : activeItems.map((item) => (
                            <div key={item.id} style={{
                                display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr .8fr',
                                alignItems:'center', padding:'11px 6px',
                                borderTop:'1px solid #f3f4f8',
                            }}>
                                {/* Name */}
                                <span style={{
                                    fontSize:'13px', fontWeight:600, color:'#2b3340',
                                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                                    paddingRight:'8px',
                                }}>
                                    {itemName(item, activeTab)}
                                </span>

                                {/* Status */}
                                <StatusPill status={item.validation_status || 'pending'}/>

                                {/* Date */}
                                <span style={{ fontSize:'12.5px', color:'#7b8595' }}>
                                    {fmtDate(item.created_at)}
                                </span>

                                {/* Actions */}
                                <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                                    <button
                                        title="Aprobar"
                                        onClick={() => act('approve', activeTabCfg?.type, item.id)}
                                        style={{
                                            width:'28px', height:'28px', borderRadius:'50%',
                                            border:'1.5px solid #d1fae5', background:'#f0fdf4',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            cursor:'pointer',
                                        }}>
                                        <Check size={14} color="#16a34a" strokeWidth={2.2}/>
                                    </button>
                                    <button
                                        title="Rechazar"
                                        onClick={() => act('reject', activeTabCfg?.type, item.id)}
                                        style={{
                                            width:'28px', height:'28px', borderRadius:'50%',
                                            border:'1.5px solid #e2e8f0', background:'#f8fafc',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            cursor:'pointer',
                                        }}>
                                        <X size={14} color="#64748b" strokeWidth={2.2}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Estado de la cola ── */}
                    <div style={{
                        padding:'20px 22px', background:'white',
                        border:'1px solid #e9ebf1', borderRadius:'24px',
                    }}>
                        <span style={{ fontSize:'16px', fontWeight:700, color:'#2b3340' }}>
                            Estado de la cola
                        </span>

                        <div style={{
                            display:'flex', justifyContent:'center', alignItems:'flex-start',
                            gap:'14px', marginTop:'20px', flexWrap:'wrap',
                        }}>
                            <Donut
                                value={approvedVal}
                                pct={approvedPct}
                                color="#83A2DB"
                                label="Validados"
                            />
                            <Donut
                                value={totalPending}
                                pct={pendingPct}
                                color="#CE6969"
                                label="Pendientes"
                            />
                        </div>

                        {/* Summary text */}
                        <div style={{ marginTop:'20px', display:'flex', flexDirection:'column', gap:'8px' }}>
                            {TABS.map((tab) => tab.count > 0 && (
                                <div key={tab.key} style={{
                                    display:'flex', justifyContent:'space-between',
                                    alignItems:'center', fontSize:'12.5px',
                                }}>
                                    <span style={{ color:'#5b6677' }}>{tab.label}</span>
                                    <span style={{
                                        fontWeight:700, color:'#2b3340',
                                        background:'#f3f4f8', borderRadius:'999px',
                                        padding:'2px 10px', fontSize:'12px',
                                    }}>
                                        {tab.count}
                                    </span>
                                </div>
                            ))}
                            {totalPending === 0 && (
                                <p style={{ textAlign:'center', color:'#9aa4b3', fontSize:'13px', marginTop:'8px' }}>
                                    Todo al día
                                </p>
                            )}
                        </div>
                    </div>

                </div>{/* end bottom row */}
            </div>{/* end content column */}
        </div>
    );
}
