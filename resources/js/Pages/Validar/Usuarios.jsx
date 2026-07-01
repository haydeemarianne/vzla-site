import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X, Check, Trash2, Eye, EyeOff } from 'lucide-react';

const ROLE_CFG = {
    super_admin: { label:'Super Admin', bg:'#0f172a', color:'white'  },
    admin:       { label:'Admin',       bg:'#4263ac', color:'white'  },
    validator:   { label:'Validador',   bg:'#f0f2f7', color:'#5b6677'},
};

const initials = (name) =>
    name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';

const PASTEL = ['#e7dcf2','#dfe6f4','#d6e8e0','#f0d6d6','#f3e2cf'];
const pastel  = (i) => PASTEL[i % PASTEL.length];

export default function Usuarios({ users = [], admin_role, admin_name }) {
    const isSuperAdmin = admin_role === 'super_admin';
    const isAdmin      = admin_role === 'admin' || isSuperAdmin;

    const allowedRoles = isSuperAdmin
        ? [{ v:'admin', label:'Admin' }, { v:'validator', label:'Validador' }]
        : [{ v:'validator', label:'Validador' }];

    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState({ name:'', email:'', password:'', role: allowedRoles[0]?.v || 'validator' });
    const [sending, setSend]        = useState(false);
    const [confirm, setConfirm]     = useState(null);
    const [showPass, setShowPass]   = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const submit = () => {
        setSend(true);
        router.post('/validar/usuarios', form, {
            preserveScroll: true,
            onSuccess: () => { setForm({ name:'', email:'', password:'', role: allowedRoles[0]?.v }); setShowForm(false); },
            onFinish: () => setSend(false),
        });
    };

    const toggle = (id) =>
        router.post(`/validar/usuarios/${id}/toggle`, {}, { preserveScroll: true });

    const destroy = (id) => {
        setConfirm(null);
        router.delete(`/validar/usuarios/${id}`, { preserveScroll: true });
    };

    const INPUT = {
        width:'100%', padding:'9px 13px', borderRadius:10,
        border:'1.5px solid #e6e9f0', fontSize:13, color:'#1a2230',
        outline:'none', fontFamily:'inherit', background:'white', boxSizing:'border-box',
    };

    const visibleUsers = isSuperAdmin ? users : users.filter(u => u.role === 'validator');

    return (
        <MainLayout>
            <div style={{ maxWidth:680, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

                {/* Título */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                        <h1 style={{ margin:0, fontSize:26, fontWeight:800, letterSpacing:'-1px', color:'#1a2230' }}>
                            Usuarios del panel
                        </h1>
                        <p style={{ margin:'4px 0 0', fontSize:13, color:'#7b8595' }}>
                            {visibleUsers.length} {visibleUsers.length === 1 ? 'usuario' : 'usuarios'} registrados
                        </p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(s => !s)} style={{
                            display:'flex', alignItems:'center', gap:7,
                            padding:'10px 18px', borderRadius:12, border:'none',
                            background:'#0f172a', color:'white',
                            fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                        }}>
                            <Plus size={15}/> Nuevo usuario
                        </button>
                    )}
                </div>

                {/* Formulario nuevo usuario */}
                {showForm && (
                    <div style={{ background:'white', border:'1px solid #e6e9f0', borderRadius:20, padding:'20px 22px' }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1a2230', marginBottom:14 }}>
                            Crear usuario
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                            <div>
                                <label style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>Nombre</label>
                                <input value={form.name} onChange={e => set('name', e.target.value)} style={INPUT} placeholder="Nombre completo"/>
                            </div>
                            <div>
                                <label style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>Correo</label>
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={INPUT} placeholder="correo@ejemplo.com"/>
                            </div>
                            <div>
                                <label style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>Contraseña</label>
                                <div style={{ position:'relative' }}>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => set('password', e.target.value)}
                                        style={{ ...INPUT, paddingRight:38 }}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(s => !s)}
                                        style={{
                                            position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                                            background:'none', border:'none', cursor:'pointer', padding:2,
                                            color:'#94a3b8', display:'flex', alignItems:'center',
                                        }}
                                    >
                                        {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize:11, fontWeight:700, color:'#7b8595', textTransform:'uppercase', letterSpacing:'.4px', display:'block', marginBottom:5 }}>Rol</label>
                                <select value={form.role} onChange={e => set('role', e.target.value)} style={INPUT}>
                                    {allowedRoles.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display:'flex', gap:9, marginTop:16 }}>
                            <button onClick={submit} disabled={sending} style={{
                                flex:1, padding:'11px', borderRadius:12, border:'none',
                                background:'#4263ac', color:'white', fontSize:13, fontWeight:700,
                                cursor:'pointer', fontFamily:'inherit', opacity: sending ? .6 : 1,
                            }}>
                                {sending ? 'Guardando…' : 'Crear usuario'}
                            </button>
                            <button onClick={() => setShowForm(false)} style={{
                                padding:'11px 16px', borderRadius:12, border:'1px solid #e6e9f0',
                                background:'white', color:'#64748b', fontSize:13, fontWeight:600,
                                cursor:'pointer', fontFamily:'inherit',
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Lista de usuarios */}
                <div style={{ background:'white', border:'1px solid #e6e9f0', borderRadius:20, overflow:'hidden' }}>
                    {visibleUsers.length === 0 ? (
                        <p style={{ textAlign:'center', color:'#94a3b8', fontSize:13, padding:'32px 0', margin:0 }}>
                            No hay usuarios registrados.
                        </p>
                    ) : visibleUsers.map((u, i) => {
                        const rc = ROLE_CFG[u.role] || ROLE_CFG.validator;
                        return (
                            <div key={u.id} style={{
                                display:'flex', alignItems:'center', gap:14,
                                padding:'14px 20px',
                                borderTop: i === 0 ? 'none' : '1px solid #f3f4f8',
                                opacity: u.active ? 1 : .5,
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width:40, height:40, borderRadius:'50%',
                                    background: pastel(i),
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:13, fontWeight:700, color:'#3a4250', flexShrink:0,
                                }}>
                                    {initials(u.name)}
                                </div>

                                {/* Info */}
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:14, fontWeight:700, color:'#1a2230', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                        {u.name}
                                    </div>
                                    <div style={{ fontSize:12, color:'#94a3b8', marginTop:1 }}>{u.email}</div>
                                </div>

                                {/* Rol */}
                                <span style={{
                                    padding:'4px 11px', borderRadius:999, fontSize:11, fontWeight:700,
                                    background: rc.bg, color: rc.color, flexShrink:0,
                                }}>
                                    {rc.label}
                                </span>

                                {/* Estado */}
                                <span style={{
                                    padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700, flexShrink:0,
                                    background: u.active ? '#dcfce7' : '#f3f4f8',
                                    color:      u.active ? '#16a34a' : '#94a3b8',
                                }}>
                                    {u.active ? 'Activo' : 'Inactivo'}
                                </span>

                                {/* Acciones */}
                                {isAdmin && u.role !== 'super_admin' && (
                                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                                        <button
                                            onClick={() => toggle(u.id)}
                                            title={u.active ? 'Desactivar' : 'Activar'}
                                            style={{
                                                width:30, height:30, borderRadius:'50%', border:'1.5px solid #e6e9f0',
                                                background: u.active ? '#fef3f2' : '#f0fdf4',
                                                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                                            }}>
                                            {u.active
                                                ? <X size={13} color="#CE6969" strokeWidth={2.5}/>
                                                : <Check size={13} color="#16a34a" strokeWidth={2.5}/>}
                                        </button>
                                        {isSuperAdmin && (
                                            <button
                                                onClick={() => setConfirm(u.id)}
                                                title="Eliminar"
                                                style={{
                                                    width:30, height:30, borderRadius:'50%', border:'1.5px solid #fecaca',
                                                    background:'#fef2f2',
                                                    display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                                                }}>
                                                <Trash2 size={13} color="#CE6969" strokeWidth={2}/>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Modal confirmación eliminar */}
                {confirm && (
                    <div style={{
                        position:'fixed', inset:0, background:'rgba(15,23,42,.35)',
                        zIndex:300, display:'flex', alignItems:'center', justifyContent:'center',
                        backdropFilter:'blur(2px)',
                    }} onClick={() => setConfirm(null)}>
                        <div onClick={e => e.stopPropagation()} style={{
                            background:'white', borderRadius:20, padding:'24px 26px',
                            width:'min(380px,90vw)', boxShadow:'0 24px 60px rgba(15,23,42,.22)',
                        }}>
                            <div style={{ fontSize:16, fontWeight:800, color:'#1a2230', marginBottom:8 }}>
                                ¿Eliminar usuario?
                            </div>
                            <p style={{ fontSize:13, color:'#5b6677', margin:'0 0 20px' }}>
                                Esta acción no se puede deshacer.
                            </p>
                            <div style={{ display:'flex', gap:9 }}>
                                <button onClick={() => destroy(confirm)} style={{
                                    flex:1, padding:'11px', borderRadius:12, border:'none',
                                    background:'#CE6969', color:'white', fontSize:13, fontWeight:700,
                                    cursor:'pointer', fontFamily:'inherit',
                                }}>
                                    Eliminar
                                </button>
                                <button onClick={() => setConfirm(null)} style={{
                                    padding:'11px 16px', borderRadius:12, border:'1px solid #e6e9f0',
                                    background:'white', color:'#64748b', fontSize:13, fontWeight:600,
                                    cursor:'pointer', fontFamily:'inherit',
                                }}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
