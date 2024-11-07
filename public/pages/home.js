import { PostList } from "../components/post.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function homePage() {
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
}



