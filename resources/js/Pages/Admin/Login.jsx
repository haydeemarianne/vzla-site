import { useForm } from '@inertiajs/react';
import { Heart, Lock, Mail } from 'lucide-react';

export default function AdminLogin({ errors }) {
    const { data, setData, post, processing } = useForm({ email: '', password: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg,#eef0f4 0%,#e3e6ee 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Onest', system-ui, sans-serif",
            padding: '20px',
        }}>
            <div style={{
                width: '100%', maxWidth: '360px',
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 18px 48px rgba(16,24,40,.10)',
                padding: '36px 28px 32px',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 11, background: '#4263ac',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Heart size={18} color="#fff" fill="#fff" />
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>
                            Venezuela Ayuda
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
                            Panel de administración
                        </div>
                    </div>
                </div>

                <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px' }}>
                    Acceso admin
                </h1>
                <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
                    Solo administradores autorizados.
                </p>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Email */}
                    <div>
                        <label style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                            Correo electrónico
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="tu@correo.com"
                                autoComplete="email"
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '11px 12px 11px 36px',
                                    border: errors?.email ? '1.5px solid #CE6969' : '1.5px solid #e2e8f0',
                                    borderRadius: 12, fontSize: 13.5,
                                    fontFamily: 'inherit', outline: 'none',
                                    color: '#1e293b', background: '#f8fafc',
                                }}
                            />
                        </div>
                        {errors?.email && (
                            <p style={{ margin: '5px 0 0', fontSize: 12, color: '#CE6969', fontWeight: 500 }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                            Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '11px 12px 11px 36px',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: 12, fontSize: 13.5,
                                    fontFamily: 'inherit', outline: 'none',
                                    color: '#1e293b', background: '#f8fafc',
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            marginTop: 6,
                            background: processing ? '#83A2DB' : '#4263ac',
                            color: '#fff', border: 'none',
                            borderRadius: 13, padding: '13px',
                            fontSize: 14, fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'background 0.15s',
                        }}
                    >
                        {processing ? 'Verificando…' : 'Entrar al panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
