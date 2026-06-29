import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FiHeart, FiSearch, FiPlus, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NinosIndex({ children, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilter = (newFilters) => {
        router.get('/ninos', { ...filters, ...newFilters }, { preserveScroll: true, replace: true });
    };

    return (
        <MainLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Niños desaparecidos y encontrados</h1>
                    <p className="text-gray-500 mt-1">
                        <span className="text-red-600 font-semibold">{stats.missing}</span> desaparecidos ·{' '}
                        <span className="text-green-600 font-semibold">{stats.found}</span> encontrados
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/ninos/reportar" className="btn-primary flex items-center gap-2">
                        <FiPlus /> Reportar desaparecido
                    </Link>
                    <Link href="/ninos/encontrado" className="btn-secondary flex items-center gap-2">
                        <FiHeart /> Niño encontrado
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        className="input pl-9"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilter({ search })}
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { value: '', label: 'Todos' },
                        { value: 'missing', label: 'Desaparecidos' },
                        { value: 'found',   label: 'Encontrados' },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => { setStatus(value); applyFilter({ status: value }); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                status === value
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {children.data.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <FiUser className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No se encontraron registros</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {children.data.map((child, i) => (
                        <motion.div
                            key={child.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                        >
                            <Link href={`/ninos/${child.id}`}
                                className="block card p-0 overflow-hidden hover:shadow-md hover:border-red-200 transition-all">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {child.photo_path
                                        ? <img src={`/storage/${child.photo_path}`} alt={child.name} className="w-full h-full object-cover" />
                                        : <FiUser className="w-10 h-10 text-gray-300" />
                                    }
                                </div>
                                <div className="p-3">
                                    <p className="font-semibold text-sm text-gray-900 truncate">{child.name}</p>
                                    <p className="text-xs text-gray-500">{child.age ? `${child.age} años` : 'Edad desconocida'}</p>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">{child.zone}</p>
                                    <div className="mt-2">
                                        {child.status === 'missing'
                                            ? <span className="badge-urgent">Desaparecido</span>
                                            : <span className="badge-ok">Encontrado</span>
                                        }
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {children.links && (
                <div className="flex justify-center gap-2">
                    {children.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm text-gray-300 bg-white border border-gray-100"
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
