import { homePage } from "../pages/home.js";
import { loginPage } from "../pages/login.js";
import { notFoundPage } from "../pages/notFound.js";
import { registerPage } from "../pages/register.js";
import { postPage } from "../pages/post.js"; // Import the post page
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
  "/posts/:id": {
    page: postPage,
    title: "Post",
  }
};

export function router() {
  const path = window.location.pathname;
  let route = routes[path] || routes["/404"];

  console.log('path',path)
  // Handle dynamic route for /posts/:id
  if (path.startsWith("/posts/")) {
    console.log("im here 2");
    const id = path.split("/")[2];

    route = {
      page: () => postPage(id),
    };
  }

  document.title = route.title;
  route.page();
}

window.addEventListener("popstate", router);
PreventDefaultATag();

router(); // Initial call to load the default page
