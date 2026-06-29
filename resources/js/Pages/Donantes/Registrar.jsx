import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

const DONATION_TYPES = [
    { key: 'money',     label: 'Dinero' },
    { key: 'food',      label: 'Alimentos' },
    { key: 'water',     label: 'Agua' },
    { key: 'medicine',  label: 'Medicamentos' },
    { key: 'equipment', label: 'Equipos' },
    { key: 'clothing',  label: 'Ropa' },
    { key: 'tools',     label: 'Herramientas' },
    { key: 'vehicles',  label: 'Vehiculos' },
    { key: 'other',     label: 'Otro' },
];

export default function RegistrarDonante() {
    const { data, setData, post, processing, errors } = useForm({
        company_name:    '',
        contact_person:  '',
        email:           '',
        phone:           '',
        donation_types:  [],
        description:     '',
        country:         'Venezuela',
        zones_available: '',
        website:         '',
    });

    const toggleType = (key) => {
        setData('donation_types', data.donation_types.includes(key)
            ? data.donation_types.filter((t) => t !== key)
            : [...data.donation_types, key]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/donantes', {
            onSuccess: () => toast.success('Donacion registrada. Gracias por su generosidad.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Registrar empresa o donante</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tu organizacion aparecera en el directorio para que los coordinadores puedan contactarte.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Empresa u organizacion *</label>
                            <input className={inputClass} value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)} />
                            {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Persona de contacto *</label>
                            <input className={inputClass} value={data.contact_person}
                                onChange={(e) => setData('contact_person', e.target.value)} />
                            {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>}
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
                        <label className={labelClass}>Que puede donar * (selecciona todo lo que aplique)</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {DONATION_TYPES.map(({ key, label }) => (
                                <button type="button" key={key} onClick={() => toggleType(key)}
                                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                                        data.donation_types.includes(key)
                                            ? 'bg-blue-700 text-white border-blue-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                                    }`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {errors.donation_types && <p className="text-red-500 text-xs mt-1">{errors.donation_types}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Descripcion de la donacion</label>
                        <textarea className={`${inputClass} resize-none`} rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Cantidad disponible, condiciones, como coordinar la entrega..." />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Pais de origen</label>
                            <input className={inputClass} value={data.country}
                                onChange={(e) => setData('country', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Zonas donde puede entregar</label>
                            <input className={inputClass} value={data.zones_available}
                                onChange={(e) => setData('zones_available', e.target.value)}
                                placeholder="La Guaira, Caracas, todo el pais..." />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Sitio web</label>
                        <input type="url" className={inputClass} value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                            placeholder="https://..." />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Registrando...' : 'Registrar donacion'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
