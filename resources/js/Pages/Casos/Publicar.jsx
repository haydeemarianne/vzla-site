import { useForm } from '@inertiajs/react';
import { Check, MapPin, Phone, Users, Baby, AlertCircle } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

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

const S = {
    field: {
        width: '100%', boxSizing: 'border-box',
        border: '1.5px solid #e2e8f0', borderRadius: 13,
        padding: '11px 14px', fontSize: 14,
        fontFamily: "'Onest', system-ui, sans-serif",
        color: '#1e293b', background: '#fff', outline: 'none',
    },
    label: {
        display: 'block', fontSize: 12.5, fontWeight: 700,
        color: '#374151', marginBottom: 6,
    },
    err: { fontSize: 11.5, color: '#CE6969', marginTop: 4, fontWeight: 500 },
};

function Field({ label, error, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <label style={S.label}>{label}</label>
            {children}
            {error && <p style={S.err}>{error}</p>}
        </div>
    );
}

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
            <div style={{ padding: '20px 20px 100px', fontFamily: "'Onest', system-ui, sans-serif" }}>
                <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, letterSpacing: '-.4px', color: '#1e293b' }}>
                    Publicar caso
                </h1>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                    Conecta tu familia con un voluntario directo.
                </p>

                {/* Aviso privacidad teléfono */}
                <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: '#eef1fa', borderRadius: 12, padding: '12px 14px', marginBottom: 20,
                }}>
                    <AlertCircle size={16} color="#4263ac" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: 12.5, color: '#4263ac', lineHeight: 1.5 }}>
                        Tu teléfono solo lo verá el voluntario que te apadrine. El caso aparece con nombre visible.
                    </p>
                </div>

                <form
                    onSubmit={e => { e.preventDefault(); post('/casos', { forceFormData: true }); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                    {/* Nombre */}
                    <Field label="Nombre de la familia *" error={errors.family_name}>
                        <input
                            style={S.field} type="text"
                            value={data.family_name}
                            onChange={e => setData('family_name', e.target.value)}
                            placeholder="Ej: Familia González Pérez"
                        />
                    </Field>

                    {/* Personas */}
                    <Field label="¿Cuántas personas son? *" error={errors.people_count}>
                        <div style={{ position: 'relative' }}>
                            <Users size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                style={{ ...S.field, paddingLeft: 36 }}
                                type="number" min={1} max={50}
                                value={data.people_count}
                                onChange={e => setData('people_count', parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </Field>

                    {/* Niños / Adultos mayores */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {[
                            { key: 'has_children', label: 'Hay niños' },
                            { key: 'has_elderly',  label: 'Adultos mayores' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setData(key, !data[key])}
                                style={{
                                    flex: 1, padding: '10px 8px', borderRadius: 12, fontSize: 12.5,
                                    fontWeight: 600, cursor: 'pointer',
                                    border: data[key] ? '1.5px solid #4263ac' : '1.5px solid #e2e8f0',
                                    background: data[key] ? '#eef1fa' : '#fff',
                                    color: data[key] ? '#4263ac' : '#64748b',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    fontFamily: 'inherit',
                                }}
                            >
                                <Baby size={14} strokeWidth={2} />
                                {label}
                                {data[key] && <Check size={12} color="#4263ac" strokeWidth={2.5} />}
                            </button>
                        ))}
                    </div>

                    {/* Descripción */}
                    <Field label="Describe su situación *" error={errors.description}>
                        <textarea
                            style={{ ...S.field, resize: 'none', lineHeight: 1.6 }}
                            rows={4}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="¿Qué pasó? ¿Dónde están? ¿Qué necesitan con más urgencia?"
                        />
                    </Field>

                    {/* Necesidades */}
                    <Field label="¿Qué necesitan? *" error={errors.needs}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {NEEDS.map(({ value, label }) => {
                                const on = data.needs.includes(value);
                                return (
                                    <button
                                        key={value} type="button"
                                        onClick={() => toggleNeed(value)}
                                        style={{
                                            padding: '7px 13px', borderRadius: 999,
                                            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                                            border: on ? 'none' : '1.5px solid #e2e8f0',
                                            background: on ? '#4263ac' : '#fff',
                                            color: on ? '#fff' : '#475569',
                                            fontFamily: 'inherit',
                                            display: 'flex', alignItems: 'center', gap: 5,
                                        }}
                                    >
                                        {on && <Check size={11} color="#fff" strokeWidth={2.5} />}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    {/* Zona */}
                    <Field label="Zona o sector donde están *" error={errors.zone}>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                style={{ ...S.field, paddingLeft: 36 }}
                                type="text"
                                value={data.zone}
                                onChange={e => setData('zone', e.target.value)}
                                placeholder="Ej: Sector Las Flores, Catia"
                            />
                        </div>
                    </Field>

                    {/* Estado */}
                    <Field label="Estado *" error={errors.state}>
                        <select
                            style={{ ...S.field, cursor: 'pointer' }}
                            value={data.state}
                            onChange={e => setData('state', e.target.value)}
                        >
                            <option value="">Selecciona un estado</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>

                    {/* Teléfono */}
                    <Field label="Tu teléfono (privado) *" error={errors.contact_phone}>
                        <div style={{ position: 'relative' }}>
                            <Phone size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                style={{ ...S.field, paddingLeft: 36 }}
                                type="tel"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                placeholder="0412-1234567"
                            />
                        </div>
                    </Field>

                    {/* Foto URL */}
                    <Field label="Foto de la familia (URL, opcional)" error={errors.photo_path}>
                        <input
                            style={S.field} type="url"
                            value={data.photo_path}
                            onChange={e => setData('photo_path', e.target.value)}
                            placeholder="https://…/foto.jpg"
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 14,
                            background: processing ? '#83A2DB' : '#4263ac',
                            color: '#fff', border: 'none', fontSize: 15, fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        {processing ? 'Publicando…' : 'Publicar caso'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
