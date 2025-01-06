import { Nav } from "../components/nav.js";
import { userList } from "../components/userList.js";
import { getCookie, PreventDefaultATag, reRoute } from "../js/utils.js";

export async function attachBaseLayout(content, capabilities) {
  // DON'T AWAIT IT
  // DON'T AWAIT IT
  // DON'T AWAIT IT
  if (getCookie("auth_token") === null) {
    console.log("re route to login");
    await reRoute("/login");
    return;
  }

  document.getElementById("main-content").innerHTML = content;

  //attach(/*html*/ `
  //      ${ul}
  //      ${nav}
  //      ${content}
  //  `);
  PreventDefaultATag();

  capabilities();
}
