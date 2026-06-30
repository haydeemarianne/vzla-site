import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Wrench, MapPin, Phone, ClipboardList, UserPlus, AlertTriangle, Calendar } from 'lucide-react';

const PASTEL = ['#e7dcf2', '#dfe6f4', '#d6e8e0', '#f0d6d6', '#f3e2cf', '#fde68a'];

function initials(name) {
    return (name ?? '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function parseZones(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

function EngineerCard({ eng, idx }) {
    const zones = parseZones(eng.zones_available);

    return (
        <div style={{ background: 'white', border: '1px solid #e9ebf1', borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {/* Avatar + nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: PASTEL[idx % PASTEL.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3a4250' }}>{initials(eng.name)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eng.name}</div>
                    {eng.specialty && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7c3aed', background: '#f3eeff', padding: '1px 7px', borderRadius: 999 }}>{eng.specialty}</span>
                    )}
                </div>
            </div>

            {/* Zonas */}
            {zones.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <MapPin size={10} color="#94a3b8" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }}/>
                    {zones.slice(0, 3).map(z => (
                        <span key={z} style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#f1f4f9', padding: '1px 6px', borderRadius: 4 }}>{z}</span>
                    ))}
                    {zones.length > 3 && <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>+{zones.length - 3}</span>}
                </div>
            )}

            {/* Teléfono + disponibilidad */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {eng.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={10} color="#94a3b8" strokeWidth={2}/>
                        <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>{eng.phone}</span>
                    </div>
                )}
                {eng.available_until && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={10} color="#94a3b8" strokeWidth={2}/>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                            Disponible hasta {new Date(eng.available_until).toLocaleDateString('es-VE', { day:'2-digit', month:'short' })}
                        </span>
                    </div>
                )}
            </div>

            {/* Notas */}
            {eng.notes && (
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {eng.notes}
                </p>
            )}
        </div>
    );
}

export default function IngenierosIndex({ engineers, total }) {
    const list = engineers?.data ?? [];

    return (
        <MainLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a2230', letterSpacing: '-.5px' }}>Ingenieros voluntarios</h1>
                        <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#7b8595' }}>
                            {total || 0} ingeniero{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''} · Evaluación estructural gratuita
                        </p>
                    </div>
                </div>

                {/* Dos CTA cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Link href="/ingenieros/solicitar" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', border: '1.5px solid #e9ebf1', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer', transition: 'border-color .15s' }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ClipboardList size={20} color="#b45309" strokeWidth={2}/>
                            </div>
                            <div>
                                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Solicitar evaluación</div>
                                <p style={{ margin: 0, fontSize: 12, color: '#7b8595', lineHeight: 1.5 }}>
                                    ¿Tu estructura tiene daños? Pide una inspección gratuita por un profesional.
                                </p>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, background: '#b45309', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 9 }}>
                                    <AlertTriangle size={12} color="white" strokeWidth={2}/> Solicitar ahora
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/ingenieros/registrar" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', border: '1.5px solid #e9ebf1', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer', transition: 'border-color .15s' }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f3eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <UserPlus size={20} color="#7c3aed" strokeWidth={2}/>
                            </div>
                            <div>
                                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Soy ingeniero</div>
                                <p style={{ margin: 0, fontSize: 12, color: '#7b8595', lineHeight: 1.5 }}>
                                    Regístrate como voluntario para evaluar estructuras afectadas por el sismo.
                                </p>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, background: '#7c3aed', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 9 }}>
                                    <Wrench size={12} color="white" strokeWidth={2}/> Registrarme
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Lista de ingenieros */}
                {list.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 1, flex: 1, background: '#f1f4f9' }}/>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#94a3b8', whiteSpace: 'nowrap' }}>Ingenieros registrados</span>
                            <div style={{ height: 1, flex: 1, background: '#f1f4f9' }}/>
                        </div>
                        <div className="va-limpieza-grid">
                            {list.map((eng, i) => <EngineerCard key={eng.id} eng={eng} idx={i}/>)}
                        </div>
                    </>
                )}

                {/* Paginación */}
                {engineers?.links && engineers.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
                        {engineers.links.map((link, i) =>
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
