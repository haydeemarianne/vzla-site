import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

const ZONES = [
    'La Guaira', 'Maiquetia', 'Caracas', 'Vargas', 'Naiguata',
    'Caraballeda', 'Macuto', 'Catia La Mar', 'Otra zona',
];

const SPECIALTIES = [
    'Estructural', 'Civil', 'Geotecnica', 'Sismica',
    'Hidraulica', 'Sanitaria', 'Arquitectura', 'Otra',
];

export default function RegistrarIngeniero() {
    const { data, setData, post, processing, errors } = useForm({
        name:            '',
        email:           '',
        phone:           '',
        license_number:  '',
        specialty:       '',
        zones_available: [],
        available_until: '',
        notes:           '',
    });

    const toggleZone = (zone) => {
        setData('zones_available', data.zones_available.includes(zone)
            ? data.zones_available.filter((z) => z !== zone)
            : [...data.zones_available, zone]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/ingenieros', {
            onSuccess: () => toast.success('Registro recibido. Sera verificado pronto. Gracias.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Registrarse como ingeniero voluntario</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Ofrece inspecciones estructurales gratuitas a familias afectadas por el terremoto.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nombre completo *</label>
                            <input className={inputClass} value={data.name}
                                onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Especialidad *</label>
                            <select className={inputClass} value={data.specialty}
                                onChange={(e) => setData('specialty', e.target.value)}>
                                <option value="">Selecciona...</option>
                                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email *</label>
                            <input type="email" className={inputClass} value={data.email}
                                onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Telefono *</label>
                            <input className={inputClass} value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+58 412 000 0000" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Numero de matricula / colegiacion</label>
                        <input className={inputClass} value={data.license_number}
                            onChange={(e) => setData('license_number', e.target.value)}
                            placeholder="Para validar tus credenciales" />
                    </div>

                    <div>
                        <label className={labelClass}>Zonas donde puedes trabajar * (selecciona)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {ZONES.map((zone) => (
                                <button type="button" key={zone} onClick={() => toggleZone(zone)}
                                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                                        data.zones_available.includes(zone)
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    {zone}
                                </button>
                            ))}
                        </div>
                        {errors.zones_available && <p className="text-red-500 text-xs mt-1">{errors.zones_available}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Disponible hasta</label>
                        <input type="date" className={inputClass} value={data.available_until}
                            onChange={(e) => setData('available_until', e.target.value)} />
                    </div>

                    <div>
                        <label className={labelClass}>Notas adicionales</label>
                        <textarea className={`${inputClass} resize-none`} rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Horario disponible, equipo que tienes, condiciones especiales..." />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Enviando...' : 'Registrarme como voluntario'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
