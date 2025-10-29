import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);

//引入axios和vue-axios
import axios from 'axios'
//vue-axios是将axios集成到Vue.js的小包装器，可以像插件一样进行安装
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)
//provide 'axios'，其它地方可以注入，从而可以使用axios
app.provide('axios', app.config.globalProperties.axios) 
app.mount('#app');