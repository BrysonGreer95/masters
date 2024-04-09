import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Scramble from "../views/Scramble.vue";
import AboutView from "../views/AboutView.vue";
import Masters from "@/views/Masters.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/scramble",
    name: "scramble",
    component: Scramble,
  },
  {
    path: "/masters",
    name: "masters",
    component: Masters,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
