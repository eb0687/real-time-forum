import { router } from "./app.js";

/**
 * 
 * @param {string} page 
 */
export function attach(page) {
    document.getElementById('app').innerHTML = page
}

/**
 * 
 * @param {import("./types.js").Paths} path 
 */
export async function reRoute(path) {
    console.log("re route");

    history.pushState({}, '', path);
    router();
}

export function PreventDefaultATag() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', async (e) => {
            console.log('prevent default');
            e.preventDefault();
            history.pushState({}, '', e.target.href);
            await router();
        });
    });
}

export async function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length != 2) {
        return null;
    }

    const cookie = decodeURI(parts.pop().split(";").shift());

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
        if (response.status === 401) await reRoute("/login");
        if (response.status === 404) await reRoute("/404");
        if (response.status === 500) await reRoute("/500");

        return response;
    } catch (e) {
        console.log('e', e)
        return null
    }
}

