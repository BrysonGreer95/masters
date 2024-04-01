/* eslint-disable no-unused-vars */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

createApp(App).use(store).use(Buefy).use(router).mount('#app')
