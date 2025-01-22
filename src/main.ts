import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'; // Vuetify CSS-Styles
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark', // Standard: Darkmode
        themes: {
            dark: {
                dark: true, // Darkmode
                colors: {
                    primary: '#89b4fa',
                    secondary: '#f38ba8',
                    background: '#1e1e2e',
                    surface: '#313244',
                    error: '#f38ba8',
                    info: '#74c7ec',
                    success: '#a6e3a1',
                    warning: '#f9e2af',
                },
            },
            light: {
                dark: false, // Lightmode
                colors: {
                    primary: '#7287fd',
                    secondary: '#d20f39',
                    background: '#eff1f5',
                    surface: '#e6e9ef',
                    error: '#d20f39',
                    info: '#04a5e5',
                    success: '#40a02b',
                    warning: '#df8e1d',
                },
            },
        },
    },
    components,
    directives,
});

const app = createApp(App);
app.use(vuetify);

app.mount("#app");
