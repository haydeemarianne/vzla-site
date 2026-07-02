import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, ClipboardList } from 'lucide-react';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoátegui', 'Bolívar', 'Lara', 'Mérida', 'Monagas', 'Nueva Esparta',
    'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Yaracuy', 'Zulia',
];

const URGENCY_OPTIONS = [
    { value: 'normal',   label: 'Normal',   desc: 'Puedo esperar días',      color: '#475569', bg: '#f1f4f9', active: '#475569' },
    { value: 'urgent',   label: 'Urgente',  desc: 'Necesito acceder pronto', color: '#b45309', bg: '#fef3e2', active: '#b45309' },
    { value: 'critical', label: 'Crítico',  desc: 'Hay personas en riesgo',  color: '#CE6969', bg: '#fef2f2', active: '#CE6969' },
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

export default function SolicitarInspeccion() {
    const { data, setData, post, processing, errors } = useForm({
        address:         '',
        zone:            '',
        state:           'La Guaira (Vargas)',
        requester_name:  '',
        requester_phone: '',
        description:     '',
        structure_type:  '',
        urgency:         'normal',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ingenieros/solicitar');
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ClipboardList size={20} color="#b45309" strokeWidth={2}/>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                            Solicitar inspección estructural
                        </h1>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                            Un ingeniero voluntario evaluará tu estructura de forma gratuita.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Ubicación de la estructura */}
                        <div style={CARD}>
                            <p style={SEC}>Ubicación de la estructura</p>
                            <FloatInput
                                label="Dirección completa *"
                                value={data.address}
                                error={errors.address}
                                onChange={e => setData('address', e.target.value)}
                            />
                            <FloatInput
                                label="Zona / Sector *"
                                value={data.zone}
                                error={errors.zone}
                                onChange={e => setData('zone', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado"
                                value={data.state}
                                onChange={e => setData('state', e.target.value)}
                            >
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                            <div style={DIV}/>
                            <p style={SEC}>Tipo de estructura</p>
                            <FloatSelect
                                label="Tipo de inmueble *"
                                value={data.structure_type}
                                error={errors.structure_type}
                                onChange={e => setData('structure_type', e.target.value)}
                            >
                                <option value="">— Selecciona —</option>
                                <option value="house">Casa / Vivienda</option>
                                <option value="apartment">Apartamento</option>
                                <option value="building">Edificio</option>
                                <option value="commercial">Local comercial</option>
                                <option value="other">Otro</option>
                            </FloatSelect>
                        </div>

                        {/* Card 2 — Daños y urgencia */}
                        <div style={CARD}>
                            <p style={SEC}>Descripción de los daños</p>
                            <FloatTextarea
                                label="Grietas, paredes caídas, deformaciones, hundimientos..."
                                value={data.description}
                                rows={5}
                                onChange={e => setData('description', e.target.value)}
                            />
                            <div style={DIV}/>
                            <p style={SEC}>Nivel de urgencia *</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {URGENCY_OPTIONS.map(({ value, label, desc, color, bg, active }) => {
                                    const sel = data.urgency === value;
                                    return (
                                        <button type="button" key={value} onClick={() => setData('urgency', value)} style={{
                                            padding: '11px 8px', borderRadius: 12, textAlign: 'center',
                                            border: `1.5px solid ${sel ? active : '#e2e8f0'}`,
                                            background: sel ? bg : 'white',
                                            cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                                        }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: sel ? color : '#2b3340' }}>{label}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 10.5, lineHeight: 1.3, color: sel ? color : '#94a3b8' }}>{desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.urgency && <p style={{ margin: 0, fontSize: 11.5, color: '#CE6969' }}>{errors.urgency}</p>}
                        </div>

                        {/* Card 3 — Contacto + aviso seguridad */}
                        <div style={CARD}>
                            <p style={SEC}>Tus datos de contacto</p>
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
                            {/* Aviso de seguridad */}
                            <div style={{ background: '#fff7ed', border: '1px solid #fde7c6', borderRadius: 13, padding: '13px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <AlertTriangle size={16} color="#b45309" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
                                <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                                    <strong>No entres a la estructura</strong> hasta que un ingeniero la evalúe. Puede ser peligroso aunque parezca estable.
                                </p>
                            </div>
                            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '11px 13px', border: '1px solid #e9ebf1' }}>
                                <p style={{ margin: 0, fontSize: 11.5, color: '#7b8595', lineHeight: 1.6 }}>
                                    Un ingeniero voluntario se pondrá en contacto contigo para coordinar la visita. El servicio es completamente gratuito.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={processing} style={{
                            display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px',
                            borderRadius: 13, border: 'none', background: '#b45309', color: 'white',
                            fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', opacity: processing ? .6 : 1,
                            boxShadow: '0 4px 14px rgba(180,83,9,.28)',
                        }}>
                            <ClipboardList size={15} color="white" strokeWidth={2}/>
                            {processing ? 'Enviando solicitud...' : 'Solicitar inspección gratuita'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
