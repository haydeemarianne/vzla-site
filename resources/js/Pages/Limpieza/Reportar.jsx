import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FiCamera, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const TYPE_OPTIONS = [
    { value: 'domestic', label: 'Basura domestica',     desc: 'Bolsas, desechos del hogar' },
    { value: 'debris',   label: 'Escombros y basura',   desc: 'Materiales de construccion, ruinas' },
    { value: 'both',     label: 'Ambos tipos',           desc: 'Mezcla de basura y escombros' },
];

const VOLUME_OPTIONS = [
    { value: 'low',    label: 'Poco',     desc: 'Un punto puntual, manejable' },
    { value: 'medium', label: 'Bastante', desc: 'Requiere varios voluntarios' },
    { value: 'high',   label: 'Mucho',    desc: 'Zona critica, urgente' },
];

export default function ReportarLimpieza() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        zone_name:      '',
        city:           '',
        state:          'La Guaira (Vargas)',
        address:        '',
        type:           'domestic',
        volume:         'medium',
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
        post('/limpieza', {
            forceFormData: true,
            onSuccess: () => toast.success('Punto reportado. Gracias por ayudar.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Reportar punto de limpieza</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        La basura acumulada post-sismo es un riesgo sanitario. Reportala para coordinar la limpieza.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">

                    {/* Ubicacion */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nombre del sector / zona *</label>
                            <input className={inputClass} value={data.zone_name}
                                onChange={(e) => setData('zone_name', e.target.value)}
                                placeholder="Barrio El Carmen, Urb. Los Pinos..." />
                            {errors.zone_name && <p className="text-red-500 text-xs mt-1">{errors.zone_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Ciudad / Municipio</label>
                            <input className={inputClass} value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="La Guaira, Maiquetia..." />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Estado</label>
                            <select className={inputClass} value={data.state}
                                onChange={(e) => setData('state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Direccion de referencia</label>
                            <input className={inputClass} value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Frente al mercado, esquina..." />
                        </div>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className={labelClass}>Tipo de desecho *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TYPE_OPTIONS.map(({ value, label, desc }) => (
                                <button type="button" key={value} onClick={() => setData('type', value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.type === value
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    <p className="font-semibold text-xs">{label}</p>
                                    <p className={`text-[10px] mt-0.5 leading-tight ${data.type === value ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Volumen */}
                    <div>
                        <label className={labelClass}>Cantidad / volumen *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {VOLUME_OPTIONS.map(({ value, label, desc }) => (
                                <button type="button" key={value} onClick={() => setData('volume', value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.volume === value
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    <p className="font-semibold text-xs">{label}</p>
                                    <p className={`text-[10px] mt-0.5 leading-tight ${data.volume === value ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Foto — obligatoria */}
                    <div>
                        <label className={labelClass}>Foto del punto *</label>
                        <p className="text-xs text-slate-400 mb-2">Una foto es esencial para que los voluntarios puedan identificar el lugar.</p>
                        {photoPreview ? (
                            <div className="relative">
                                <img src={photoPreview} className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                                <button type="button"
                                    onClick={() => { setPhotoPreview(null); setData('photo', null); }}
                                    className="absolute top-2 right-2 w-7 h-7 bg-slate-800/80 text-white rounded-full flex items-center justify-center">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-10 cursor-pointer hover:border-blue-400 transition-colors">
                                <FiCamera className="w-7 h-7 text-slate-400" />
                                <span className="text-sm text-slate-500">Toca para tomar o subir una foto</span>
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
                            </label>
                        )}
                        {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className={labelClass}>Descripcion adicional</label>
                        <textarea className={`${inputClass} resize-none`} rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Dias que lleva acumulado, acceso al lugar, peligros..." />
                    </div>

                    {/* Reportante */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">Quien reporta</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Tu nombre *</label>
                                <input className={inputClass} value={data.reporter_name}
                                    onChange={(e) => setData('reporter_name', e.target.value)} />
                                {errors.reporter_name && <p className="text-red-500 text-xs mt-1">{errors.reporter_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Telefono *</label>
                                <input className={inputClass} value={data.reporter_phone}
                                    onChange={(e) => setData('reporter_phone', e.target.value)}
                                    placeholder="+58 412 000 0000" />
                                {errors.reporter_phone && <p className="text-red-500 text-xs mt-1">{errors.reporter_phone}</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Enviando reporte...' : 'Reportar punto de limpieza'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
