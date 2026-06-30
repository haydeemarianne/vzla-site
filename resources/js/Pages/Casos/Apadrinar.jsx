import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Heart, MapPin, Phone, User, CreditCard, Mail, Building2, ShieldCheck } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';

const STATES = [
    'Distrito Capital','Miranda','La Guaira (Vargas)','Aragua','Carabobo',
    'Anzoátegui','Bolívar','Falcón','Guárico','Lara','Mérida','Monagas',
    'Nueva Esparta','Portuguesa','Sucre','Táchira','Trujillo','Yaracuy',
    'Zulia','Amazonas','Apure','Barinas','Cojedes','Delta Amacuro',
];

const NEED_LABEL = {
    food:'Alimentación', water:'Agua', medicine:'Medicamentos', clothing:'Ropa',
    furniture:'Mobiliario', baby:'Bebé', tools:'Herramientas', documents:'Documentos',
    shelter:'Refugio', other:'Otro',
};

const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:20, padding:'20px', display:'flex', flexDirection:'column', gap:14 };
const SEC  = { margin:0, fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' };
const DIV  = { height:1, background:'#f3f4f8' };

function parseNeeds(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

export default function CasosApadrinar({ supportCase }) {
    const { data, setData, post, processing, errors } = useForm({
        name:       '',
        cedula:     '',
        phone:      '',
        email:      '',
        city:       '',
        state:      '',
        motivation: '',
    });

    const needs      = parseNeeds(supportCase.needs);
    const caseName   = supportCase.is_anonymous ? 'Familia anónima' : (supportCase.family_name ?? 'Familia');

    return (
        <MainLayout>
            <div style={{ padding:'0 4px' }}>

                <Link href={`/casos/${supportCase.id}`} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:'#64748b', textDecoration:'none', marginBottom:16 }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Volver al caso
                </Link>

                {/* Encabezado */}
                <div style={{ marginBottom:16 }}>
                    <h1 style={{ margin:'0 0 3px', fontSize:22, fontWeight:800, letterSpacing:'-.5px', color:'#1a2230' }}>
                        Quiero ser padrino
                    </h1>
                    <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>
                        Tu solicitud será revisada por el equipo de coordinación. Te contactaremos para confirmar.
                    </p>
                </div>

                <div className="va-publish-grid">

                    {/* Card 1 — Resumen del caso */}
                    <div style={CARD}>
                        <p style={SEC}>Caso a apadrinar</p>

                        <div style={{ background:'#f8fafc', borderRadius:14, padding:'14px' }}>
                            <div style={{ fontSize:14, fontWeight:800, color:'#1e293b', marginBottom:6 }}>{caseName}</div>
                            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:10 }}>
                                <MapPin size={11} color="#94a3b8" strokeWidth={2}/>
                                <span style={{ fontSize:12, color:'#94a3b8' }}>
                                    {[supportCase.zone, supportCase.state].filter(Boolean).join(', ')}
                                </span>
                            </div>
                            {needs.length > 0 && (
                                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                                    {needs.map(n => (
                                        <span key={n} style={{ background:'white', border:'1px solid #e9ebf1', color:'#334155', fontSize:10.5, fontWeight:600, padding:'3px 9px', borderRadius:999 }}>
                                            {NEED_LABEL[n] ?? n}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={DIV}/>

                        {/* Qué implica ser padrino */}
                        <p style={SEC}>¿Qué implica?</p>
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                            {[
                                { Icon:ShieldCheck, text:'El equipo verifica tu identidad y motivación' },
                                { Icon:Heart,       text:'Cubre las necesidades de esta familia directamente' },
                                { Icon:Phone,       text:'Recibes el contacto directo de la familia al ser aprobado' },
                            ].map(({ Icon, text }) => (
                                <div key={text} style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
                                    <div style={{ width:28, height:28, borderRadius:8, background:'#eef1fa', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                        <Icon size={13} color="#4263ac" strokeWidth={2}/>
                                    </div>
                                    <span style={{ fontSize:12, color:'#334155', lineHeight:1.5, paddingTop:5 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 2 — Datos personales */}
                    <div style={CARD}>
                        <p style={SEC}>Tus datos</p>
                        <FloatInput
                            label="Nombre completo *"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            error={errors.name}
                            icon={User}
                        />
                        <FloatInput
                            label="Cédula de identidad *"
                            value={data.cedula}
                            onChange={e => setData('cedula', e.target.value)}
                            error={errors.cedula}
                            icon={CreditCard}
                        />
                        <FloatInput
                            label="Teléfono (WhatsApp) *"
                            type="tel"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            error={errors.phone}
                            icon={Phone}
                        />
                        <FloatInput
                            label="Correo electrónico (opcional)"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            error={errors.email}
                            icon={Mail}
                        />
                        <div style={DIV}/>
                        <FloatInput
                            label="Ciudad / Municipio *"
                            value={data.city}
                            onChange={e => setData('city', e.target.value)}
                            error={errors.city}
                            icon={Building2}
                        />
                        <FloatSelect
                            label="Estado *"
                            value={data.state}
                            onChange={e => setData('state', e.target.value)}
                            error={errors.state}
                        >
                            <option value="">— Selecciona —</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </FloatSelect>
                    </div>

                    {/* Card 3 — Motivación */}
                    <div style={CARD}>
                        <p style={SEC}>¿Por qué quieres ayudar?</p>
                        <FloatTextarea
                            label="Cuéntanos tu motivación *"
                            value={data.motivation}
                            onChange={e => setData('motivation', e.target.value)}
                            error={errors.motivation}
                            rows={6}
                        />

                        <div style={DIV}/>

                        {/* Aviso privacidad */}
                        <div style={{ background:'#f8fafc', borderRadius:12, padding:'12px 14px', border:'1px solid #e9ebf1' }}>
                            <p style={{ margin:0, fontSize:11.5, color:'#7b8595', lineHeight:1.6 }}>
                                Tus datos solo serán vistos por el equipo coordinador. No se publican ni comparten con terceros. Al enviar aceptas ser contactado para verificar tu solicitud.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <form onSubmit={e => { e.preventDefault(); post(`/casos/${supportCase.id}/apadrinar`); }}>
                    {/* Hidden fields — el form real usa los del useForm */}
                </form>

                <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:14 }}>
                    <Link href={`/casos/${supportCase.id}`} style={{ padding:'10px 20px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'white', color:'#475569', fontSize:13, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center' }}>
                        Cancelar
                    </Link>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => post(`/casos/${supportCase.id}/apadrinar`)}
                        style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 24px', borderRadius:12, border:'none', background:'#4263ac', color:'white', fontSize:13.5, fontWeight:700, cursor: processing ? 'not-allowed' : 'pointer', fontFamily:'inherit', opacity: processing ? .6 : 1, boxShadow:'0 4px 14px rgba(66,99,172,.30)' }}
                    >
                        <Heart size={14} fill="white" color="white" strokeWidth={0}/>
                        {processing ? 'Enviando…' : 'Enviar solicitud'}
                    </button>
                </div>

            </div>
        </MainLayout>
    );
}
