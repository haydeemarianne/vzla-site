import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

const ZONES = [
    'La Guaira', 'Maiquetía', 'Caracas', 'Vargas', 'Naiguatá',
    'Caraballeda', 'Macuto', 'Catia La Mar', 'Otra zona',
];

const SPECIALTIES = [
    'Estructural', 'Civil', 'Geotécnica', 'Sísmica',
    'Hidráulica', 'Sanitaria', 'Arquitectura', 'Otra',
];

const CARD = { background:'white', border:'1px solid #e9ebf1', borderRadius:24, padding:'24px 22px' };
const SECTION = { fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#7b8595', marginBottom:12 };

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
            ? data.zones_available.filter((z) => z !== zone)
            : [...data.zones_available, zone]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/ingenieros', {
            onSuccess: () => toast.success('Registro recibido. Será verificado pronto. Gracias.'),
        });
    };

    return (
        <MainLayout>
            <div style={{ maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

                {/* Encabezado */}
                <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <div style={{ width:36, height:36, borderRadius:11, background:'#f3eeff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Wrench size={18} color="#7c3aed" strokeWidth={2}/>
                        </div>
                        <div>
                            <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#1a2230', letterSpacing:'-.5px' }}>
                                Registro de ingeniero voluntario
                            </h1>
                            <p style={{ margin:0, fontSize:12.5, color:'#7b8595' }}>
                                Ofrece inspecciones estructurales gratuitas a familias afectadas por el terremoto.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

                    {/* Datos personales */}
                    <div style={CARD}>
                        <p style={SECTION}>Datos personales</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                            <FloatInput
                                label="Nombre completo *"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <FloatSelect
                                label="Especialidad *"
                                value={data.specialty}
                                error={errors.specialty}
                                onChange={(e) => setData('specialty', e.target.value)}
                            >
                                <option value=""/>
                                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14 }}>
                            <FloatInput
                                label="Email *"
                                type="email"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono *"
                                type="tel"
                                value={data.phone}
                                error={errors.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>
                        <div style={{ marginTop:14 }}>
                            <FloatInput
                                label="N° de matrícula / colegiación"
                                value={data.license_number}
                                onChange={(e) => setData('license_number', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Zonas */}
                    <div style={CARD}>
                        <p style={SECTION}>Zonas donde puedes trabajar *</p>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
                            {ZONES.map((zone) => {
                                const sel = data.zones_available.includes(zone);
                                return (
                                    <button type="button" key={zone} onClick={() => toggleZone(zone)} style={{
                                        padding:'9px 8px', borderRadius:12, border:`1.5px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                        background: sel ? '#4263ac' : 'white',
                                        color: sel ? 'white' : '#475569',
                                        fontSize:12.5, fontWeight:600, cursor:'pointer',
                                        transition:'all .13s', fontFamily:'inherit',
                                    }}>
                                        {zone}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.zones_available && <p style={{ margin:'6px 0 0', fontSize:11.5, color:'#CE6969', fontWeight:500 }}>{errors.zones_available}</p>}
                    </div>

                    {/* Disponibilidad y notas */}
                    <div style={CARD}>
                        <p style={SECTION}>Disponibilidad</p>
                        <FloatInput
                            label="Disponible hasta"
                            type="date"
                            value={data.available_until}
                            onChange={(e) => setData('available_until', e.target.value)}
                        />
                        <div style={{ marginTop:14 }}>
                            <FloatTextarea
                                label="Notas adicionales"
                                value={data.notes}
                                rows={3}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="va-btn va-btn--primary va-btn--full va-btn--lg">
                        {processing ? 'Enviando...' : 'Registrarme como voluntario'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
