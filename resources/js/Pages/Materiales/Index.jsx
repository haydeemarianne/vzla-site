import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Upload, Download, Printer, Box, Package, AtSign, FileText } from 'lucide-react';

const PRINT_CATEGORIES = [
    { value: '',       label: 'Todos' },
    { value: 'flyer',  label: 'Flyers' },
    { value: 'poster', label: 'Carteles' },
    { value: 'guide',  label: 'Guías' },
    { value: 'map',    label: 'Mapas' },
    { value: 'other',  label: 'Otro' },
];

const CATEGORIES_3D = [
    { value: '',                label: 'Todos' },
    { value: '3d_construction', label: 'Construcción' },
    { value: '3d_ironwork',     label: 'Herrería' },
    { value: '3d_medical',      label: 'Médico' },
    { value: '3d_furniture',    label: 'Literas y muebles' },
    { value: '3d_tools',        label: 'Herramientas' },
    { value: '3d_other',        label: 'Otro' },
];

const TABS = [
    { key: 'print', label: 'Para imprimir', Icon: Printer },
    { key: '3d',    label: 'Archivos 3D',   Icon: Box     },
];

const CATEGORY_LABEL = {
    flyer: 'Flyer', poster: 'Cartel', guide: 'Guía', map: 'Mapa', other: 'Otro',
    '3d_construction': 'Construcción', '3d_ironwork': 'Herrería',
    '3d_medical': 'Médico', '3d_furniture': 'Literas/muebles',
    '3d_tools': 'Herramientas', '3d_other': 'Otro',
};

function FileIcon({ fileType, is3d }) {
    if (is3d) return <Box size={15} color="#4263ac" strokeWidth={1.5}/>;
    if (fileType === 'pdf') return <FileText size={15} color="#CE6969" strokeWidth={1.5}/>;
    if (['jpg','jpeg','png','svg'].includes(fileType)) return <FileText size={15} color="#7c3aed" strokeWidth={1.5}/>;
    return <Package size={15} color="#64748b" strokeWidth={1.5}/>;
}

function MaterialCard({ material }) {
    const ig = material.contributor_instagram;

    const handleDownload = (e) => {
        e.stopPropagation();
        window.location.href = `/materiales/${material.id}/descargar`;
    };

    return (
        <div onClick={() => router.visit(`/materiales/${material.id}`)}
            style={{ background: 'white', border: '1px solid #e9ebf1', borderRadius: 16, padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer' }}>

            {/* Header: icono + título + Instagram */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: '#f8fafc', border: '1px solid #e9ebf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileIcon fileType={material.file_type} is3d={material.is_3d}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {material.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                        {material.organization || material.uploaded_by}
                    </div>
                </div>
                {ig && (
                    <a href={`https://instagram.com/${ig.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', color: '#9d174d', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 7, textDecoration: 'none', flexShrink: 0, border: '1px solid #fce7f3' }}>
                        <AtSign size={9} color="#9d174d" strokeWidth={2}/> {ig.replace('@','')}
                    </a>
                )}
            </div>

            {/* Descripción */}
            {material.description && (
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {material.description}
                </p>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f1f4f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#f1f4f9', color: '#64748b', padding: '2px 7px', borderRadius: 5 }}>
                        {CATEGORY_LABEL[material.category] || material.category}
                    </span>
                    <span style={{ fontSize: 10, color: '#cbd5e1' }}>
                        {material.download_count ?? 0} desc.
                    </span>
                </div>
                <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#4263ac', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Download size={10} color="white" strokeWidth={2}/> Descargar
                </button>
            </div>
        </div>
    );
}

export default function MaterialesIndex({ materials, filters }) {
    const activeTab = filters.tab === '3d' ? '3d' : 'print';
    const [category, setCategory] = useState(filters.category || '');
    const categories = activeTab === '3d' ? CATEGORIES_3D : PRINT_CATEGORIES;

    const filterBy = (value) => {
        setCategory(value);
        router.get('/materiales', { category: value, tab: activeTab }, { preserveScroll: true, replace: true });
    };

    const switchTab = (tab) => {
        setCategory('');
        router.get('/materiales', { tab }, { preserveScroll: true, replace: true });
    };

    const list = materials?.data ?? [];

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: '#1e293b' }}>Materiales y archivos</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            Recursos gratuitos para imprimir y fabricar
                        </p>
                    </div>
                    <Link href="/materiales/subir" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#4263ac', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0 }}>
                        <Upload size={12} color="white" strokeWidth={2.5}/> Subir archivo
                    </Link>
                </div>

                {/* Tabs + chips en una fila */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 3, background: '#f1f4f9', padding: 3, borderRadius: 11, flexShrink: 0 }}>
                        {TABS.map(({ key, label, Icon }) => {
                            const sel = activeTab === key;
                            return (
                                <button key={key} onClick={() => switchTab(key)} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                                    background: sel ? 'white' : 'transparent',
                                    color: sel ? '#1e293b' : '#94a3b8',
                                    boxShadow: sel ? '0 1px 3px rgba(16,24,40,.07)' : 'none',
                                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                }}>
                                    <Icon size={11} strokeWidth={2}/> {label}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ width: 1, height: 20, background: '#e2e8f0', flexShrink: 0 }}/>

                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {categories.map(({ value, label }) => {
                            const sel = category === value;
                            return (
                                <button key={value} onClick={() => filterBy(value)} style={{
                                    padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                                    background: sel ? '#4263ac' : 'transparent',
                                    color: sel ? 'white' : '#64748b',
                                    border: `1px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}>
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Grid */}
                {list.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                        <Package size={36} color="#e2e8f0" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 10px' }}/>
                        <p style={{ margin: '0 0 12px', fontSize: 13.5, color: '#94a3b8', fontWeight: 500 }}>No hay archivos en esta categoría</p>
                        <Link href="/materiales/subir" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#4263ac', color: 'white', fontSize: 12.5, fontWeight: 700, padding: '9px 18px', borderRadius: 11, textDecoration: 'none' }}>
                            <Upload size={12} color="white" strokeWidth={2}/> Subir el primero
                        </Link>
                    </div>
                ) : (
                    <div className="va-limpieza-grid">
                        {list.map(m => <MaterialCard key={m.id} material={m}/>)}
                    </div>
                )}

                {/* Paginación */}
                {materials?.links && materials.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
                        {materials.links.map((link, i) =>
                            link.url ? (
                                <Link key={i} href={link.url} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: link.active ? 700 : 500, background: link.active ? '#4263ac' : 'white', color: link.active ? 'white' : '#475569', border: link.active ? 'none' : '1px solid #e2e6ee', textDecoration: 'none' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}/>
                            ) : (
                                <span key={i} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 13, color: '#cbd5e1' }} dangerouslySetInnerHTML={{ __html: link.label }}/>
                            )
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
