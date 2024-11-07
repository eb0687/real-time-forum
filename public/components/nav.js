import { getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "../pages/layouts.js";

export const Nav = async () => {
    let cookie = await getCookie("auth_token");

    let nav;
    if (!cookie) {
        nav = /*html*/`
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a href="/login" class="route">login</a>
        <a href="/register" class="route">register</a>
    </nav>
    `
    } else {
        nav = /*html*/`
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a class="route" id="logout-button">logout</a>
    </nav>
    `
    }
    return { nav, cap };
}


function cap() {

    document.getElementById("logout-button")?.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const response = await SpecialFetch("/api/logout", "POST");
            if (!response.ok) throw "Logout failed, please try again";

            // const data = await response.json();
            // console.log("Logout response", data);

            attachBaseLayout("", () => { })
            console.log("logged out from server");

            await reRoute("/login");

        } catch (error) {
            console.log("error", error);
        }
    });
}
