import { createRouter, createWebHistory } from "vue-router"
import RemoteController from "../views/RemoteController.vue"
import SmartTable from "../views/SmartTable.vue"

const routes = [
  {
    path: "/",
    name: "RemoteController",
    component: RemoteController,
  },
  {
    path: "/table",
    name: "table",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: SmartTable,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
