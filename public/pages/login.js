import { reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function loginPage() {
  
  await attachBaseLayout(/*html*/ `
        <form id="login-form" >
            <input type="text" name="email" id="email">
            <input type="password" name="password" id="password">
            <button type="submit">login</button>
        </form>
    `,
    capabilities,
  );
}

function capabilities() {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        const response = await SpecialFetch("/api/login", "POST", {
          email,
          password,
        });
        if (!response) throw "could not get the response";
        if (response.status === 404) throw "please create an account";
        if (response.status === 401) throw "your email or password is incorrect";
        const data = await response.json();

        console.log("data", data);
        await reRoute("/");
      } catch (error) {
        console.log("error", error);
      }
    });
}

