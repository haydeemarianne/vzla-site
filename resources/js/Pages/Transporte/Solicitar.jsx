import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const CARGO_OPTIONS = [
    { value: 'supplies', label: 'Insumos',   desc: 'Agua, comida, medicamentos, ropa' },
    { value: 'debris',   label: 'Escombros', desc: 'Materiales de construccion pequeños' },
    { value: 'people',   label: 'Personas',  desc: 'Evacuacion o traslado (no es rescate de emergencia)' },
];

export default function SolicitarTransporte() {
    const { data, setData, post, processing, errors } = useForm({
        cargo_type:        'supplies',
        description:       '',
        origin_zone:       '',
        origin_state:      'La Guaira (Vargas)',
        destination_zone:  '',
        destination_state: 'La Guaira (Vargas)',
        urgency:           'normal',
        requester_name:    '',
        requester_phone:   '',
        notes:             '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/transporte/solicitar', {
            onSuccess: () => toast.success('Solicitud publicada. Un conductor se pondra en contacto.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-slate-900">Necesito transporte</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Publica tu solicitud y un conductor voluntario se pondra en contacto contigo.
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                    <p className="text-xs text-amber-800">
                        <strong>Para emergencias medicas</strong> llama al 171 o 112 — este modulo es para traslado de insumos y evacuacion no urgente.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">

                    {/* Tipo de carga */}
                    <div>
                        <label className={labelClass}>Que necesitas transportar *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CARGO_OPTIONS.map(({ value, label, desc }) => (
                                <button type="button" key={value} onClick={() => setData('cargo_type', value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.cargo_type === value
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    <p className="font-semibold text-xs">{label}</p>
                                    <p className={`text-[10px] mt-0.5 leading-tight ${data.cargo_type === value ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className={labelClass}>Describe lo que necesitas mover *</label>
                        <textarea className={`${inputClass} resize-none`} rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Ej: 4 cajas de agua, 2 personas adultas, escombros de una pared..." />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Origen */}
                    <div>
                        <label className={labelClass}>Punto de origen *</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <input className={inputClass} value={data.origin_zone}
                                    onChange={(e) => setData('origin_zone', e.target.value)}
                                    placeholder="Zona / sector de origen" />
                                {errors.origin_zone && <p className="text-red-500 text-xs mt-1">{errors.origin_zone}</p>}
                            </div>
                            <select className={inputClass} value={data.origin_state}
                                onChange={(e) => setData('origin_state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Destino */}
                    <div>
                        <label className={labelClass}>Punto de destino *</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <input className={inputClass} value={data.destination_zone}
                                    onChange={(e) => setData('destination_zone', e.target.value)}
                                    placeholder="Zona / sector de destino" />
                                {errors.destination_zone && <p className="text-red-500 text-xs mt-1">{errors.destination_zone}</p>}
                            </div>
                            <select className={inputClass} value={data.destination_state}
                                onChange={(e) => setData('destination_state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Urgencia */}
                    <div>
                        <label className={labelClass}>Urgencia</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'normal', label: 'Normal', desc: 'Puede esperar horas' },
                                { value: 'urgent', label: 'Urgente', desc: 'Lo necesito hoy' },
                            ].map(({ value, label, desc }) => (
                                <button type="button" key={value} onClick={() => setData('urgency', value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.urgency === value
                                            ? value === 'urgent'
                                                ? 'bg-amber-500 text-white border-amber-500'
                                                : 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <p className="font-semibold text-sm">{label}</p>
                                    <p className={`text-xs mt-0.5 ${data.urgency === value ? 'text-white/80' : 'text-slate-400'}`}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className={labelClass}>Informacion adicional</label>
                        <textarea className={`${inputClass} resize-none`} rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Peso aproximado, acceso al lugar, horario disponible..." />
                    </div>

                    {/* Contacto */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">Tu contacto</h3>
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
                        {processing ? 'Publicando...' : 'Publicar solicitud de transporte'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
