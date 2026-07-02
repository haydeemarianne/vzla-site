import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Upload, Calendar, Check, X, ArrowRight, ChevronRight, User, Phone, MapPin, Tag, Clock, LogOut, History, UserCheck, Camera } from 'lucide-react';

/* ─── helpers ─── */
const PASTEL = ['#e7dcf2','#dfe6f4','#d6e8e0','#f0d6d6','#f3e2cf','#fde68a'];
const initials = (name) =>
    name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';
const pastel = (i) => PASTEL[i % PASTEL.length];

const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString('es-VE', { day:'2-digit', month:'short' });
};

/* ─── Etapas del recorrido ─── */
const STAGES = ['recepcion', 'verificacion', 'asignacion', 'seguimiento'];
const STAGE_CFG = {
    recepcion:    { label:'Recepción',    dot:'#CE6969', nextLabel:'Pasar a Verificación'  },
    verificacion: { label:'Verificación', dot:'#f59e0b', nextLabel:'Pasar a Asignación'    },
    asignacion:   { label:'Asignación',   dot:'#4263ac', nextLabel:'Pasar a Seguimiento'   },
    seguimiento:  { label:'Seguimiento',  dot:'#16a34a', nextLabel:null                     },
};

/* ─── Acciones por módulo + etapa ─── */
const MODULE_STAGE = {
    cases: {
        recepcion: {
            description: 'Confirma que el caso familiar fue recibido con todos los datos necesarios.',
            checks: ['Nombre y contacto completos', 'Zona/estado identificados', 'Descripción de necesidades clara'],
        },
        verificacion: {
            description: 'Verifica la identidad, urgencia real y situación de riesgo del núcleo familiar.',
            checks: ['Llamada de verificación realizada', 'Nivel de urgencia confirmado', 'Situación de riesgo evaluada'],
        },
        asignacion: {
            description: 'Busca un padrino o voluntario disponible para acompañar este caso.',
            checks: ['Padrino identificado', 'Disponibilidad confirmada', 'Contacto inicial realizado'],
            linkLabel: 'Abrir formulario de padrino',
            linkPath: (item) => `/casos/${item.id}/apadrinar`,
        },
        seguimiento: {
            description: 'Monitorea la gestión activa, confirma entregas y cierra cuando esté resuelto.',
            checks: ['Primera entrega realizada', 'Familia en seguimiento activo', 'Listo para cierre'],
            linkLabel: 'Ver detalle del caso',
            linkPath: (item) => `/casos/${item.id}`,
        },
    },
    engineers: {
        recepcion: {
            description: 'Confirma que el ingeniero voluntario fue registrado con datos completos.',
            checks: ['Nombre, teléfono y email completos', 'Especialidad indicada', 'Zonas disponibles definidas'],
        },
        verificacion: {
            description: 'Verifica las credenciales profesionales y disponibilidad real del ingeniero.',
            checks: ['Número de colegiatura/licencia verificado', 'Contacto de confirmación realizado', 'Disponibilidad hasta fecha confirmada'],
        },
        asignacion: {
            description: 'Asigna al ingeniero a una solicitud de inspección pendiente.',
            checks: ['Solicitud de inspección identificada', 'Ingeniero notificado', 'Fecha de visita coordinada'],
            linkLabel: 'Ver solicitudes de inspección',
            linkPath: () => '/ingenieros',
        },
        seguimiento: {
            description: 'Confirma que el ingeniero realizó la inspección y está disponible para más casos.',
            checks: ['Inspección realizada', 'Reporte o informe recibido', 'Ingeniero disponible para más asignaciones'],
        },
    },
    materials: {
        recepcion: {
            description: 'Revisa que el material subido esté completo: título, categoría y archivo adjunto.',
            checks: ['Título descriptivo', 'Categoría asignada correctamente', 'Archivo adjunto y accesible'],
        },
        verificacion: {
            description: 'Verifica la calidad, utilidad y seguridad del contenido del material.',
            checks: ['Contenido útil y relevante para la comunidad', 'Sin información incorrecta o dañina', 'Instrucciones claras (si aplica)'],
        },
        asignacion: {
            description: 'El material está listo. Confirma la categoría final y prepara la publicación.',
            checks: ['Categoría y subcategoría correctas', 'Contribuidor debidamente acreditado', 'Material listo para publicar'],
        },
        seguimiento: {
            description: 'El material está publicado. Monitorea descargas y utilidad reportada.',
            checks: ['Visible en el índice de materiales', 'Descargas registradas', 'Votos de utilidad positivos'],
            linkLabel: 'Ver material publicado',
            linkPath: (item) => `/materiales/${item.id}`,
        },
    },
    cleaning: {
        recepcion: {
            description: 'Confirma que el punto de limpieza fue reportado con foto, zona y datos de contacto.',
            checks: ['Zona y dirección identificadas', 'Foto del punto recibida', 'Tipo de residuo indicado'],
            linkLabel: 'Ver punto en limpieza',
            linkPath: (item) => `/limpieza/${item.id}`,
        },
        verificacion: {
            description: 'Verifica la urgencia del punto, volumen de residuos y accesibilidad para el equipo.',
            checks: ['Urgencia verificada in situ o por foto', 'Volumen y tipo de residuo confirmados', 'Acceso al punto viable'],
        },
        asignacion: {
            description: 'Coordina voluntarios y equipos para atender el punto de limpieza.',
            checks: ['Equipo de voluntarios identificado', 'Fecha de jornada coordinada', 'Herramientas y transporte disponibles'],
            linkLabel: 'Ver voluntarios del punto',
            linkPath: (item) => `/limpieza/${item.id}`,
        },
        seguimiento: {
            description: 'Confirma que la jornada fue realizada y el punto está limpio o resuelto.',
            checks: ['Jornada de limpieza realizada', 'Foto del resultado recibida', 'Punto marcado como resuelto'],
        },
    },
    transport: {
        recepcion: {
            description: 'Confirma los datos de la solicitud: origen, destino, tipo de carga y urgencia.',
            checks: ['Origen y destino claros', 'Tipo de carga válido', 'Contacto del solicitante disponible'],
        },
        verificacion: {
            description: 'Verifica la urgencia real de la solicitud, la ruta y la ventana de tiempo.',
            checks: ['Urgencia real confirmada', 'Ruta viable y segura', 'Ventana de tiempo definida'],
        },
        asignacion: {
            description: 'Busca un conductor con vehículo adecuado para el tipo de carga y destino.',
            checks: ['Conductor con vehículo adecuado identificado', 'Disponibilidad del conductor confirmada', 'Conductor notificado con datos de solicitud'],
            linkLabel: 'Ver conductores disponibles',
            linkPath: () => '/transporte?tab=drivers',
        },
        seguimiento: {
            description: 'Confirma que el viaje fue completado y el solicitante recibió la ayuda.',
            checks: ['Conductor tomó la solicitud', 'Viaje completado', 'Solicitante confirma recepción'],
        },
    },
    drivers: {
        recepcion: {
            description: 'Confirma el registro del conductor voluntario: nombre, vehículo y zonas de cobertura.',
            checks: ['Nombre y teléfono completos', 'Tipo de vehículo indicado', 'Zonas de cobertura definidas'],
        },
        verificacion: {
            description: 'Verifica que el conductor tenga vehículo disponible y esté activo.',
            checks: ['Contacto de verificación realizado', 'Vehículo y capacidad confirmados', 'Disponibilidad actual activa'],
        },
        asignacion: {
            description: 'Asigna al conductor a una solicitud de transporte pendiente compatible.',
            checks: ['Solicitud compatible identificada', 'Conductor notificado con detalles', 'Fecha y hora de recogida coordinadas'],
            linkLabel: 'Ver solicitudes de transporte',
            linkPath: () => '/transporte',
        },
        seguimiento: {
            description: 'Confirma que el conductor completó el viaje y sigue disponible para más.',
            checks: ['Viaje completado confirmado', 'Conductor activo y disponible', 'Registro actualizado en sistema'],
        },
    },
};

/* ─── módulos del Recorrido ─── */
const BOARD_MODULES = [
    { key:'cases',     label:'Casos',      prop:'staged_cases',    type:'support_case'    },
    { key:'engineers', label:'Ingenieros', prop:'staged_engineers', type:'engineer'        },
    { key:'materials', label:'Materiales', prop:'staged_materials', type:'material'        },
    { key:'cleaning',  label:'Limpieza',   prop:'staged_cleaning',  type:'cleaning'        },
    { key:'transport', label:'Transporte', prop:'staged_transport', type:'transport_request'},
    { key:'drivers',   label:'Conductores',prop:'staged_drivers',   type:'transport_driver'},
];

/* ─── nombre legible de un item según su módulo ─── */
const itemLabel = (item, modKey) => {
    if (modKey === 'cases')     return item.family_name  || 'Sin nombre';
    if (modKey === 'materials') return item.title        || 'Sin título';
    if (modKey === 'cleaning')  return item.zone_name    || item.city || 'Sin zona';
    if (modKey === 'transport') return `${item.origin_zone ?? '?'} → ${item.destination_zone ?? '?'}`;
    if (modKey === 'drivers')   return item.name         || 'Sin nombre';
    return item.name || 'Sin nombre';
};

const itemMeta = (item, modKey) => {
    if (modKey === 'cases')     return item.zone     || item.state || '';
    if (modKey === 'engineers') return item.specialty || item.zones_available?.[0] || '';
    if (modKey === 'materials') return item.category  || '';
    if (modKey === 'cleaning')  return item.city      || item.state || '';
    if (modKey === 'transport') return item.cargo_type || '';
    if (modKey === 'drivers')   return item.vehicle_type || '';
    return '';
};

/* ─── SVG inline ─── */
const DblCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#2b3340" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 13 6 17.5 13.5 8"/>
        <path d="M10.5 15.5 12 17l8.5-9.5"/>
    </svg>
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

const StagePill = ({ stage }) => {
    const cfg = STAGE_CFG[stage];
    if (!cfg) return null;
    return (
        <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700,
            background:'#f3f4f8', color:'#2b3340',
        }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, flexShrink:0 }}/>
            {cfg.label}
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

const MiniDonut = ({ value, total, color, label }) => {
    const pct = total > 0 ? `${Math.round((value / total) * 100)}%` : '0%';
    return (
        <div style={{ textAlign:'center' }}>
            <div style={{ width:72, height:72, margin:'0 auto',
                borderRadius:'50%',
                background:`conic-gradient(${color} 0% ${pct}, #eef1f6 ${pct} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
            }}>
                <div style={{
                    width:50, height:50, borderRadius:'50%', background:'white',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:18, fontWeight:700, color:'#2b3340',
                }}>
                    {value}
                </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginTop:7 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:color }}/>
                <span style={{ fontSize:11, fontWeight:600, color:'#5b6677' }}>{label}</span>
            </div>
        </div>
    );
};

/* ─── Colores por módulo (para el calendario) ─── */
const MOD_DOT = {
    cases:     '#CE6969',
    engineers: '#4263ac',
    materials: '#f59e0b',
    cleaning:  '#16a34a',
    transport: '#8b5cf6',
    drivers:   '#0891b2',
};

/* ─── Campos para registro rápido por módulo ─── */
const QUICK_CFG = {
    cases: {
        endpoint: '/casos',
        fields: [
            { name:'family_name',   label:'Nombre de la familia', type:'text',     required:true  },
            { name:'zone',          label:'Zona / barrio',         type:'text'                     },
            { name:'state',         label:'Estado',                type:'text'                     },
            { name:'contact_phone', label:'Teléfono de contacto',  type:'text'                     },
            { name:'description',   label:'Descripción breve',     type:'textarea'                 },
        ],
    },
    engineers: {
        endpoint: '/ingenieros',
        fields: [
            { name:'name',      label:'Nombre completo',  type:'text',  required:true },
            { name:'phone',     label:'Teléfono',         type:'text',  required:true },
            { name:'specialty', label:'Especialidad',      type:'text'                },
            { name:'email',     label:'Correo electrónico',type:'email'               },
            { name:'notes',     label:'Notas',             type:'textarea'            },
        ],
    },
    transport: {
        endpoint: '/transporte/solicitar',
        fields: [
            { name:'requester_name',    label:'Nombre del solicitante', type:'text',   required:true },
            { name:'requester_phone',   label:'Teléfono',               type:'text',   required:true },
            { name:'origin_zone',       label:'Origen',                  type:'text',   required:true },
            { name:'destination_zone',  label:'Destino',                 type:'text',   required:true },
            { name:'cargo_type',        label:'Tipo de carga',           type:'select',
              options:[{v:'supplies',label:'Suministros'},{v:'debris',label:'Escombros'},{v:'people',label:'Personas'}] },
            { name:'urgency',           label:'Urgencia',                type:'select',
              options:[{v:'normal',label:'Normal'},{v:'urgent',label:'Urgente'}] },
        ],
    },
    drivers: {
        endpoint: '/transporte/registrar',
        fields: [
            { name:'name',         label:'Nombre del conductor', type:'text', required:true },
            { name:'phone',        label:'Teléfono',              type:'text', required:true },
            { name:'vehicle_type', label:'Tipo de vehículo',      type:'select',
              options:[{v:'moto',label:'Moto'},{v:'car',label:'Carro'},{v:'pickup',label:'Pickup'},{v:'truck',label:'Camión'}] },
            { name:'state',        label:'Estado donde opera',    type:'text'               },
        ],
    },
    materials: { endpoint:'/materiales/subir', redirect:true },
    cleaning:  { endpoint:'/limpieza/reportar', redirect:true },
};

const OVERLAY = {
    position:'fixed', inset:0, background:'rgba(15,23,42,.35)',
    zIndex:200, backdropFilter:'blur(2px)', display:'flex',
    alignItems:'center', justifyContent:'center',
};

/* ─── Modal: registro rápido ─── */
function QuickAddModal({ initModule, onClose }) {
    const [mod, setMod]     = useState(initModule || 'cases');
    const [form, setForm]   = useState({});
    const [sending, setSend] = useState(false);

    const cfg = QUICK_CFG[mod];

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const submit = () => {
        if (cfg.redirect) { window.location.href = cfg.endpoint; return; }
        setSend(true);
        router.post(cfg.endpoint, form, {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => setSend(false),
        });
    };

    const INPUT = {
        width:'100%', padding:'9px 12px', borderRadius:10, border:'1.5px solid #e6e9f0',
        fontSize:13, color:'#1a2230', outline:'none', fontFamily:'inherit',
        background:'white', boxSizing:'border-box',
    };

    return (
        <div style={OVERLAY} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background:'white', borderRadius:22, width:'min(480px,95vw)',
                maxHeight:'90vh', overflowY:'auto',
                boxShadow:'0 24px 60px rgba(15,23,42,.22)',
            }}>
                {/* Header */}
                <div style={{ padding:'20px 22px 14px', borderBottom:'1px solid #f0f2f7', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:16, fontWeight:800, color:'#1a2230' }}>Registro rápido</span>
                    <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e6e9f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <X size={14} color="#64748b" strokeWidth={2.2}/>
                    </button>
                </div>

                {/* Selector de módulo */}
                <div style={{ padding:'14px 22px 0', display:'flex', gap:5, flexWrap:'wrap' }}>
                    {BOARD_MODULES.map(m => (
                        <button key={m.key} onClick={() => { setMod(m.key); setForm({}); }} style={{
                            padding:'4px 11px', borderRadius:999, border:'none', cursor:'pointer',
                            fontSize:12, fontWeight:700, fontFamily:'inherit',
                            background: mod===m.key ? '#0f172a' : '#f3f4f8',
                            color:      mod===m.key ? 'white'  : '#64748b',
                        }}>{m.label}</button>
                    ))}
                </div>

                {/* Form */}
                <div style={{ padding:'16px 22px' }}>
                    {cfg.redirect ? (
                        <div style={{ textAlign:'center', padding:'20px 0' }}>
                            <p style={{ margin:'0 0 16px', fontSize:13, color:'#5b6677' }}>
                                {mod === 'materials' ? 'Los recursos requieren subir un archivo.' : 'Los puntos de limpieza requieren foto del lugar.'}<br/>
                                Usa el formulario completo.
                            </p>
                            <a href={cfg.endpoint} style={{ display:'inline-block', padding:'10px 20px', borderRadius:12, background:'#4263ac', color:'white', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                                Ir al formulario
                            </a>
                        </div>
                    ) : (
                        <>
                            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                                {cfg.fields.map(f => (
                                    <div key={f.name}>
                                        <label style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>
                                            {f.label}{f.required && <span style={{ color:'#CE6969' }}> *</span>}
                                        </label>
                                        {f.type === 'textarea' ? (
                                            <textarea rows={3} value={form[f.name]||''} onChange={e => set(f.name, e.target.value)}
                                                style={{ ...INPUT, resize:'vertical' }}/>
                                        ) : f.type === 'select' ? (
                                            <select value={form[f.name]||''} onChange={e => set(f.name, e.target.value)} style={INPUT}>
                                                <option value="">Seleccionar…</option>
                                                {f.options.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
                                            </select>
                                        ) : (
                                            <input type={f.type} value={form[f.name]||''} onChange={e => set(f.name, e.target.value)} style={INPUT}/>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={submit} disabled={sending} style={{
                                marginTop:18, width:'100%', padding:'13px', borderRadius:14, border:'none',
                                background:'#0f172a', color:'white', fontSize:14, fontWeight:700,
                                cursor:'pointer', fontFamily:'inherit', opacity: sending ? .6 : 1,
                            }}>
                                {sending ? 'Guardando…' : 'Registrar'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Modal: carga masiva ─── */
function BulkUploadModal({ onClose }) {
    const [mod, setMod]   = useState('cases');
    const [step, setStep] = useState(1);

    const TEMPLATES = {
        cases:     'family_name,zone,state,contact_phone,description',
        engineers: 'name,phone,email,specialty,notes',
        transport: 'requester_name,requester_phone,origin_zone,destination_zone,cargo_type,urgency',
        drivers:   'name,phone,vehicle_type,state',
        materials: 'title,category,uploaded_by,contact',
        cleaning:  'zone_name,city,state,type,volume,reporter_name,reporter_phone',
    };

    const modLabel = BOARD_MODULES.find(m => m.key === mod)?.label || mod;

    return (
        <div style={OVERLAY} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background:'white', borderRadius:22, width:'min(500px,95vw)',
                boxShadow:'0 24px 60px rgba(15,23,42,.22)',
            }}>
                {/* Header */}
                <div style={{ padding:'20px 22px 14px', borderBottom:'1px solid #f0f2f7', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                        <div style={{ fontSize:16, fontWeight:800, color:'#1a2230' }}>Carga masiva</div>
                        <div style={{ fontSize:12, color:'#7b8595', marginTop:2 }}>Importa registros desde un CSV</div>
                    </div>
                    <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e6e9f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <X size={14} color="#64748b" strokeWidth={2.2}/>
                    </button>
                </div>

                <div style={{ padding:'18px 22px 22px' }}>
                    {/* Paso 1: seleccionar módulo */}
                    <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:8 }}>
                            ¿Qué vas a cargar?
                        </div>
                        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                            {BOARD_MODULES.map(m => (
                                <button key={m.key} onClick={() => setMod(m.key)} style={{
                                    padding:'5px 12px', borderRadius:999, border:'none', cursor:'pointer',
                                    fontSize:12, fontWeight:700, fontFamily:'inherit',
                                    background: mod===m.key ? '#4263ac' : '#f3f4f8',
                                    color:      mod===m.key ? 'white'  : '#64748b',
                                }}>{m.label}</button>
                            ))}
                        </div>
                    </div>

                    {/* Plantilla CSV */}
                    <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px', marginBottom:16, border:'1px solid #e6e9f0' }}>
                        <div style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:8 }}>
                            Formato CSV — {modLabel}
                        </div>
                        <code style={{ fontSize:11.5, color:'#4263ac', wordBreak:'break-all', display:'block' }}>
                            {TEMPLATES[mod]}
                        </code>
                        <button
                            onClick={() => {
                                const blob = new Blob([TEMPLATES[mod] + '\n'], { type:'text/csv' });
                                const a = document.createElement('a');
                                a.href = URL.createObjectURL(blob);
                                a.download = `plantilla_${mod}.csv`;
                                a.click();
                            }}
                            style={{ marginTop:10, padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'white', color:'#4263ac', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
                        >
                            Descargar plantilla
                        </button>
                    </div>

                    {/* Subir archivo */}
                    <div style={{ border:'2px dashed #d1d9e6', borderRadius:14, padding:'28px', textAlign:'center' }}>
                        <Upload size={28} color="#c0c8d4" strokeWidth={1.5} style={{ margin:'0 auto 10px', display:'block' }}/>
                        <div style={{ fontSize:13, fontWeight:600, color:'#5b6677', marginBottom:6 }}>
                            Arrastra tu CSV aquí o selecciona un archivo
                        </div>
                        <div style={{ fontSize:12, color:'#94a3b8', marginBottom:14 }}>Máximo 500 registros por archivo</div>
                        <label style={{ display:'inline-block', padding:'9px 18px', borderRadius:10, background:'#0f172a', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                            Seleccionar archivo
                            <input type="file" accept=".csv" style={{ display:'none' }} onChange={e => {
                                if (e.target.files[0]) alert(`Archivo seleccionado: ${e.target.files[0].name}\n\n(Importación disponible próximamente)`);
                            }}/>
                        </label>
                    </div>

                    <p style={{ margin:'12px 0 0', fontSize:11.5, color:'#94a3b8', textAlign:'center' }}>
                        Todos los registros entrarán como <strong>pendientes</strong> en la Cola de validación.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Modal: calendario del recorrido ─── */
function RecorridoCalendarModal({ stagedMap, onClose }) {
    const now   = new Date();
    const [cur, setCur] = useState({ year: now.getFullYear(), month: now.getMonth() });

    const allItems = Object.entries(stagedMap).flatMap(([mod, items]) =>
        items.map(item => ({ ...item, _mod: mod }))
    );

    const byDate = {};
    allItems.forEach(item => {
        if (!item.created_at) return;
        const d = new Date(item.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (!byDate[key]) byDate[key] = [];
        byDate[key].push(item);
    });

    const { year, month } = cur;
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMon = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMon; d++) cells.push(d);

    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const dayNames   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

    const prevMonth = () => setCur(({ year, month }) => month === 0 ? { year:year-1, month:11 } : { year, month:month-1 });
    const nextMonth = () => setCur(({ year, month }) => month === 11 ? { year:year+1, month:0 } : { year, month:month+1 });

    const todayKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    const [selectedDay, setSelectedDay] = useState(null);
    const selectedKey = selectedDay ? `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` : null;
    const selectedItems = selectedKey ? (byDate[selectedKey] || []) : [];

    return (
        <div style={OVERLAY} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background:'white', borderRadius:22, width:'min(540px,96vw)',
                maxHeight:'90vh', overflowY:'auto',
                boxShadow:'0 24px 60px rgba(15,23,42,.22)',
            }}>
                {/* Header */}
                <div style={{ padding:'20px 22px 14px', borderBottom:'1px solid #f0f2f7', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <button onClick={prevMonth} style={{ width:30, height:30, borderRadius:'50%', border:'1px solid #e6e9f0', background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <ChevronRight size={14} color="#5b6677" strokeWidth={2} style={{ transform:'rotate(180deg)' }}/>
                        </button>
                        <span style={{ fontSize:16, fontWeight:800, color:'#1a2230', minWidth:160, textAlign:'center' }}>
                            {monthNames[month]} {year}
                        </span>
                        <button onClick={nextMonth} style={{ width:30, height:30, borderRadius:'50%', border:'1px solid #e6e9f0', background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <ChevronRight size={14} color="#5b6677" strokeWidth={2}/>
                        </button>
                    </div>
                    <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e6e9f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <X size={14} color="#64748b" strokeWidth={2.2}/>
                    </button>
                </div>

                <div style={{ padding:'16px 22px 22px' }}>
                    {/* Cabecera días */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:6 }}>
                        {dayNames.map(d => (
                            <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#94a3b8', padding:'4px 0', textTransform:'uppercase', letterSpacing:'.4px' }}>{d}</div>
                        ))}
                    </div>

                    {/* Grid de días */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
                        {cells.map((day, i) => {
                            if (!day) return <div key={`e-${i}`}/>;
                            const dKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                            const items = byDate[dKey] || [];
                            const isToday = dKey === todayKey;
                            const isSelected = day === selectedDay;
                            return (
                                <button key={dKey} onClick={() => setSelectedDay(day === selectedDay ? null : day)} style={{
                                    padding:'6px 2px 4px', borderRadius:10, border:'none',
                                    background: isSelected ? '#0f172a' : isToday ? '#eef1fa' : 'transparent',
                                    cursor: items.length ? 'pointer' : 'default',
                                    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                                }}>
                                    <span style={{ fontSize:12.5, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? 'white' : isToday ? '#4263ac' : '#2b3340' }}>
                                        {day}
                                    </span>
                                    {items.length > 0 && (
                                        <div style={{ display:'flex', gap:2, flexWrap:'wrap', justifyContent:'center' }}>
                                            {[...new Set(items.map(it => it._mod))].slice(0,3).map(m => (
                                                <span key={m} style={{ width:5, height:5, borderRadius:'50%', background: MOD_DOT[m] || '#c0c8d4', display:'block' }}/>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Leyenda */}
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:14, paddingTop:12, borderTop:'1px solid #f0f2f7' }}>
                        {BOARD_MODULES.filter(m => (stagedMap[m.key]||[]).length > 0).map(m => (
                            <div key={m.key} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#5b6677', fontWeight:600 }}>
                                <span style={{ width:7, height:7, borderRadius:'50%', background:MOD_DOT[m.key], flexShrink:0 }}/>
                                {m.label}
                            </div>
                        ))}
                    </div>

                    {/* Items del día seleccionado */}
                    {selectedItems.length > 0 && (
                        <div style={{ marginTop:16, background:'#f8fafc', borderRadius:14, padding:'14px 16px', border:'1px solid #e6e9f0' }}>
                            <div style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:10 }}>
                                {selectedDay} de {monthNames[month]}
                            </div>
                            {selectedItems.map((item, i) => {
                                const mod = BOARD_MODULES.find(m => m.key === item._mod);
                                return (
                                    <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop: i===0 ? 'none' : '1px solid #f0f2f7' }}>
                                        <span style={{ width:8, height:8, borderRadius:'50%', background:MOD_DOT[item._mod], flexShrink:0 }}/>
                                        <span style={{ fontSize:13, fontWeight:600, color:'#2b3340', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {itemLabel(item, item._mod)}
                                        </span>
                                        <StagePill stage={item.validation_stage}/>
                                        <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600, flexShrink:0 }}>{mod?.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {selectedDay && selectedItems.length === 0 && (
                        <p style={{ textAlign:'center', color:'#94a3b8', fontSize:13, marginTop:16 }}>Sin actividad en el recorrido este día.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Campos completos por módulo (vista de datos) ─── */
/* Traducción de necesidades (needs) — mismo mapeo que Casos/Index y Casos/Show */
const NEED_LABELS = {
    food: 'Alimentación', water: 'Agua', medicine: 'Medicamentos',
    medical_care: 'Atención médica', shelter: 'Refugio', clothing: 'Ropa',
    hygiene: 'Higiene', baby: 'Bebé', construction: 'Materiales',
    cleaning: 'Limpieza', transport: 'Transporte', electricity: 'Electricidad',
    tools: 'Herramientas', documents: 'Documentos', furniture: 'Mobiliario',
    emotional: 'Apoyo emocional', other: 'Otro',
};

const MODULE_DATA_FIELDS = {
    cases: [
        { label:'Nombre familia',    key:'family_name'   },
        { label:'Teléfono',          key:'contact_phone'  },
        { label:'Zona / barrio',     key:'zone'           },
        { label:'Estado',            key:'state'          },
        { label:'N° personas',       key:'people_count'   },
        { label:'Niños',             key:'has_children',  bool:true },
        { label:'Adultos mayores',   key:'has_elderly',   bool:true },
        { label:'Situación de riesgo', key:'has_risk',    bool:true },
        { label:'Tipo de caso',      key:'case_type'      },
        { label:'Necesidades',       key:'needs',         array:true },
        { label:'Descripción',       key:'description',   full:true  },
    ],
    engineers: [
        { label:'Nombre',            key:'name'              },
        { label:'Teléfono',          key:'phone'             },
        { label:'Correo',            key:'email'             },
        { label:'N° colegiatura',    key:'license_number'    },
        { label:'Especialidad',      key:'specialty'         },
        { label:'Disponible hasta',  key:'available_until', date:true },
        { label:'Zonas disponibles', key:'zones_available',  array:true },
        { label:'Notas',             key:'notes',            full:true  },
    ],
    materials: [
        { label:'Título',             key:'title'                   },
        { label:'Categoría',          key:'category'                },
        { label:'Subcategoría',       key:'subcategory'             },
        { label:'¿Es 3D?',            key:'is_3d',         bool:true },
        { label:'Contribuidor',       key:'uploaded_by'             },
        { label:'Organización',       key:'organization'            },
        { label:'Contacto',           key:'contact'                 },
        { label:'Instagram',          key:'contributor_instagram'   },
        { label:'Teléfono contribuidor', key:'contributor_phone'    },
        { label:'Descripción',        key:'description',  full:true  },
    ],
    cleaning: [
        { label:'Zona',              key:'zone_name'      },
        { label:'Ciudad',            key:'city'           },
        { label:'Estado',            key:'state'          },
        { label:'Dirección',         key:'address'        },
        { label:'Tipo de residuo',   key:'type'           },
        { label:'Volumen',           key:'volume'         },
        { label:'Reportado por',     key:'reporter_name'  },
        { label:'Teléfono reportero',key:'reporter_phone' },
        { label:'Notas',             key:'notes',         full:true },
    ],
    transport: [
        { label:'Solicitante',       key:'requester_name'       },
        { label:'Teléfono',          key:'requester_phone'      },
        { label:'Origen',            key:'origin_zone'          },
        { label:'Estado origen',     key:'origin_state'         },
        { label:'Destino',           key:'destination_zone'     },
        { label:'Estado destino',    key:'destination_state'    },
        { label:'Tipo de carga',     key:'cargo_type'           },
        { label:'Urgencia',          key:'urgency'              },
        { label:'Descripción',       key:'description',  full:true },
        { label:'Notas',             key:'notes',        full:true },
    ],
    drivers: [
        { label:'Nombre',            key:'name'         },
        { label:'Teléfono',          key:'phone'        },
        { label:'Tipo de vehículo',  key:'vehicle_type' },
        { label:'Capacidad',         key:'capacity'     },
        { label:'Estado donde opera',key:'state'        },
        { label:'Zonas de cobertura',key:'zones',       array:true },
        { label:'Notas',             key:'notes',       full:true  },
    ],
};

/* ─── Campos editables en Verificación — se derivan de MODULE_DATA_FIELDS ───
   Así "Editar datos" siempre cubre exactamente lo mismo que "Datos completos". */
const NUMBER_EDIT_FIELDS = ['people_count', 'capacity'];
const EMAIL_EDIT_FIELDS  = ['email'];

function editFieldsFor(modKey) {
    return (MODULE_DATA_FIELDS[modKey] || []).map(f => ({
        name:  f.key,
        label: f.label,
        type:  f.bool ? 'bool'
             : f.array ? 'array'
             : f.full ? 'textarea'
             : NUMBER_EDIT_FIELDS.includes(f.key) ? 'number'
             : EMAIL_EDIT_FIELDS.includes(f.key) ? 'email'
             : 'text',
    }));
}

/* ════════════════════════════════════════════════════════════
   MODAL del Recorrido
═══════════════════════════════════════════════════════════════ */
const CLOSEABLE_MODS = ['cases', 'cleaning', 'transport'];

function RecorridoModal({ item, modKey, modType, onClose, onAvanzar, adoptions, onActAdoption }) {
    const [confirmed,  setConfirmed]  = useState([]);
    const [editMode,   setEditMode]   = useState(false);
    const [editForm,   setEditForm]   = useState({});
    const [saving,     setSaving]     = useState(false);
    const [activeTab,  setActiveTab]  = useState('datos');
    const [history,    setHistory]    = useState([]);
    const [closeNote,  setCloseNote]  = useState('');
    const [closePhoto, setClosePhoto] = useState(null);
    const [closing,    setClosing]    = useState(false);

    useEffect(() => {
        if (activeTab === 'historial' && item && modType) {
            fetch(`/validar/historial?type=${modType}&id=${item.id}`)
                .then(r => r.json())
                .then(setHistory)
                .catch(() => setHistory([]));
        }
    }, [activeTab, item, modType]);

    if (!item) return null;
    const stage    = item.validation_stage || 'recepcion';
    const stageCfg = STAGE_CFG[stage] || STAGE_CFG.recepcion;
    const stageAct = MODULE_STAGE[modKey]?.[stage] || MODULE_STAGE.cases[stage];
    const actionLink = stageAct?.linkLabel && stageAct?.linkPath ? stageAct.linkPath(item) : null;

    const relatedAdoptions = (modKey === 'cases' && stage === 'asignacion')
        ? (adoptions || []).filter(a => a.support_case_id === item.id)
        : [];

    const canClose = stage === 'seguimiento' && CLOSEABLE_MODS.includes(modKey);

    const submitClose = (e) => {
        e.preventDefault();
        setClosing(true);
        const form = new FormData();
        form.append('type', modType);
        form.append('id', item.id);
        form.append('note', closeNote);
        if (closePhoto) form.append('photo', closePhoto);
        router.post('/validar/cerrar', form, {
            preserveScroll: true,
            onSuccess: () => { setCloseNote(''); setClosePhoto(null); setClosing(false); onClose(); },
            onError:   () => setClosing(false),
        });
    };

    const toggle = (i) =>
        setConfirmed(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

    const startEdit = () => {
        const initial = {};
        editFields.forEach(f => {
            if (f.type === 'bool') initial[f.name] = !!item[f.name];
            else if (f.type === 'array') {
                const raw = item[f.name];
                initial[f.name] = Array.isArray(raw) ? raw : (typeof raw === 'string' ? (JSON.parse(raw || '[]')) : []);
            }
            else initial[f.name] = item[f.name] ?? '';
        });
        setEditForm(initial);
        setEditMode(true);
    };

    const saveEdit = () => {
        setSaving(true);
        router.post('/validar/corregir', { type: modType, id: item.id, data: editForm }, {
            preserveScroll: true,
            onSuccess: () => { setEditMode(false); setSaving(false); },
            onFinish:  () => setSaving(false),
        });
    };

    const nombre = itemLabel(item, modKey);
    const meta   = itemMeta(item, modKey);
    const dataFields = MODULE_DATA_FIELDS[modKey] || [];
    const editFields = editFieldsFor(modKey);

    const INPUT = {
        width:'100%', padding:'10px 13px', borderRadius:11, border:'1.5px solid #e2e8f0',
        fontSize:13, color:'#1e293b', outline:'none', fontFamily:'inherit',
        background:'white', boxSizing:'border-box',
    };
    const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:16, padding:'15px 16px' };
    const SEC  = { margin:'0 0 10px', fontSize:10.5, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' };

    const TABS = [
        { key:'datos',     label:'Datos completos' },
        { key:'etapa',     label:'Etapa' },
        { key:'historial', label:'Historial' },
    ];

    const renderBoolVal = (v) => (
        <span style={{ fontSize:13, fontWeight:600, color: v ? '#16a34a' : '#94a3b8' }}>{v ? 'Sí' : 'No'}</span>
    );

    const renderArrayVal = (v, key) => {
        const arr = Array.isArray(v) ? v : (typeof v === 'string' ? JSON.parse(v || '[]') : []);
        if (!arr.length) return <span style={{ fontSize:13, color:'#c0c8d4' }}>—</span>;
        return (
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {arr.map((t, i) => (
                    <span key={i} style={{ padding:'3px 10px', borderRadius:999, background:'#eef1fa', color:'#4263ac', fontSize:11.5, fontWeight:700 }}>
                        {key === 'needs' ? (NEED_LABELS[t] ?? t) : t}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* overlay */}
            <div onClick={onClose} style={{
                position:'fixed', inset:0, background:'rgba(15,23,42,.35)',
                zIndex:200, backdropFilter:'blur(2px)',
            }}/>
            {/* panel */}
            <div style={{
                position:'fixed', top:0, right:0, bottom:0, width:'min(480px, 100vw)',
                background:'white', zIndex:201,
                boxShadow:'-24px 0 60px rgba(15,23,42,.18)',
                display:'flex', flexDirection:'column', overflow:'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding:'20px 22px 14px',
                    borderBottom:'1px solid #f0f2f7',
                    display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12,
                }}>
                    <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                            <StagePill stage={stage}/>
                            {item.created_at && (
                                <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>
                                    {fmtDate(item.created_at)}
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize:17, fontWeight:800, color:'#1a2230', lineHeight:1.2, wordBreak:'break-word' }}>
                            {nombre}
                        </div>
                        {meta && (
                            <div style={{ fontSize:12, color:'#7b8595', marginTop:3 }}>{meta}</div>
                        )}
                    </div>
                    <button onClick={onClose} style={{
                        width:34, height:34, borderRadius:'50%', border:'1px solid #e6e9f0',
                        background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', flexShrink:0,
                    }}>
                        <X size={15} color="#64748b" strokeWidth={2.2}/>
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display:'flex', padding:'10px 22px 0', gap:4, borderBottom:'1px solid #f0f2f7' }}>
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => { setActiveTab(t.key); setEditMode(false); }} style={{
                            padding:'7px 14px', borderRadius:'10px 10px 0 0', border:'none',
                            fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                            background: activeTab===t.key ? 'white' : 'transparent',
                            color: activeTab===t.key ? '#1a2230' : '#94a3b8',
                            borderBottom: activeTab===t.key ? '2px solid #4263ac' : '2px solid transparent',
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div style={{ flex:1, overflowY:'auto', padding:'18px 22px' }}>

                    {/* ── TAB DATOS ── */}
                    {activeTab === 'datos' && (
                        <>
                            {editMode ? (
                                /* Formulario de edición (solo en Verificación) — cubre todos los campos */
                                <div style={{ ...CARD, display:'flex', flexDirection:'column', gap:13 }}>
                                    <p style={SEC}>Editar / corregir datos</p>
                                    {editFields.map(f => (
                                        <div key={f.name}>
                                            <label style={{ fontSize:10.5, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>
                                                {f.label}
                                            </label>
                                            {f.type === 'bool' ? (
                                                <div style={{ display:'flex', gap:8 }}>
                                                    {[true, false].map(v => (
                                                        <button key={String(v)} type="button" onClick={() => setEditForm(p => ({ ...p, [f.name]: v }))} style={{
                                                            flex:1, padding:'9px', borderRadius:11,
                                                            border:`1.5px solid ${editForm[f.name] === v ? '#4263ac' : '#e2e8f0'}`,
                                                            background: editForm[f.name] === v ? '#eef1fa' : 'white',
                                                            color: editForm[f.name] === v ? '#4263ac' : '#94a3b8',
                                                            fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                                                        }}>
                                                            {v ? 'Sí' : 'No'}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : f.type === 'array' ? (
                                                <div>
                                                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom: (editForm[f.name]||[]).length ? 8 : 0 }}>
                                                        {(editForm[f.name] || []).map((tag, i) => (
                                                            <span key={i} style={{ display:'flex', alignItems:'center', gap:5, background:'#eef1fa', color:'#4263ac', fontSize:11.5, fontWeight:700, padding:'4px 9px', borderRadius:999 }}>
                                                                {f.name === 'needs' ? (NEED_LABELS[tag] ?? tag) : tag}
                                                                <button type="button" onClick={() => setEditForm(p => ({ ...p, [f.name]: p[f.name].filter((_, idx) => idx !== i) }))}
                                                                    style={{ border:'none', background:'none', cursor:'pointer', color:'#4263ac', padding:0, display:'flex' }}>
                                                                    <X size={10} strokeWidth={2.5}/>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input type="text" placeholder="Escribe y presiona Enter para agregar…" style={INPUT}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                setEditForm(p => ({ ...p, [f.name]: [...(p[f.name] || []), e.target.value.trim()] }));
                                                                e.target.value = '';
                                                            }
                                                        }}/>
                                                </div>
                                            ) : f.type === 'textarea' ? (
                                                <textarea rows={3} value={editForm[f.name]||''} onChange={e => setEditForm(p=>({...p,[f.name]:e.target.value}))} style={{ ...INPUT, resize:'vertical' }}/>
                                            ) : (
                                                <input type={f.type||'text'} value={editForm[f.name]||''} onChange={e => setEditForm(p=>({...p,[f.name]:e.target.value}))} style={INPUT}/>
                                            )}
                                        </div>
                                    ))}
                                    <div style={{ display:'flex', gap:8, marginTop:2 }}>
                                        <button onClick={saveEdit} disabled={saving} style={{
                                            flex:1, padding:'11px', borderRadius:12, border:'none',
                                            background: saving ? '#83A2DB' : '#4263ac', color:'white', fontSize:13, fontWeight:700,
                                            cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
                                        }}>
                                            {saving ? 'Guardando…' : 'Guardar cambios'}
                                        </button>
                                        <button onClick={() => setEditMode(false)} style={{
                                            padding:'11px 16px', borderRadius:12, border:'1px solid #e2e8f0',
                                            background:'white', color:'#64748b', fontSize:13, fontWeight:600,
                                            cursor:'pointer', fontFamily:'inherit',
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Vista de datos completos */
                                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                                    <div style={CARD}>
                                        <p style={SEC}>Datos completos</p>
                                        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                                            {dataFields.map((f, i) => {
                                                const val = item[f.key];
                                                const isEmpty = val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
                                                return (
                                                    <div key={f.key} style={{
                                                        display:'grid', gridTemplateColumns:'120px 1fr',
                                                        gap:8, padding:'9px 0',
                                                        borderBottom: i < dataFields.length-1 ? '1px solid #f7f8fb' : 'none',
                                                        alignItems:'start',
                                                    }}>
                                                        <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.4px', lineHeight:1.4 }}>
                                                            {f.label}
                                                        </span>
                                                        {isEmpty ? (
                                                            <span style={{ fontSize:13, fontWeight:600, color:'#c0c8d4' }}>—</span>
                                                        ) : f.bool ? renderBoolVal(val) :
                                                           f.array ? renderArrayVal(val, f.key) :
                                                           f.date ? (
                                                               <span style={{ fontSize:13, fontWeight:600, color:'#2b3340', lineHeight:1.4 }}>{fmtDate(val)}</span>
                                                           ) : (
                                                               <span style={{ fontSize:13, fontWeight:600, color:'#2b3340', lineHeight:1.4 }}>{String(val)}</span>
                                                           )
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Foto si existe */}
                                    {item.photo_path && (
                                        <div style={CARD}>
                                            <p style={SEC}>Foto</p>
                                            <img src={`/storage/${item.photo_path}`} alt="foto"
                                                style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:12, border:'1px solid #e6e9f0' }}/>
                                        </div>
                                    )}

                                    {/* Botón editar — solo en Verificación */}
                                    {stage === 'verificacion' && editFields.length > 0 && (
                                        <button onClick={startEdit} style={{
                                            width:'100%', padding:'11px', borderRadius:12,
                                            border:'1.5px dashed #a9b8dd', background:'#eef1fa',
                                            color:'#4263ac', fontSize:13, fontWeight:700,
                                            cursor:'pointer', fontFamily:'inherit',
                                        }}>
                                            Editar / corregir datos
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* ── TAB ETAPA ── */}
                    {activeTab === 'etapa' && (
                        <>
                            {/* Qué hacer */}
                            <div style={{ ...CARD, marginBottom:14 }}>
                                <p style={SEC}>Qué hacer aquí</p>
                                <p style={{ margin:'0 0 12px', fontSize:13, color:'#5b6677', lineHeight:1.55 }}>
                                    {stageAct.description}
                                </p>
                                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                                    {stageAct.checks.map((c, i) => (
                                        <button key={i} onClick={() => toggle(i)} style={{
                                            display:'flex', alignItems:'center', gap:10,
                                            padding:'9px 13px', borderRadius:11, textAlign:'left',
                                            border:`1px solid ${confirmed.includes(i) ? '#bbf7d0' : '#f0f2f7'}`,
                                            background: confirmed.includes(i) ? '#f0fdf4' : '#f8fafc',
                                            cursor:'pointer', fontFamily:'inherit',
                                        }}>
                                            <div style={{
                                                width:18, height:18, borderRadius:'50%', flexShrink:0,
                                                border:`2px solid ${confirmed.includes(i) ? '#16a34a' : '#d1d9e6'}`,
                                                background: confirmed.includes(i) ? '#16a34a' : 'white',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                {confirmed.includes(i) && <Check size={10} color="white" strokeWidth={3}/>}
                                            </div>
                                            <span style={{ fontSize:13, fontWeight:confirmed.includes(i)?700:500, color: confirmed.includes(i)?'#16a34a':'#2b3340' }}>
                                                {c}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Asignación en vivo — padrinos pendientes del caso */}
                            {modKey === 'cases' && stage === 'asignacion' && (
                                <div style={{ marginBottom:14, padding:'15px 16px', borderRadius:16, background:'#eef1fa', border:'1px solid #d6dffa' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                                        <UserCheck size={14} color="#4263ac" strokeWidth={2}/>
                                        <span style={{ fontSize:12, fontWeight:700, color:'#4263ac' }}>Padrinos pendientes de este caso</span>
                                    </div>
                                    {relatedAdoptions.length === 0 ? (
                                        <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>Aún no hay solicitudes de padrinazgo para este caso.</p>
                                    ) : (
                                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                            {relatedAdoptions.map(a => (
                                                <div key={a.id} style={{ background:'white', borderRadius:11, padding:'9px 11px', display:'flex', alignItems:'center', gap:9 }}>
                                                    <div style={{ flex:1, minWidth:0 }}>
                                                        <div style={{ fontSize:12.5, fontWeight:700, color:'#1e293b' }}>{a.volunteer?.name || 'Voluntario'}</div>
                                                        <div style={{ fontSize:11, color:'#94a3b8' }}>{a.volunteer?.phone}</div>
                                                    </div>
                                                    <button onClick={() => onActAdoption('reject', a.id)} style={{ padding:'6px 11px', borderRadius:9, border:'1px solid #fecaca', background:'#fef2f2', color:'#CE6969', fontSize:11.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                                        Rechazar
                                                    </button>
                                                    <button onClick={() => onActAdoption('approve', a.id)} style={{ padding:'6px 11px', borderRadius:9, border:'none', background:'#16a34a', color:'white', fontSize:11.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                                        Aprobar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cierre con comprobante — solo en Seguimiento */}
                            {canClose && (
                                <form onSubmit={submitClose} style={{ marginBottom:14, padding:'15px 16px', borderRadius:16, background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', flexDirection:'column', gap:9 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                        <Camera size={14} color="#16a34a" strokeWidth={2}/>
                                        <span style={{ fontSize:12, fontWeight:700, color:'#15803d' }}>Cerrar con comprobante</span>
                                    </div>
                                    <textarea rows={2} required placeholder="Diagnóstico final: qué se hizo, cómo quedó..."
                                        value={closeNote} onChange={e => setCloseNote(e.target.value)}
                                        style={{ ...INPUT, resize:'vertical', background:'white' }}/>
                                    <input type="file" accept="image/*" onChange={e => setClosePhoto(e.target.files[0] ?? null)}
                                        style={{ fontSize:12 }}/>
                                    <button type="submit" disabled={closing} style={{
                                        padding:'10px', borderRadius:11, border:'none',
                                        background: closing ? '#86efac' : '#16a34a', color:'white',
                                        fontSize:13, fontWeight:700, cursor: closing ? 'not-allowed' : 'pointer', fontFamily:'inherit',
                                    }}>
                                        {closing ? 'Cerrando…' : 'Cerrar caso con comprobante'}
                                    </button>
                                </form>
                            )}

                            {/* Flujo de etapas */}
                            <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap', padding:'12px 0', borderTop:'1px solid #f0f2f7' }}>
                                {STAGES.map((s, i) => {
                                    const cfg = STAGE_CFG[s];
                                    const isActive = s === stage;
                                    const isDone   = STAGES.indexOf(stage) > i;
                                    return (
                                        <div key={s} style={{ display:'flex', alignItems:'center', gap:5 }}>
                                            <div style={{
                                                display:'flex', alignItems:'center', gap:4,
                                                padding:'4px 9px', borderRadius:999, fontSize:11, fontWeight:700,
                                                background: isActive ? '#0f172a' : isDone ? '#f0fdf4' : '#f3f4f8',
                                                color: isActive ? 'white' : isDone ? '#16a34a' : '#94a3b8',
                                            }}>
                                                <span style={{ width:5, height:5, borderRadius:'50%', background: isActive?'white':cfg.dot, flexShrink:0 }}/>
                                                {cfg.label}
                                            </div>
                                            {i < STAGES.length-1 && <ChevronRight size={11} color="#c0c8d4" strokeWidth={2.5}/>}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* ── TAB HISTORIAL ── */}
                    {activeTab === 'historial' && (
                        history.length === 0 ? (
                            <div style={CARD}>
                                <p style={{ textAlign:'center', color:'#94a3b8', fontSize:13, margin:0 }}>Sin movimientos registrados todavía.</p>
                            </div>
                        ) : (
                            <div style={{ ...CARD, display:'flex', flexDirection:'column', gap:0 }}>
                                {history.map((log, i) => (
                                    <div key={log.id} style={{
                                        display:'flex', gap:11, padding:'11px 0',
                                        borderBottom: i < history.length-1 ? '1px solid #f7f8fb' : 'none',
                                    }}>
                                        <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'#eef1fa', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            <History size={13} color="#4263ac" strokeWidth={2}/>
                                        </div>
                                        <div style={{ flex:1, minWidth:0 }}>
                                            <div style={{ fontSize:12.5, fontWeight:700, color:'#1e293b' }}>
                                                {log.action === 'avanzado' ? `Avanzó a ${STAGE_CFG[log.stage]?.label ?? log.stage}` :
                                                 log.action === 'aprobado' ? 'Aprobó el registro' :
                                                 log.action === 'rechazado' ? 'Rechazó el registro' :
                                                 log.action === 'cerrado' ? 'Cerró con comprobante' : log.action}
                                            </div>
                                            <div style={{ fontSize:11.5, color:'#94a3b8', marginTop:1 }}>
                                                {log.admin_name || 'Validador'} · {fmtDate(log.created_at)}
                                            </div>
                                            {log.note && (
                                                <p style={{ margin:'5px 0 0', fontSize:12, color:'#5b6677', lineHeight:1.5, background:'#f8fafc', borderRadius:8, padding:'7px 10px' }}>
                                                    {log.note}
                                                </p>
                                            )}
                                            {log.photo_path && (
                                                <img src={`/storage/${log.photo_path}`} alt="comprobante"
                                                    style={{ marginTop:7, width:'100%', maxHeight:160, objectFit:'cover', borderRadius:10, border:'1px solid #e6e9f0' }}/>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding:'14px 22px', borderTop:'1px solid #f0f2f7', display:'flex', flexDirection:'column', gap:8 }}>
                    {actionLink && (
                        <a href={actionLink} style={{
                            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                            padding:'9px 18px', borderRadius:11, border:'1px solid #e2e8f0',
                            background:'#f8fafc', color:'#4263ac',
                            fontSize:13, fontWeight:700, textDecoration:'none', textAlign:'center',
                        }}>
                            <ChevronRight size={13} color="#4263ac" strokeWidth={2.5}/>
                            {stageAct.linkLabel}
                        </a>
                    )}
                    <div style={{ display:'flex', gap:9 }}>
                        {stageCfg.nextLabel ? (
                            <button onClick={onAvanzar} style={{
                                flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                                padding:'12px 18px', borderRadius:13, border:'none',
                                background:'#0f172a', color:'white',
                                fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                            }}>
                                <ArrowRight size={15} color="white" strokeWidth={2.2}/>
                                {stageCfg.nextLabel}
                            </button>
                        ) : (
                            <div style={{
                                flex:1, padding:'12px 18px', borderRadius:13,
                                background:'#f0fdf4', color:'#16a34a',
                                fontSize:13, fontWeight:700, textAlign:'center',
                                border:'1px solid #bbf7d0',
                            }}>
                                ✓ En Seguimiento activo
                            </div>
                        )}
                        <button onClick={onClose} style={{
                            padding:'12px 16px', borderRadius:13, border:'1px solid #e6e9f0',
                            background:'white', color:'#64748b',
                            fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                        }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const ROLE_LABEL = { super_admin:'Super Admin', admin:'Admin', validator:'Validador' };

export default function ValidarDashboard({
    admin_email,
    admin_name,
    admin_role,
    pending_children,
    pending_engineers,
    pending_zones,
    pending_cases,
    pending_volunteers,
    pending_adoptions,
    pending_materials,
    pending_cleaning,
    pending_transport_req,
    pending_transport_drivers,
    staged_cases,
    staged_engineers,
    staged_materials,
    staged_cleaning,
    staged_transport,
    staged_drivers,
}) {
    const [activeTab,      setActiveTab]      = useState('cases');
    const [boardModule,    setBoardModule]    = useState('cases');
    const [modalItem,      setModalItem]      = useState(null);
    const [modalModKey,    setModalModKey]    = useState(null);
    const [modalModType,   setModalModType]   = useState(null);
    const [showQuickAdd,   setShowQuickAdd]   = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [showCalendar,   setShowCalendar]   = useState(false);

    /* safe arrays */
    const safeCases            = pending_cases             ?? [];
    const safeVolunteers       = pending_volunteers        ?? [];
    const safeChildren         = pending_children          ?? [];
    const safeEngineers        = pending_engineers         ?? [];
    const safeZones            = pending_zones             ?? [];
    const safeAdoptions        = pending_adoptions         ?? [];
    const safeMaterials        = pending_materials         ?? [];
    const safeCleaning         = pending_cleaning          ?? [];
    const safeTransportReq     = pending_transport_req     ?? [];
    const safeTransportDrivers = pending_transport_drivers ?? [];

    const stagedMap = {
        cases:     staged_cases     ?? [],
        engineers: staged_engineers ?? [],
        materials: staged_materials ?? [],
        cleaning:  staged_cleaning  ?? [],
        transport: staged_transport ?? [],
        drivers:   staged_drivers   ?? [],
    };

    const totalPending =
        safeChildren.length + safeEngineers.length + safeZones.length +
        safeCases.length + safeVolunteers.length + safeAdoptions.length +
        safeMaterials.length + safeCleaning.length +
        safeTransportReq.length + safeTransportDrivers.length;

    const totalStaged = Object.values(stagedMap).reduce((acc, arr) => acc + arr.length, 0);

    const approvedVal = 47;
    const pendingPct  = `${Math.min(99, Math.round((totalPending / Math.max(1, totalPending + approvedVal)) * 100))}%`;
    const approvedPct = '84%';

    const act = (action, type, id) =>
        router.post(`/validar/${action}`, { type, id }, { preserveScroll: true });

    const actAdoption = (action, id) => {
        const path = action === 'approve' ? 'aprobar' : 'rechazar';
        router.post(`/validar/padrinos/${id}/${path}`, {}, { preserveScroll: true });
    };

    const openModal = (item, modKey, modType) => {
        setModalItem(item);
        setModalModKey(modKey);
        setModalModType(modType);
    };

    const closeModal = () => {
        setModalItem(null);
        setModalModKey(null);
        setModalModType(null);
    };

    const avanzar = () => {
        if (!modalItem || !modalModType) return;
        router.post('/validar/avanzar', { type: modalModType, id: modalItem.id }, {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const TABS = [
        { key:'cases',             label:'Casos',        count:safeCases.length,            type:'support_case'      },
        { key:'adoptions',         label:'Padrinos',     count:safeAdoptions.length,         type:'adoption'          },
        { key:'materials',         label:'Materiales',   count:safeMaterials.length,         type:'material'          },
        { key:'cleaning',          label:'Limpieza',     count:safeCleaning.length,          type:'cleaning'          },
        { key:'transport_req',     label:'Transporte',   count:safeTransportReq.length,      type:'transport_request' },
        { key:'transport_drivers', label:'Conductores',  count:safeTransportDrivers.length,  type:'transport_driver'  },
        { key:'engineers',         label:'Ingenieros',   count:safeEngineers.length,         type:'engineer'          },
        { key:'zones',             label:'Zonas',        count:safeZones.length,             type:'zone'              },
        { key:'volunteers',        label:'Voluntarios',  count:safeVolunteers.length,        type:'case_volunteer'    },
        { key:'children',          label:'Personas',     count:safeChildren.length,          type:'child'             },
    ];

    const activeTabCfg = TABS.find((t) => t.key === activeTab);
    const activeItems = {
        cases:             safeCases,
        adoptions:         safeAdoptions,
        materials:         safeMaterials,
        cleaning:          safeCleaning,
        transport_req:     safeTransportReq,
        transport_drivers: safeTransportDrivers,
        engineers:         safeEngineers,
        zones:             safeZones,
        volunteers:        safeVolunteers,
        children:          safeChildren,
    }[activeTab] || [];

    const itemName = (item, key) => {
        if (key === 'cases')             return item.family_name  || 'Sin nombre';
        if (key === 'zones')             return item.zone_name    || item.name || 'Sin nombre';
        if (key === 'materials')         return item.title        || 'Sin título';
        if (key === 'cleaning')          return item.zone_name    || item.city || 'Sin nombre';
        if (key === 'transport_req')     return `${item.origin_zone ?? '?'} → ${item.destination_zone ?? '?'}`;
        if (key === 'transport_drivers') return item.name         || 'Sin nombre';
        return item.name || 'Sin nombre';
    };

    const boardAvatars = safeCases.slice(0, 5).length
        ? safeCases.slice(0, 5).map((c, i) => ({ label: initials(c.family_name || c.name || '?'), bg: pastel(i) }))
        : [{ label:'MA', bg:'#e7dcf2' }, { label:'CR', bg:'#dfe6f4' }, { label:'FP', bg:'#d6e8e0' }];

    /* ─ Board helpers ─ */
    const currentBoardMod = BOARD_MODULES.find(m => m.key === boardModule) || BOARD_MODULES[0];
    const boardItems = stagedMap[boardModule] || [];

    const byStage = (stage) => boardItems.filter(item => item.validation_stage === stage);

    /* Board card */
    const BoardCard = ({ item, idx, mod }) => (
        <div
            onClick={() => openModal(item, mod.key, mod.type)}
            style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 4px', borderTop: idx===0?'none':'1px solid #f3f4f8',
                cursor:'pointer',
            }}
        >
            <AvatarCircle
                label={initials(itemLabel(item, mod.key))}
                bg={pastel(idx)} size={38} fontSize={12}
            />
            <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {itemLabel(item, mod.key)}
                </div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>
                    {itemMeta(item, mod.key) || fmtDate(item.created_at)}
                </div>
            </div>
            <ChevronRight size={14} color="#c0c8d4" strokeWidth={2}/>
        </div>
    );

    const EmptyCol = ({ label }) => (
        <div style={{ padding:'18px 4px', textAlign:'center', color:'#c0c8d4', fontSize:12 }}>{label}</div>
    );

    const BoardCol = ({ stage }) => {
        const cfg   = STAGE_CFG[stage];
        const items = byStage(stage);
        return (
            <div style={{ flexShrink:0, width: stage === 'seguimiento' ? 300 : 260 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10, paddingLeft:4 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:cfg.dot, flexShrink:0 }}/>
                    <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' }}>
                        {cfg.label}
                    </span>
                    <span style={{ fontSize:11, fontWeight:700, color:'#c0c8d4', marginLeft:'auto' }}>
                        {items.length}
                    </span>
                </div>
                <div style={{
                    background:'white', borderRadius:22, padding:'8px 14px',
                    boxShadow:'0 14px 34px rgba(16,24,40,.07)',
                    height: 262, overflowY:'auto',
                }}>
                    {items.length === 0
                        ? <EmptyCol label="Sin elementos"/>
                        : items.map((item, i) => (
                            <BoardCard key={item.id} item={item} idx={i} mod={currentBoardMod}/>
                        ))
                    }
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* ── Título + usuario ── */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                    <div>
                        <h1 style={{ margin:0, fontSize:28, fontWeight:800, letterSpacing:'-1px', color:'#1a2230' }}>
                            Panel de validación
                        </h1>
                        <p style={{ margin:'4px 0 0', fontSize:13, color:'#7b8595' }}>
                            {totalPending > 0
                                ? `${totalPending} pendiente${totalPending !== 1 ? 's' : ''} · ${totalStaged} en recorrido`
                                : totalStaged > 0
                                    ? `Todo al día · ${totalStaged} en recorrido`
                                    : 'Todo al día — sin pendientes'}
                        </p>
                    </div>

                    {/* Usuario actual + logout */}
                    {admin_name && (
                        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                            <div style={{ textAlign:'right' }}>
                                <div style={{ fontSize:13, fontWeight:700, color:'#1a2230' }}>{admin_name}</div>
                                <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>
                                    {ROLE_LABEL[admin_role] || admin_role}
                                </div>
                            </div>
                            <button
                                onClick={() => router.post('/admin/logout')}
                                title="Cerrar sesión"
                                style={{
                                    width:36, height:36, borderRadius:'50%',
                                    border:'1.5px solid #e6e9f0', background:'white',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor:'pointer', flexShrink:0,
                                }}
                            >
                                <LogOut size={15} color="#CE6969" strokeWidth={2}/>
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Recorrido del caso ── */}
                <div style={{
                    background:'linear-gradient(180deg,#fafbfd,#edeff5)',
                    border:'1px solid #e6e9f0', borderRadius:28, padding:24,
                    boxShadow:'0 24px 60px -28px rgba(16,24,40,.2)',
                }}>
                    {/* ── Fila única: título + tabs + avatares + acciones ── */}
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, minWidth:0 }}>
                        {/* Título */}
                        <span style={{ fontSize:16, fontWeight:800, color:'#2b3340', flexShrink:0 }}>
                            Recorrido del caso
                        </span>
                        {/* Divisor */}
                        <div style={{ width:1, height:18, background:'#dde1ea', flexShrink:0 }}/>
                        {/* Tabs de módulo — scroll horizontal silencioso */}
                        <div style={{ flex:1, display:'flex', gap:5, overflowX:'auto', scrollbarWidth:'none', msOverflowStyle:'none', paddingBottom:1 }}>
                            {BOARD_MODULES.map(mod => {
                                const count = (stagedMap[mod.key] || []).length;
                                const isA = boardModule === mod.key;
                                return (
                                    <button key={mod.key} onClick={() => setBoardModule(mod.key)} style={{
                                        display:'flex', alignItems:'center', gap:4, flexShrink:0,
                                        padding:'4px 11px', borderRadius:999, border:'none',
                                        cursor:'pointer', fontSize:12, fontWeight:600,
                                        background: isA ? '#4263ac' : 'rgba(255,255,255,.55)',
                                        color:      isA ? 'white'  : '#64748b',
                                        transition:'all .15s', fontFamily:'inherit',
                                    }}>
                                        {mod.label}
                                        {count > 0 && (
                                            <span style={{
                                                fontSize:10, fontWeight:700,
                                                background: isA ? 'rgba(255,255,255,.28)' : '#e2e8f0',
                                                color: isA ? 'white' : '#64748b',
                                                padding:'1px 6px', borderRadius:999,
                                            }}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Avatares + botones de acción */}
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                {boardAvatars.map((av, i) => (
                                    <div key={i} style={{
                                        width:34, height:34, borderRadius:'50%', background:av.bg,
                                        border:'2.5px solid white', marginLeft: i===0?0:'-8px',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:11, fontWeight:700, color:'#3a4250',
                                        zIndex: boardAvatars.length - i, position:'relative',
                                    }}>
                                        {av.label}
                                    </div>
                                ))}
                            </div>
                            {[
                                { icon:<Plus size={16}/>,     title:'Registro rápido',  onClick:() => setShowQuickAdd(true)   },
                                { icon:<Upload size={15}/>,   title:'Carga masiva CSV', onClick:() => setShowBulkUpload(true) },
                                { icon:<Calendar size={15}/>, title:'Calendario',        onClick:() => setShowCalendar(true)   },
                            ].map((btn, i) => (
                                <button key={i} title={btn.title} onClick={btn.onClick} style={{
                                    width:36, height:36, borderRadius:'50%',
                                    background:'white', border:'1px solid #e6e9f0',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor:'pointer', color:'#5b6677', flexShrink:0,
                                }}>
                                    {btn.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Columnas Kanban + métricas — misma altura fija */}
                    <div style={{ display:'flex', gap:20, height:320, alignItems:'stretch' }}>

                        {/* Columnas — scroll horizontal, llenan el alto */}
                        <div style={{ flex:1, display:'flex', gap:20, overflowX:'auto', paddingBottom:8, alignItems:'flex-start', height:'100%' }}>
                            {STAGES.map(stage => (
                                <BoardCol key={stage} stage={stage}/>
                            ))}
                        </div>

                        {/* Donuts — centrados verticalmente dentro del mismo alto */}
                        <div style={{
                            flexShrink:0, minWidth:190,
                            display:'grid', gridTemplateColumns:'1fr 1fr', gap:12,
                            alignContent:'center',
                        }}>
                            {STAGES.map(s => {
                                const cfg = STAGE_CFG[s];
                                const cnt = byStage(s).length;
                                return (
                                    <MiniDonut key={s} value={cnt} total={Math.max(boardItems.length, 1)} color={cfg.dot} label={cfg.label}/>
                                );
                            })}
                        </div>

                    </div>

                    {boardItems.length === 0 && (
                        <p style={{ textAlign:'center', color:'#94a3b8', fontSize:13, marginTop:8, marginBottom:0 }}>
                            Aprueba elementos desde la Cola para que entren al recorrido.
                        </p>
                    )}
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
                                        color:      isA ? 'white'  : '#64748b',
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
                            {activeTab === 'adoptions' ? <span>Padrino → Caso</span> : <span>Nombre</span>}
                            <span>Estado</span><span>Recibido</span><span>Acciones</span>
                        </div>

                        {/* Rows — max 5 visibles, scroll interno */}
                        <div style={{ maxHeight:272, overflowY:'auto' }}>
                        {activeItems.length === 0 ? (
                            <p style={{ textAlign:'center', color:'#9aa4b3', fontSize:13, padding:'20px 0', margin:0 }}>Sin elementos pendientes.</p>
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

            {/* ── Modal Recorrido ── */}
            <RecorridoModal
                item={modalItem}
                modKey={modalModKey}
                modType={modalModType}
                onClose={closeModal}
                onAvanzar={avanzar}
                adoptions={safeAdoptions}
                onActAdoption={actAdoption}
            />

            {/* ── Modal Registro rápido ── */}
            {showQuickAdd && (
                <QuickAddModal
                    initModule={boardModule}
                    onClose={() => setShowQuickAdd(false)}
                />
            )}

            {/* ── Modal Carga masiva ── */}
            {showBulkUpload && (
                <BulkUploadModal onClose={() => setShowBulkUpload(false)}/>
            )}

            {/* ── Modal Calendario ── */}
            {showCalendar && (
                <RecorridoCalendarModal
                    stagedMap={stagedMap}
                    onClose={() => setShowCalendar(false)}
                />
            )}
        </MainLayout>
    );
}
