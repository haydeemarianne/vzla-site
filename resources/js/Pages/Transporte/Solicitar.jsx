import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { Truck, TriangleAlert } from 'lucide-react';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoátegui', 'Bolívar', 'Falcón', 'Guárico', 'Lara', 'Mérida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const CARGO_OPTIONS = [
    { value: 'supplies', label: 'Insumos',   desc: 'Agua, comida, medicamentos, ropa' },
    { value: 'debris',   label: 'Escombros', desc: 'Materiales de construcción' },
    { value: 'people',   label: 'Personas',  desc: 'Evacuación o traslado' },
];

const URGENCY_OPTIONS = [
    { value: 'normal', label: 'Normal',  desc: 'Puede esperar horas' },
    { value: 'urgent', label: 'Urgente', desc: 'Lo necesito hoy' },
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

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
        post('/transporte/solicitar');
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fef3e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Truck size={20} color="#b45309" strokeWidth={2}/>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                            Necesito transporte
                        </h1>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                            Publica tu solicitud y un conductor voluntario se pondrá en contacto contigo.
                        </p>
                    </div>
                </div>

                {/* Aviso emergencias */}
                <div style={{ background: '#fef3e2', border: '1px solid #fed7aa', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <TriangleAlert size={15} color="#b45309" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
                    <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                        <strong>Para emergencias médicas</strong> llama al 171 o 112 — este módulo es para traslado de insumos y evacuación no urgente.
                    </p>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Qué + urgencia */}
                        <div style={CARD}>
                            <p style={SEC}>¿Qué necesitas transportar? *</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
                                {CARGO_OPTIONS.map(({ value, label, desc }) => {
                                    const sel = data.cargo_type === value;
                                    return (
                                        <button type="button" key={value} onClick={() => setData('cargo_type', value)} style={{
                                            padding: '10px 8px', borderRadius: 12, border: `1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                            background: sel ? '#4263ac' : 'white', textAlign: 'left',
                                            cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                                        }}>
                                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: sel ? 'white' : '#2b3340' }}>{label}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 10, lineHeight: 1.3, color: sel ? 'rgba(255,255,255,.7)' : '#7b8595' }}>{desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={DIV}/>
                            <p style={SEC}>Urgencia</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {URGENCY_OPTIONS.map(({ value, label, desc }) => {
                                    const sel   = data.urgency === value;
                                    const color = value === 'urgent' ? '#b45309' : '#4263ac';
                                    const bg    = value === 'urgent' ? '#fef3e2' : '#eef1fa';
                                    return (
                                        <button type="button" key={value} onClick={() => setData('urgency', value)} style={{
                                            padding: '10px 12px', borderRadius: 12,
                                            border: `1.5px solid ${sel ? color : '#e2e8f0'}`,
                                            background: sel ? bg : 'white', textAlign: 'left',
                                            cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                                        }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: sel ? color : '#2b3340' }}>{label}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 11, color: sel ? color : '#7b8595', opacity: sel ? .7 : 1 }}>{desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={DIV}/>
                            <p style={SEC}>Descripción *</p>
                            <FloatTextarea
                                label="¿Qué necesitas mover? Ej: 4 cajas de agua, 2 adultos..."
                                value={data.description}
                                error={errors.description}
                                rows={3}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* Card 2 — Origen + destino */}
                        <div style={CARD}>
                            <p style={SEC}>Punto de origen *</p>
                            <FloatInput
                                label="Zona / sector de origen"
                                value={data.origin_zone}
                                error={errors.origin_zone}
                                onChange={e => setData('origin_zone', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado de origen"
                                value={data.origin_state}
                                onChange={e => setData('origin_state', e.target.value)}
                            >
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                            <div style={DIV}/>
                            <p style={SEC}>Punto de destino *</p>
                            <FloatInput
                                label="Zona / sector de destino"
                                value={data.destination_zone}
                                error={errors.destination_zone}
                                onChange={e => setData('destination_zone', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado de destino"
                                value={data.destination_state}
                                onChange={e => setData('destination_state', e.target.value)}
                            >
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                        </div>

                        {/* Card 3 — Contacto + notas */}
                        <div style={CARD}>
                            <p style={SEC}>Tu contacto</p>
                            <FloatInput
                                label="Tu nombre completo *"
                                value={data.requester_name}
                                error={errors.requester_name}
                                onChange={e => setData('requester_name', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono (WhatsApp) *"
                                type="tel"
                                value={data.requester_phone}
                                error={errors.requester_phone}
                                onChange={e => setData('requester_phone', e.target.value)}
                            />
                            <div style={DIV}/>
                            <p style={SEC}>Información adicional</p>
                            <FloatTextarea
                                label="Peso aproximado, acceso al lugar, horario disponible..."
                                value={data.notes}
                                rows={5}
                                onChange={e => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={processing} style={{
                            display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px',
                            borderRadius: 13, border: 'none', background: '#4263ac', color: 'white',
                            fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', opacity: processing ? .6 : 1,
                            boxShadow: '0 4px 14px rgba(66,99,172,.28)',
                        }}>
                            <Truck size={15} color="white" strokeWidth={2}/>
                            {processing ? 'Publicando...' : 'Publicar solicitud de transporte'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
