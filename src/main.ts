import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from "./vuetify.ts";
import router from "./router.ts";

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount("#app");
