import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'react-hot-toast';
import '../css/app.css';

createInertiaApp({
    title: (title) => title ? `${title} — Venezuela Ayuda` : 'Venezuela Ayuda',
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </>
        );
    },
    progress: { color: '#dc2626' },
});
