import { getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "../pages/layouts.js";
import { managePostModal } from "./managePost.js";

export const Nav = async () => {
  const cookie = await getCookie("auth_token");

  let nav;
  if (!cookie) {
    nav = /*html*/ `
        <nav>
            <a href="/" class="route">Home</a>
            <a href="/about" class="route">About</a>
            <a href="/login" class="route">login</a>
            <a href="/register" class="route">register</a>
        </nav>
    `;
    return { nav, cap: () => {} };
  }
  nav = /*html*/ `
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a class="route" id="create-post-button">Create Post</a>
        <a href="/profile" class="route" id="profile-button">Profile Page</a>
        <a class="route" id="logout-button">logout</a>
    </nav>
    `;
  return { nav, cap: capabilities };
};

function capabilities() {
  document
    .getElementById("logout-button")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await SpecialFetch("/api/logout", "POST");
        if (!response.ok) throw "Logout failed, please try again";

        attachBaseLayout("", () => {});
        console.log("logged out from server");

        await reRoute("/login");
      } catch (error) {
        console.log("error", error);
      }
    });

  document
    .getElementById("profile-button")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        // TODO: figure out how to retrieve the userid dynamically from the server
        // and append it to the url
        const response = await SpecialFetch("/api/profile/", "GET");
        if (!response.ok) throw "Something went wrong";

        // TODO: reroute to the profile page here
        await reRoute("/profile/");
      } catch (error) {
        console.log("error", error);
      }
    });

  document
    .getElementById("create-post-button")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("create-post-modal");
      if (modal) {
        modal.parentNode.removeChild(modal);
      }

      managePostModal(false);

      document.getElementById("create-post-modal").style.display = "block";
    });
}
