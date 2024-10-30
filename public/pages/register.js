import { reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function registerPage() {
  attachBaseLayout(
    /*html*/ `
        <form id="registration-form" >
            <input type="text" name="nickname" id="nickname">
            <input type="text" name="age" id="age">
            <input type="radio" name="gender" id="male" value="male">
            <input type="radio" name="gender" id="female" value="female">
            <input type="text" name="firstname" id="firstname">
            <input type="text" name="lastname" id="lastname">
            <input type="text" name="email" id="email">
            <input type="password" name="password" id="password">
            <button type="submit">register</button>
            <p id="message"><\p>
        </form>
    `,
    capabilities,
  );
}

function capabilities() {
  document
    .getElementById("registration-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const nickname = document.getElementById("nickname").value;
      const age = document.getElementById("age").value;
      const gender = document.querySelector(
        'input[name="gender"]:checked',
      )?.value;
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (
        !nickname ||
        !age ||
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
        const response = await SpecialFetch("/api/register", "POST", {
          nickname,
          age,
          gender,
          firstname,
          lastname,
          email,
          password,
        });

        if (!response) throw "could not get the response";
        if (response.status == 401) throw "account already exists";
        response.headers.forEach((value, name, parent) => {
          console.log("name", name);
          console.log("value", value);
          console.log("parent", parent);
        });
        const data = await response.json();

        console.log("data", data);
        reRoute("/");
      } catch (error) {
        if (error == "account already exists") {
          return (document.getElementById("message").innerHTML = `
                <a href="/">Account already exists. Click <strong>here</strong> to login</a>
            `);
        }
        console.log("error", error);
      }
    });
}
