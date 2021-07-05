import axios from "axios";

//import { createProject } from "@/api/content";

export default {
  namespaced: true,
  state: {
    content: [
      {
        id: "i1",
        url: require("@/assets/images/Thumb1.jpg"),
        ref: "img1",
        active: false,
        type: "image",
      },
      {
        id: "i2",
        url: require("@/assets/images/Thumb2.jpg"),
        ref: "img2",
        active: false,
        type: "image",
      },
      {
        id: "i3",
        url: "https://inter-cat.net/",
        ref: "img4",
        active: false,
        type: "link",
      },
      {
        id: "i4",
        url: "http://ds-client.ifrm.ru/dkutv1",
        ref: "img5",
        active: false,
        type: "link",
      },
      {
        id: "i5",
        url: "https://inter-cat.net/",
        ref: "img6",
        active: false,
        type: "link",
      },
      {
        id: "i6",
        url: "http://ds-client.ifrm.ru/dkutv1",
        ref: "img7",
        active: false,
        type: "link",
      },
      {
        id: "i7",
        url: require("@/assets/videos/first.mov"),
        urlForPicture: require("@/assets/images/Thumb3.jpg"),
        ref: "img7",
        active: false,
        type: "video",
      },
    ],
    projects: [],
    config: {
      friction: 2,
      tension: 5,
      mass: 0.4,
      speed: 1000,
    },
  },
  getters: {
    getProjects: (state) => state.projects,
    getContent: (state) => state.content,
    getConfig: (state) => state.config,
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = { ...config };
    },
    SET_POROJECTS(state, projects) {
      state.projects = projects;
    },
    ADD_PROJECT(state, project) {
      const _project = state.projects.find(({ name }) => name === project.name);
      if (_project) return;
      state.projects.push(project);
      console.log(state.projects);
    },
  },
  actions: {
    async getConfig({ commit }) {
      try {
        const { data } = await axios.get("/api/get-config");
        commit("SET_CONFIG", data);
      } catch (e) {
        console.log(e);
      }
    },
    async updateConfig({ dispatch }, config) {
      try {
        const {
          data: { result },
        } = await axios.put("/api/update-config", config);
        if (result) {
          await dispatch("getConfig");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async addProject({ commit }, project) {
      try {
        /*   const { result } = await createProject(project);
        if (result) { */
        commit("ADD_PROJECT", project);
        /*      return true;
        } else {
          return false;
        } */
      } catch (e) {
        console.log(e);
      }
    },
  },
};
