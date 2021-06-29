import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vue3TouchEvents from "vue3-touch-events";

store
  .dispatch("content/getConfig")
  .then(() =>
    createApp(App).use(store).use(router).use(Vue3TouchEvents).mount("#app")
  );
