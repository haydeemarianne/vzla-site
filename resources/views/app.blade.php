<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="description" content="Plataforma de ayuda humanitaria — Terremoto Venezuela 2026" />
    <title>Venezuela Site</title>

    {{-- Open Graph / WhatsApp --}}
    <meta property="og:type"        content="website" />
    <meta property="og:site_name"   content="Venezuela Site" />
    <meta property="og:title"       content="Venezuela Site — Ayuda Humanitaria" />
    <meta property="og:description" content="Casos de ayuda, jornadas de limpieza e inspecciones estructurales post-terremoto Venezuela 2026." />
    <meta property="og:url"         content="{{ url()->current() }}" />
    <meta property="og:locale"      content="es_VE" />

    {{-- Twitter / X --}}
    <meta name="twitter:card"        content="summary" />
    <meta name="twitter:title"       content="Venezuela Site — Ayuda Humanitaria" />
    <meta name="twitter:description" content="Casos de ayuda, jornadas de limpieza e inspecciones estructurales post-terremoto Venezuela 2026." />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234263ac'/><path d='M16 23s-8-5.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 5.5-8 11-8 11z' fill='white'/></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-50">
    @inertia
</body>
</html>
