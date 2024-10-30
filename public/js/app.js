import { homePage } from "../pages/home.js";
import { loginPage } from "../pages/login.js";
import { notFoundPage } from "../pages/notFound.js";
import { registerPage } from "../pages/register.js";
import { PreventDefaultATag } from "./utils.js";
const routes = {
  "/": {
    page: homePage,
    title: "Home",
  },
  "/404": {
    page: notFoundPage,
    title: "404 - Page Not Found",
  },
  "/login": {
    page: loginPage,
    title: "Login",
  },
  "/register": {
    page: registerPage,
    title: "Login",
  },
};

export function router() {
  const path = window.location.pathname;
  const route = routes[path] || routes["/404"];
  document.title = route.title;
  route.page();
}

window.addEventListener("popstate", router);
PreventDefaultATag();

router(); // Initial call to load the default page
