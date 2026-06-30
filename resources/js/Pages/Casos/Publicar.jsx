import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Check, MapPin, Phone, Users, Baby, AlertCircle, Heart, Camera, X, ShieldAlert, Users2 } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';

const STATES = [
    'Distrito Capital','Miranda','La Guaira (Vargas)','Aragua','Carabobo',
    'Anzoátegui','Bolívar','Falcón','Guárico','Lara','Mérida','Monagas',
    'Nueva Esparta','Portuguesa','Sucre','Táchira','Trujillo','Yaracuy',
    'Zulia','Amazonas','Apure','Barinas','Cojedes','Delta Amacuro',
];

const NEEDS = [
    { value: 'food',      label: 'Alimentación' },
    { value: 'water',     label: 'Agua'          },
    { value: 'medicine',  label: 'Medicamentos'  },
    { value: 'shelter',   label: 'Refugio'       },
    { value: 'clothing',  label: 'Ropa'          },
    { value: 'baby',      label: 'Bebé'          },
    { value: 'documents', label: 'Documentos'    },
    { value: 'tools',     label: 'Herramientas'  },
    { value: 'furniture', label: 'Mobiliario'    },
    { value: 'other',     label: 'Otro'          },
];

const CARD = {
    background:'white', border:'1px solid #e9ebf1', borderRadius:20, padding:'20px',
    display:'flex', flexDirection:'column', gap:14,
};
const SEC  = { margin:0, fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' };
const DIV  = { height:1, background:'#f3f4f8', flexShrink:0 };

export default function CasosPublicar() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        family_name:   '',
        people_count:  1,
        case_type:     'familiar',
        has_children:  false,
        has_elderly:   false,
        has_risk:      false,
        description:   '',
        needs:         [],
        zone:          '',
        state:         '',
        contact_phone: '',
        photo:         null,
    });

    const toggleNeed = (v) =>
        setData('needs', data.needs.includes(v)
            ? data.needs.filter(n => n !== v)
            : [...data.needs, v]);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    return (
        <MainLayout>
            <div style={{ padding:'0 4px' }}>

                {/* Encabezado */}
                <div style={{ marginBottom:14 }}>
                    <h1 style={{ margin:'0 0 3px', fontSize:22, fontWeight:800, letterSpacing:'-.5px', color:'#1a2230' }}>
                        Publicar caso
                    </h1>
                    <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>
                        Conecta tu familia con un voluntario directo. Sin intermediarios.
                    </p>
                </div>

                {/* Aviso */}
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', background:'#eef1fa', borderRadius:14, padding:'11px 14px', border:'1px solid #d0d9f0', marginBottom:14 }}>
                    <AlertCircle size={15} color="#4263ac" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
                    <p style={{ margin:0, fontSize:12, color:'#4263ac', lineHeight:1.55 }}>
                        Tu teléfono solo lo verá el voluntario que te apadrine. El caso aparece con nombre visible.
                    </p>
                </div>

                <form onSubmit={e => { e.preventDefault(); post('/casos', { forceFormData: true }); }}>

                    {/* ─── 3 cards en fila (desktop) ─── */}
                    <div className="va-publish-grid">

                        {/* Card 1 — Familia */}
                        <div style={CARD}>
                            <p style={SEC}>Datos del caso</p>

                            {/* Tipo de caso */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                                {[
                                    { val:'familiar', label:'Familiar',  Icon: Users2 },
                                    { val:'personal', label:'Personal',  Icon: Users  },
                                ].map(({ val, label, Icon }) => {
                                    const sel = data.case_type === val;
                                    return (
                                        <button key={val} type="button" onClick={() => setData('case_type', val)} style={{
                                            padding:'9px 10px', borderRadius:11,
                                            border: sel ? '1.5px solid #4263ac' : '1.5px solid #e2e8f0',
                                            background: sel ? '#eef1fa' : '#fafbfd',
                                            color: sel ? '#4263ac' : '#64748b',
                                            fontSize:12, fontWeight:700,
                                            display:'flex', alignItems:'center', gap:6,
                                            cursor:'pointer', fontFamily:'inherit',
                                        }}>
                                            <Icon size={13} strokeWidth={2}/>
                                            {label}
                                            {sel && <Check size={11} color="#4263ac" strokeWidth={2.5} style={{ marginLeft:'auto' }}/>}
                                        </button>
                                    );
                                })}
                            </div>

                            <FloatInput
                                label="Nombre de la familia o persona *"
                                value={data.family_name}
                                onChange={e => setData('family_name', e.target.value)}
                                error={errors.family_name}
                            />
                            <FloatInput
                                label="¿Cuántas personas? *"
                                type="number"
                                value={data.people_count}
                                onChange={e => setData('people_count', parseInt(e.target.value) || 1)}
                                error={errors.people_count}
                                icon={Users}
                                min={1} max={50}
                            />

                            <div style={DIV}/>

                            {/* Condiciones especiales */}
                            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                {[
                                    { key:'has_children', label:'Hay niños',          Icon: Baby         },
                                    { key:'has_elderly',  label:'Adultos mayores',    Icon: Users        },
                                    { key:'has_risk',     label:'Situación de riesgo', Icon: ShieldAlert },
                                ].map(({ key, label, Icon }) => (
                                    <button key={key} type="button" onClick={() => setData(key, !data[key])} style={{
                                        padding:'9px 12px', borderRadius:11,
                                        fontSize:12, fontWeight:700, cursor:'pointer',
                                        border: data[key] ? '1.5px solid #4263ac' : '1.5px solid #e2e8f0',
                                        background: data[key] ? '#eef1fa' : '#fafbfd',
                                        color: data[key] ? '#4263ac' : '#64748b',
                                        display:'flex', alignItems:'center', gap:7,
                                        fontFamily:'inherit', transition:'all .13s', textAlign:'left',
                                    }}>
                                        <Icon size={13} strokeWidth={2}/>
                                        <span style={{ flex:1 }}>{label}</span>
                                        {data[key] && <Check size={11} color="#4263ac" strokeWidth={2.5}/>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card 2 — Situación */}
                        <div style={CARD}>
                            <p style={SEC}>Situación y necesidades</p>
                            <FloatTextarea
                                label="Describe su situación *"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                error={errors.description}
                                rows={5}
                            />
                            <div style={DIV}/>
                            <div>
                                <p style={{ ...SEC, marginBottom:10 }}>¿Qué necesitan? *</p>
                                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                    {NEEDS.map(({ value, label }) => {
                                        const on = data.needs.includes(value);
                                        return (
                                            <button key={value} type="button" onClick={() => toggleNeed(value)} style={{
                                                padding:'5px 11px', borderRadius:999,
                                                fontSize:11.5, fontWeight:600, cursor:'pointer',
                                                border: on ? 'none' : '1.5px solid #e2e8f0',
                                                background: on ? '#4263ac' : '#f3f4f8',
                                                color: on ? '#fff' : '#475569',
                                                fontFamily:'inherit', display:'flex', alignItems:'center', gap:4,
                                                transition:'all .13s',
                                            }}>
                                                {on && <Check size={10} color="#fff" strokeWidth={2.5}/>}
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.needs && <p style={{ margin:'5px 0 0', fontSize:11, color:'#CE6969', fontWeight:500 }}>{errors.needs}</p>}
                            </div>
                        </div>

                        {/* Card 3 — Ubicación y foto */}
                        <div style={CARD}>
                            <p style={SEC}>Ubicación y contacto</p>
                            <FloatInput
                                label="Zona o sector *"
                                value={data.zone}
                                onChange={e => setData('zone', e.target.value)}
                                error={errors.zone}
                                icon={MapPin}
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
                            <FloatInput
                                label="Tu teléfono (privado) *"
                                type="tel"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                error={errors.contact_phone}
                                icon={Phone}
                            />

                            <div style={DIV}/>

                            {/* Foto */}
                            <div>
                                <p style={{ ...SEC, marginBottom:10 }}>Foto (opcional)</p>
                                {photoPreview ? (
                                    <div style={{ position:'relative' }}>
                                        <img src={photoPreview} alt="preview" style={{ width:'100%', height:150, objectFit:'cover', borderRadius:12, border:'1px solid #e9ebf1' }}/>
                                        <button type="button"
                                            onClick={() => { setPhotoPreview(null); setData('photo', null); }}
                                            style={{ position:'absolute', top:7, right:7, width:26, height:26, borderRadius:'50%', background:'rgba(15,23,42,.7)', border:'none', color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                                            <X size={13} strokeWidth={2.5}/>
                                        </button>
                                    </div>
                                ) : (
                                    <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, border:'2px dashed #e2e8f0', borderRadius:12, padding:'22px 16px', cursor:'pointer' }}>
                                        <Camera size={24} color="#94a3b8" strokeWidth={1.5}/>
                                        <span style={{ fontSize:12, color:'#64748b', fontWeight:500 }}>Toca para subir una foto</span>
                                        <input type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={handlePhoto}/>
                                    </label>
                                )}
                                {errors.photo && <p style={{ margin:'5px 0 0', fontSize:11, color:'#CE6969', fontWeight:500 }}>{errors.photo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:14 }}>
                        <button type="button" onClick={() => window.history.back()} style={{
                            padding:'10px 20px', borderRadius:12, border:'1.5px solid #e2e8f0',
                            background:'white', color:'#475569', fontSize:13, fontWeight:600,
                            cursor:'pointer', fontFamily:'inherit',
                        }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} style={{
                            display:'flex', alignItems:'center', gap:6,
                            padding:'10px 24px', borderRadius:12, border:'none',
                            background:'#4263ac', color:'white', fontSize:13.5, fontWeight:700,
                            cursor:'pointer', fontFamily:'inherit', opacity: processing ? .6 : 1,
                            boxShadow:'0 4px 14px rgba(66,99,172,.30)',
                        }}>
                            <Heart size={14} fill="white" color="white" strokeWidth={0}/>
                            {processing ? 'Publicando…' : 'Publicar caso'}
                        </button>
                    </div>

                </form>
            </div>
        </MainLayout>
    );
}
