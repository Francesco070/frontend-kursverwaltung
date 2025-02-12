import type {RouteRecordRaw} from 'vue-router';
import {createRouter, createWebHistory} from 'vue-router';
import Home from "./view/Home.vue";
import Dozenten from "./view/Dozenten.vue";
import Kurse from "./view/Kurse.vue";
import Laender from "./view/Laender.vue";
import Lehrbetriebe from "./view/Lehrbetriebe.vue";
import Lernende from "./view/Lernende.vue";
import KursLernende from "./view/KursLernende.vue";
import LehrbetriebLernende from "./view/LehrbetriebLernende.vue";


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
    {
        path: '/kurs-lernende',
        name: 'KursLernende',
        component: KursLernende,
    },
    {
        path: '/lehrbetrieb-lernende',
        name: 'LehrbetriebLernende',
        component: LehrbetriebLernende,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('./view/NotFound.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;