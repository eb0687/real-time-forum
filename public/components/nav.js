import { getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { WebSocketSingleton } from "../js/WebSocketSingleton.js";
import { attachBaseLayout } from "../pages/layouts.js";
import { managePostModal } from "./managePost.js";

export const Nav = async () => {
  return {
    nav: `
    <link rel="stylesheet" href="/public/css/nav.css">
    <nav class="sidebar">
        <a href="/" class="nav-item">
            <i class="fas fa-home"></i>
            <span class="nav-text">Home</span>
        </a>
        <a href="/profile" class="nav-item" >
            <i class="fas fa-user"></i>
            <span class="nav-text">Profile Page</span>
        </a>
        <a href="/messages" class="nav-item" >
            <i class="fa-solid fa-message"></i>
            <span class="nav-text">Messages</span>
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
  `,
    cap: capabilities,
  };
};

function capabilities() {
  document
    .getElementById("logout-button")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await SpecialFetch("/auth/logout", "POST");
        if (!response.ok) throw "Logout failed, please try again";

        attachBaseLayout("", () => {});
        console.log("logged out from server");

        await reRoute("/login");
        WebSocketSingleton.getInstance().close();
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
        return;
      }

      managePostModal(false);
      if (document.getElementById("create-post-modal") == null) {
        return;
      }

      document.getElementById("create-post-modal").style.display = "block";
    });
}
