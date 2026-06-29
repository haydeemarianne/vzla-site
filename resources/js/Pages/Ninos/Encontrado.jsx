import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Encontrado() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', age: '', gender: '', description: '',
        photo: null, zone: '', reporter_name: '', reporter_phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ninos/encontrado', {
            forceFormData: true,
            onSuccess: () => toast.success('Registro enviado. Gracias.'),
        });
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Registrar niño encontrado</h1>
                    <p className="text-gray-500 mt-1">
                        Está atendiendo a un niño no identificado? Regístrelo aquí para que su familia pueda localizarlo.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-green-700">
                        Esta sección es para reportar niños que ya están en lugar seguro pero cuya familia no ha sido localizada aún.
                    </p>
                </div>

                <form onSubmit={submit} className="card space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Nombre (si se sabe)</label>
                            <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre o 'desconocido'" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="label">Edad aproximada</label>
                            <input className="input" type="number" min="0" max="17" value={data.age} onChange={(e) => setData('age', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="label">Género</label>
                        <select className="input" value={data.gender} onChange={(e) => setData('gender', e.target.value)}>
                            <option value="">No especificado</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Descripción *</label>
                        <textarea className="input" rows={3} value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descripción física, estado de salud, cualquier información que ayude a identificarlo..." />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="label">Foto (muy importante)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-300 transition-colors"
                            onClick={() => document.getElementById('found-photo').click()}>
                            <FiUpload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            {data.photo
                                ? <p className="text-sm text-green-600 font-medium">{data.photo.name}</p>
                                : <p className="text-sm text-gray-400">Clic para subir foto</p>
                            }
                            <input id="found-photo" type="file" accept="image/*" className="hidden"
                                onChange={(e) => setData('photo', e.target.files[0])} />
                        </div>
                    </div>

                    <div>
                        <label className="label">Zona donde fue encontrado *</label>
                        <input className="input" value={data.zone} onChange={(e) => setData('zone', e.target.value)} placeholder="Albergue, hospital, zona..." />
                        {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Su nombre *</label>
                            <input className="input" value={data.reporter_name} onChange={(e) => setData('reporter_name', e.target.value)} />
                            {errors.reporter_name && <p className="text-red-500 text-xs mt-1">{errors.reporter_name}</p>}
                        </div>
                        <div>
                            <label className="label">Teléfono de contacto *</label>
                            <input className="input" value={data.reporter_phone} onChange={(e) => setData('reporter_phone', e.target.value)} placeholder="+58..." />
                            {errors.reporter_phone && <p className="text-red-500 text-xs mt-1">{errors.reporter_phone}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors">
                        {processing ? 'Enviando...' : 'Registrar niño encontrado'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
