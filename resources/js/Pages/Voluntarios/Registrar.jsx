import { useForm } from '@inertiajs/react';
import { FiInfo } from 'react-icons/fi';
import MainLayout from '@/Layouts/MainLayout';

const VENEZUELAN_STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida', 'Monagas',
    'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo', 'Yaracuy',
    'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5 leading-snug';

export default function VoluntariosRegistrar() {
    const { data, setData, post, processing, errors } = useForm({
        name:       '',
        cedula:     '',
        phone:      '',
        email:      '',
        city:       '',
        state:      '',
        motivation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/voluntarios/registrar');
    };

    return (
        <MainLayout>
            <div className="max-w-xl mx-auto">
                <h1 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Ser voluntario</h1>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Registrate para poder apadrinar casos y conectar con familias que necesitan ayuda.
                </p>

                {/* Info notice */}
                <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Tu registro sera revisado. Una vez aprobado, podras apadrinar casos y contactar familias.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* name */}
                    <div>
                        <label className={labelClass}>
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej: Maria Gonzalez"
                            className={inputClass} />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.name}</p>
                        )}
                    </div>

                    {/* cedula */}
                    <div>
                        <label className={labelClass}>Cedula de identidad (opcional)</label>
                        <input
                            type="text"
                            value={data.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                            placeholder="Ej: V-12345678"
                            className={inputClass} />
                        {errors.cedula && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.cedula}</p>
                        )}
                    </div>

                    {/* phone */}
                    <div>
                        <label className={labelClass}>
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400 mb-1.5 leading-snug">
                            Lo usaras para identificarte al apadrinar un caso.
                        </p>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Ej: 0412-1234567"
                            className={inputClass} />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.phone}</p>
                        )}
                    </div>

                    {/* email */}
                    <div>
                        <label className={labelClass}>Correo electronico (opcional)</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu@correo.com"
                            className={inputClass} />
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.email}</p>
                        )}
                    </div>

                    {/* city */}
                    <div>
                        <label className={labelClass}>Ciudad o municipio</label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="Ej: Caracas"
                            className={inputClass} />
                        {errors.city && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.city}</p>
                        )}
                    </div>

                    {/* state */}
                    <div>
                        <label className={labelClass}>Estado</label>
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

                    {/* motivation */}
                    <div>
                        <label className={labelClass}>
                            Por qué quieres ser voluntario <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={data.motivation}
                            onChange={(e) => setData('motivation', e.target.value)}
                            placeholder="Cuéntanos qué te motiva a ayudar y cómo puedes contribuir..."
                            className={`${inputClass} resize-none`} />
                        {errors.motivation && (
                            <p className="text-xs text-red-600 mt-1 leading-snug">{errors.motivation}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                        {processing ? 'Enviando...' : 'Registrarme como voluntario'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
