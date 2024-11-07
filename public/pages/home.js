import { PostList } from "../components/post.js";
import { SpecialFetch, getCookie, reRoute } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function homePage() {
    console.log('Page');
    if (await getCookie("auth_token") === null) {
        reRoute("/login");
        return;
    } 
    const res = await SpecialFetch("/api/posts");
    if (!res.ok) return;
    /**
     * @type {import("../js/types").Post[]}
     */
    const posts = await res.json();

    await attachBaseLayout(/*html*/`
        <div>
            ${PostList(posts)}
        </div>
    `, capabilities);
}

function capabilities() {
    // Add any additional capabilities here
}



