import { createRouter, createWebHistory } from "vue-router";
import RemoteController from "../views/RemoteController.vue";
import SmartTable from "../views/SmartTable.vue";
import ConfigPage from "../views/Config.vue";

const routes = [
  {
    path: "/",
    name: "RemoteController",
    component: RemoteController,
  },
  {
    path: "/table/:aminType",
    name: "table",
    component: SmartTable,
  },
  {
    path: "/config",
    name: "config",
    component: ConfigPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
