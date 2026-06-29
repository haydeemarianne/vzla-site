import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FiFileText, FiDownload, FiUpload, FiPrinter, FiPackage, FiInstagram, FiPhone, FiBox } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PRINT_CATEGORIES = [
    { value: '', label: 'Todos' },
    { value: 'flyer',  label: 'Flyers' },
    { value: 'poster', label: 'Carteles' },
    { value: 'guide',  label: 'Guías' },
    { value: 'map',    label: 'Mapas' },
    { value: 'other',  label: 'Otro' },
];

const CATEGORIES_3D = [
    { value: '',               label: 'Todos' },
    { value: '3d_construction', label: 'Construcción' },
    { value: '3d_ironwork',     label: 'Herrería' },
    { value: '3d_medical',      label: 'Médico / Primeros auxilios' },
    { value: '3d_furniture',    label: 'Literas y muebles' },
    { value: '3d_tools',        label: 'Herramientas' },
    { value: '3d_other',        label: 'Otro' },
];

const FileTypeIcon = ({ fileType, is3d }) => {
    if (is3d) return <FiBox className="w-5 h-5 text-blue-500" />;
    if (['jpg','jpeg','png','svg'].includes(fileType)) return <FiFileText className="w-5 h-5 text-indigo-400" />;
    if (fileType === 'pdf') return <FiFileText className="w-5 h-5 text-red-400" />;
    return <FiPackage className="w-5 h-5 text-gray-400" />;
};

const ContributorContact = ({ material }) => {
    if (!material.contributor_instagram && !material.contributor_phone) return null;
    return (
        <div className="flex items-center gap-3 mt-2 flex-wrap">
            {material.contributor_instagram && (
                <a href={`https://instagram.com/${material.contributor_instagram.replace('@','')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                    <FiInstagram className="w-3.5 h-3.5" />
                    {material.contributor_instagram}
                </a>
            )}
            {material.contributor_phone && (
                <a href={`tel:${material.contributor_phone}`}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                    <FiPhone className="w-3.5 h-3.5" />
                    {material.contributor_phone}
                </a>
            )}
        </div>
    );
};

export default function MaterialesIndex({ materials, filters }) {
    const activeTab      = filters.tab === '3d' ? '3d' : 'print';
    const [category, setCategory] = useState(filters.category || '');

    const filterBy = (value) => {
        setCategory(value);
        router.get('/materiales', { category: value, tab: activeTab }, { preserveScroll: true, replace: true });
    };

    const switchTab = (tab) => {
        setCategory('');
        router.get('/materiales', { tab }, { preserveScroll: true, replace: true });
    };

    const categories = activeTab === '3d' ? CATEGORIES_3D : PRINT_CATEGORIES;

    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Materiales y archivos</h1>
                    <p className="text-slate-500 mt-1 text-sm">Descargue y comparta recursos gratuitos para la emergencia</p>
                </div>
                <Link href="/materiales/subir"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiUpload className="w-4 h-4" /> Subir archivo
                </Link>
            </div>

            {/* Main tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
                <button onClick={() => switchTab('print')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === 'print'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    <FiPrinter className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Para imprimir
                </button>
                <button onClick={() => switchTab('3d')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === '3d'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    <FiBox className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Archivos 3D
                </button>
            </div>

            {/* Info banner */}
            {activeTab === '3d' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                    <p className="text-sm text-blue-700">
                        <strong>Para constructores, herreros y fabricantes:</strong> Descargue los patrones STL
                        y contacte directamente al contribuidor para coordinar la produccion.
                    </p>
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
                    <p className="text-sm text-slate-600">
                        <strong>Para imprentas y voluntarios:</strong> Descargue el archivo y siga las instrucciones
                        de impresion incluidas. Todos los materiales son gratuitos.
                    </p>
                </div>
            )}

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
                {categories.map(({ value, label }) => (
                    <button key={value} onClick={() => filterBy(value)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            category === value
                                ? 'bg-blue-700 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}>
                        {label}
                    </button>
                ))}
            </div>

            {materials.data.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No hay archivos en esta categoria</p>
                    <Link href="/materiales/subir"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        Subir el primero
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {materials.data.map((material, i) => (
                        <motion.div key={material.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                            className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col">

                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                                    <FileTypeIcon fileType={material.file_type} is3d={material.is_3d} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 leading-snug text-sm">{material.title}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {material.organization || material.uploaded_by}
                                    </p>
                                    <ContributorContact material={material} />
                                </div>
                            </div>

                            {material.description && (
                                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{material.description}</p>
                            )}

                            {/* Print instructions (solo para imprimibles) */}
                            {!material.is_3d && material.print_instructions && Object.values(material.print_instructions).some(Boolean) && (
                                <div className="bg-slate-50 rounded-xl p-3 mb-3 text-xs space-y-1 flex-1">
                                    <p className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                        <FiPrinter className="w-3.5 h-3.5" /> Instrucciones de impresion
                                    </p>
                                    {material.print_instructions.size && (
                                        <p className="text-slate-600">Tamano: <span className="font-medium">{material.print_instructions.size}</span></p>
                                    )}
                                    {material.print_instructions.color && (
                                        <p className="text-slate-600">Color: <span className="font-medium">{material.print_instructions.color}</span></p>
                                    )}
                                    {material.print_instructions.paper && (
                                        <p className="text-slate-600">Papel: <span className="font-medium">{material.print_instructions.paper}</span></p>
                                    )}
                                    {material.print_instructions.quantity && (
                                        <p className="text-slate-600">Cantidad: <span className="font-medium">{material.print_instructions.quantity}</span></p>
                                    )}
                                    {material.print_instructions.notes && (
                                        <p className="text-slate-500 italic">{material.print_instructions.notes}</p>
                                    )}
                                </div>
                            )}

                            {/* 3D info */}
                            {material.is_3d && (
                                <div className="bg-blue-50 rounded-xl p-3 mb-3 text-xs flex-1">
                                    <p className="font-semibold text-blue-700 mb-1">Archivo 3D — {material.file_type?.toUpperCase()}</p>
                                    {material.subcategory && (
                                        <p className="text-blue-600">Categoria: {material.subcategory}</p>
                                    )}
                                    <p className="text-blue-600 mt-1">Contacta al contribuidor para coordinar la produccion.</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <FiDownload className="w-3 h-3" />
                                    {material.download_count} descargas
                                </span>
                                <a href={`/materiales/${material.id}/descargar`}
                                    className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                                    <FiDownload className="w-3.5 h-3.5" /> Descargar
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {materials.links && (
                <div className="flex justify-center gap-2 flex-wrap">
                    {materials.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-white border border-slate-100"
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
