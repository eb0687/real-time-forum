import { homePage } from "../pages/home.js";
import { loginPage } from "../pages/login.js";
import { notFoundPage } from "../pages/errorPages.js";
import { registerPage } from "../pages/register.js";
import { postPage } from "../pages/post.js"; // Import the post page
import { getCookie, PreventDefaultATag } from "./utils.js";

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
    title: "Register",
  },
  "/posts/:id": {
    page: postPage,
    title: "Post",
  }
};

export async function router() {

  console.log('router');

  const path = window.location.pathname;
  let route = routes[path] || routes["/404"];

  console.log('path', path)
  // Handle dynamic route for /posts/:id
  if (path.startsWith("/posts/")) {
    const id = path.split("/")[2];
    route = {
      page: async () => postPage(id),
    };
  }


  // if (await getCookie("auth_token") === null && path !== "/login" && path !== "/register") {
  //   route = routes["/login"];
  // }

  document.title = route.title;
  await route.page();
}

window.addEventListener("popstate", router);
PreventDefaultATag();

await router(); // Initial call to load the default page
