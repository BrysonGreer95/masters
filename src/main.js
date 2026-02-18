/* eslint-disable no-unused-vars */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Buefy from "buefy";
import "./styles/main.scss";

createApp(App).use(store).use(Buefy).use(router).mount("#app");
