import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowRight, Heart, MapPin, Share2, Plus } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────

const CARD_H = 120; // altura aprox de cada tarjeta (px)
const VISIBLE = 5;  // tarjetas visibles antes de hacer scroll en la columna

const NEED_LABELS = {
    food: 'Alimentación', water: 'Agua', medicine: 'Medicamentos',
    clothing: 'Ropa', furniture: 'Mobiliario', baby: 'Bebé',
    tools: 'Herramientas', documents: 'Documentos', shelter: 'Refugio', other: 'Otro',
};

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

const COLUMNS = [
    { key: 'open',      label: 'Sin apadrinar',  color: '#4263ac', bg: '#eef1fa', dot: '#4263ac' },
    { key: 'in_review', label: 'En evaluación',  color: '#b45309', bg: '#fef3e2', dot: '#f59e0b' },
    { key: 'adopted',   label: 'Apadrinados',    color: '#0e7490', bg: '#e0f2fe', dot: '#0e7490' },
    { key: 'resolved',  label: 'Cerrados',       color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
    { key: 'rejected',  label: 'Rechazados',     color: '#94a3b8', bg: '#f1f5f9', dot: '#94a3b8' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name, anon) {
    if (anon) return 'FA';
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function daysSince(date) {
    if (!date) return 1;
    return Math.max(1, Math.floor((Date.now() - new Date(date)) / 86400000));
}

function fmtShort(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
}

function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

function shareCase(c) {
    const url  = `${window.location.origin}/casos/${c.id}`;
    const name = c.is_anonymous ? 'Una familia' : c.family_name;
    const text = `${name} necesita apoyo urgente. Apadrínalos directamente en Venezuela Ayuda.`;
    if (navigator.share) {
        navigator.share({ title: `${name} — Venezuela Ayuda`, text, url }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url).then(() => alert('¡Enlace copiado!')).catch(() => {});
    }
}

// ─── Tarjeta ──────────────────────────────────────────────────────────────────

function CaseCard({ c, idx }) {
    const needs      = parseNeeds(c.needs);
    const days       = daysSince(c.created_at);
    const fecha      = fmtShort(c.created_at);
    const name       = c.is_anonymous ? 'Familia anónima' : (c.family_name ?? 'Familia');
    const isOpen     = c.status === 'open';
    const tasks      = c.tasks ?? [];
    const tasksDone  = tasks.filter(t => t.status === 'done').length;
    const tasksTaken = tasks.filter(t => t.status !== 'pending').length;
    const tasksTotal = tasks.length;

    return (
        <div
            onClick={() => router.visit(`/casos/${c.id}`)}
            style={{
                background: '#fff', borderRadius: 12,
                boxShadow: '0 1px 6px rgba(16,24,40,.06)',
                padding: '9px 11px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 5,
                flexShrink: 0,
            }}
        >
            {/* Fila 1: avatar + nombre + ubicación */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {c.photo_path ? (
                    <img src={`/storage/${c.photo_path}`} alt="" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                ) : (
                    <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background: PASTEL[idx % PASTEL.length], display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:10, fontWeight:700, color:'#3a4250' }}>{initials(c.family_name, c.is_anonymous)}</span>
                    </div>
                )}
                <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'#1e293b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                        <MapPin size={9} color="#94a3b8" strokeWidth={2}/>
                        <span style={{ fontSize:10.5, color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {[c.zone, c.state].filter(Boolean).join(', ')}{c.people_count ? ` · ${c.people_count}p` : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Fila 2: chips de necesidades */}
            {needs.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {needs.slice(0, 2).map(n => (
                        <span key={n} style={{ background:'#f1f4f9', color:'#334155', fontSize:9.5, fontWeight:600, padding:'1px 6px', borderRadius:4 }}>
                            {NEED_LABELS[n] ?? n}
                        </span>
                    ))}
                    {needs.length > 2 && (
                        <span style={{ background:'#f1f4f9', color:'#94a3b8', fontSize:9.5, fontWeight:600, padding:'1px 6px', borderRadius:4 }}>+{needs.length - 2}</span>
                    )}
                </div>
            )}

            {/* Fila 3: barra de tareas (solo si existen) */}
            {tasksTotal > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ flex:1, height:2, borderRadius:999, background:'#f1f4f9', overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:999, background: tasksDone === tasksTotal ? '#16a34a' : '#4263ac', width: `${Math.round((tasksDone/tasksTotal)*100)}%`, transition:'width .3s' }}/>
                    </div>
                    <span style={{ fontSize:9.5, color:'#94a3b8', fontWeight:600, whiteSpace:'nowrap' }}>{tasksDone}/{tasksTotal}</span>
                </div>
            )}

            {/* Fila 4: fecha + días + acciones */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f1f4f9', paddingTop:5, marginTop:1 }}>
                <span style={{ fontSize:10, fontWeight:600, color:'#94a3b8' }}>
                    {fecha} · <span style={{ color: days > 14 ? '#CE6969' : '#94a3b8' }}>{days}d</span>
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={e => { e.stopPropagation(); shareCase(c); }}
                        style={{ width:22, height:22, borderRadius:'50%', background:'#f1f4f9', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Share2 size={10} color="#64748b" strokeWidth={2}/>
                    </button>
                    {isOpen && (
                        <Link href={`/casos/${c.id}`} onClick={e => e.stopPropagation()}
                            style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, fontWeight:700, color:'#4263ac', textDecoration:'none' }}>
                            Apadrinar <ArrowRight size={11} color="#4263ac" strokeWidth={2.5}/>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Columna ──────────────────────────────────────────────────────────────────

function Column({ col, cases }) {
    return (
        <div style={{ width:268, flexShrink:0, display:'flex', flexDirection:'column', gap:8, height:'100%' }}>

            {/* Header fijo */}
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 11px', background:col.bg, borderRadius:11, flexShrink:0 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:col.dot, flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:700, color:col.color, flex:1 }}>{col.label}</span>
                <span style={{ fontSize:11, fontWeight:700, color:'#fff', background:col.color, minWidth:20, height:20, borderRadius:'50%', padding:'0 4px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {cases.length}
                </span>
            </div>

            {/* Cards — scroll individual, altura fija ~4 tarjetas */}
            <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                overflowY: 'auto', overflowX: 'hidden',
                maxHeight: VISIBLE * CARD_H,
                paddingRight: 2,
                scrollbarWidth: 'thin',
                scrollbarColor: '#e2e8f0 transparent',
                flex: 1,
            }}>
                {cases.length === 0 ? (
                    <div style={{ background:'#fff', borderRadius:14, padding:'20px 13px', textAlign:'center', boxShadow:'0 2px 8px rgba(16,24,40,.04)' }}>
                        <Heart size={18} color="#e2e8f0" strokeWidth={2} style={{ display:'block', margin:'0 auto 5px' }}/>
                        <p style={{ fontSize:11.5, color:'#cbd5e1', margin:0, fontWeight:500 }}>Ningún caso</p>
                    </div>
                ) : (
                    cases.map((c, i) => <CaseCard key={c.id} c={c} idx={i}/>)
                )}
            </div>
        </div>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CasosIndex({ by_status }) {
    const open      = by_status?.open      ?? [];
    const in_review = by_status?.in_review ?? [];
    const adopted   = by_status?.adopted   ?? [];
    const resolved  = by_status?.resolved  ?? [];
    const rejected  = by_status?.rejected  ?? [];
    const total     = open.length + in_review.length + adopted.length + resolved.length + rejected.length;

    const byKey = { open, in_review, adopted, resolved, rejected };

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 64px)', overflow:'hidden', padding:'16px 0 0', fontFamily:"'Onest', system-ui, sans-serif" }}>

                {/* Encabezado */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'0 20px', marginBottom:14, flexShrink:0 }}>
                    <div>
                        <h1 style={{ margin:0, fontSize:20, fontWeight:700, letterSpacing:'-0.4px', color:'#1e293b' }}>Tablero de casos</h1>
                        <p style={{ margin:'3px 0 0', fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                            {open.length} sin apadrinar · {total} en total
                        </p>
                    </div>
                    <Link href="/casos/publicar" style={{ display:'flex', alignItems:'center', gap:4, background:'#4263ac', color:'#fff', fontSize:12, fontWeight:700, padding:'8px 13px', borderRadius:11, textDecoration:'none', flexShrink:0 }}>
                        <Plus size={13} color="#fff" strokeWidth={2.5}/> Publicar
                    </Link>
                </div>

                {/* Kanban — scroll horizontal, sin scroll de página */}
                <div style={{ display:'flex', gap:10, overflowX:'auto', padding:'2px 20px 20px', flex:1, alignItems:'flex-start', scrollbarWidth:'none' }}>
                    {COLUMNS.map(col => (
                        <Column key={col.key} col={col} cases={byKey[col.key] ?? []}/>
                    ))}
                </div>
            </div>

            <style>{`
                div::-webkit-scrollbar { width: 4px; height: 4px; }
                div::-webkit-scrollbar-track { background: transparent; }
                div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
            `}</style>
        </MainLayout>
    );
}
