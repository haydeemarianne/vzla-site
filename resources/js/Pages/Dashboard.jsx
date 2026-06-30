import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Heart, Sparkles, Wrench, Truck, Package, ArrowRight, Plus, MapPin, Users, Download, FileText, RotateCw } from 'lucide-react';

const PASTEL = ['#e7dcf2','#dfe6f4','#d6e8e0','#f0d6d6','#f3e2cf','#fde68a'];

const CARD_STYLE = {
    background: 'white',
    border: '1px solid #e9ebf1',
    borderRadius: 24,
    padding: '18px 20px',
};

function initials(name, anon) {
    if (anon) return 'FA';
    return (name ?? '?').trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

const NEED_LABELS = {
    food:'Alimentación', water:'Agua', medicine:'Medicamentos',
    shelter:'Refugio', clothing:'Ropa', baby:'Bebé',
    documents:'Documentos', tools:'Herramientas', furniture:'Mobiliario', other:'Otro',
};

const URGENCY = {
    high:   { label:'Urgente', bg:'#fbeaea', color:'#b04b4b' },
    medium: { label:'Media',   bg:'#fef3e2', color:'#b45309' },
    low:    { label:'Normal',  bg:'#f1f4f9', color:'#5b6677' },
};

const ACCIONES = [
    { href:'/casos',          icon: Heart,    label:'Apadrinar',    color:'#4263ac', bg:'#eef1fa',
      desc:'Toma un caso y apoya a una familia directamente' },
    { href:'/casos/publicar', icon: Plus,     label:'Publicar caso', color:'#b45309', bg:'#fef3e2',
      desc:'Registra tu familia para recibir ayuda urgente' },
    { href:'/ingenieros',     icon: Wrench,   label:'Ingenieros',   color:'#7c3aed', bg:'#f3eeff',
      desc:'Inspecciona edificaciones dañadas con tu equipo' },
    { href:'/limpieza',       icon: Sparkles, label:'Limpieza',     color:'#16a34a', bg:'#e8f5e9',
      desc:'Únete a una cuadrilla y limpia tu cuadrante' },
    { href:'/transporte',     icon: Truck,    label:'Transporte',   color:'#0369a1', bg:'#e0f2fe',
      desc:'Traslada personas a refugios o zonas seguras' },
    { href:'/materiales',     icon: Package,  label:'Recursos',     color:'#92600e', bg:'#fef9c3',
      desc:'Descarga materiales para imprimir y compartir' },
];

/* ── KPI compacto ── */
function CompactStat({ value, label, color, bg }) {
    return (
        <div style={{ background:bg, borderRadius:13, padding:'11px 14px' }}>
            <div style={{ fontSize:22, fontWeight:800, color, lineHeight:1, letterSpacing:'-.4px' }}>{value}</div>
            <div style={{ fontSize:10.5, color:'#7b8595', fontWeight:600, marginTop:3 }}>{label}</div>
        </div>
    );
}

/* ── Cabecera de card ── */
function CardHeader({ title, href, color = '#4263ac' }) {
    return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:14.5, fontWeight:700, color:'#2b3340' }}>{title}</span>
            <Link href={href} style={{ display:'flex', alignItems:'center', gap:3, fontSize:11.5, fontWeight:600, color, textDecoration:'none' }}>
                Ver todos <ArrowRight size={11} color={color} strokeWidth={2.5}/>
            </Link>
        </div>
    );
}

/* ── Fila de caso ── */
function CaseRow({ c, i }) {
    const needs = parseNeeds(c.needs).slice(0,2);
    const name  = c.is_anonymous ? 'Familia anónima' : (c.family_name ?? 'Familia');
    return (
        <div onClick={() => router.visit(`/casos/${c.id}`)} style={{
            display:'flex', alignItems:'center', gap:9,
            padding:'8px 0', cursor:'pointer',
            borderTop: i===0 ? 'none' : '1px solid #f3f4f8',
        }}>
            <div style={{
                width:34, height:34, borderRadius:'50%', flexShrink:0,
                background: PASTEL[i % PASTEL.length],
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11.5, fontWeight:700, color:'#3a4250',
            }}>
                {initials(c.family_name, c.is_anonymous)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {name}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                    <MapPin size={9} color="#7b8595" strokeWidth={2}/>
                    <span style={{ fontSize:10.5, color:'#7b8595', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {[c.zone, c.state].filter(Boolean).join(', ')}
                    </span>
                </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:2, flexShrink:0 }}>
                {needs.map(n => (
                    <span key={n} style={{ background:'#f3f4f8', color:'#5b6677', fontSize:9.5, fontWeight:600, padding:'2px 6px', borderRadius:4 }}>
                        {NEED_LABELS[n] ?? n}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ── Badge de urgencia ── */
function UrgencyBadge({ level }) {
    const u = URGENCY[level] ?? URGENCY.low;
    return (
        <span style={{ fontSize:10, fontWeight:700, background:u.bg, color:u.color, padding:'3px 8px', borderRadius:999, flexShrink:0, whiteSpace:'nowrap' }}>
            {u.label}
        </span>
    );
}

/* ── Dashboard ── */
export default function Dashboard({ stats, recent_cases, recent_cleaning, top_materials, recent_inspections, recent_transport }) {
    const s           = stats               ?? {};
    const cases       = recent_cases        ?? [];
    const cleaning    = recent_cleaning     ?? [];
    const materials   = top_materials       ?? [];
    const inspections = recent_inspections  ?? [];
    const transport   = recent_transport    ?? [];

    const KPIS = [
        { value: s.cases_open      ?? 0, label:'Sin apadrinar', color:'#CE6969', bg:'#fbeaea' },
        { value: s.cases_adopted   ?? 0, label:'Apadrinados',   color:'#16a34a', bg:'#dcfce7' },
        { value: s.engineers       ?? 0, label:'Ingenieros',    color:'#7c3aed', bg:'#f3eeff' },
        { value: s.cleaning_points ?? 0, label:'Limpieza',      color:'#0369a1', bg:'#e0f2fe' },
    ];

    const emptyMsg = (msg) => (
        <p style={{ fontSize:12, color:'#7b8595', textAlign:'center', padding:'18px 0', margin:0 }}>{msg}</p>
    );

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                {/* ── Hero ── */}
                <div style={{ paddingTop:8 }}>
                    <div style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        background:'#fbeaea', color:'#b04b4b',
                        padding:'4px 11px', borderRadius:999,
                        fontSize:10, fontWeight:700, letterSpacing:'.5px', marginBottom:10,
                    }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:'#CE6969', display:'inline-block', animation:'vaPulse 1.6s infinite' }}/>
                        RESPUESTA AL TERREMOTO M7.5
                    </div>
                    <h1 style={{ margin:0, fontSize:26, fontWeight:800, letterSpacing:'-.6px', color:'#1a2230', lineHeight:1.1 }}>
                        Ayuda directa,<br/>
                        <span style={{ color:'#83A2DB' }}>familia por familia.</span>
                    </h1>
                    <p style={{ margin:'6px 0 0', fontSize:12.5, color:'#7b8595', lineHeight:1.5 }}>
                        Sin intermediarios. Contacto directo.
                    </p>
                </div>

                {/* ── ROW 1: KPIs compactos + Materiales ── */}
                <div className="va-dash-row1">

                    {/* KPIs 2×2 compactos */}
                    <div style={{ ...CARD_STYLE, padding:'14px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:'#7b8595', letterSpacing:'.3px', textTransform:'uppercase' }}>Resumen</span>
                            <button
                                onClick={() => router.reload()}
                                style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'#7b8595', display:'flex', alignItems:'center' }}
                                title="Actualizar datos"
                            >
                                <RotateCw size={13} strokeWidth={2}/>
                            </button>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
                            {KPIS.map(kpi => <CompactStat key={kpi.label} {...kpi}/>)}
                        </div>
                    </div>

                    {/* Materiales más descargados */}
                    <div style={CARD_STYLE}>
                        <CardHeader title="Materiales" href="/materiales" color="#92600e"/>
                        <p style={{ margin:'-6px 0 12px', fontSize:11.5, color:'#7b8595', lineHeight:1.4 }}>
                            Volantes, guías e instructivos para imprimir y compartir
                        </p>
                        {materials.length === 0 ? (
                            <Link href="/materiales" style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 0' }}>
                                <div style={{ width:40, height:40, borderRadius:'50%', background:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <Package size={18} color="#92600e" strokeWidth={2}/>
                                </div>
                                <span style={{ fontSize:12, color:'#92600e', fontWeight:600 }}>Ver recursos disponibles</span>
                            </Link>
                        ) : materials.map((m,i) => {
                            const ftUpper = (m.file_type ?? 'doc').toUpperCase();
                            const ftColors = {
                                PDF:{ bg:'#fef2f2', color:'#b91c1c' },
                                STL:{ bg:'#f3eeff', color:'#7c3aed' },
                                SVG:{ bg:'#e0f2fe', color:'#0369a1' },
                                PNG:{ bg:'#dcfce7', color:'#15803d' },
                                DOC:{ bg:'#f1f4f9', color:'#475569' },
                            };
                            const ft = ftColors[ftUpper] ?? ftColors.DOC;
                            return (
                                <Link key={m.id} href={`/materiales/${m.id}`} style={{ textDecoration:'none', display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                    <div style={{ width:36, height:36, borderRadius:10, background:'#fef9c3', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <FileText size={16} color="#92600e" strokeWidth={2}/>
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:12.5, fontWeight:700, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {m.title}
                                        </div>
                                        {m.description && (
                                            <div style={{ fontSize:11, color:'#7b8595', marginTop:2, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                                                {m.description}
                                            </div>
                                        )}
                                        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                                            <span style={{ fontSize:9.5, fontWeight:700, background:ft.bg, color:ft.color, padding:'2px 7px', borderRadius:4 }}>
                                                {ftUpper}
                                            </span>
                                            {m.category && (
                                                <span style={{ fontSize:10, color:'#7b8595' }}>{m.category}</span>
                                            )}
                                            <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:3 }}>
                                                <Download size={10} color="#92600e" strokeWidth={2}/>
                                                <span style={{ fontSize:11, fontWeight:700, color:'#92600e' }}>{m.download_count ?? 0}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        <Link href="/materiales/subir" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:10, paddingTop:10, borderTop:'1px solid #f3f4f8', fontSize:12, fontWeight:600, color:'#92600e', textDecoration:'none' }}>
                            <Plus size={13} strokeWidth={2.5}/> Subir material
                        </Link>
                    </div>

                </div>

                {/* ── ROW 2: 4 columnas de actividad ── */}
                <div className="va-dash-4col">

                    {/* Casos urgentes */}
                    <div style={CARD_STYLE}>
                        <CardHeader title="Casos urgentes" href="/casos" color="#4263ac"/>
                        {cases.length === 0 ? emptyMsg('No hay casos pendientes') :
                            cases.slice(0,5).map((c,i) => <CaseRow key={c.id} c={c} i={i}/>)
                        }
                    </div>

                    {/* Jornadas activas */}
                    <div style={CARD_STYLE}>
                        <CardHeader title="Jornadas activas" href="/limpieza" color="#16a34a"/>
                        {cleaning.length === 0 ? emptyMsg('No hay jornadas activas') :
                            cleaning.map((p,i) => (
                                <div key={p.id} onClick={() => router.visit(`/limpieza/${p.id}`)} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 0', cursor:'pointer', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                    <div style={{ width:34, height:34, borderRadius:'50%', background:'#e8f5e9', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <Sparkles size={15} color="#16a34a" strokeWidth={2}/>
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:12.5, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.zone_name}</div>
                                        <div style={{ fontSize:10.5, color:'#7b8595', display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                                            <Users size={9} color="#7b8595" strokeWidth={2}/>
                                            {p.helpers_count ?? 0} voluntarios · {p.state}
                                        </div>
                                    </div>
                                    <span style={{ fontSize:10, fontWeight:700, background:'#dcfce7', color:'#15803d', padding:'3px 8px', borderRadius:999 }}>Activa</span>
                                </div>
                            ))
                        }
                    </div>

                    {/* Inspecciones */}
                    <div style={CARD_STYLE}>
                        <CardHeader title="Inspecciones" href="/ingenieros" color="#7c3aed"/>
                        {inspections.length === 0 ? emptyMsg('No hay inspecciones abiertas') :
                            inspections.map((r,i) => (
                                <div key={r.id} onClick={() => router.visit(`/ingenieros/${r.id}`)} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 0', cursor:'pointer', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                    <div style={{ width:34, height:34, borderRadius:'50%', background:'#f3eeff', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <Wrench size={15} color="#7c3aed" strokeWidth={2}/>
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:12.5, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {r.zone ?? r.state}
                                        </div>
                                        <div style={{ fontSize:10.5, color:'#7b8595', marginTop:1 }}>{r.structure_type} · {r.state}</div>
                                    </div>
                                    <UrgencyBadge level={r.urgency}/>
                                </div>
                            ))
                        }
                    </div>

                    {/* Transporte */}
                    <div style={CARD_STYLE}>
                        <CardHeader title="Transporte" href="/transporte" color="#0369a1"/>
                        {transport.length === 0 ? emptyMsg('No hay traslados abiertos') :
                            transport.map((r,i) => (
                                <div key={r.id} onClick={() => router.visit(`/transporte/${r.id}`)} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 0', cursor:'pointer', borderTop: i===0?'none':'1px solid #f3f4f8' }}>
                                    <div style={{ width:34, height:34, borderRadius:'50%', background:'#e0f2fe', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <Truck size={15} color="#0369a1" strokeWidth={2}/>
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:12.5, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {r.cargo_type || 'Traslado'}
                                        </div>
                                        <div style={{ fontSize:10.5, color:'#7b8595', marginTop:1 }}>
                                            {r.origin_state} → {r.destination_state}
                                        </div>
                                    </div>
                                    <UrgencyBadge level={r.urgency}/>
                                </div>
                            ))
                        }
                    </div>

                </div>

                {/* ── ROW 3: ¿Cómo quieres ayudar? ── */}
                <div style={CARD_STYLE}>
                    <span style={{ fontSize:15, fontWeight:700, color:'#2b3340', display:'block', marginBottom:14 }}>
                        ¿Cómo quieres ayudar?
                    </span>
                    <div className="va-acciones-grid">
                        {ACCIONES.map(({ href, icon:Icon, bg, color, label, desc }) => (
                            <Link key={href} href={href} style={{
                                textDecoration:'none',
                                background:'#fafbfd', border:'1px solid #eef0f5',
                                borderRadius:16, padding:'16px 12px',
                                display:'flex', flexDirection:'column',
                                alignItems:'center', gap:7, textAlign:'center',
                            }}>
                                <div style={{ width:44, height:44, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(16,24,40,.06)', flexShrink:0 }}>
                                    <Icon size={20} color={color} strokeWidth={2}/>
                                </div>
                                <span style={{ fontSize:12.5, fontWeight:700, color:'#2b3340', lineHeight:1.2 }}>{label}</span>
                                <span style={{ fontSize:11, color:'#7b8595', lineHeight:1.4, fontWeight:500 }}>{desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
