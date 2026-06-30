import { useForm } from '@inertiajs/react';
import { Check, MapPin, Phone, Users, Baby, AlertCircle, Heart } from 'lucide-react';
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

const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:20, padding:'20px' };
const DIV  = { height:1, background:'#f3f4f8', margin:'16px 0' };

export default function CasosPublicar() {
    const { data, setData, post, processing, errors } = useForm({
        family_name:   '',
        people_count:  1,
        has_children:  false,
        has_elderly:   false,
        is_anonymous:  false,
        description:   '',
        needs:         [],
        zone:          '',
        state:         '',
        contact_phone: '',
        photo_path:    '',
    });

    const toggleNeed = (v) =>
        setData('needs', data.needs.includes(v)
            ? data.needs.filter(n => n !== v)
            : [...data.needs, v]);

    return (
        <MainLayout>
            <div style={{ maxWidth:780, margin:'0 auto', display:'grid', gap:14 }}>

                {/* Encabezado */}
                <div>
                    <h1 style={{ margin:'0 0 3px', fontSize:22, fontWeight:800, letterSpacing:'-.5px', color:'#1a2230' }}>
                        Publicar caso
                    </h1>
                    <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>
                        Conecta tu familia con un voluntario directo. Sin intermediarios.
                    </p>
                </div>

                {/* Aviso */}
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', background:'#eef1fa', borderRadius:14, padding:'12px 14px', border:'1px solid #d0d9f0' }}>
                    <AlertCircle size={15} color="#4263ac" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
                    <p style={{ margin:0, fontSize:12, color:'#4263ac', lineHeight:1.55 }}>
                        Tu teléfono solo lo verá el voluntario que te apadrine. El caso aparece con nombre visible.
                    </p>
                </div>

                <form onSubmit={e => { e.preventDefault(); post('/casos', { forceFormData: true }); }} style={{ display:'flex', flexDirection:'column', gap:10 }}>

                    {/* Familia */}
                    <div style={CARD}>
                        <p style={{ margin:'0 0 14px', fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' }}>
                            Datos de la familia
                        </p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                            <FloatInput
                                label="Nombre de la familia *"
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
                        </div>

                        <div style={DIV}/>

                        <div style={{ display:'flex', gap:8 }}>
                            {[
                                { key:'has_children', label:'Hay niños'       },
                                { key:'has_elderly',  label:'Adultos mayores' },
                                { key:'is_anonymous', label:'Publicar anónimo'},
                            ].map(({ key, label }) => (
                                <button key={key} type="button" onClick={() => setData(key, !data[key])} style={{
                                    flex:1, padding:'9px 8px', borderRadius:11,
                                    fontSize:11.5, fontWeight:700, cursor:'pointer',
                                    border: data[key] ? '1.5px solid #4263ac' : '1.5px solid #e2e8f0',
                                    background: data[key] ? '#eef1fa' : '#fafbfd',
                                    color: data[key] ? '#4263ac' : '#64748b',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                                    fontFamily:'inherit', transition:'all .13s',
                                }}>
                                    <Baby size={12} strokeWidth={2}/>
                                    {label}
                                    {data[key] && <Check size={11} color="#4263ac" strokeWidth={2.5}/>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Situación */}
                    <div style={CARD}>
                        <p style={{ margin:'0 0 14px', fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' }}>
                            Situación y necesidades
                        </p>
                        <FloatTextarea
                            label="Describe su situación *"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            error={errors.description}
                            rows={3}
                        />

                        <div style={{ marginTop:14 }}>
                            <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'#7b8595' }}>
                                ¿Qué necesitan? *
                            </p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                {NEEDS.map(({ value, label }) => {
                                    const on = data.needs.includes(value);
                                    return (
                                        <button key={value} type="button" onClick={() => toggleNeed(value)} style={{
                                            padding:'6px 12px', borderRadius:999,
                                            fontSize:12, fontWeight:600, cursor:'pointer',
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

                    {/* Ubicación y contacto */}
                    <div style={CARD}>
                        <p style={{ margin:'0 0 14px', fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595' }}>
                            Ubicación y contacto
                        </p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
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
                                <option value="">—</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
                            <FloatInput
                                label="Tu teléfono (privado) *"
                                type="tel"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                error={errors.contact_phone}
                                icon={Phone}
                            />
                            <FloatInput
                                label="Foto (URL, opcional)"
                                type="url"
                                value={data.photo_path}
                                onChange={e => setData('photo_path', e.target.value)}
                                error={errors.photo_path}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:2 }}>
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
