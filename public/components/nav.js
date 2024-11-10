import { getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "../pages/layouts.js";
import { managePostModal } from "./managePost.js";

export const Nav = async () => {
  const cookie = await getCookie("auth_token");

  let nav;
  if (!cookie) {
    nav = /*html*/ `
        <nav>
            <a href="/login" class="route">login</a>
            <a href="/register" class="route">register</a>
        </nav>
    `;
    return { nav, cap: () => { } };
  }

  nav = /*html*/ `
    <link rel="stylesheet" href="/public/css/nav.css">
    <nav class="sidebar">
        <a href="/" class="nav-item">
            <i class="fas fa-home"></i>
            <span class="nav-text">Home</span>
        </a>
        <a href="/about" class="nav-item">
            <i class="fas fa-info-circle"></i>
            <span class="nav-text">About</span>
        </a>
        <a href="/profile" class="nav-item" >
            <i class="fas fa-user"></i>
            <span class="nav-text">Profile Page</span>
        </a>
        <button class="nav-item" id="create-post-button">
            <i class="fas fa-plus-circle"></i>
            <span class="nav-text">Create Post</span>
        </button>
        <button class="nav-item" id="logout-button" >
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-text">Logout</span>
        </button>
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

        attachBaseLayout("", () => { });
        console.log("logged out from server");

        await reRoute("/login");
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
