import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Camera, X } from 'lucide-react';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoátegui', 'Bolívar', 'Falcón', 'Guárico', 'Lara', 'Mérida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const TYPE_OPTIONS = [
    { value: 'domestic', label: 'Basura doméstica',  desc: 'Bolsas, desechos del hogar' },
    { value: 'debris',   label: 'Escombros',          desc: 'Materiales de construcción' },
    { value: 'both',     label: 'Ambos tipos',        desc: 'Mezcla de basura y escombros' },
];

const VOLUME_OPTIONS = [
    { value: 'low',    label: 'Poco',     desc: 'Manejable, puntual' },
    { value: 'medium', label: 'Bastante', desc: 'Requiere varios voluntarios' },
    { value: 'high',   label: 'Mucho',    desc: 'Zona crítica, urgente' },
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

function ToggleGrid({ options, value, onChange, active = '#4263ac' }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
            {options.map(({ value: v, label, desc }) => {
                const sel = value === v;
                return (
                    <button type="button" key={v} onClick={() => onChange(v)} style={{
                        padding: '10px 8px', borderRadius: 12, border: `1.5px solid ${sel ? active : '#e2e8f0'}`,
                        background: sel ? active : 'white', textAlign: 'left',
                        cursor: 'pointer', transition: 'all .13s', fontFamily: 'inherit',
                    }}>
                        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: sel ? 'white' : '#2b3340' }}>{label}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 10.5, lineHeight: 1.3, color: sel ? 'rgba(255,255,255,.75)' : '#7b8595' }}>{desc}</p>
                    </button>
                );
            })}
        </div>
    );
}

export default function ReportarLimpieza() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors, setError } = useForm({
        zone_name:      '',
        city:           '',
        state:          'La Guaira (Vargas)',
        address:        '',
        type:           '',
        volume:         '',
        photo:          null,
        reporter_name:  '',
        reporter_phone: '',
        notes:          '',
    });

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        let hasError = false;
        if (!data.type) {
            setError('type', 'Selecciona el tipo de desecho.');
            hasError = true;
        }
        if (!data.volume) {
            setError('volume', 'Selecciona la cantidad estimada.');
            hasError = true;
        }
        if (!data.photo) {
            setError('photo', 'La foto es requerida para identificar el punto.');
            hasError = true;
        }
        if (hasError) return;
        post('/limpieza', { forceFormData: true });
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Encabezado */}
                <div>
                    <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                        Reportar punto de limpieza
                    </h1>
                    <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                        La basura acumulada post-sismo es un riesgo sanitario. Repórtala para coordinar la limpieza.
                    </p>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Ubicación + quién reporta */}
                        <div style={CARD}>
                            <p style={SEC}>Ubicación</p>
                            <FloatInput
                                label="Nombre del sector / zona *"
                                value={data.zone_name}
                                error={errors.zone_name}
                                onChange={e => setData('zone_name', e.target.value)}
                            />
                            <FloatInput
                                label="Ciudad / Municipio *"
                                value={data.city}
                                error={errors.city}
                                onChange={e => setData('city', e.target.value)}
                            />
                            <FloatSelect
                                label="Estado"
                                value={data.state}
                                onChange={e => setData('state', e.target.value)}
                            >
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FloatSelect>
                            <FloatInput
                                label="Dirección de referencia *"
                                value={data.address}
                                error={errors.address}
                                onChange={e => setData('address', e.target.value)}
                            />

                            <div style={DIV}/>

                            <p style={SEC}>Quién reporta</p>
                            <FloatInput
                                label="Tu nombre completo *"
                                value={data.reporter_name}
                                error={errors.reporter_name}
                                onChange={e => setData('reporter_name', e.target.value)}
                            />
                            <FloatInput
                                label="Teléfono *"
                                type="tel"
                                value={data.reporter_phone}
                                error={errors.reporter_phone}
                                onChange={e => setData('reporter_phone', e.target.value)}
                            />
                        </div>

                        {/* Card 2 — Tipo y volumen */}
                        <div style={CARD}>
                            <p style={SEC}>Tipo de desecho *</p>
                            <ToggleGrid
                                options={TYPE_OPTIONS}
                                value={data.type}
                                onChange={v => setData('type', v)}
                            />
                            {errors.type && <p style={{ margin: '-6px 0 0', fontSize: 11.5, color: '#CE6969', fontWeight: 500 }}>{errors.type}</p>}

                            <div style={DIV}/>

                            <p style={SEC}>Cantidad / volumen *</p>
                            <ToggleGrid
                                options={VOLUME_OPTIONS}
                                value={data.volume}
                                onChange={v => setData('volume', v)}
                                active="#CE6969"
                            />
                            {errors.volume && <p style={{ margin: '-6px 0 0', fontSize: 11.5, color: '#CE6969', fontWeight: 500 }}>{errors.volume}</p>}
                        </div>

                        {/* Card 3 — Foto + notas */}
                        <div style={CARD}>
                            <p style={SEC}>Foto del punto *</p>
                            <p style={{ margin: '-6px 0 0', fontSize: 11.5, color: '#7b8595' }}>
                                Una foto ayuda a los voluntarios a identificar el lugar.
                            </p>
                            {photoPreview ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={photoPreview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14, border: '1px solid #e9ebf1' }}/>
                                    <button type="button" onClick={() => { setPhotoPreview(null); setData('photo', null); }}
                                        style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(15,23,42,.7)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={14} strokeWidth={2.5}/>
                                    </button>
                                </div>
                            ) : (
                                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '2px dashed #e2e8f0', borderRadius: 14, padding: '32px 16px', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                                    <Camera size={28} color="#94a3b8" strokeWidth={1.5}/>
                                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Toca para tomar o subir una foto</span>
                                    <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto}/>
                                </label>
                            )}
                            {errors.photo && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#CE6969', fontWeight: 500 }}>{errors.photo}</p>}

                            <div style={DIV}/>

                            <p style={SEC}>Descripción adicional</p>
                            <FloatTextarea
                                label="Días acumulados, acceso al lugar, peligros..."
                                value={data.notes}
                                rows={4}
                                onChange={e => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={processing} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '11px 28px',
                            borderRadius: 13, border: 'none', background: '#4263ac', color: 'white',
                            fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', opacity: processing ? .6 : 1,
                            boxShadow: '0 4px 14px rgba(66,99,172,.30)',
                        }}>
                            {processing ? 'Enviando reporte...' : 'Reportar punto de limpieza'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
