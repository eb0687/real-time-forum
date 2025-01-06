import { Nav } from "../components/nav.js";
import { userList } from "../components/userList.js";
import { attach, getCookie, PreventDefaultATag, reRoute } from "../js/utils.js";

export async function attachBaseLayout(content, capabilities) {
  const { nav, cap } = await Nav();
  const { ul, ulCap } = await userList();

  // DON'T AWAIT IT
  // DON'T AWAIT IT
  // DON'T AWAIT IT
  if (getCookie("auth_token") === null) {
    console.log("re route to login");
    await reRoute("/login");
    return;
  }

  attach(/*html*/ `
        ${ul}
        ${nav}
        ${content}
    `);
  PreventDefaultATag();

  capabilities();
  cap();
  ulCap();
}
