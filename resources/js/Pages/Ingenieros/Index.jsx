import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';

const DANOS_OPTIONS = ['Grietas', 'Techo caído', 'Inclinación', 'Columnas', 'Otro'];
const ZONAS_OPTIONS = ['Caracas', 'La Guaira', 'Los Teques', 'Miranda', 'Vargas'];

const inputStyle = {
    width: '100%',
    border: '1px solid #e2e6ee',
    borderRadius: 13,
    padding: '13px 14px',
    fontSize: 14.5,
    color: '#0f172a',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Onest', system-ui, sans-serif",
    transition: 'border-color .15s',
};

const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: '#334155',
    display: 'block',
    marginBottom: 6,
    fontFamily: "'Onest', system-ui, sans-serif",
};

function ChipSelector({ options, selected, onToggle }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
            {options.map((opt) => {
                const active = selected.includes(opt);
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onToggle(opt)}
                        style={{
                            background: active ? '#4263ac' : '#fff',
                            color: active ? '#fff' : '#334155',
                            border: `1px solid ${active ? '#4263ac' : '#e2e6ee'}`,
                            padding: '8px 13px',
                            borderRadius: 11,
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: "'Onest', system-ui, sans-serif",
                            transition: 'all .15s',
                        }}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}

function FocusableInput({ style, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            style={{
                ...style,
                borderColor: focused ? '#4263ac' : '#e2e6ee',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
}

function TabSolicitar() {
    const [selectedDanos, setSelectedDanos] = useState([]);
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [phoneFocused, setPhoneFocused] = useState(false);

    const toggleDano = (d) =>
        setSelectedDanos((prev) =>
            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
        );

    return (
        <div>
            {/* Aviso ámbar */}
            <div
                style={{
                    marginTop: 18,
                    background: '#fff7ed',
                    border: '1px solid #fde7c6',
                    borderRadius: 16,
                    padding: 14,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                }}
            >
                <AlertTriangle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12.5, color: '#92400e', lineHeight: 1.5, margin: 0 }}>
                    ¿Tu casa tiene grietas o daño visible?{' '}
                    <strong>No entres</strong> hasta que un ingeniero la evalúe.
                </p>
            </div>

            {/* Formulario */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 13,
                    marginTop: 16,
                }}
            >
                {/* Dirección */}
                <div>
                    <label style={labelStyle}>Dirección del inmueble</label>
                    <FocusableInput
                        type="text"
                        placeholder="Calle, edificio, sector..."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Daños observados */}
                <div>
                    <label style={labelStyle}>¿Qué daño observas?</label>
                    <ChipSelector
                        options={DANOS_OPTIONS}
                        selected={selectedDanos}
                        onToggle={toggleDano}
                    />
                </div>

                {/* Teléfono */}
                <div>
                    <label style={labelStyle}>Tu teléfono</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                        <div
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e6ee',
                                borderRadius: 13,
                                padding: '0 14px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#334155',
                                whiteSpace: 'nowrap',
                                fontFamily: "'Onest', system-ui, sans-serif",
                            }}
                        >
                            🇻🇪 +58
                        </div>
                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="4XX XXX XXXX"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            style={{
                                ...inputStyle,
                                flex: 1,
                                borderColor: phoneFocused ? '#4263ac' : '#e2e6ee',
                            }}
                            onFocus={() => setPhoneFocused(true)}
                            onBlur={() => setPhoneFocused(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Botón solicitar */}
            <button
                onClick={() => router.visit('/ingenieros/solicitar')}
                style={{
                    marginTop: 22,
                    width: '100%',
                    background: '#4263ac',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '14px 0',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Onest', system-ui, sans-serif",
                    letterSpacing: '-0.1px',
                }}
            >
                Solicitar evaluación
            </button>
        </div>
    );
}

function TabRegistrar() {
    const [selectedZonas, setSelectedZonas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [colegiatura, setColegiatura] = useState('');
    const [nombreFocused, setNombreFocused] = useState(false);
    const [civFocused, setCivFocused] = useState(false);

    const toggleZona = (z) =>
        setSelectedZonas((prev) =>
            prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]
        );

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 13,
                    marginTop: 16,
                }}
            >
                {/* Nombre */}
                <div>
                    <label style={labelStyle}>Nombre y apellido</label>
                    <input
                        type="text"
                        placeholder="Ing. Carlos Mendoza"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{
                            ...inputStyle,
                            borderColor: nombreFocused ? '#4263ac' : '#e2e6ee',
                        }}
                        onFocus={() => setNombreFocused(true)}
                        onBlur={() => setNombreFocused(false)}
                    />
                </div>

                {/* Colegiatura */}
                <div>
                    <label style={labelStyle}>N° de colegiatura (CIV)</label>
                    <input
                        type="text"
                        placeholder="CIV 000000"
                        value={colegiatura}
                        onChange={(e) => setColegiatura(e.target.value)}
                        style={{
                            ...inputStyle,
                            borderColor: civFocused ? '#4263ac' : '#e2e6ee',
                        }}
                        onFocus={() => setCivFocused(true)}
                        onBlur={() => setCivFocused(false)}
                    />
                </div>

                {/* Zonas */}
                <div>
                    <label style={labelStyle}>Zonas donde puedes evaluar</label>
                    <ChipSelector
                        options={ZONAS_OPTIONS}
                        selected={selectedZonas}
                        onToggle={toggleZona}
                    />
                </div>
            </div>

            {/* Botón registrar */}
            <button
                onClick={() => router.visit('/ingenieros/registrar')}
                style={{
                    marginTop: 22,
                    width: '100%',
                    background: '#4263ac',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '14px 0',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Onest', system-ui, sans-serif",
                    letterSpacing: '-0.1px',
                }}
            >
                Registrarme como voluntario
            </button>

            {/* Nota validación */}
            <p
                style={{
                    fontSize: 11.5,
                    color: '#94a3b8',
                    textAlign: 'center',
                    marginTop: 11,
                    lineHeight: 1.5,
                }}
            >
                Tu colegiatura será validada por el equipo antes de asignarte casos.
            </p>
        </div>
    );
}

export default function IngenierosIndex({ engineers, total }) {
    const [ing, setIng] = useState('sol');

    return (
        <MainLayout>
            <div
                style={{
                    padding: '6px 20px 100px',
                    fontFamily: "'Onest', system-ui, sans-serif",
                }}
            >
                {/* Header */}
                <h1
                    style={{
                        fontSize: 21,
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.4px',
                        margin: 0,
                    }}
                >
                    Ingenieros voluntarios
                </h1>
                <p
                    style={{
                        fontSize: 12.5,
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginTop: 1,
                        marginBottom: 0,
                    }}
                >
                    Evaluación estructural gratuita
                </p>

                {/* Segmented control */}
                <div
                    style={{
                        marginTop: 14,
                        background: '#eceef2',
                        borderRadius: 13,
                        padding: 5,
                        display: 'flex',
                        gap: 6,
                    }}
                >
                    {[
                        { key: 'sol', label: 'Solicitar evaluación' },
                        { key: 'reg', label: 'Soy ingeniero' },
                    ].map(({ key, label }) => {
                        const active = ing === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setIng(key)}
                                style={{
                                    flex: 1,
                                    padding: '9px 10px',
                                    borderRadius: 9,
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: active ? 700 : 600,
                                    color: active ? '#0f172a' : '#64748b',
                                    background: active ? '#fff' : 'transparent',
                                    boxShadow: active ? '0 2px 8px rgba(16,24,40,.08)' : 'none',
                                    fontFamily: "'Onest', system-ui, sans-serif",
                                    transition: 'all .15s',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Tabs */}
                {ing === 'sol' ? <TabSolicitar /> : <TabRegistrar />}
            </div>
        </MainLayout>
    );
}
