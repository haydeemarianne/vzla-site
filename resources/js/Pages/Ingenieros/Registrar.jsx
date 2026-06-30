import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { Wrench, UserPlus } from 'lucide-react';

const ZONES = [
    'La Guaira', 'Maiquetía', 'Caracas', 'Vargas', 'Naiguatá',
    'Caraballeda', 'Macuto', 'Catia La Mar', 'Caracas Este',
    'Caracas Oeste', 'Los Teques', 'Miranda', 'Otra zona',
];

const SPECIALTIES = [
    'Estructural', 'Civil', 'Geotécnica', 'Sísmica',
    'Hidráulica', 'Sanitaria', 'Arquitectura', 'Otra',
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

export default function RegistrarIngeniero() {
    const { data, setData, post, processing, errors } = useForm({
        name:            '',
        email:           '',
        phone:           '',
        license_number:  '',
        specialty:       '',
        zones_available: [],
        available_until: '',
        notes:           '',
    });

    const toggleZone = (zone) => {
        setData('zones_available', data.zones_available.includes(zone)
            ? data.zones_available.filter(z => z !== zone)
            : [...data.zones_available, zone]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/ingenieros');
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f3eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Wrench size={20} color="#7c3aed" strokeWidth={2}/>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                            Registro de ingeniero voluntario
                        </h1>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                            Ofrece inspecciones estructurales gratuitas a familias afectadas por el terremoto.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Datos personales */}
                        <div style={CARD}>
                            <p style={SEC}>Datos personales</p>
                            <FloatInput
                                label="Nombre completo *"
                                value={data.name}
                                error={errors.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <FloatSelect
                                label="Especialidad *"
                                value={data.specialty}
                                error={errors.specialty}
                                onChange={e => setData('specialty', e.target.value)}
                            >
                                <option value="">— Selecciona —</option>
                                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                            <FloatInput
                                label="Correo electrónico *"
                                type="email"
                                value={data.email}
                                error={errors.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono (WhatsApp) *"
                                type="tel"
                                value={data.phone}
                                error={errors.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                            <div style={DIV}/>
                            <FloatInput
                                label="N° matrícula / colegiación (CIV)"
                                value={data.license_number}
                                onChange={e => setData('license_number', e.target.value)}
                            />
                        </div>

                        {/* Card 2 — Zonas */}
                        <div style={CARD}>
                            <p style={SEC}>Zonas donde puedes trabajar *</p>
                            <p style={{ margin: '-6px 0 0', fontSize: 11.5, color: '#7b8595' }}>
                                Selecciona todas las zonas donde puedes realizar inspecciones.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
                                {ZONES.map(zone => {
                                    const sel = data.zones_available.includes(zone);
                                    return (
                                        <button type="button" key={zone} onClick={() => toggleZone(zone)} style={{
                                            padding: '9px 10px', borderRadius: 11,
                                            border: `1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                            background: sel ? '#4263ac' : 'white',
                                            color: sel ? 'white' : '#475569',
                                            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                                            transition: 'all .13s', fontFamily: 'inherit', textAlign: 'center',
                                        }}>
                                            {zone}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.zones_available && (
                                <p style={{ margin: 0, fontSize: 11.5, color: '#CE6969', fontWeight: 500 }}>{errors.zones_available}</p>
                            )}
                        </div>

                        {/* Card 3 — Disponibilidad + notas */}
                        <div style={CARD}>
                            <p style={SEC}>Disponibilidad</p>
                            <FloatInput
                                label="Disponible hasta"
                                type="date"
                                value={data.available_until}
                                onChange={e => setData('available_until', e.target.value)}
                            />
                            <div style={DIV}/>
                            <p style={SEC}>Notas adicionales</p>
                            <FloatTextarea
                                label="Horarios, condiciones especiales, herramientas..."
                                value={data.notes}
                                rows={5}
                                onChange={e => setData('notes', e.target.value)}
                            />
                            <div style={DIV}/>
                            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e9ebf1' }}>
                                <p style={{ margin: 0, fontSize: 11.5, color: '#7b8595', lineHeight: 1.6 }}>
                                    Tu colegiatura será validada por el equipo coordinador antes de asignarte inspecciones. Te contactaremos para confirmar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={processing} style={{
                            display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px',
                            borderRadius: 13, border: 'none', background: '#7c3aed', color: 'white',
                            fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', opacity: processing ? .6 : 1,
                            boxShadow: '0 4px 14px rgba(124,58,237,.28)',
                        }}>
                            <UserPlus size={16} color="white" strokeWidth={2}/>
                            {processing ? 'Enviando...' : 'Registrarme como voluntario'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
