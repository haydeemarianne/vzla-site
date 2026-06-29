import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const ZONES = [
    'La Guaira', 'Maiquetia', 'Catia La Mar', 'Naiguata', 'Caraballeda',
    'Macuto', 'Caracas (centro)', 'Caracas (este)', 'Caracas (oeste)',
    'Los Teques', 'Guarenas / Guatire', 'Otra zona',
];

const VEHICLE_OPTIONS = [
    { value: 'moto',   label: 'Moto',      desc: 'Rapido, rutas estrechas' },
    { value: 'car',    label: 'Carro',     desc: 'Hasta 4 personas o carga liviana' },
    { value: 'pickup', label: 'Camioneta', desc: 'Carga media o grupos' },
    { value: 'truck',  label: 'Camion',    desc: 'Carga pesada o voluminosa' },
];

export default function RegistrarConductor() {
    const { data, setData, post, processing, errors } = useForm({
        name:         '',
        phone:        '',
        vehicle_type: 'car',
        capacity:     '',
        zones:        [],
        state:        'La Guaira (Vargas)',
        notes:        '',
    });

    const toggleZone = (zone) => {
        setData('zones', data.zones.includes(zone)
            ? data.zones.filter((z) => z !== zone)
            : [...data.zones, zone]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/transporte/registrar', {
            onSuccess: () => toast.success('Registrado. Gracias por ofrecerte como conductor voluntario.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-slate-900">Registrarme como conductor voluntario</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tu vehiculo puede marcar la diferencia. Los solicitantes veran tu contacto y te llamaran directamente.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Tu nombre *</label>
                            <input className={inputClass} value={data.name}
                                onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Telefono *</label>
                            <input className={inputClass} value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+58 412 000 0000" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Tipo de vehiculo */}
                    <div>
                        <label className={labelClass}>Tipo de vehiculo *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {VEHICLE_OPTIONS.map(({ value, label, desc }) => (
                                <button type="button" key={value} onClick={() => setData('vehicle_type', value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.vehicle_type === value
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    <p className="font-semibold text-sm">{label}</p>
                                    <p className={`text-[10px] mt-0.5 leading-tight ${data.vehicle_type === value ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Capacidad aproximada</label>
                            <input className={inputClass} value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                                placeholder="Ej: 4 personas, 200 kg, 10 cajas..." />
                        </div>
                        <div>
                            <label className={labelClass}>Estado base</label>
                            <select className={inputClass} value={data.state}
                                onChange={(e) => setData('state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Zonas */}
                    <div>
                        <label className={labelClass}>Zonas donde puedes operar</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {ZONES.map((zone) => (
                                <button type="button" key={zone} onClick={() => toggleZone(zone)}
                                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                                        data.zones.includes(zone)
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    <FiMapPin className="w-3 h-3 flex-shrink-0" /> {zone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Notas adicionales</label>
                        <textarea className={`${inputClass} resize-none`} rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Horario disponible, restricciones, condiciones especiales..." />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Registrando...' : 'Registrarme como conductor voluntario'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
