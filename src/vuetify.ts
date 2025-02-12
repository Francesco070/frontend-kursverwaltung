import {createVuetify} from 'vuetify'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'vuetify/styles/main.css'; // add main.css to prevent error
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
    defaults: {
        global: {
            rounded: 'xl',
            elevation: 0,
            border: 0,
        },
        VCard: {
            color: "background"
        },
        VTextField: {
            variant: "solo",
            flat: true,
        },
        VTextarea: {
            variant: "solo",
            flat: true,
        },
        VSelect: {
            variant: "solo",
            flat: true,
            itemColor: "primary"
        },
        VDataTable: {
            style: "border-radius: 24px",
        },
        VCheckbox: {
            color: "primary"
        },
    },
    theme: {
        defaultTheme: 'dark', // Standard: Darkmode
        themes: {
            dark: {
                dark: true, // Darkmode
                colors: {
                    primary: '#cba6f7',
                    secondary: '#fab387',
                    background: '#1e1e2e',
                    surface: '#181825',
                    error: '#f38ba8',
                    info: '#89dceb',
                    success: '#a6e3a1',
                    warning: '#f9e2af',
                },
            },
            light: {
                dark: false, // Lightmode
                colors: {
                    primary: '#7287fd',
                    secondary: '#fe640b',
                    background: '#f3ede9',
                    surface: '#7b503f',
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
})
