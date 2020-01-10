import Vue from 'vue'
import App from './App.vue'
import Notifications from 'vue-notification';
import { VueSpinners } from '@saeris/vue-spinners';

import router from './router';

Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.use(VueSpinners);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
