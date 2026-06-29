import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FiUser, FiUpload, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATES = [
    'La Guaira (Vargas)', 'Distrito Capital', 'Miranda', 'Aragua', 'Carabobo',
    'Vargas', 'Anzoategui', 'Bolivar', 'Falcon', 'Guarico', 'Lara', 'Merida',
    'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Tachira', 'Trujillo',
    'Yaracuy', 'Zulia', 'Amazonas', 'Apure', 'Barinas', 'Cojedes', 'Delta Amacuro',
];

const TYPES = [
    { key: 'child',    label: 'Nino desaparecido',   desc: 'Menor de 18 anos' },
    { key: 'adult',    label: 'Adulto desaparecido',  desc: '18 anos o mas' },
    { key: 'deceased', label: 'Persona fallecida',    desc: 'Registro de difunto identificado' },
];

export default function PersonasRegistrar({ defaultType = 'child' }) {
    const [type, setType] = useState(defaultType);

    const { data, setData, post, processing, errors, reset } = useForm({
        type:              defaultType,
        name:              '',
        age:               '',
        gender:            '',
        description:       '',
        photo:             null,
        zone:              '',
        state:             'La Guaira (Vargas)',
        last_seen_place:   '',
        found_location:    '',
        cause_of_death:    '',
        reporter_name:     '',
        reporter_phone:    '',
        reporter_relation: '',
    });

    const changeType = (t) => {
        setType(t);
        setData('type', t);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/personas', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Reporte recibido. Gracias por ayudar.');
                reset();
            },
        });
    };

    const isDeceased = type === 'deceased';

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isDeceased ? 'Registrar persona fallecida' : 'Reportar persona desaparecida'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isDeceased
                            ? 'Registra a un fallecido identificado para que sus familiares puedan localizarlo.'
                            : 'Cada reporte ayuda a reunir familias. Completa todos los datos posibles.'}
                    </p>
                </div>

                {/* Type selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {TYPES.map(({ key, label, desc }) => (
                        <button key={key} type="button" onClick={() => changeType(key)}
                            className={`p-3 rounded-xl border-2 text-left transition-colors ${
                                type === key
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}>
                            <p className={`text-xs font-bold leading-tight ${type === key ? 'text-blue-700' : 'text-slate-700'}`}>{label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                        </button>
                    ))}
                </div>

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Nombre completo *
                        </label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nombre y apellido"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Edad + Genero */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Edad aproximada
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={type === 'child' ? 17 : 120}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)}
                                placeholder={type === 'child' ? '0-17' : 'anos'}
                            />
                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Genero</label>
                            <select
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}>
                                <option value="">No especificado</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                            </select>
                        </div>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Descripcion fisica
                        </label>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Estatura, complexion, color de cabello, senales particulares, ropa que llevaba..."
                        />
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Foto (opcional)</label>
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => document.getElementById('person-photo').click()}>
                            {data.photo
                                ? <p className="text-sm text-blue-600 font-medium">{data.photo.name}</p>
                                : <>
                                    <FiUpload className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                                    <p className="text-sm text-slate-400">Clic para subir foto</p>
                                  </>
                            }
                            <input id="person-photo" type="file" accept="image/*" className="hidden"
                                onChange={(e) => setData('photo', e.target.files[0])} />
                        </div>
                    </div>

                    {/* Zona + Estado */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            <FiMapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                            Zona donde desaparecio / fue visto *
                        </label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            value={data.zone}
                            onChange={(e) => setData('zone', e.target.value)}
                            placeholder="Municipio, barrio, sector..."
                        />
                        {errors.zone && <p className="text-red-500 text-xs mt-1 mb-1">{errors.zone}</p>}
                        <select
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}>
                            {STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* Campos segun tipo */}
                    {!isDeceased && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Ultimo lugar donde fue visto
                            </label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.last_seen_place}
                                onChange={(e) => setData('last_seen_place', e.target.value)}
                                placeholder="Hospital, refugio, calle, edificio..."
                            />
                        </div>
                    )}

                    {isDeceased && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Lugar donde fue encontrado
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.found_location}
                                    onChange={(e) => setData('found_location', e.target.value)}
                                    placeholder="Hospital, morgue, zona de rescate..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Causa aparente (opcional)
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.cause_of_death}
                                    onChange={(e) => setData('cause_of_death', e.target.value)}
                                    placeholder="Traumatismo, aplastamiento, causa desconocida..."
                                />
                            </div>
                        </>
                    )}

                    {/* Datos del reportante */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-3">
                            <FiPhone className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                            Quien reporta
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Su nombre *</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.reporter_name}
                                        onChange={(e) => setData('reporter_name', e.target.value)}
                                    />
                                    {errors.reporter_name && <p className="text-red-500 text-xs mt-1">{errors.reporter_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Telefono *</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.reporter_phone}
                                        onChange={(e) => setData('reporter_phone', e.target.value)}
                                        placeholder="+58 412 000 0000"
                                    />
                                    {errors.reporter_phone && <p className="text-red-500 text-xs mt-1">{errors.reporter_phone}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Relacion con la persona
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.reporter_relation}
                                    onChange={(e) => setData('reporter_relation', e.target.value)}
                                    placeholder="Madre, padre, hermano, vecino, rescatista..."
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        {processing
                            ? 'Enviando...'
                            : isDeceased ? 'Registrar fallecido' : 'Enviar reporte'}
                    </button>

                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                        Los reportes son revisados antes de publicarse para evitar duplicados.
                        Tu telefono sera visible para que alguien pueda contactarte si tiene informacion.
                    </p>
                </form>
            </div>
        </MainLayout>
    );
}
