import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(ElementPlus);
app.use(pinia); 

// 引入 axios 和 vue-axios
import axios from 'axios';
import VueAxios from 'vue-axios';
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);

// 挂载应用
app.mount('#app');