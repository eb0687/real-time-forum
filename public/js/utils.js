import { router } from "./app.js";

/**
 * 
 * @param {string} page 
 */
export function attach(page) {
    document.getElementById('app').innerHTML = page
}

export function reRoute(path) {
    history.pushState({}, '', path);
    router();
}

export function PreventDefaultATag() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState({}, '', e.target.href);
            router();
        });
    });
}

export function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length != 2) {
        return null;
    }
    let cookie = decodeURI(parts.pop().split(";").shift());
    return cookie;

}


// you can only send json data or array or a map
export async function SpecialFetch(url, method, data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        return null
    }

}
