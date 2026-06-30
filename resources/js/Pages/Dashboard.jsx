import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Heart, Sparkles, Wrench, Truck, Package, ArrowRight, Plus, MapPin, Users, Download, FileText } from 'lucide-react';

/* ─── tokens compartidos con ValidarDashboard ───── */
const PASTEL = ['#e7dcf2','#dfe6f4','#d6e8e0','#f0d6d6','#f3e2cf','#fde68a'];

/* card idéntico al de ValidarDashboard */
const CARD_STYLE = {
    background: 'white',
    border: '1px solid #e9ebf1',
    borderRadius: 24,
    padding: '20px 22px',
};

/* ─── helpers ───────────────────────────────────── */
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

/* ─── Acciones rápidas — con descripción corta ───── */
const ACCIONES = [
    {
        href:'/casos',          icon: Heart,    label:'Apadrinar',    color:'#4263ac', bg:'#eef1fa',
        desc:'Toma un caso y apoya a una familia directamente',
    },
    {
        href:'/casos/publicar', icon: Plus,     label:'Publicar caso', color:'#b45309', bg:'#fef3e2',
        desc:'Registra tu familia para recibir ayuda urgente',
    },
    {
        href:'/ingenieros',     icon: Wrench,   label:'Ingenieros',   color:'#7c3aed', bg:'#f3eeff',
        desc:'Inspecciona edificaciones dañadas con tu equipo',
    },
    {
        href:'/limpieza',       icon: Sparkles, label:'Limpieza',     color:'#16a34a', bg:'#e8f5e9',
        desc:'Únete a una cuadrilla y limpia tu cuadrante',
    },
    {
        href:'/transporte',     icon: Truck,    label:'Transporte',   color:'#0369a1', bg:'#e0f2fe',
        desc:'Traslada personas a refugios o zonas seguras',
    },
    {
        href:'/materiales',     icon: Package,  label:'Recursos',     color:'#92600e', bg:'#fef9c3',
        desc:'Descarga materiales para imprimir y compartir',
    },
];

/* ─── Donut mini — para KPIs ───────────────────── */
function StatCard({ value, label, color, bg }) {
    return (
        <div style={{ background: bg, borderRadius: 16, padding: '15px 16px' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: '-.7px', lineHeight: 1 }}>
                {value}
            </div>
            <div style={{ fontSize: 12, color: '#7b8595', fontWeight: 600, marginTop: 5, lineHeight: 1.3 }}>
                {label}
            </div>
        </div>
    );
}

/* ─── Dashboard ─────────────────────────────────── */
const FILE_TYPE_ICON = { pdf: '📄', stl: '🖨️', svg: '🗂️', png: '🖼️', doc: '📝' };

export default function Dashboard({ stats, recent_cases, recent_cleaning, top_materials }) {
    const s         = stats           ?? {};
    const cases     = recent_cases    ?? [];
    const cleaning  = recent_cleaning ?? [];
    const materials = top_materials   ?? [];

    const KPIS = [
        { value: s.cases_open      ?? 0, label:'Sin apadrinar', color:'#CE6969', bg:'#fbeaea' },
        { value: s.cases_adopted   ?? 0, label:'Apadrinados',   color:'#16a34a', bg:'#dcfce7' },
        { value: s.engineers       ?? 0, label:'Ingenieros',    color:'#7c3aed', bg:'#f3eeff' },
        { value: s.cleaning_points ?? 0, label:'Limpieza',      color:'#0369a1', bg:'#e0f2fe' },
    ];

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* ── Hero ── */}
                <div>
                    {/* chip pulsante */}
                    <div style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        background:'#fbeaea', color:'#b04b4b',
                        padding:'5px 12px', borderRadius:999,
                        fontSize:10.5, fontWeight:700, letterSpacing:'.5px',
                        marginBottom:12,
                    }}>
                        <span style={{
                            width:6, height:6, borderRadius:'50%', background:'#CE6969',
                            display:'inline-block', animation:'vaPulse 1.6s infinite',
                        }}/>
                        RESPUESTA AL TERREMOTO M7.5
                    </div>

                    <h1 style={{
                        margin:0, fontSize:28, fontWeight:800,
                        letterSpacing:'-.6px', color:'#1a2230', lineHeight:1.1,
                    }}>
                        Ayuda directa,<br/>
                        <span style={{ color:'#83A2DB' }}>familia por familia.</span>
                    </h1>
                    <p style={{ margin:'8px 0 0', fontSize:13, color:'#7b8595', lineHeight:1.5 }}>
                        Sin intermediarios. Contacto directo.
                    </p>
                </div>

                {/* ── KPIs — 2x2 mobile, 4 columnas desktop ── */}
                <div style={{
                    ...CARD_STYLE,
                    display:'grid',
                    gridTemplateColumns:'1fr 1fr',
                    gap:10, padding:'16px',
                }}>
                    {KPIS.map(kpi => <StatCard key={kpi.label} {...kpi}/>)}
                </div>

                {/* ── Fila de contenido: 3 columnas ── */}
                <div className="va-dash-3col">

                    {/* Col 1 — Casos urgentes */}
                    <div style={CARD_STYLE}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                            <span style={{ fontSize:15, fontWeight:700, color:'#2b3340' }}>Casos urgentes</span>
                            <Link href="/casos" style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color:'#4263ac', textDecoration:'none' }}>
                                Ver todos <ArrowRight size={12} color="#4263ac" strokeWidth={2.5}/>
                            </Link>
                        </div>
                        {cases.length === 0 ? (
                            <p style={{ fontSize:12.5, color:'#7b8595', textAlign:'center', padding:'20px 0', margin:0 }}>No hay casos pendientes</p>
                        ) : cases.slice(0,5).map((c,i) => {
                            const needs = parseNeeds(c.needs).slice(0,2);
                            const name  = c.is_anonymous ? 'Familia anónima' : (c.family_name ?? 'Familia');
                            return (
                                <div key={c.id} onClick={() => router.visit(`/casos/${c.id}`)} style={{
                                    display:'flex', alignItems:'center', gap:10,
                                    padding:'9px 0', cursor:'pointer',
                                    borderTop: i===0 ? 'none' : '1px solid #f3f4f8',
                                }}>
                                    <div style={{
                                        width:36, height:36, borderRadius:'50%', flexShrink:0,
                                        background: PASTEL[i % PASTEL.length],
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:12, fontWeight:700, color:'#3a4250',
                                    }}>
                                        {initials(c.family_name, c.is_anonymous)}
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:13, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                            {name}
                                        </div>
                                        <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                                            <MapPin size={9} color="#7b8595" strokeWidth={2}/>
                                            <span style={{ fontSize:11, color:'#7b8595', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                                {[c.zone, c.state].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:2, flexShrink:0 }}>
                                        {needs.map(n => (
                                            <span key={n} style={{ background:'#f3f4f8', color:'#5b6677', fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:4 }}>
                                                {NEED_LABELS[n] ?? n}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Col 2 — Jornadas activas */}
                    <div style={CARD_STYLE}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                            <span style={{ fontSize:15, fontWeight:700, color:'#2b3340' }}>Jornadas activas</span>
                            <Link href="/limpieza" style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color:'#16a34a', textDecoration:'none' }}>
                                Ver todas <ArrowRight size={12} color="#16a34a" strokeWidth={2.5}/>
                            </Link>
                        </div>
                        {cleaning.length === 0 ? (
                            <p style={{ fontSize:12.5, color:'#7b8595', textAlign:'center', padding:'20px 0', margin:0 }}>No hay jornadas activas</p>
                        ) : cleaning.map((p,i) => (
                            <div key={p.id} onClick={() => router.visit(`/limpieza/${p.id}`)} style={{
                                display:'flex', alignItems:'center', gap:10,
                                padding:'9px 0', cursor:'pointer',
                                borderTop: i===0 ? 'none' : '1px solid #f3f4f8',
                            }}>
                                <div style={{ width:36, height:36, borderRadius:'50%', background:'#e8f5e9', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <Sparkles size={16} color="#16a34a" strokeWidth={2}/>
                                </div>
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:13, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                        {p.zone_name}
                                    </div>
                                    <div style={{ fontSize:11, color:'#7b8595', display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                                        <Users size={9} color="#7b8595" strokeWidth={2}/>
                                        {p.helpers_count ?? 0} voluntarios · {p.state}
                                    </div>
                                </div>
                                <span style={{ fontSize:10, fontWeight:700, background:'#dcfce7', color:'#15803d', padding:'3px 8px', borderRadius:999, flexShrink:0 }}>
                                    Activa
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Col 3 — Materiales más descargados */}
                    <div style={CARD_STYLE}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                            <span style={{ fontSize:15, fontWeight:700, color:'#2b3340' }}>Materiales</span>
                            <Link href="/materiales" style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color:'#92600e', textDecoration:'none' }}>
                                Ver todos <ArrowRight size={12} color="#92600e" strokeWidth={2.5}/>
                            </Link>
                        </div>
                        {materials.length === 0 ? (
                            <Link href="/materiales" style={{
                                textDecoration:'none', display:'flex', flexDirection:'column',
                                alignItems:'center', gap:8, padding:'20px 0', textAlign:'center',
                            }}>
                                <div style={{ width:44, height:44, borderRadius:'50%', background:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <Package size={20} color="#92600e" strokeWidth={2}/>
                                </div>
                                <span style={{ fontSize:12.5, color:'#92600e', fontWeight:600 }}>Ver recursos disponibles</span>
                            </Link>
                        ) : materials.map((m,i) => (
                            <Link key={m.id} href={`/materiales/${m.id}`} style={{
                                textDecoration:'none', display:'flex', alignItems:'center', gap:10,
                                padding:'9px 0',
                                borderTop: i===0 ? 'none' : '1px solid #f3f4f8',
                            }}>
                                <div style={{ width:36, height:36, borderRadius:10, background:'#fef9c3', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <FileText size={16} color="#92600e" strokeWidth={2}/>
                                </div>
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:12.5, fontWeight:600, color:'#2b3340', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                        {m.title}
                                    </div>
                                    <div style={{ fontSize:11, color:'#7b8595', marginTop:1 }}>
                                        {m.category ?? m.file_type?.toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
                                    <Download size={11} color="#92600e" strokeWidth={2}/>
                                    <span style={{ fontSize:11, fontWeight:700, color:'#92600e' }}>{m.download_count ?? 0}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>

                {/* ── ¿Cómo ayudar? ── */}
                <div style={CARD_STYLE}>
                    <span style={{ fontSize:16, fontWeight:700, color:'#2b3340', display:'block', marginBottom:16 }}>
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
                                <div style={{
                                    width:44, height:44, borderRadius:'50%',
                                    background: bg,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    boxShadow:'0 3px 10px rgba(16,24,40,.06)',
                                    flexShrink:0,
                                }}>
                                    <Icon size={20} color={color} strokeWidth={2}/>
                                </div>
                                <span style={{ fontSize:12.5, fontWeight:700, color:'#2b3340', lineHeight:1.2 }}>
                                    {label}
                                </span>
                                <span style={{ fontSize:11, color:'#7b8595', lineHeight:1.4, fontWeight:500 }}>
                                    {desc}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
