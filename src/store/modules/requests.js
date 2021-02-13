export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      requests: []
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.unshift(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    }
  },
  actions: {
    async contactCoach(ctx, payload) {
      const newRequest = {
        id: new Date().toISOString(),
        coachId: payload.coachId,
        userEmail: payload.email,
        message: payload.message
      };

      const res = await fetch(
        `https://vue3-http-requests-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest)
        }
      );

      const resData = res.json();
      if (!res.ok) {
        const error = new Error(resData.message || 'Failed to fetch!');
        throw error;
      }
      ctx.commit('addRequest', newRequest);
    },
    async loadRequests(ctx) {
      if (!ctx.getters.shouldUpdate) {
        return;
      }
      const coachId = ctx.rootGetters.userId;
      const token = ctx.rootGetters.token;
      const res = await fetch(
        `https://vue3-http-requests-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`
      );
      const resData = await res.json();
      if (!res.ok) {
        const error = new Error(resData.message || 'Failed to fetch!');
        throw error;
      }

      const requests = [];
      for (const key in resData) {
        const request = {
          id: key,
          message: resData[key].message,
          userEmail: resData[key].userEmail
        };
        requests.unshift(request);
      }
      ctx.commit('setRequests', requests);
      ctx.commit('setFetchTimestamp');
    }
  },
  getters: {
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
    requests(state) {
      // const coachId = rootGetters.userId;
      return state.requests;
      // return state.requests.filter(req => req.coachId === coachId);
    },
    hasRequests(_, getters) {
      return getters.requests && getters.requests.length > 0;
      // return state.requests && state.requests.length > 0;
    }
  }
};
