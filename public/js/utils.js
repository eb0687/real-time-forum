import { Nav } from "../components/nav.js";
import { userList } from "../components/userList.js";
import { router } from "./app.js";
import { WebSocketSingleton } from "./WebSocketSingleton.js";

/**
 *
 * @param {string} page
 */
export function attach(page) {
  document.getElementById("app").innerHTML = page;
}

export async function onRefresh() {
  console.log("mama");

  WebSocketSingleton.getInstance();
  const { nav, cap } = await Nav();
  document.querySelector("nav#nav-content").innerHTML = nav;
  cap();

  const { ul, ulCap } = await userList();
  document.querySelector("nav#user-list-content").innerHTML = ul;
  ulCap();
  PreventDefaultATag();
}

/**
 *
 * @param {import("./types.js").Paths} path
 */
export async function reRoute(path) {
  history.pushState({}, "", path);
  router();
}

export function PreventDefaultATag() {
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      history.pushState({}, "", e.target.href);
      await router();
    });
  });
}

function removeAllEventListeners(element, eventType) {
  if (eventType) {
    // If an event type is provided, remove only that type of listener
    const listener = eventListeners.get(eventType);
    if (listener) {
      element.removeEventListener(eventType, listener);
      eventListeners.delete(eventType);
    }
  } else {
    // If no event type is provided, remove all event listeners
    for (const [event, listener] of eventListeners.entries()) {
      element.removeEventListener(event, listener);
    }
    eventListeners.clear(); // Clear all stored event listeners
  }
}

export async function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length != 2) {
    return null;
  }

  const cookie = decodeURI(parts.pop().split(";").shift());

  const res = await SpecialFetch("/api/cookie");
  if (!res || !res.ok) return null;

  return cookie;
}

export function getCookieWithoutRequest(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length != 2) {
    return null;
  }

  const cookie = decodeURI(parts.pop().split(";").shift());
  return cookie;
}

export async function SpecialFetch(url, method, data) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // if (response.ok) return response;
    // const currentPath = window.location.pathname;
    // if (response.status === 401 && currentPath !== "/login") await reRoute("/login");
    // if (response.status === 401) await reRoute("/login");
    // if (response.status === 404) await reRoute("/404");
    // if (response.status === 500) await reRoute("/500");

    return response;
  } catch (e) {
    console.log("e", e);
    return null;
  }
}
