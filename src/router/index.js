import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Scramble from "../views/Scramble.vue";
import FinalPrize from '../views/FinalPrize.vue'
import AboutView from "../views/AboutView.vue";
import Masters from "@/views/Masters.vue";
import MastersScore from "@/views/MastersScore.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/prize",
    name: "prize",
    component: FinalPrize,
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
  {
    path: "/masters_score",
    name: "masters_score",
    component: MastersScore,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
