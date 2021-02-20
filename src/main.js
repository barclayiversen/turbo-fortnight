import { createApp, defineAsyncComponent } from 'vue';
// import VueSocketIOExt  from 'vue-socket.io-extended';
// import VueSocketIO from 'vue-socket';
// import { io } from 'socket.io-client';
import router from './router.js';
import store from './store/index.js';
import App from './App.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseBadge from './components/ui/BaseBadge.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import BaseVideoCard from './components/ui/BaseVideoCard.vue';
// import BaseDialog from './components/ui/BaseDialog.vue';

const BaseDialog = defineAsyncComponent(() =>
  import('./components/ui/BaseDialog.vue')
);

// const socket = io('http://localhost:3000');
const app = createApp(App);

// app.use(socket);
app.use(store);
app.use(router);
app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-badge', BaseBadge);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);
app.component('base-video-card', BaseVideoCard);
app.mount('#app');
