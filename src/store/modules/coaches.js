export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      streams: [
        {
          id: 'c1',
          streamerHandle: 'Spracto',
          streamName: 'Destiny 2!',
          areas: ['Games', 'Music'],
          description: 'Playing some Destiny 2, come hang out!'
        },
        {
          id: 'c2',
          streamerHandle: 'Harley The DJ',
          streamName: 'Dubstep dayz',
          areas: ['Music'],
          description: 'Blasting the latest dubstep tunes'
        }
      ]
    };
  },
  mutations: {
    saveCoach(state, data) {
      state.coaches.push(data);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    }
  },
  actions: {
    async saveCoachData(ctx, data) {
      const userId = ctx.rootGetters.userId;
      const newCoach = {
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas
      };

      const token = ctx.rootGetters.token;
      const res = await fetch(
        `https://vue3-http-requests-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,
        {
          method: 'PUT',
          body: JSON.stringify(newCoach)
        }
      );

      // resData = await res.json();
      if (!res.ok) {
        // error ...
      }
      ctx.commit('saveCoach', {
        ...newCoach,
        id: userId
      });
    },
    async loadCoaches(ctx, payload) {
      if (!payload.forceRefresh && !ctx.getters.shouldUpdate) {
        return;
      }

      const res = await fetch(
        'https://vue3-http-requests-default-rtdb.firebaseio.com/coaches.json'
      );
      const resData = await res.json();
      if (!res.ok) {
        // error ...
        const error = new Error(resData.message || 'Failed to fetch!');
        throw error;
      }
      const coaches = [];
      for (const key in resData) {
        const coach = {
          id: key,
          firstName: resData[key].firstName,
          lastName: resData[key].lastName,
          description: resData[key].description,
          hourlyRate: resData[key].hourlyRate,
          areas: resData[key].areas
        };
        coaches.push(coach);
      }
      ctx.commit('setCoaches', coaches);
      ctx.commit('setFetchTimestamp');
    }
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    coachById(state, coachId) {
      return state.coaches.find(coach => coach.id === coachId);
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some(coach => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    }
  }
};
