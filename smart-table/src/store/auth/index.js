import * as User from "@/api/auth";
import router from "@/router";
let autoLog;
let endLoad = new Promise((resolve) => {
  autoLog = resolve;
});

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    user: (state) => state.user,
    ready: () => endLoad,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async auth({ commit }, auth) {
      try {
        const { user, token } = await User.auth(auth);
        if ((user, token)) {
          localStorage.setItem("token", token);
          commit("setUser", { ...user, token });
          router.push("/admin");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getUser({ commit }) {
      try {
        let token = localStorage.getItem("token");
        if (token) {
          let { username } = await User.check(token);
          if (username) {
            commit("setUser", username);
          } else {
            commit("setUser", null);
          }
        } else {
          commit("setUser", null);
        }
      } catch (e) {
        console.log(e);
      }
      autoLog();
    },
    setUser({ commit }, user) {
      commit("setUser", user);
    },
  },
};
