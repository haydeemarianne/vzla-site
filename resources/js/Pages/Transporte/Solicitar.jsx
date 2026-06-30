import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { Truck, TriangleAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoátegui', 'Bolívar', 'Falcón', 'Guárico', 'Lara', 'Mérida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const CARGO_OPTIONS = [
    { value: 'supplies', label: 'Insumos',   desc: 'Agua, comida, medicamentos, ropa' },
    { value: 'debris',   label: 'Escombros', desc: 'Materiales pequeños de construcción' },
    { value: 'people',   label: 'Personas',  desc: 'Evacuación o traslado no urgente' },
];

const URGENCY_OPTIONS = [
    { value: 'normal', label: 'Normal',  desc: 'Puede esperar horas' },
    { value: 'urgent', label: 'Urgente', desc: 'Lo necesito hoy' },
];

const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:24, padding:'24px 22px' };
const SECTION = { fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595', marginBottom:12 };

export default function SolicitarTransporte() {
    const { data, setData, post, processing, errors } = useForm({
        cargo_type:        'supplies',
        description:       '',
        origin_zone:       '',
        origin_state:      'La Guaira (Vargas)',
        destination_zone:  '',
        destination_state: 'La Guaira (Vargas)',
        urgency:           'normal',
        requester_name:    '',
        requester_phone:   '',
        notes:             '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/transporte/solicitar', {
            onSuccess: () => toast.success('Solicitud publicada. Un conductor se pondrá en contacto.'),
        });
    };

    return (
        <MainLayout>
            <div style={{ maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

                {/* Encabezado */}
                <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <div style={{ width:36, height:36, borderRadius:11, background:'#fef3e2', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Truck size={18} color="#b45309" strokeWidth={2}/>
                        </div>
                        <div>
                            <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#1a2230', letterSpacing:'-.5px' }}>
                                Necesito transporte
                            </h1>
                            <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>
                                Publica tu solicitud y un conductor voluntario se pondrá en contacto contigo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Aviso */}
                <div style={{ background:'#fef3e2', border:'1px solid #fed7aa', borderRadius:14, padding:'10px 14px', display:'flex', gap:10, alignItems:'flex-start' }}>
                    <TriangleAlert size={15} color="#b45309" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
                    <p style={{ margin:0, fontSize:12, color:'#92400e', lineHeight:1.5 }}>
                        <strong>Para emergencias médicas</strong> llama al 171 o 112 — este módulo es para traslado de insumos y evacuación no urgente.
                    </p>
                </div>

                <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

                    {/* Tipo de carga */}
                    <div style={CARD}>
                        <p style={SECTION}>¿Qué necesitas transportar? *</p>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
                            {CARGO_OPTIONS.map(({ value, label, desc }) => {
                                const sel = data.cargo_type === value;
                                return (
                                    <button type="button" key={value} onClick={() => setData('cargo_type', value)} style={{
                                        padding:'10px 8px', borderRadius:12, border:`1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                        background: sel ? '#4263ac' : 'white', textAlign:'left',
                                        cursor:'pointer', transition:'all .13s', fontFamily:'inherit',
                                    }}>
                                        <p style={{ margin:0, fontSize:12.5, fontWeight:700, color: sel?'white':'#2b3340' }}>{label}</p>
                                        <p style={{ margin:'3px 0 0', fontSize:10.5, lineHeight:1.3, color: sel?'rgba(255,255,255,.75)':'#7b8595' }}>{desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div style={CARD}>
                        <p style={SECTION}>Descripción *</p>
                        <FloatTextarea
                            label="¿Qué necesitas mover? Ej: 4 cajas de agua, 2 adultos..."
                            value={data.description}
                            error={errors.description}
                            rows={3}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    {/* Origen y destino */}
                    <div style={CARD}>
                        <p style={SECTION}>Punto de origen *</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                            <FloatInput
                                label="Zona / sector de origen"
                                value={data.origin_zone}
                                error={errors.origin_zone}
                                onChange={(e) => setData('origin_zone', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado de origen"
                                value={data.origin_state}
                                onChange={(e) => setData('origin_state', e.target.value)}
                            >
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                        </div>

                        <p style={{ ...SECTION, marginTop:20 }}>Punto de destino *</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                            <FloatInput
                                label="Zona / sector de destino"
                                value={data.destination_zone}
                                error={errors.destination_zone}
                                onChange={(e) => setData('destination_zone', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado de destino"
                                value={data.destination_state}
                                onChange={(e) => setData('destination_state', e.target.value)}
                            >
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                        </div>
                    </div>

                    {/* Urgencia */}
                    <div style={CARD}>
                        <p style={SECTION}>Urgencia</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                            {URGENCY_OPTIONS.map(({ value, label, desc }) => {
                                const sel = data.urgency === value;
                                const color = value === 'urgent' ? '#b45309' : '#4263ac';
                                const bg    = value === 'urgent' ? '#b45309' : '#4263ac';
                                return (
                                    <button type="button" key={value} onClick={() => setData('urgency', value)} style={{
                                        padding:'10px 12px', borderRadius:12, border:`1.5px solid ${sel ? bg : '#e2e8f0'}`,
                                        background: sel ? bg : 'white', textAlign:'left',
                                        cursor:'pointer', transition:'all .13s', fontFamily:'inherit',
                                    }}>
                                        <p style={{ margin:0, fontSize:13, fontWeight:700, color: sel?'white':'#2b3340' }}>{label}</p>
                                        <p style={{ margin:'3px 0 0', fontSize:11, color: sel?'rgba(255,255,255,.75)':'#7b8595' }}>{desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notas */}
                    <div style={CARD}>
                        <p style={SECTION}>Información adicional</p>
                        <FloatTextarea
                            label="Peso aproximado, acceso al lugar, horario disponible..."
                            value={data.notes}
                            rows={3}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </div>

                    {/* Contacto */}
                    <div style={CARD}>
                        <p style={SECTION}>Tu contacto</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                            <FloatInput
                                label="Tu nombre *"
                                value={data.requester_name}
                                error={errors.requester_name}
                                onChange={(e) => setData('requester_name', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono *"
                                type="tel"
                                value={data.requester_phone}
                                error={errors.requester_phone}
                                onChange={(e) => setData('requester_phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="va-btn va-btn--primary va-btn--full va-btn--lg">
                        {processing ? 'Publicando...' : 'Publicar solicitud de transporte'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
