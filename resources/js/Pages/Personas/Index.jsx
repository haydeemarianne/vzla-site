import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FiSearch, FiUser, FiMapPin, FiPhone, FiPlus, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TABS = [
    { key: 'child',    label: 'Niños',    statsKey: 'children' },
    { key: 'adult',    label: 'Adultos',  statsKey: 'adults' },
    { key: 'deceased', label: 'Difuntos', statsKey: 'deceased' },
];

const STATUS_BADGE = {
    missing:  'bg-amber-50 text-amber-700 border border-amber-200',
    found:    'bg-green-50 text-green-700 border border-green-200',
    deceased: 'bg-slate-100 text-slate-600 border border-slate-200',
};
const STATUS_LABEL = {
    missing:  'Desaparecido',
    found:    'Encontrado',
    deceased: 'Difunto',
};

const GENDER_LABEL = { male: 'Masculino', female: 'Femenino', unknown: 'No especificado' };

export default function PersonasIndex({ persons, filters, stats }) {
    const activeTab = filters.type || 'child';
    const [search, setSearch] = useState(filters.search || '');

    const go = (params) => {
        router.get('/personas', { ...filters, ...params }, { preserveScroll: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        go({ search, type: activeTab });
    };

    const switchTab = (key) => {
        go({ type: key, search: '', status: '' });
        setSearch('');
    };

    const isDeceased = activeTab === 'deceased';

    return (
        <MainLayout>

            {/* Banner "Estoy a salvo" — siempre visible en primer fold */}
            <Link href="/personas/salvo"
                className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 mb-5 transition-colors group">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold leading-tight">Estoy a salvo</p>
                    <p className="text-green-100 text-xs mt-0.5">Toca aqui para que tu familia sepa que estas bien</p>
                </div>
                <span className="text-white/60 text-sm font-semibold group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Personas</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Busca a un ser querido o reporta un caso</p>
                </div>
                <Link href={`/personas/registrar?type=${activeTab}`}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <FiPlus className="w-4 h-4" />
                    {isDeceased ? 'Registrar difunto' : 'Reportar desaparecido'}
                </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                    { label: 'Niños desap.',  value: stats.children, color: 'text-amber-600' },
                    { label: 'Adultos desap.', value: stats.adults,   color: 'text-amber-600' },
                    { label: 'Encontrados',    value: stats.found,    color: 'text-green-600' },
                    { label: 'Difuntos',       value: stats.deceased, color: 'text-slate-500' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-2xl p-3 text-center">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4 w-fit">
                {TABS.map(({ key, label, statsKey }) => (
                    <button key={key} onClick={() => switchTab(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            activeTab === key
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}>
                        {label}
                        <span className={`ml-1.5 text-xs font-bold ${activeTab === key ? 'text-blue-700' : 'text-slate-400'}`}>
                            {stats[statsKey]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nombre, cedula, zona o estado..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <button type="submit"
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors">
                    Buscar
                </button>
                {filters.search && (
                    <button type="button" onClick={() => { setSearch(''); go({ search: '', type: activeTab }); }}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors">
                        Limpiar
                    </button>
                )}
            </form>

            {/* Status filter */}
            {!isDeceased && (
                <div className="flex gap-2 mb-4">
                    {[
                        { value: '', label: 'Todos' },
                        { value: 'missing', label: 'Desaparecidos' },
                        { value: 'found',   label: 'Encontrados' },
                    ].map(({ value, label }) => (
                        <button key={value} onClick={() => go({ status: value, type: activeTab })}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                (filters.status || '') === value
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}>
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Cards */}
            {persons.data.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <FiUsers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-600 text-sm">
                        {filters.search ? `Sin resultados para "${filters.search}"` : 'No hay registros en esta seccion'}
                    </p>
                    <Link href={`/personas/registrar?type=${activeTab}`}
                        className="mt-3 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        <FiPlus className="w-4 h-4" /> Reportar
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {persons.data.map((person, i) => (
                        <motion.div key={person.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}>
                            <Link href={`/personas/${person.id}`}
                                className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 hover:shadow-md transition-shadow block">
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {person.photo_path
                                        ? <img src={`/storage/${person.photo_path}`} alt={person.name} className="w-full h-full object-cover" />
                                        : <FiUser className="w-6 h-6 text-slate-300" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{person.name}</p>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[person.status] || STATUS_BADGE.missing}`}>
                                            {STATUS_LABEL[person.status] || person.status}
                                        </span>
                                    </div>
                                    {person.age && (
                                        <p className="text-xs text-slate-500">
                                            {person.age} años{person.gender ? ` · ${GENDER_LABEL[person.gender] || ''}` : ''}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <FiMapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <p className="text-xs text-slate-500 truncate">
                                            {person.zone}{person.state ? `, ${person.state}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <FiPhone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <p className="text-xs text-slate-400">{person.reporter_phone}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {persons.links && (
                <div className="flex justify-center gap-2 flex-wrap">
                    {persons.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm text-slate-300"
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
