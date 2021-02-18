let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    }
  },
  actions: {
    async login(ctx, payload) {
      return ctx.dispatch('auth', {
        ...payload,
        mode: 'login'
      });
    },
    async signup(ctx, payload) {
      return ctx.dispatch('auth', {
        ...payload,
        mode: 'signup'
      });
    },
    async auth(ctx, payload) {
      const mode = payload.mode;
      let url =
          'http://localhost:3000/api/user/login';

      if (mode === 'signup') {
        url =
        'http://localhost:3000/api/user/register';
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          username: payload.username
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        if (mode === 'signup') {
          const error = new Error(
            resData[0].message || 'Failed to register, are you already signed up?'
          );
          throw error;
        } else {
          const error = new Error(resData.message || 'Failed to authenticate');
          throw error;
        }
      }
      // currently useless until backend updates are finished. 
      const expiresIn = +resData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', resData.idToken);
      localStorage.setItem('userId', resData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        ctx.dispatch('autoLogout');
      }, expiresIn);

      ctx.commit('setUser', {
        token: resData.idToken,
        userId: resData.localId
      });
    },
    autoLogin(ctx) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 1000) {
        return;
      }

      timer = setTimeout(() => {
        ctx.dispatch('autoLogout');
      }, expiresIn);

      if (token && userId) {
        ctx.commit('setUser', {
          token: token,
          userId: userId
        });
      }
    },
    logout(ctx) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');
      clearTimeout(timer);
      ctx.commit('setUser', {
        token: null,
        userId: null
      });
    },
    autoLogout(ctx) {
      ctx.dispatch('logout');
      ctx.commit('setAutoLogout');
    }
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    }
  }
};
