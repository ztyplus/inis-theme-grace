import "./assets/css/base.css";
import "./assets/css/main.css";
import "./assets/css/var.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vLazy from "@/directives/imglazy";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive("lazy", vLazy);

app.mount("#app");
