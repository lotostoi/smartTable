import { createStore } from "vuex";
import content from "@/store/content";
import auth from "@/store/auth";

export default createStore({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    content,
    auth,
  },
});
