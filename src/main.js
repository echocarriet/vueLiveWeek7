import { createApp } from 'vue';
// 載入 vue axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// 時間戳&千分位逗號
import { date, currency } from './methods/filters';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 時間戳&千分位逗號
app.config.globalProperties.$filters = {
  currency,
  date,
};
app.use(router);
// vue axios
app.use(VueAxios, axios);
app.mount('#app');
