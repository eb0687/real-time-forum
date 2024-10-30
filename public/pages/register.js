import { reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function registerPage() {
  attachBaseLayout(
    /*html*/ `
<form id="registration-form">
  <label for="nickname">Nickname:</label>
  <input type="text" name="nickname" id="nickname">

  <label for="age">Age:</label>
  <input type="text" name="age" id="age">

  <label>Gender:</label>
  <input type="radio" name="gender" id="male" value="male">
  <label for="male">Male</label>
  <input type="radio" name="gender" id="female" value="female">
  <label for="female">Female</label>

  <label for="firstname">First Name:</label>
  <input type="text" name="firstname" id="firstname">

  <label for="lastname">Last Name:</label>
  <input type="text" name="lastname" id="lastname">

  <label for="email">Email:</label>
  <input type="text" name="email" id="email">

  <label for="password">Password:</label>
  <input type="password" name="password" id="password">

  <button type="submit">Register</button>
  <p id="message"></p>
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
