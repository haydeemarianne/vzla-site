import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const NEEDS = [
    { key: 'water',         label: 'Agua potable' },
    { key: 'food',          label: 'Comida' },
    { key: 'medical',       label: 'Atencion medica' },
    { key: 'rescue',        label: 'Rescate' },
    { key: 'shelter',       label: 'Refugio' },
    { key: 'electricity',   label: 'Electricidad' },
    { key: 'communication', label: 'Comunicacion / senal' },
    { key: 'other',         label: 'Otro' },
];

const URGENCY_OPTIONS = [
    { value: 'normal',   label: 'Normal',  desc: 'Necesitan ayuda pero no es inmediata',  badge: 'border-slate-300 text-slate-600' },
    { value: 'high',     label: 'Alto',    desc: 'Situacion seria, requiere atencion pronto', badge: 'border-amber-400 text-amber-700 bg-amber-50' },
    { value: 'critical', label: 'Critico', desc: 'Emergencia inmediata, riesgo de vida',   badge: 'border-red-400 text-red-700 bg-red-50' },
];

export default function ReportarZona() {
    const { data, setData, post, processing, errors } = useForm({
        zone_name:        '',
        state:            'La Guaira (Vargas)',
        city:             '',
        description:      '',
        needs:            [],
        urgency_level:    'high',
        estimated_people: '',
        reporter_name:    '',
        reporter_phone:   '',
        reporter_role:    '',
    });

    const toggleNeed = (key) => {
        setData('needs', data.needs.includes(key)
            ? data.needs.filter((n) => n !== key)
            : [...data.needs, key]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/zonas', {
            onSuccess: () => toast.success('Zona reportada. Gracias por informar.'),
        });
    };

    const inputClass  = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass  = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Reportar zona sin atencion</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Informa sobre una zona que no esta recibiendo ayuda para que los coordinadores actuen.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    {/* Zona + ciudad */}
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

                    {/* Estado */}
                    <div>
                        <label className={labelClass}>Estado</label>
                        <select className={inputClass} value={data.state}
                            onChange={(e) => setData('state', e.target.value)}>
                            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className={labelClass}>Descripcion de la situacion *</label>
                        <textarea
                            className={`${inputClass} resize-none`}
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Cuanto tiempo llevan sin ayuda, que ocurrio, como acceder al lugar, estado de la comunidad..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Necesidades */}
                    <div>
                        <label className={labelClass}>Que necesitan * (selecciona todo lo que aplique)</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {NEEDS.map(({ key, label }) => (
                                <button type="button" key={key} onClick={() => toggleNeed(key)}
                                    className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                        data.needs.includes(key)
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {errors.needs && <p className="text-red-500 text-xs mt-1">{errors.needs}</p>}
                    </div>

                    {/* Urgencia */}
                    <div>
                        <label className={labelClass}>Nivel de urgencia *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {URGENCY_OPTIONS.map(({ value, label, desc, badge }) => (
                                <button type="button" key={value} onClick={() => setData('urgency_level', value)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                                        data.urgency_level === value
                                            ? `${badge} ring-2 ring-offset-1 ring-current`
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <p className={`text-sm font-bold ${data.urgency_level === value ? '' : 'text-slate-700'}`}>{label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Personas afectadas */}
                    <div>
                        <label className={labelClass}>Personas aproximadas afectadas</label>
                        <input type="number" min="1" className={inputClass}
                            value={data.estimated_people}
                            onChange={(e) => setData('estimated_people', e.target.value)}
                            placeholder="Ej: 150" />
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
                        <div className="mt-4">
                            <label className={labelClass}>Rol / Organizacion</label>
                            <input className={inputClass} value={data.reporter_role}
                                onChange={(e) => setData('reporter_role', e.target.value)}
                                placeholder="Voluntario, Lider comunitario, Rescatista, Vecino..." />
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Enviando...' : 'Reportar zona'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
