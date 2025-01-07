import { homePage } from "../pages/home.js";
// import { loginPage } from "../pages/login.js";
import { notFoundPage } from "../pages/errorPages.js";
// import { registerPage } from "../pages/register.js";
import { postPage } from "../pages/post.js"; // Import the post page
import {
  getCookie,
  getCookieWithoutRequest,
  onRefresh,
  PreventDefaultATag,
} from "./utils.js";
import { profilePage, ownProfilePage } from "../pages/profile.js";
import { applyTailwind } from "./cheatyCheaty.js";
import { authPage } from "../pages/auth.js";
import { messagesPage } from "../pages/messages.js";
import { WebSocketSingleton } from "./WebSocketSingleton.js";

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
    page: authPage,
    title: "Login",
  },
  "/register": {
    page: authPage,
    title: "Register",
  },
  "/posts/:id": {
    page: postPage,
    title: "Post",
  },

  "/profile": {
    page: ownProfilePage,
    title: "Profile",
  },
  "/profile/:id": {
    page: profilePage,
    title: "Profile",
  },
  "/messages": {
    page: messagesPage,
    title: "Messages",
  },
};

let pageLoaded = false;
export async function router() {
  if (pageLoaded) return;
  pageLoaded = true;
  const path = window.location.pathname;
  let route = routes[path] || routes["/404"];

  console.log("path", path);
  // Handle dynamic route for /posts/:id
  if (path.startsWith("/posts/")) {
    const id = path.split("/")[2];
    route = {
      page: async () => postPage(id),
    };
  }

  // Handle dynamic route for /profile/:id
  if (path.startsWith("/profile/")) {
    const id = path.split("/")[2];
    route = {
      page: async () => profilePage(id),
    };
  }

  if (
    (await getCookie("auth_token")) === null &&
    path !== "/login" &&
    path !== "/register"
  ) {
    route = routes["/login"];
  }

  document.title = route.title;
  await route.page();
  applyTailwind();
  pageLoaded = false;
}

//window.addEventListener("popstate", router);
PreventDefaultATag();
await router(); // Initial call to load the default page

const a = await getCookie("auth_token");
console.warn(a);
if (a !== null) {
  onRefresh();
}
