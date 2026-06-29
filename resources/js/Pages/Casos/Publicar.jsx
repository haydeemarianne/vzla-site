import { useForm } from '@inertiajs/react';
import { FiInfo, FiCheck } from 'react-icons/fi';
import MainLayout from '@/Layouts/MainLayout';

const VENEZUELAN_STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida', 'Monagas',
    'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo', 'Yaracuy',
    'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const NEEDS_OPTIONS = [
    { value: 'food',      label: 'Alimentacion' },
    { value: 'water',     label: 'Agua' },
    { value: 'medicine',  label: 'Medicamentos' },
    { value: 'clothing',  label: 'Ropa' },
    { value: 'furniture', label: 'Mobiliario' },
    { value: 'baby',      label: 'Bebe' },
    { value: 'tools',     label: 'Herramientas' },
    { value: 'documents', label: 'Documentos' },
    { value: 'shelter',   label: 'Refugio' },
    { value: 'other',     label: 'Otro' },
];

const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5 leading-snug';

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
        photo:         null,
    });

    const toggleNeed = (value) => {
        const current = data.needs;
        if (current.includes(value)) {
            setData('needs', current.filter((need) => need !== value));
        } else {
            setData('needs', [...current, value]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/casos', { forceFormData: true });
    };

    return (
        <MainLayout>
            <div className="max-w-xl mx-auto">
                <h1 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Publicar mi caso</h1>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Cuéntanos tu situacion para conectarte con un voluntario.
                </p>

                {/* Info notice */}
                <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Tu caso sera revisado antes de publicarse. Te contactaremos si necesitamos mas informacion.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* family_name */}
                    <div>
                        <label className={labelClass}>
                            Tu nombre o nombre de tu familia <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.family_name}
                            onChange={(e) => setData('family_name', e.target.value)}
                            placeholder="Ej: Familia Gonzalez"
                            className={inputClass} />
                        {errors.family_name && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.family_name}</p>
                        )}
                    </div>

                    {/* people_count */}
                    <div>
                        <label className={labelClass}>Cuantas personas son</label>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={data.people_count}
                            onChange={(e) => setData('people_count', parseInt(e.target.value) || 1)}
                            className={inputClass} />
                        {errors.people_count && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.people_count}</p>
                        )}
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3">
                        {[
                            { key: 'has_children',  label: 'Hay ninos en el grupo' },
                            { key: 'has_elderly',   label: 'Hay adultos mayores en el grupo' },
                            { key: 'is_anonymous',  label: 'Publicar de forma anonima (el publico no vera mi nombre, pero los administradores si)' },
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
                                <button
                                    type="button"
                                    onClick={() => setData(key, !data[key])}
                                    className={`w-10 h-6 rounded-full flex-shrink-0 transition-colors relative ${
                                        data[key] ? 'bg-blue-700' : 'bg-slate-200'
                                    }`}>
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                                        data[key] ? 'translate-x-5' : 'translate-x-1'
                                    }`} />
                                </button>
                                <span className="text-sm text-slate-700 leading-snug">{label}</span>
                            </label>
                        ))}
                    </div>

                    {/* description */}
                    <div>
                        <label className={labelClass}>
                            Describe tu situacion actual <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Cuéntanos que paso, dónde están, qué necesitan con mas urgencia..."
                            className={`${inputClass} resize-none`} />
                        {errors.description && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.description}</p>
                        )}
                    </div>

                    {/* needs multi-select chips */}
                    <div>
                        <label className={labelClass}>Que necesitan (selecciona todos los que apliquen)</label>
                        <div className="flex flex-wrap gap-2">
                            {NEEDS_OPTIONS.map(({ value, label }) => {
                                const active = data.needs.includes(value);
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => toggleNeed(value)}
                                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                                            active
                                                ? 'bg-blue-700 text-white border-blue-700'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                                        }`}>
                                        {active && <FiCheck className="w-3.5 h-3.5" />}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.needs && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.needs}</p>
                        )}
                    </div>

                    {/* zone */}
                    <div>
                        <label className={labelClass}>
                            Zona o sector donde estan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.zone}
                            onChange={(e) => setData('zone', e.target.value)}
                            placeholder="Ej: Sector Las Flores, Catia"
                            className={inputClass} />
                        {errors.zone && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.zone}</p>
                        )}
                    </div>

                    {/* state */}
                    <div>
                        <label className={labelClass}>
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}
                            className={inputClass}>
                            <option value="">Selecciona un estado</option>
                            {VENEZUELAN_STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        {errors.state && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.state}</p>
                        )}
                    </div>

                    {/* contact_phone */}
                    <div>
                        <label className={labelClass}>
                            Tu teléfono <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400 mb-1.5 leading-snug">Solo lo vera el voluntario que te apadrine.</p>
                        <input
                            type="tel"
                            value={data.contact_phone}
                            onChange={(e) => setData('contact_phone', e.target.value)}
                            placeholder="Ej: 0412-1234567"
                            className={inputClass} />
                        {errors.contact_phone && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.contact_phone}</p>
                        )}
                    </div>

                    {/* photo */}
                    <div>
                        <label className={labelClass}>Foto (opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files[0] ?? null)}
                            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 transition-colors" />
                        {errors.photo && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.photo}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                        {processing ? 'Enviando...' : 'Publicar mi caso'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
