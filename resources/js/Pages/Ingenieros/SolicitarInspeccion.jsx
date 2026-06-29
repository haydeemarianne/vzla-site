import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Lara', 'Merida', 'Monagas', 'Nueva Esparta',
    'Portuguesa', 'Sucre', 'Tachira', 'Trujillo', 'Yaracuy', 'Zulia',
];

const URGENCY_OPTIONS = [
    { value: 'normal',   label: 'Normal',   desc: 'Puedo esperar dias',       cls: 'border-slate-300 text-slate-600' },
    { value: 'urgent',   label: 'Urgente',  desc: 'Necesito acceder pronto',  cls: 'border-amber-400 text-amber-700 bg-amber-50' },
    { value: 'critical', label: 'Critico',  desc: 'Hay personas en riesgo',   cls: 'border-red-400 text-red-700 bg-red-50' },
];

export default function SolicitarInspeccion() {
    const { data, setData, post, processing, errors } = useForm({
        address:         '',
        zone:            '',
        state:           'La Guaira (Vargas)',
        requester_name:  '',
        requester_phone: '',
        description:     '',
        structure_type:  '',
        urgency:         'normal',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ingenieros/solicitar', {
            onSuccess: () => toast.success('Solicitud enviada. Un ingeniero se pondra en contacto.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Solicitar inspeccion estructural gratuita</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Un ingeniero voluntario evaluara tu estructura para determinar si es seguro acceder.
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-amber-800">
                        <strong>No entres a una estructura danada</strong> hasta que un profesional la evalúe.
                        Puede ser peligroso aunque parezca estable.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    <div>
                        <label className={labelClass}>Direccion de la estructura *</label>
                        <input className={inputClass} value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Direccion completa, referencia de ubicacion..." />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Zona / Sector *</label>
                            <input className={inputClass} value={data.zone}
                                onChange={(e) => setData('zone', e.target.value)}
                                placeholder="La Guaira, Maiquetia..." />
                            {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Estado</label>
                            <select className={inputClass} value={data.state}
                                onChange={(e) => setData('state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Tipo de estructura</label>
                        <select className={inputClass} value={data.structure_type}
                            onChange={(e) => setData('structure_type', e.target.value)}>
                            <option value="">Selecciona...</option>
                            <option value="house">Casa / Vivienda</option>
                            <option value="apartment">Apartamento</option>
                            <option value="building">Edificio</option>
                            <option value="commercial">Local comercial</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Descripcion de los danos observados</label>
                        <textarea className={`${inputClass} resize-none`} rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe lo que ves: grietas, paredes caidas, deformaciones, hundimientos... Cuanta mas informacion, mejor." />
                    </div>

                    <div>
                        <label className={labelClass}>Urgencia *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {URGENCY_OPTIONS.map(({ value, label, desc, cls }) => (
                                <button type="button" key={value} onClick={() => setData('urgency', value)}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                                        data.urgency === value
                                            ? `${cls} ring-2 ring-offset-1 ring-current`
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <p className={`font-bold text-sm ${data.urgency === value ? '' : 'text-slate-700'}`}>{label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">Tus datos de contacto</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Tu nombre *</label>
                                <input className={inputClass} value={data.requester_name}
                                    onChange={(e) => setData('requester_name', e.target.value)} />
                                {errors.requester_name && <p className="text-red-500 text-xs mt-1">{errors.requester_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Telefono *</label>
                                <input className={inputClass} value={data.requester_phone}
                                    onChange={(e) => setData('requester_phone', e.target.value)}
                                    placeholder="+58 412 000 0000" />
                                {errors.requester_phone && <p className="text-red-500 text-xs mt-1">{errors.requester_phone}</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Enviando solicitud...' : 'Solicitar inspeccion gratuita'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
