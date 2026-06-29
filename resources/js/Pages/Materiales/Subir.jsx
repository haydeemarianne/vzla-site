import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FiUpload, FiBox, FiPrinter, FiInstagram, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PRINT_CATEGORIES = [
    { value: 'flyer',  label: 'Flyer' },
    { value: 'poster', label: 'Cartel' },
    { value: 'guide',  label: 'Guia' },
    { value: 'map',    label: 'Mapa' },
    { value: 'other',  label: 'Otro' },
];

const CATEGORIES_3D = [
    { value: '3d_construction', label: 'Construccion' },
    { value: '3d_ironwork',     label: 'Herreria / Metalurgia' },
    { value: '3d_medical',      label: 'Medico / Primeros auxilios' },
    { value: '3d_furniture',    label: 'Literas y muebles de emergencia' },
    { value: '3d_tools',        label: 'Herramientas y equipos' },
    { value: '3d_other',        label: 'Otro' },
];

const ACCEPT_PRINT = '.pdf,.jpg,.jpeg,.png,.svg';
const ACCEPT_3D    = '.stl,.obj,.gcode,.zip';

export default function SubirMaterial() {
    const [mode, setMode] = useState('print');

    const { data, setData, post, processing, errors, reset } = useForm({
        title:                  '',
        description:            '',
        file:                   null,
        category:               'flyer',
        subcategory:            '',
        print_instructions:     { size: '', color: '', paper: '', quantity: '', notes: '' },
        uploaded_by:            '',
        organization:           '',
        contact:                '',
        contributor_instagram:  '',
        contributor_phone:      '',
    });

    const setPrint = (key, value) =>
        setData('print_instructions', { ...data.print_instructions, [key]: value });

    const switchMode = (m) => {
        setMode(m);
        setData('category', m === '3d' ? '3d_construction' : 'flyer');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/materiales', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Archivo subido. Gracias por contribuir.');
                reset();
            },
        });
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Subir archivo</h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Comparte materiales imprimibles o patrones 3D para ayudar en la emergencia.
                    </p>
                </div>

                {/* Mode selector */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
                    <button type="button" onClick={() => switchMode('print')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            mode === 'print' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}>
                        <FiPrinter className="w-4 h-4" /> Para imprimir
                    </button>
                    <button type="button" onClick={() => switchMode('3d')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            mode === '3d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}>
                        <FiBox className="w-4 h-4" /> Archivo 3D
                    </button>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Titulo *</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder={mode === '3d' ? 'Ej: Patron de litera plegable emergencia' : 'Ej: Flyer de busqueda de personas'}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Categoria *</label>
                        <select
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}>
                            {(mode === '3d' ? CATEGORIES_3D : PRINT_CATEGORIES).map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Descripcion</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={mode === '3d'
                                ? 'Material, dimensiones aproximadas, herramienta necesaria...'
                                : 'Para que sirve, como se usa, donde distribuir...'
                            }
                        />
                    </div>

                    {/* File upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            {mode === '3d' ? 'Archivo 3D * (STL, OBJ, GCODE, ZIP — max 100MB)' : 'Archivo * (PDF, JPG, PNG, SVG — max 20MB)'}
                        </label>
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => document.getElementById('mat-file').click()}>
                            <FiUpload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            {data.file
                                ? <p className="text-sm text-blue-600 font-medium">{data.file.name}</p>
                                : <p className="text-sm text-slate-400">Clic para seleccionar archivo</p>
                            }
                            <input
                                id="mat-file"
                                type="file"
                                accept={mode === '3d' ? ACCEPT_3D : ACCEPT_PRINT}
                                className="hidden"
                                onChange={(e) => setData('file', e.target.files[0])}
                            />
                        </div>
                        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                    </div>

                    {/* Print instructions — only for printables */}
                    {mode === 'print' && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Instrucciones de impresion</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tamano</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.print_instructions.size}
                                        onChange={(e) => setPrint('size', e.target.value)}
                                        placeholder="A4, A3, Carta..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Color</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.print_instructions.color}
                                        onChange={(e) => setPrint('color', e.target.value)}>
                                        <option value="">Especifique...</option>
                                        <option value="Color completo">Color completo</option>
                                        <option value="Blanco y negro">Blanco y negro</option>
                                        <option value="Color recomendado, B&N aceptable">Color recomendado, B&N aceptable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de papel</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.print_instructions.paper}
                                        onChange={(e) => setPrint('paper', e.target.value)}
                                        placeholder="Bond 75g, Couche, Sulfite..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad recomendada</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.print_instructions.quantity}
                                        onChange={(e) => setPrint('quantity', e.target.value)}
                                        placeholder="Ej: 500 copias por zona"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Notas adicionales</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={2}
                                    value={data.print_instructions.notes}
                                    onChange={(e) => setPrint('notes', e.target.value)}
                                    placeholder="Doblez, distribucion sugerida, instrucciones especiales..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Contributor info */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">Quien sube el archivo</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre *</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.uploaded_by}
                                    onChange={(e) => setData('uploaded_by', e.target.value)}
                                />
                                {errors.uploaded_by && <p className="text-red-500 text-xs mt-1">{errors.uploaded_by}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Organizacion / Empresa</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.organization}
                                    onChange={(e) => setData('organization', e.target.value)}
                                    placeholder="Cruz Roja, ONG, Independiente..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                    <FiInstagram className="w-3.5 h-3.5" /> Instagram
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.contributor_instagram}
                                    onChange={(e) => setData('contributor_instagram', e.target.value)}
                                    placeholder="@usuario"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                    <FiPhone className="w-3.5 h-3.5" /> Telefono de contacto
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.contributor_phone}
                                    onChange={(e) => setData('contributor_phone', e.target.value)}
                                    placeholder="+58 412 000 0000"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Subiendo...' : 'Subir archivo'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
