import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FiUpload, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Reportar() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', age: '', gender: '', description: '',
        photo: null, zone: '', state: 'La Guaira',
        last_seen_place: '', reporter_name: '', reporter_phone: '', reporter_relation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ninos', {
            forceFormData: true,
            onSuccess: () => toast.success('Reporte enviado correctamente.'),
        });
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Reportar niño desaparecido</h1>
                    <p className="text-gray-500 mt-1">Complete la información con el mayor detalle posible.</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
                    <FiAlertTriangle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">
                        Si el niño está en peligro inmediato, contacte primero a los servicios de emergencia. Esta plataforma es complementaria.
                    </p>
                </div>

                <form onSubmit={submit} className="card space-y-5">
                    <h2 className="font-semibold text-gray-900 border-b pb-2">Información del niño</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Nombre completo *</label>
                            <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre del niño/a" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="label">Edad</label>
                            <input className="input" type="number" min="0" max="17" value={data.age} onChange={(e) => setData('age', e.target.value)} placeholder="Años" />
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
                        <label className="label">Descripción física</label>
                        <textarea className="input" rows={3} value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descripción: color de cabello, ropa que llevaba, señas particulares..." />
                    </div>

                    <div>
                        <label className="label">Foto (opcional pero muy importante)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('photo-input').click()}>
                            <FiUpload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            {data.photo
                                ? <p className="text-sm text-green-600 font-medium">{data.photo.name}</p>
                                : <p className="text-sm text-gray-400">Clic para subir foto</p>
                            }
                            <input id="photo-input" type="file" accept="image/*" className="hidden"
                                onChange={(e) => setData('photo', e.target.files[0])} />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Zona donde desapareció *</label>
                            <input className="input" value={data.zone} onChange={(e) => setData('zone', e.target.value)} placeholder="Ej: La Guaira, Barrio X" />
                            {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                        </div>
                        <div>
                            <label className="label">Estado</label>
                            <input className="input" value={data.state} onChange={(e) => setData('state', e.target.value)} placeholder="La Guaira" />
                        </div>
                    </div>

                    <div>
                        <label className="label">Último lugar visto</label>
                        <input className="input" value={data.last_seen_place} onChange={(e) => setData('last_seen_place', e.target.value)} placeholder="Dirección o referencia" />
                    </div>

                    <h2 className="font-semibold text-gray-900 border-b pb-2 pt-2">Quien reporta</h2>

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

                    <div>
                        <label className="label">Relación con el niño</label>
                        <input className="input" value={data.reporter_relation} onChange={(e) => setData('reporter_relation', e.target.value)} placeholder="Madre, padre, vecino..." />
                    </div>

                    <button type="submit" disabled={processing} className="btn-primary w-full py-3 text-base">
                        {processing ? 'Enviando...' : 'Enviar reporte'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
