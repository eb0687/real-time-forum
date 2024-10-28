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
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

