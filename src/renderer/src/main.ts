import './styles/index.scss';
import 'virtual:uno.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(ElementPlus).use(pinia);
app.mount('#app');
