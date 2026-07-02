import MainLayout from '@/Layouts/MainLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, Box, Phone, AtSign, FileText, Package, Tag, Users, ThumbsUp, Share2 } from 'lucide-react';

const CATEGORY_LABEL = {
    flyer: 'Flyer', poster: 'Cartel', guide: 'Guía', map: 'Mapa', other: 'Otro',
    '3d_construction': 'Construcción 3D', '3d_ironwork': 'Herrería 3D',
    '3d_medical': 'Médico 3D', '3d_furniture': 'Literas y muebles 3D',
    '3d_tools': 'Herramientas 3D', '3d_other': 'Otro 3D',
};

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'svg', 'webp'];
const VIDEO_TYPES = ['mp4', 'webm', 'mov', 'avi'];

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf'];

const CARD = { background: 'white', border: '1px solid #e9ebf1', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 };
const SEC  = { margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7b8595' };
const DIV  = { height: 1, background: '#f3f4f8' };

function initials(name = '') {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function FileIcon({ fileType, is3d }) {
    if (is3d) return <Box size={22} color="#4263ac" strokeWidth={1.5}/>;
    if (fileType === 'pdf') return <FileText size={22} color="#CE6969" strokeWidth={1.5}/>;
    if (IMAGE_TYPES.includes(fileType)) return <FileText size={22} color="#7c3aed" strokeWidth={1.5}/>;
    return <Package size={22} color="#64748b" strokeWidth={1.5}/>;
}

export default function MaterialesShow({ material: m }) {
    const { props } = usePage();
    const flash    = props.flash ?? {};
    const voted    = flash.voted;
    const pi       = m.print_instructions || {};
    const hasPrint = !m.is_3d && (pi.size || pi.color || pi.paper || pi.quantity || pi.notes);
    const isImage  = IMAGE_TYPES.includes(m.file_type);
    const isVideo  = VIDEO_TYPES.includes(m.file_type);
    const isMedia  = isImage || isVideo;

    const vote  = () => router.post(`/materiales/${m.id}/votar`, {}, { preserveScroll: true });
    const share = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: m.title, url });
        } else {
            navigator.clipboard?.writeText(url);
        }
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <Link href="/materiales" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none' }}>
                    <ArrowLeft size={14} color="#64748b" strokeWidth={2.5}/> Materiales
                </Link>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: m.is_3d ? '#eef1fa' : '#f8fafc', border: '1px solid #e9ebf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileIcon fileType={m.file_type} is3d={m.is_3d}/>
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a2230', letterSpacing: '-.4px', lineHeight: 1.2 }}>{m.title}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, background: '#eef1fa', color: '#4263ac', padding: '2px 10px', borderRadius: 999 }}>
                                    {CATEGORY_LABEL[m.category] || m.category}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={share} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                        <Share2 size={14} color="#64748b" strokeWidth={2}/> Compartir
                    </button>
                </div>

                {/* ── Portada — protagonismo al archivo ── */}
                <div style={{ ...CARD, padding: isMedia && m.file_path ? 12 : 30 }}>
                    {isMedia && m.file_path ? (
                        <div style={{ borderRadius: 14, overflow: 'hidden', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
                            {isImage && (
                                <img src={`/storage/${m.file_path}`} alt={m.title}
                                    style={{ width: '100%', maxHeight: 440, objectFit: 'contain', display: 'block' }}/>
                            )}
                            {isVideo && (
                                <video src={`/storage/${m.file_path}`} controls
                                    style={{ width: '100%', maxHeight: 440, display: 'block' }}/>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: 18, background: m.is_3d ? '#eef1fa' : '#f8fafc', border: '1px solid #e9ebf1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileIcon fileType={m.file_type} is3d={m.is_3d}/>
                            </div>
                            <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8', fontWeight: 600 }}>
                                {m.is_3d ? 'Archivo 3D — descarga para verlo' : `Archivo ${(m.file_type || '').toUpperCase()}`}
                            </p>
                        </div>
                    )}
                </div>

                <div className="va-show-grid">

                    {/* ── Col izq: descripción + instrucciones ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={CARD}>
                            {m.description && (
                                <>
                                    <p style={SEC}>Descripción</p>
                                    <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.7 }}>{m.description}</p>
                                    {hasPrint && <div style={DIV}/>}
                                </>
                            )}
                            {hasPrint && (
                                <>
                                    <p style={SEC}>Instrucciones de impresión</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {[
                                            { label: 'Tamaño',            val: pi.size     },
                                            { label: 'Color',             val: pi.color    },
                                            { label: 'Papel',             val: pi.paper    },
                                            { label: 'Cantidad sugerida', val: pi.quantity },
                                        ].filter(r => r.val).map(({ label, val }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 11px', background: '#f8fafc', borderRadius: 9, border: '1px solid #f1f4f9' }}>
                                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</span>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{val}</span>
                                            </div>
                                        ))}
                                        {pi.notes && <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6, padding: '7px 11px', background: '#f8fafc', borderRadius: 9, border: '1px solid #f1f4f9' }}>{pi.notes}</p>}
                                    </div>
                                </>
                            )}
                            {m.is_3d && (
                                <>
                                    {m.description && <div style={DIV}/>}
                                    <div style={{ background: '#eef1fa', borderRadius: 12, padding: '11px 14px', border: '1px solid #d6dffa' }}>
                                        <p style={{ margin: 0, fontSize: 13, color: '#4263ac', lineHeight: 1.6 }}>
                                            Descarga el archivo y coordina con el contribuidor para ajustar escala, material y método de fabricación.
                                        </p>
                                    </div>
                                </>
                            )}
                            {!m.description && !hasPrint && !m.is_3d && (
                                <p style={{ margin: 0, fontSize: 13, color: '#c0c8d4' }}>Sin descripción adicional.</p>
                            )}
                        </div>

                        {/* Contribuidor — crédito visible a quien aporta el recurso */}
                        <div style={CARD}>
                            <p style={SEC}>Aportado por</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: PASTEL[(m.uploaded_by || '?').charCodeAt(0) % PASTEL.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#3a4250' }}>{initials(m.uploaded_by)}</span>
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b', letterSpacing: '-.2px' }}>{m.uploaded_by || 'Anónimo'}</p>
                                    {m.organization && <p style={{ margin: '1px 0 0', fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>{m.organization}</p>}
                                </div>
                            </div>
                            {(m.contributor_instagram || m.contributor_phone) && <div style={DIV}/>}
                            {(m.contributor_instagram || m.contributor_phone) && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {m.contributor_instagram && (
                                        <a href={`https://instagram.com/${m.contributor_instagram.replace('@','')}`}
                                            target="_blank" rel="noopener noreferrer"
                                            style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 8, background: '#fdf2f8', color: '#9d174d', fontSize: 12.5, fontWeight: 700, padding: '10px 13px', borderRadius: 12, textDecoration: 'none', border: '1px solid #fce7f3' }}>
                                            <AtSign size={13} color="#9d174d" strokeWidth={2}/> {m.contributor_instagram.replace('@','')}
                                        </a>
                                    )}
                                    {m.contributor_phone && (
                                        <a href={`tel:${m.contributor_phone}`}
                                            style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 8, background: '#eef1fa', color: '#4263ac', fontSize: 12.5, fontWeight: 700, padding: '10px 13px', borderRadius: 12, textDecoration: 'none', border: '1px solid #d6dffa' }}>
                                            <Phone size={13} color="#4263ac" strokeWidth={2}/> {m.contributor_phone}
                                        </a>
                                    )}
                                </div>
                            )}
                            {m.price_estimate && (
                                <>
                                    <div style={DIV}/>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Tag size={13} color="#b45309" strokeWidth={2}/>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{m.price_estimate}</p>
                                            <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>costo referencial</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Col der: acciones ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Acciones — botones sólidos + stats inline */}
                        <div style={CARD}>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <a href={`/materiales/${m.id}/descargar`} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    background: '#4263ac', color: 'white', fontSize: 13, fontWeight: 700,
                                    padding: '11px', borderRadius: 12, textDecoration: 'none',
                                }}>
                                    <Download size={14} color="white" strokeWidth={2}/> Descargar
                                </a>
                                <button onClick={vote} disabled={voted} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                    background: voted ? '#dcfce7' : '#f8fafc',
                                    border: `1.5px solid ${voted ? '#bbf7d0' : '#e2e8f0'}`,
                                    color: voted ? '#16a34a' : '#475569',
                                    fontSize: 13, fontWeight: 700, borderRadius: 12, padding: '11px',
                                    cursor: voted ? 'default' : 'pointer', fontFamily: 'inherit',
                                }}>
                                    <ThumbsUp size={13} strokeWidth={2} color={voted ? '#16a34a' : '#475569'}/>
                                    {voted ? '¡Gracias!' : 'Útil'}
                                </button>
                            </div>
                            <div style={DIV}/>
                            <div style={{ display: 'flex', gap: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                                    <span style={{ fontSize: 17, fontWeight: 800, color: '#1e293b' }}>{m.download_count ?? 0}</span>
                                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>descargas</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                                    <span style={{ fontSize: 17, fontWeight: 800, color: '#1e293b' }}>{m.helpful_count ?? 0}</span>
                                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>marcaron útil</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
