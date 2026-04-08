import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Scramble from "../views/Scramble.vue";
import Masters from "../views/Masters.vue";
import MastersScore from "../views/MastersScore.vue";
import Prize from "../views/FinalPrize.vue";
import AboutView from "../views/AboutView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  { path: "/",             name: "home",         component: HomeView    },
  { path: "/scramble",     name: "scramble",     component: Scramble    },
  { path: "/masters",      name: "masters",      component: Masters     },
  { path: "/masters-score",name: "masters_score",component: MastersScore},
  { path: "/final-prize",  name: "final_prize",  component: Prize       },
  { path: "/about",        name: "about",        component: AboutView   },
  { path: "/admin",        name: "admin",        component: AdminView   },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
