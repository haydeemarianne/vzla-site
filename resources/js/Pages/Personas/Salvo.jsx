import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FiCheckCircle, FiUpload, FiX } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

export default function EstoyASalvo() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name:          '',
        cedula:        '',
        age:           '',
        state:         'La Guaira (Vargas)',
        zone:          '',
        contact_phone: '',
        photo:         null,
    });

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/personas/salvo', {
            forceFormData: true,
            onSuccess: () => toast.success('¡Registrado como a salvo!'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-lg mx-auto">

                {/* Header destacado */}
                <div className="bg-green-600 rounded-2xl p-6 text-white text-center mb-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FiCheckCircle className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Estoy a salvo</h1>
                    <p className="text-green-100 text-sm leading-relaxed">
                        Registrate para que tu familia sepa que estas bien.
                        Si ya alguien te reporto como desaparecido, actualizaremos ese registro automaticamente.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">

                    <div>
                        <label className={labelClass}>Tu nombre completo *</label>
                        <input className={inputClass} value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Como apareces en tu cedula" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Numero de cedula</label>
                            <input className={inputClass} value={data.cedula}
                                onChange={(e) => setData('cedula', e.target.value)}
                                placeholder="V-12345678" />
                            <p className="text-xs text-slate-400 mt-1">Ayuda a encontrar tu reporte mas rapido</p>
                        </div>
                        <div>
                            <label className={labelClass}>Edad</label>
                            <input type="number" min="0" max="120" className={inputClass}
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Donde estas ahora *</label>
                        <input className={inputClass} value={data.zone}
                            onChange={(e) => setData('zone', e.target.value)}
                            placeholder="Barrio, sector, edificio, municipio..." />
                        {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Estado</label>
                        <select className={inputClass} value={data.state}
                            onChange={(e) => setData('state', e.target.value)}>
                            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Telefono de contacto</label>
                        <input className={inputClass} value={data.contact_phone}
                            onChange={(e) => setData('contact_phone', e.target.value)}
                            placeholder="+58 412 000 0000" />
                        <p className="text-xs text-slate-400 mt-1">Para que tu familia pueda llamarte directamente</p>
                    </div>

                    {/* Foto */}
                    <div>
                        <label className={labelClass}>Foto tuya (opcional)</label>
                        {photoPreview ? (
                            <div className="relative inline-block">
                                <img src={photoPreview} className="w-24 h-24 rounded-xl object-cover border border-slate-200" />
                                <button type="button" onClick={() => { setPhotoPreview(null); setData('photo', null); }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-green-400 transition-colors">
                                <FiUpload className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-500">Toca para subir una foto</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                            </label>
                        )}
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                        <FiCheckCircle className="w-5 h-5" />
                        {processing ? 'Buscando tu reporte...' : 'Confirmar que estoy a salvo'}
                    </button>

                    <p className="text-center text-xs text-slate-400 leading-relaxed">
                        Si alguien ya te reporto como desaparecido, actualizaremos ese registro automaticamente.
                        Si no, crearemos uno nuevo para que tu familia pueda buscarte.
                    </p>
                </form>
            </div>
        </MainLayout>
    );
}
