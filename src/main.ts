import { createApp } from 'vue';
import App from '@/App.vue';
// pinia store
import { createPinia } from 'pinia';
import router from '@/router';
// main app css
import '@/assets/css/app.css';

import { app as firebaseApp } from './firebase';

// perfect scrollbar
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
//vue-meta
import { createHead } from '@vueuse/head';
// set default settings
import appSetting from '@/app-setting';
//vue-i18n
import i18n from '@/i18n';
// popper
import Popper from 'vue3-popper';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.use(PerfectScrollbarPlugin);

const head = createHead();
app.use(head);

appSetting.init();

app.config.globalProperties.$firebase = firebaseApp;


app.use(i18n);

import { vMaska } from 'maska/vue';
app.directive('maska', vMaska);

app.component('Popper', Popper);

app.mount('#app');
