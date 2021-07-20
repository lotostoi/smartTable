import { createRouter, createWebHistory } from "vue-router";
import RemoteController from "../views/RemoteController.vue";
import SmartTable from "../views/SmartTable.vue";
import ConfigPage from "../views/Config.vue";
import AdminPage from "../views/Admin.vue";
import P404 from "../views/P404.vue";
import Auth from "../views/Auth";
import store from "@/store";

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
  {
    path: "/auth",
    name: "auth",
    component: Auth,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "p404",
    component: P404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

let flag = false;

router.beforeEach(async (to, from, next) => {
  if (!flag) {
    flag = await store.getters["auth/ready"];
  }
  const isUser = store.getters["auth/user"];

  if (to.name === "admin" && !isUser) {
    next({ name: "auth" });
  } else next();
});

export default router;
