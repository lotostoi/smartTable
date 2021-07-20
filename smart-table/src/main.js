import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "font-awesome/css/font-awesome.min.css";
import Vue3TouchEvents from "vue3-touch-events";
store.dispatch("auth/getUser");
(async () => {
  await Promise.all([store.dispatch("content/getConfig"), store.dispatch("content/getProjects")]);
  createApp(App).use(store).use(router).use(Vue3TouchEvents).mount("#app");
})();
