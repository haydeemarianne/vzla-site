import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FiUpload, FiX, FiCamera } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

export default function SubirHospital() {
    const { data, setData, post, processing, errors } = useForm({
        hospital_name:         '',
        zone:                  '',
        state:                 'La Guaira (Vargas)',
        address:               '',
        description:           '',
        photos:                [],
        patient_count_approx:  '',
        uploaded_by:           '',
        uploader_phone:        '',
        list_date:             '',
    });

    const [previews, setPreviews] = useState([]);

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const removePhoto = (index) => {
        const newFiles = data.photos.filter((_, i) => i !== index);
        setData('photos', newFiles);
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/hospitales', {
            forceFormData: true,
            onSuccess: () => toast.success('Lista subida correctamente. Gracias.'),
        });
    };

    const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Subir lista de hospital</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Fotografía la lista de pacientes y subela aquí. Las familias podran buscar a sus seres queridos.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700">
                        <strong>Importante:</strong> Asegurate de que las fotos sean legibles.
                        Puedes subir hasta 10 fotos por hospital.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    {/* Hospital name + zone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nombre del hospital *</label>
                            <input className={inputClass} value={data.hospital_name}
                                onChange={(e) => setData('hospital_name', e.target.value)}
                                placeholder="Ej: Hospital Vargas, Clinica Caracas..." />
                            {errors.hospital_name && <p className="text-red-500 text-xs mt-1">{errors.hospital_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Municipio / Zona *</label>
                            <input className={inputClass} value={data.zone}
                                onChange={(e) => setData('zone', e.target.value)}
                                placeholder="La Guaira, Maiquetia..." />
                            {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                        </div>
                    </div>

                    {/* State + date */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Estado</label>
                            <select className={inputClass} value={data.state}
                                onChange={(e) => setData('state', e.target.value)}>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Fecha de la lista</label>
                            <input type="date" className={inputClass} value={data.list_date}
                                onChange={(e) => setData('list_date', e.target.value)} />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className={labelClass}>Direccion del hospital</label>
                        <input className={inputClass} value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Av. principal, piso, ala..." />
                    </div>

                    {/* Patient count */}
                    <div>
                        <label className={labelClass}>Cantidad aproximada de pacientes en la lista</label>
                        <input type="number" className={inputClass} value={data.patient_count_approx}
                            onChange={(e) => setData('patient_count_approx', e.target.value)}
                            placeholder="Ej: 45" min="1" />
                    </div>

                    {/* Photos */}
                    <div>
                        <label className={labelClass}>Fotos de la lista * (maximo 10 fotos)</label>
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => document.getElementById('photos-input').click()}>
                            <FiCamera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 font-medium">Toca para seleccionar fotos</p>
                            <p className="text-xs text-slate-400 mt-1">Puedes seleccionar varias a la vez</p>
                            <input id="photos-input" type="file" accept="image/*" multiple className="hidden"
                                onChange={handlePhotos} />
                        </div>
                        {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos}</p>}

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removePhoto(i)}
                                            className="absolute top-1.5 right-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors">
                                            <FiX className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={labelClass}>Notas adicionales</label>
                        <textarea
                            className={`${inputClass} resize-none`}
                            rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Area de emergencias, turno de la manana, lista provisional..." />
                    </div>

                    {/* Reporter */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">Quien sube la lista</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Tu nombre *</label>
                                <input className={inputClass} value={data.uploaded_by}
                                    onChange={(e) => setData('uploaded_by', e.target.value)} />
                                {errors.uploaded_by && <p className="text-red-500 text-xs mt-1">{errors.uploaded_by}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Telefono de contacto</label>
                                <input className={inputClass} value={data.uploader_phone}
                                    onChange={(e) => setData('uploader_phone', e.target.value)}
                                    placeholder="+58 412 000 0000" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing ? 'Subiendo...' : 'Subir lista del hospital'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
