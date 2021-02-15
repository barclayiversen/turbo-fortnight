import { createStore } from 'vuex';
import coachesModule from './modules/streams.js';
import requestsModule from './modules/requests.js';
import authModule from './modules/auth.js';

const store = createStore({
  modules: {
    streams: coachesModule,
    requests: requestsModule,
    auth: authModule
  }
});

export default store;
