import { getCookie } from "../js/utils.js";

export const Nav = () => {
    let cookie = getCookie('token');
    console.log('document.cookie', document.cookie)
    if (!cookie) {
        return /*html*/`
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a href="/login" class="route">login</a>
        <a href="/register" class="route">register</a>
    </nav>
    `
    }
    return /*html*/`
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a href="/logout" class="route">logout</a>
    </nav>
    `
}


