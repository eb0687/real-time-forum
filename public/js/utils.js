import { router } from "./app.js";

/**
 * 
 * @param {string} page 
 */
export function attach(page) {
    document.getElementById('app').innerHTML = page
}

export async function reRoute(path) {
    history.pushState({}, '', path);
    await router();
}

export function PreventDefaultATag() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            history.pushState({}, '', e.target.href);
            await router();
        });
    });
}

export async function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length != 2) {
        return null;
    }

    let cookie = decodeURI(parts.pop().split(";").shift());

    // TODO: check cookie from server
    const res = await SpecialFetch("/api/cookie")
    if (!res || !res.ok) return null;

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
        if (response.ok) return response;
        if (response.status === 401) reRoute("/login");
        if (response.status === 404) reRoute("/404");
        if (response.status === 500) reRoute("/500");

        return response;
    } catch (e) {
        console.log('e',e)
        return null
    }

}
