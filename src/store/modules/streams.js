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
          streamerHandle: 'Harley_The_DJ',
          streamName: 'Dubstep dayz',
          areas: ['Music', 'Other'],
          description: 'Blasting the latest dubstep tunes'
        }
      ]
    };
  },
  mutations: {
    saveCoach(state, data) {
      state.streams.push(data);
    },
    setStreams(state, payload) {
      try{
        state, payload
      }catch{
        return;
      }
      // state.streams = payload;
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
        `https://vue3-http-requests-default-rtdb.firebaseio.com/streams/${userId}.json?auth=${token}`,
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
    async loadStreams(ctx, payload) {
      if (!payload.forceRefresh && !ctx.getters.shouldUpdate) {
        return;
      }

      // const res = await fetch(
      //   'https://vue3-http-requests-default-rtdb.firebaseio.com/streams.json'
      // );
      // const resData = await res.json();
      // if (!res.ok) {
      //   // error ...
      //   const error = new Error(resData.message || 'Failed to fetch!');
      //   throw error;
      // }
      // const streams = [];
      // for (const key in resData) {
      //   const coach = {
      //     id: key,
      //     firstName: resData[key].firstName,
      //     lastName: resData[key].lastName,
      //     description: resData[key].description,
      //     hourlyRate: resData[key].hourlyRate,
      //     areas: resData[key].areas
      //   };
      //   streams.push(coach);
      // }
      // ctx.commit('setStreams', streams);
      ctx.commit('setStreams');
      ctx.commit('setFetchTimestamp');
    }
  },
  getters: {
    streams(state) {
      return state.streams;
    },
    hasStreams(state) {
      return state.streams && state.streams.length > 0;
    },
    streamById(state, streamId) {
      return state.streams.find(stream => stream.id === streamId);
    },
    isCoach(_, getters, _2, rootGetters) {
      const streams = getters.streams;
      const userId = rootGetters.userId;
      return streams.some(coach => coach.id === userId);
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
