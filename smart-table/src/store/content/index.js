import axios from "axios";

import api from "@/api/content";

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
    isLoad: false,
  },
  getters: {
    getProjects: (state) => state.projects,
    getContent: (state) => state.content,
    getConfig: (state) => state.config,
    isLoad: (state) => state.isLoad,
  },
  mutations: {
    IS_LOAD_OFF(state) {
      state.isLoad = false;
      console.log(state.isLoad);
    },
    IS_LOAD_ON(state) {
      state.isLoad = true;
    },

    SET_CONFIG(state, config) {
      state.config = { ...config };
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    ADD_PROJECT(state, project) {
      const _project = state.projects.find(({ name }) => name === project.name);
      if (_project) return;
      state.projects.push(project);
    },
    REMOVE_PROJECT(state, id) {
      const idx = state.projects.findIndex(({ _id }) => _id === id);
      if (idx < 0) return;
      state.projects.splice(idx, 1);
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

    // projects
    // add/create project
    async addProject({ commit }, project) {
      commit("IS_LOAD_ON");
      try {
        const { result, projects } = await api.createProject(project);
        if (result) {
          commit("SET_PROJECTS", projects);
        }
      } catch (e) {
        console.log(e);
      }
      commit("IS_LOAD_OFF");
    },

    // get all projects
    async getProjects({ commit }) {
      try {
        const { projects } = await api.getProjects();
        commit("SET_PROJECTS", projects);
      } catch (e) {
        console.log(e);
      }
    },
    // remove project by id
    async removeProject({ commit }, id) {
      try {
        await api.removeProjects(id);
        commit("REMOVE_PROJECT", id);
      } catch (e) {
        console.log(e);
      }
    },
    // add item
    async addItem({ commit }, item) {
      commit("IS_LOAD_ON");
      try {
        const { result, projects } = await api.addItem(item);
        if (result) {
          commit("SET_PROJECTS", projects);
        }
      } catch (e) {
        console.log(e);
      }
      commit("IS_LOAD_OFF");
    },
  },
};
