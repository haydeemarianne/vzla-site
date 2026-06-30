import { useForm } from '@inertiajs/react';
import { Check, MapPin, Phone, Users, Baby, AlertCircle } from 'lucide-react';
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
    { value: 'water',     label: 'Agua' },
    { value: 'medicine',  label: 'Medicamentos' },
    { value: 'shelter',   label: 'Refugio' },
    { value: 'clothing',  label: 'Ropa' },
    { value: 'baby',      label: 'Bebé' },
    { value: 'documents', label: 'Documentos' },
    { value: 'tools',     label: 'Herramientas' },
    { value: 'furniture', label: 'Mobiliario' },
    { value: 'other',     label: 'Otro' },
];

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
            <div style={{ padding: '24px 20px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>

                {/* Encabezado */}
                <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, letterSpacing: '-.5px', color: '#1e293b' }}>
                    Publicar caso
                </h1>
                <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                    Conecta tu familia con un voluntario directo.
                </p>

                {/* Aviso privacidad */}
                <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: '#eef1fa', borderRadius: 13, padding: '13px 15px', marginBottom: 28,
                    border: '1px solid #d0d9f0',
                }}>
                    <AlertCircle size={16} color="#4263ac" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: 12.5, color: '#4263ac', lineHeight: 1.55 }}>
                        Tu teléfono solo lo verá el voluntario que te apadrine.
                        El caso aparece con nombre visible.
                    </p>
                </div>

                <form
                    onSubmit={e => { e.preventDefault(); post('/casos', { forceFormData: true }); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
                >
                    {/* Nombre */}
                    <FloatInput
                        label="Nombre de la familia *"
                        value={data.family_name}
                        onChange={e => setData('family_name', e.target.value)}
                        error={errors.family_name}
                        placeholder=" "
                    />

                    {/* Personas */}
                    <FloatInput
                        label="¿Cuántas personas son? *"
                        type="number"
                        value={data.people_count}
                        onChange={e => setData('people_count', parseInt(e.target.value) || 1)}
                        error={errors.people_count}
                        icon={Users}
                        min={1} max={50}
                        placeholder=" "
                    />

                    {/* Niños / Adultos mayores */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {[
                            { key: 'has_children', label: 'Hay niños' },
                            { key: 'has_elderly',  label: 'Adultos mayores' },
                        ].map(({ key, label }) => (
                            <button
                                key={key} type="button"
                                onClick={() => setData(key, !data[key])}
                                style={{
                                    flex: 1, padding: '12px 10px',
                                    borderRadius: 13, fontSize: 13,
                                    fontWeight: 700, cursor: 'pointer',
                                    border: data[key] ? '1.5px solid #4263ac' : '1.5px solid #e2e8f0',
                                    background: data[key] ? '#eef1fa' : '#fff',
                                    color: data[key] ? '#4263ac' : '#64748b',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                    fontFamily: 'inherit',
                                    transition: 'all .15s',
                                    boxShadow: data[key] ? '0 0 0 3px rgba(66,99,172,.09)' : 'none',
                                }}
                            >
                                <Baby size={14} strokeWidth={2} />
                                {label}
                                {data[key] && <Check size={12} color="#4263ac" strokeWidth={2.5} />}
                            </button>
                        ))}
                    </div>

                    {/* Descripción */}
                    <FloatTextarea
                        label="Describe su situación *"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        error={errors.description}
                        rows={4}
                        placeholder=" "
                    />

                    {/* Necesidades */}
                    <div>
                        <p style={{
                            margin: '0 0 10px', fontSize: 12, fontWeight: 700,
                            color: '#64748b', letterSpacing: '.4px', textTransform: 'uppercase',
                        }}>
                            ¿Qué necesitan? *
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {NEEDS.map(({ value, label }) => {
                                const on = data.needs.includes(value);
                                return (
                                    <button
                                        key={value} type="button"
                                        onClick={() => toggleNeed(value)}
                                        style={{
                                            padding: '8px 14px', borderRadius: 999,
                                            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                                            border: on ? 'none' : '1.5px solid #e2e8f0',
                                            background: on ? '#4263ac' : '#f8fafc',
                                            color: on ? '#fff' : '#475569',
                                            fontFamily: 'inherit',
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            transition: 'all .13s',
                                        }}
                                    >
                                        {on && <Check size={11} color="#fff" strokeWidth={2.5} />}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.needs && (
                            <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#CE6969', fontWeight: 500 }}>
                                {errors.needs}
                            </p>
                        )}
                    </div>

                    {/* Zona */}
                    <FloatInput
                        label="Zona o sector donde están *"
                        value={data.zone}
                        onChange={e => setData('zone', e.target.value)}
                        error={errors.zone}
                        icon={MapPin}
                        placeholder=" "
                    />

                    {/* Estado */}
                    <FloatSelect
                        label="Estado *"
                        value={data.state}
                        onChange={e => setData('state', e.target.value)}
                        error={errors.state}
                    >
                        <option value="">—</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </FloatSelect>

                    {/* Teléfono */}
                    <FloatInput
                        label="Tu teléfono (privado) *"
                        type="tel"
                        value={data.contact_phone}
                        onChange={e => setData('contact_phone', e.target.value)}
                        error={errors.contact_phone}
                        icon={Phone}
                        placeholder=" "
                    />

                    {/* Foto URL */}
                    <FloatInput
                        label="Foto de la familia (URL, opcional)"
                        type="url"
                        value={data.photo_path}
                        onChange={e => setData('photo_path', e.target.value)}
                        error={errors.photo_path}
                        placeholder=" "
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="va-btn va-btn--primary va-btn--full va-btn--lg"
                        style={{ marginTop: 4 }}
                    >
                        {processing ? 'Publicando…' : 'Publicar caso'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
