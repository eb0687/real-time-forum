import { applyTailwind } from "../js/cheatyCheaty.js";
import { reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function authPage() {
  await attachBaseLayout(
    /*html*/ `
    <div class="flex flex-col items-center justify-center h-100dvh">
      <div class="flex flex-col items-center b-1px-border p-20px rounded bg-sec">
        <div class="w-500px flex gap-10px">
          <button class="tab-btn flex-grow-1 rounded p-10px b-1px-border active" data-tab="login">Login</button>
          <button class="tab-btn flex-grow-1 rounded p-10px b-1px-border" data-tab="register">Register</button>
        </div>

        <div class="tab-content w-500px" id="login-tab">
          <form id="login-form" class="flex flex-col gap-10px">
            <label for="login-email">Email:</label>
            <input type="text" name="email" id="login-email" class="rounded p-5px">
            <label for="login-password">Password:</label>
            <input type="password" name="password" id="login-password" class="rounded p-5px">
            <input type="submit" value="Login" class="mt-15px rounded p-5px"></input>
            <p id="message"></p>
          </form>
        </div>

        <div class="tab-content hidden w-500px" id="register-tab">
          <form id="registration-form" class="flex flex-col gap-10px">
            <label for="nickname">Nickname:</label>
            <input type="text" name="nickname" id="nickname" class="rounded p-5px">

            <label for="age">Age:</label>
            <input type="number" name="age" id="age" class="rounded p-5px">

            <label>Gender:</label>
            <div>
              <input type="radio" name="gender" id="male" value="male">
              <label for="male">Male</label>
              <input type="radio" name="gender" id="female" value="female">
              <label for="female">Female</label>
            </div>

            <label for="firstname">First Name:</label>
            <input type="text" name="firstname" id="firstname" class="rounded p-5px">

            <label for="lastname">Last Name:</label>
            <input type="text" name="lastname" id="lastname" class="rounded p-5px">

            <label for="email">Email:</label>
            <input type="text" name="email" id="email" class="rounded p-5px">

            <label for="password">Password:</label>
            <input type="password" name="password" id="password" class="rounded p-5px">

            <input type="submit" value="Register" class="mt-15px rounded p-5px"></input>
            <p id="message"></p>
          </form>
        </div>
      </div>
    </div>

    <link rel="stylesheet" href="/public/css/auth.css">
    `,
    setupAuthHandlers,
  );
}

function setupAuthHandlers() {
  // Tab switching logic
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabContents = document.querySelectorAll(".tab-content");
      tabContents.forEach((content) => content.classList.add("hidden"));
      document
        .getElementById(`${tab.dataset.tab}-tab`)
        .classList.remove("hidden");
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add("block");
      applyTailwind();
    });
  });

  // Login form handler
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const response = await SpecialFetch("/auth/login", "POST", {
          email,
          password,
        });
        if (!response) throw "could not get the response";
        if (response.status === 404) throw "please create an account";
        if (response.status === 401)
          throw "your email or password is incorrect";
        // const data = await response.json();
        await reRoute("/");
      } catch (error) {
        // alert(error);
        document.getElementById("message").innerHTML = error;

        console.log("error", error);
      }
    });

  // Registration form handler
  document
    .getElementById("registration-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const nickname = document.getElementById("nickname").value;
      const age = parseInt(document.getElementById("age").value);
      const gender = document.querySelector(
        'input[name="gender"]:checked',
      )?.value;
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (
        !nickname ||
        !gender ||
        !firstname ||
        !lastname ||
        !email ||
        !password
      ) {
        console.log("Please fill in all fields.");
        return;
      }

      try {
        const response = await SpecialFetch("/auth/register", "POST", {
          nickname,
          age,
          gender,
          first_name: firstname,
          last_name: lastname,
          email,
          password,
        });

        if (!response) throw "could not get the response";
        //if (response.status == 401)
        //  throw `<a href="/login">Account already exists. Click <strong>here</strong> to login</a>`;

        if (response.status === 401) throw "Account already exists.";

        if (response.status == 400) throw "Please fill in all fields";
        if (response.status != 200) throw "could not create an account";
        //   const data = await response.json();
        await reRoute("/");
      } catch (error) {
        document.getElementById("message").innerHTML = error;
        console.log("error", error);
      }
    });

  // https://github.com/eb0687/real-time-forum/issues/10
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}
