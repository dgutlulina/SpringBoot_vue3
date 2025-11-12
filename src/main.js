import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia, defineStore } from 'pinia'; 
import { ref, reactive } from 'vue'; 

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub, faWeibo } from '@fortawesome/free-brands-svg-icons';

library.add(faGithub);
library.add(faWeibo)

export const useStore = defineStore('my', () => {
  const articleId = ref(0)
  const page = reactive({ "pageParams": null })
  const home = reactive({ "page": 1 })
  return { articleId, page, home }
})

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(pinia); 

// 引入 axios 和 vue-axios
import axios from 'axios';
import VueAxios from 'vue-axios';
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);
app.component('font-awesome-icon', FontAwesomeIcon);

// 挂载应用
app.mount('#app');