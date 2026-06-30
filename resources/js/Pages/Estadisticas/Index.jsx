import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { BarChart2, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

const CARD = {
    background: 'white',
    border: '1px solid #e9ebf1',
    borderRadius: 24,
    padding: '20px 22px',
};

function Trend({ today = 0, yesterday = 0 }) {
    const diff = today - yesterday;
    if (diff > 0) return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color:'#16a34a', background:'#dcfce7', padding:'2px 8px', borderRadius:999 }}>
            <TrendingUp size={11} strokeWidth={2.5}/> +{diff} vs ayer
        </span>
    );
    if (diff < 0) return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color:'#CE6969', background:'#fbeaea', padding:'2px 8px', borderRadius:999 }}>
            <TrendingDown size={11} strokeWidth={2.5}/> {diff} vs ayer
        </span>
    );
    return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color:'#7b8595', background:'#f1f4f9', padding:'2px 8px', borderRadius:999 }}>
            <Minus size={11} strokeWidth={2.5}/> igual que ayer
        </span>
    );
}

function StatBlock({ value, label, color, bg, today, yesterday }) {
    return (
        <div style={{ background:bg, borderRadius:16, padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:34, fontWeight:800, color, lineHeight:1, letterSpacing:'-.7px' }}>{value}</div>
            <div style={{ fontSize:12, color:'#7b8595', fontWeight:600 }}>{label}</div>
            {today !== undefined && <Trend today={today} yesterday={yesterday}/>}
        </div>
    );
}

export default function EstadisticasIndex({ stats_today = {}, stats_yesterday = {} }) {
    const t = stats_today;
    const y = stats_yesterday;

    const STATS = [
        { value: t.cases_new       ?? 0, label:'Casos nuevos hoy',       color:'#CE6969', bg:'#fbeaea', today: t.cases_new,     yesterday: y.cases_new     },
        { value: t.cases_adopted   ?? 0, label:'Casos apadrinados hoy',  color:'#16a34a', bg:'#dcfce7', today: t.cases_adopted, yesterday: y.cases_adopted },
        { value: t.cleaning_active ?? 0, label:'Jornadas activas',        color:'#0369a1', bg:'#e0f2fe'                                                     },
        { value: t.engineers       ?? 0, label:'Ingenieros registrados',  color:'#7c3aed', bg:'#f3eeff'                                                     },
        { value: t.transport_open  ?? 0, label:'Traslados abiertos',      color:'#b45309', bg:'#fef3e2'                                                     },
        { value: t.inspections_open?? 0, label:'Inspecciones abiertas',   color:'#92600e', bg:'#fef9c3'                                                     },
    ];

    return (
        <MainLayout>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* Header */}
                <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <div style={{ width:36, height:36, borderRadius:11, background:'#eef1fa', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <BarChart2 size={18} color="#4263ac" strokeWidth={2}/>
                        </div>
                        <div>
                            <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#1a2230', letterSpacing:'-.5px' }}>Estadísticas</h1>
                            <p style={{ margin:0, fontSize:12, color:'#7b8595' }}>Actividad del día de hoy</p>
                        </div>
                    </div>
                </div>

                {/* Grid de stats del día */}
                <div style={CARD}>
                    <p style={{ margin:'0 0 14px', fontSize:13, fontWeight:700, color:'#2b3340' }}>Hoy</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }} className="va-stats-grid">
                        {STATS.map(s => <StatBlock key={s.label} {...s}/>)}
                    </div>
                </div>

                {/* Próximamente */}
                <div style={{ ...CARD, textAlign:'center', padding:'36px 24px' }}>
                    <BarChart2 size={32} color="#d0d6e4" strokeWidth={1.5} style={{ margin:'0 auto 12px' }}/>
                    <p style={{ margin:'0 0 6px', fontSize:15, fontWeight:700, color:'#2b3340' }}>Gráficos y noticias — próximamente</p>
                    <p style={{ margin:'0 0 16px', fontSize:12.5, color:'#7b8595', lineHeight:1.5 }}>
                        Aquí irán evolución diaria, noticias oficiales y alertas importantes.
                    </p>
                    <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12.5, fontWeight:600, color:'#4263ac', textDecoration:'none' }}>
                        Volver al inicio <ArrowRight size={13} strokeWidth={2.5}/>
                    </Link>
                </div>

            </div>
        </MainLayout>
    );
}
