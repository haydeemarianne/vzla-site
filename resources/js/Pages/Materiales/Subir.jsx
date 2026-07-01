import MainLayout from '@/Layouts/MainLayout';
import { FloatInput, FloatTextarea, FloatSelect } from '@/Components/UI/FloatField';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Upload, Printer, Box, AtSign, Phone } from 'lucide-react';

const PRINT_CATEGORIES = [
    { value: 'flyer',  label: 'Flyer' },
    { value: 'poster', label: 'Cartel' },
    { value: 'guide',  label: 'Guía' },
    { value: 'map',    label: 'Mapa' },
    { value: 'other',  label: 'Otro' },
];

const CATEGORIES_3D = [
    { value: '3d_construction', label: 'Construcción' },
    { value: '3d_ironwork',     label: 'Herrería / Metalurgia' },
    { value: '3d_medical',      label: 'Médico / Primeros auxilios' },
    { value: '3d_furniture',    label: 'Literas y muebles de emergencia' },
    { value: '3d_tools',        label: 'Herramientas y equipos' },
    { value: '3d_other',        label: 'Otro' },
];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

const MODE_OPTS = [
    { key: 'print', label: 'Para imprimir', Icon: Printer },
    { key: '3d',    label: 'Archivo 3D',    Icon: Box     },
];

export default function SubirMaterial() {
    const [mode, setMode] = useState('print');

    const { data, setData, post, processing, errors } = useForm({
        title:                 '',
        description:           '',
        file:                  null,
        category:              'flyer',
        subcategory:           '',
        print_instructions:    { size: '', color: '', paper: '', quantity: '', notes: '' },
        uploaded_by:           '',
        organization:          '',
        contact:               '',
        contributor_instagram: '',
        contributor_phone:     '',
        price_estimate:        '',
    });

    const setPrint = (key, value) =>
        setData('print_instructions', { ...data.print_instructions, [key]: value });

    const switchMode = (m) => {
        setMode(m);
        setData('category', m === '3d' ? '3d_construction' : 'flyer');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/materiales', { forceFormData: true });
    };

    const categories = mode === '3d' ? CATEGORIES_3D : PRINT_CATEGORIES;
    const pi = data.print_instructions;

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eef1fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Upload size={20} color="#4263ac" strokeWidth={2}/>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>
                            Subir archivo
                        </h1>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#7b8595' }}>
                            Comparte materiales imprimibles o patrones 3D para ayudar en la emergencia.
                        </p>
                    </div>
                </div>

                {/* Toggle tipo */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f4f9', padding: 4, borderRadius: 14, width: 'fit-content' }}>
                    {MODE_OPTS.map(({ key, label, Icon }) => {
                        const sel = mode === key;
                        return (
                            <button key={key} type="button" onClick={() => switchMode(key)} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 700,
                                background: sel ? 'white' : 'transparent',
                                color: sel ? '#1e293b' : '#94a3b8',
                                boxShadow: sel ? '0 1px 4px rgba(16,24,40,.08)' : 'none',
                                border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .13s',
                            }}>
                                <Icon size={12} strokeWidth={2}/> {label}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="va-publish-grid">

                        {/* Card 1 — Info básica */}
                        <div style={CARD}>
                            <p style={SEC}>Información del archivo</p>
                            <FloatInput
                                label={mode === '3d' ? 'Título del patrón *' : 'Título del material *'}
                                value={data.title}
                                error={errors.title}
                                onChange={e => setData('title', e.target.value)}
                            />
                            <FloatSelect
                                label="Categoría *"
                                value={data.category}
                                error={errors.category}
                                onChange={e => setData('category', e.target.value)}
                            >
                                {categories.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </FloatSelect>
                            <FloatTextarea
                                label={mode === '3d'
                                    ? 'Material, dimensiones aproximadas, herramienta necesaria...'
                                    : '¿Para qué sirve? ¿Cómo se usa? ¿Dónde distribuir?'
                                }
                                value={data.description}
                                rows={4}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* Card 2 — Archivo + instrucciones */}
                        <div style={CARD}>
                            <p style={SEC}>Archivo *</p>
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '2px dashed #e2e8f0', borderRadius: 14, padding: '24px 16px', cursor: 'pointer' }}>
                                <Upload size={24} color="#94a3b8" strokeWidth={1.5}/>
                                {data.file
                                    ? <span style={{ fontSize: 13, color: '#4263ac', fontWeight: 600, textAlign: 'center', wordBreak: 'break-all' }}>{data.file.name}</span>
                                    : <span style={{ fontSize: 12.5, color: '#64748b' }}>Toca para seleccionar archivo</span>
                                }
                                <span style={{ fontSize: 10.5, color: '#94a3b8' }}>
                                    {mode === '3d' ? 'STL, OBJ, GCODE, ZIP — máx 100 MB' : 'PDF, JPG, PNG, SVG — máx 20 MB'}
                                </span>
                                <input type="file"
                                    accept={mode === '3d' ? '.stl,.obj,.gcode,.zip' : '.pdf,.jpg,.jpeg,.png,.svg'}
                                    style={{ display: 'none' }}
                                    onChange={e => setData('file', e.target.files[0])}
                                />
                            </label>
                            {errors.file && <p style={{ margin: 0, fontSize: 11.5, color: '#CE6969' }}>{errors.file}</p>}

                            {mode === 'print' && (
                                <>
                                    <div style={DIV}/>
                                    <p style={SEC}>Instrucciones de impresión</p>
                                    <FloatInput label="Tamaño" value={pi.size} onChange={e => setPrint('size', e.target.value)}/>
                                    <FloatSelect label="Color" value={pi.color} onChange={e => setPrint('color', e.target.value)}>
                                        <option value="">— Especifica —</option>
                                        <option value="Color completo">Color completo</option>
                                        <option value="Blanco y negro">Blanco y negro</option>
                                        <option value="Color recomendado, B&N aceptable">Color rec., B&N aceptable</option>
                                    </FloatSelect>
                                    <FloatInput label="Tipo de papel" value={pi.paper} onChange={e => setPrint('paper', e.target.value)}/>
                                    <FloatInput label="Cantidad recomendada" value={pi.quantity} onChange={e => setPrint('quantity', e.target.value)}/>
                                    <FloatTextarea label="Notas de impresión" value={pi.notes} rows={2} onChange={e => setPrint('notes', e.target.value)}/>
                                </>
                            )}

                            {mode === '3d' && (
                                <>
                                    <div style={DIV}/>
                                    <div style={{ background: '#eef1fa', borderRadius: 12, padding: '12px 14px', border: '1px solid #d6dffa' }}>
                                        <p style={{ margin: 0, fontSize: 11.5, color: '#4263ac', lineHeight: 1.6 }}>
                                            Los archivos 3D serán visibles a constructores, herreros y fabricantes que se pondrán en contacto contigo directamente.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Card 3 — Quien sube */}
                        <div style={CARD}>
                            <p style={SEC}>Quien sube el archivo</p>
                            <FloatInput
                                label="Tu nombre completo *"
                                value={data.uploaded_by}
                                error={errors.uploaded_by}
                                onChange={e => setData('uploaded_by', e.target.value)}
                            />
                            <FloatInput
                                label="Organización / Empresa"
                                value={data.organization}
                                onChange={e => setData('organization', e.target.value)}
                            />
                            <div style={DIV}/>
                            <p style={SEC}>Contacto visible</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AtSign size={14} color="#94a3b8" strokeWidth={2} style={{ flexShrink: 0 }}/>
                                <div style={{ flex: 1 }}>
                                    <FloatInput
                                        label="Instagram (@usuario)"
                                        value={data.contributor_instagram}
                                        onChange={e => setData('contributor_instagram', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Phone size={14} color="#94a3b8" strokeWidth={2} style={{ flexShrink: 0 }}/>
                                <div style={{ flex: 1 }}>
                                    <FloatInput
                                        label="Teléfono de contacto"
                                        type="tel"
                                        value={data.contributor_phone}
                                        onChange={e => setData('contributor_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <FloatInput
                                label="Costo estimado de producción (opcional)"
                                placeholder="Ej: Bs. 5 por hoja, $0.50 c/u"
                                value={data.price_estimate}
                                onChange={e => setData('price_estimate', e.target.value)}
                            />
                            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '11px 13px', border: '1px solid #e9ebf1' }}>
                                <p style={{ margin: 0, fontSize: 11.5, color: '#7b8595', lineHeight: 1.6 }}>
                                    Tu contacto aparecerá en la tarjeta del archivo para que quienes lo descarguen puedan comunicarse contigo.
                                </p>
                            </div>
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
                            <Upload size={15} color="white" strokeWidth={2}/>
                            {processing ? 'Subiendo archivo...' : 'Subir archivo'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
