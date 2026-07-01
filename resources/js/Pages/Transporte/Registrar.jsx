import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { Truck, MapPin } from 'lucide-react';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoátegui', 'Bolívar', 'Falcón', 'Guárico', 'Lara', 'Mérida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const ZONES = [
    'La Guaira', 'Maiquetía', 'Catia La Mar', 'Naiguatá', 'Caraballeda',
    'Macuto', 'Caracas (centro)', 'Caracas (este)', 'Caracas (oeste)',
    'Los Teques', 'Guarenas / Guatire', 'Otra zona',
];

const VEHICLE_OPTIONS = [
    { value: 'moto',   label: 'Moto',      desc: 'Rápida, rutas estrechas' },
    { value: 'car',    label: 'Carro',     desc: 'Hasta 4 personas o carga liviana' },
    { value: 'pickup', label: 'Camioneta', desc: 'Carga media o grupos' },
    { value: 'truck',  label: 'Camión',    desc: 'Carga pesada o voluminosa' },
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

export default function RegistrarConductor() {
    const { data, setData, post, processing, errors } = useForm({
        name:         '',
        phone:        '',
        vehicle_type: 'car',
        capacity:     '',
        zones:        [],
        state:        'La Guaira (Vargas)',
        notes:        '',
    });

    const toggleZone = (zone) => {
        setData('zones', data.zones.includes(zone)
            ? data.zones.filter(z => z !== zone)
            : [...data.zones, zone]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/transporte/registrar');
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Truck size={20} color="#4263ac" strokeWidth={2}/>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                            Registrarme como conductor voluntario
                        </h1>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                            Tu vehículo puede marcar la diferencia. Los solicitantes verán tu contacto y te llamarán directamente.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Datos personales */}
                        <div style={CARD}>
                            <p style={SEC}>Tus datos</p>
                            <FloatInput
                                label="Tu nombre completo *"
                                value={data.name}
                                error={errors.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono (WhatsApp) *"
                                type="tel"
                                value={data.phone}
                                error={errors.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                            <div style={DIV}/>
                            <p style={SEC}>Tipo de vehículo *</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {VEHICLE_OPTIONS.map(({ value, label, desc }) => {
                                    const sel = data.vehicle_type === value;
                                    return (
                                        <button type="button" key={value} onClick={() => setData('vehicle_type', value)} style={{
                                            padding: '10px 8px', borderRadius: 12, textAlign: 'left',
                                            border: `1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                            background: sel ? '#4263ac' : 'white',
                                            cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                                        }}>
                                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: sel ? 'white' : '#2b3340' }}>{label}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 10, lineHeight: 1.3, color: sel ? 'rgba(255,255,255,.7)' : '#7b8595' }}>{desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Card 2 — Zonas */}
                        <div style={CARD}>
                            <p style={SEC}>Zonas donde puedes operar</p>
                            <p style={{ margin: '-6px 0 0', fontSize: 11.5, color: '#7b8595' }}>
                                Selecciona todas las zonas a las que puedes llegar.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                                {ZONES.map(zone => {
                                    const sel = data.zones.includes(zone);
                                    return (
                                        <button type="button" key={zone} onClick={() => toggleZone(zone)} style={{
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            padding: '8px 10px', borderRadius: 11, textAlign: 'left',
                                            border: `1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                            background: sel ? '#4263ac' : 'white',
                                            cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                                        }}>
                                            <MapPin size={10} color={sel ? 'rgba(255,255,255,.8)' : '#94a3b8'} strokeWidth={2} style={{ flexShrink: 0 }}/>
                                            <span style={{ fontSize: 11.5, fontWeight: 600, color: sel ? 'white' : '#475569' }}>{zone}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Card 3 — Capacidad + estado + notas */}
                        <div style={CARD}>
                            <p style={SEC}>Capacidad y disponibilidad</p>
                            <FloatInput
                                label="Capacidad aproximada"
                                value={data.capacity}
                                onChange={e => setData('capacity', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado base"
                                value={data.state}
                                onChange={e => setData('state', e.target.value)}
                            >
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                            <div style={DIV}/>
                            <p style={SEC}>Notas adicionales</p>
                            <FloatTextarea
                                label="Horario disponible, restricciones, condiciones especiales..."
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
                            {processing ? 'Registrando...' : 'Registrarme como conductor voluntario'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
