import { attach } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function registerPage() {
  attachBaseLayout(
    /*html*/ `
        <form id="registration-form" >
            <input type="text" name="nickname" id="nickname">
            <input type="text" name="age" id="age">
            <input type="text" name="gender" id="gender">
            <input type="text" name="firstname" id="firstname">
            <input type="text" name="lastname" id="lastname">
            <input type="text" name="email" id="email">
            <input type="password" name="password" id="password">
            <button type="submit">register</button>
        </form>
    `,
    capabilities,
  );
}

function capabilities() {
  // all event listeners here
}
