import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Upload, Download, Printer, Box, Package, Phone, AtSign, FileText } from 'lucide-react';

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

const SEC = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };

function FileIcon({ fileType, is3d }) {
    if (is3d) return <Box size={16} color="#4263ac" strokeWidth={1.5}/>;
    if (['jpg','jpeg','png','svg'].includes(fileType)) return <FileText size={16} color="#7c3aed" strokeWidth={1.5}/>;
    if (fileType === 'pdf') return <FileText size={16} color="#CE6969" strokeWidth={1.5}/>;
    return <Package size={16} color="#64748b" strokeWidth={1.5}/>;
}

function MaterialCard({ material }) {
    const pi       = material.print_instructions || {};
    const hasPrint = !material.is_3d && (pi.size || pi.color || pi.paper || pi.quantity || pi.notes);
    const ig       = material.contributor_instagram;
    const phone    = material.contributor_phone;

    return (
        <div style={{ background: 'white', border: '1px solid #e9ebf1', borderRadius: 14, padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* Header: icono + título + Instagram prioritario */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f8fafc', border: '1px solid #e9ebf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileIcon fileType={material.file_type} is3d={material.is_3d}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {material.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 1 }}>
                        {material.organization || material.uploaded_by}
                    </div>
                </div>
                {/* Instagram — prioridad máxima, arriba a la derecha */}
                {ig && (
                    <a href={`https://instagram.com/${ig.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fdf2f8', color: '#9d174d', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 8, textDecoration: 'none', flexShrink: 0, border: '1px solid #fce7f3' }}>
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

            {/* Instrucciones de impresión (compactas) */}
            {hasPrint && (
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '7px 10px', border: '1px solid #e9ebf1', display: 'flex', flexWrap: 'wrap', gap: '3px 12px' }}>
                    {pi.size     && <span style={{ fontSize: 10.5, color: '#475569' }}>📐 {pi.size}</span>}
                    {pi.color    && <span style={{ fontSize: 10.5, color: '#475569' }}>🎨 {pi.color}</span>}
                    {pi.paper    && <span style={{ fontSize: 10.5, color: '#475569' }}>{pi.paper}</span>}
                    {pi.quantity && <span style={{ fontSize: 10.5, color: '#475569' }}>×{pi.quantity}</span>}
                </div>
            )}

            {/* Info 3D */}
            {material.is_3d && (
                <div style={{ background: '#eef1fa', borderRadius: 8, padding: '6px 10px', border: '1px solid #d6dffa' }}>
                    <span style={{ fontSize: 10.5, color: '#4263ac', fontWeight: 700 }}>3D · {material.file_type?.toUpperCase()}</span>
                    <span style={{ fontSize: 10.5, color: '#4263ac', opacity: .7 }}> — coordina con el contribuidor</span>
                </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #f1f4f9', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {phone && (
                        <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#64748b', textDecoration: 'none' }}>
                            <Phone size={9} strokeWidth={2}/> {phone}
                        </a>
                    )}
                    {!ig && !phone && (
                        <span style={{ fontSize: 10, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Download size={9} strokeWidth={2}/> {material.download_count}
                        </span>
                    )}
                </div>
                <a href={`/materiales/${material.id}/descargar`} style={{
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                    background: '#4263ac', color: 'white', fontSize: 11, fontWeight: 700,
                    padding: '5px 11px', borderRadius: 9, textDecoration: 'none',
                }}>
                    <Download size={10} color="white" strokeWidth={2}/> Descargar
                </a>
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
                            Descarga y comparte recursos gratuitos para la emergencia
                        </p>
                    </div>
                    <Link href="/materiales/subir" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#4263ac', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 13px', borderRadius: 11, textDecoration: 'none', flexShrink: 0 }}>
                        <Upload size={12} color="white" strokeWidth={2.5}/> Subir archivo
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f4f9', padding: 4, borderRadius: 14, width: 'fit-content' }}>
                    {TABS.map(({ key, label, Icon }) => {
                        const sel = activeTab === key;
                        return (
                            <button key={key} onClick={() => switchTab(key)} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 700,
                                background: sel ? 'white' : 'transparent',
                                color: sel ? '#1e293b' : '#94a3b8',
                                boxShadow: sel ? '0 1px 4px rgba(16,24,40,.08)' : 'none',
                                border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .13s',
                            }}>
                                <Icon size={12} strokeWidth={2}/> {label}
                            </button>
                        );
                    })}
                </div>

                {/* Aviso contextual */}
                <div style={{ background: activeTab === '3d' ? '#eef1fa' : '#f8fafc', border: `1px solid ${activeTab === '3d' ? '#d6dffa' : '#e9ebf1'}`, borderRadius: 12, padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: 11.5, color: activeTab === '3d' ? '#4263ac' : '#64748b', lineHeight: 1.5 }}>
                        {activeTab === '3d'
                            ? <><strong>Para constructores, herreros y fabricantes:</strong> Descarga los patrones STL y contacta al contribuidor para coordinar la producción.</>
                            : <><strong>Para imprentas y voluntarios:</strong> Descarga el archivo y sigue las instrucciones incluidas. Todos los materiales son gratuitos.</>
                        }
                    </p>
                </div>

                {/* Chips de categoría */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {categories.map(({ value, label }) => {
                        const sel = category === value;
                        return (
                            <button key={value} onClick={() => filterBy(value)} style={{
                                padding: '5px 14px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                                background: sel ? '#4263ac' : 'white',
                                color: sel ? 'white' : '#475569',
                                border: `1px solid ${sel ? '#4263ac' : '#e2e8f0'}`,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .13s',
                            }}>
                                {label}
                            </button>
                        );
                    })}
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
