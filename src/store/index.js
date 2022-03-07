import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_user: null,
    target_user: null
  },
  getters: {
    getCurrentUserId(state) {
      return state.current_user.id;
    },
    getCurrentUserName(state) {
      return state.current_user.name;
    }
  },
  mutations: {
    setCurrentUser(state, payload) {
      state.current_user = payload;
    },
    setTargetUser(state, payload) {
      state.current_user = payload;
    }
  },
  actions: {
    setCurrentUserAction(context, payload) {
      context.commit('setCurrentUser', payload);
    },
    setTargetUserAction(context, payload) {
      context.commit('setTargetUser', payload);
    }
  },
  modules: {
  }
})
