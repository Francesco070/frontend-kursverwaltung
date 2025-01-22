import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from "./view/Home.vue";
import Dozenten from "./view/Dozenten.vue";
import Kurse from "./view/Kurse.vue";
import Laender from "./view/Laender.vue";
import Lehrbetriebe from "./view/Lehrbetriebe.vue";
import Lernende from "./view/Lernende.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/dozenten',
        name: 'Dozenten',
        component: Dozenten,
    },
    {
        path: '/kurse',
        name: 'Kurse',
        component: Kurse,
    },
    {
        path: '/laender',
        name: 'Laender',
        component: Laender,
    },
    {
        path: '/lehrbetriebe',
        name: 'Lehrbetriebe',
        component: Lehrbetriebe,
    },
    {
        path: '/lernende',
        name: 'Lernende',
        component: Lernende,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;