import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/home",
        name: "home",
        component: () => import("../views/home.vue"),
    },
    {
        path: "/designer",
        name: "designer",
        component: () => import("../views/designer/index.vue"),
    },
    {
        path: "/preview",
        name: "preview",
        component: () => import("../views/preview/index.vue"),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
