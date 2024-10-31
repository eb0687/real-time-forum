import { attach, getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function logout() {
  console.log("logout");

  attachBaseLayout(
    /*html*/ `
      <button id="logout-button">Logout</button>
    `,
    capabilities,
  );
}

function capabilities() {
  document
    .getElementById("logout-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await SpecialFetch("/api/logout", "POST");
        if (!response.ok) throw "Logout failed, please try again";

        const data = await response.json();
        console.log("Logout response", data);

        reRoute("/login");
      } catch (error) {
        console.log("error", error);
      }
    });
}
