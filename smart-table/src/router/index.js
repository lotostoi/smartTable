import { createRouter, createWebHistory } from "vue-router";
import RemoteController from "../views/RemoteController.vue";
import SmartTable from "../views/SmartTable.vue";
import ConfigPage from "../views/Config.vue";
import AdminPage from "../views/Admin.vue";

const routes = [
  {
    path: "/:projectName",
    name: "RemoteController",
    component: RemoteController,
  },
  {
    path: "/table/:projectName/:aminType",
    name: "table",
    component: SmartTable,
  },
  {
    path: "/config",
    name: "config",
    component: ConfigPage,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
