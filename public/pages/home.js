import { PostList } from "../components/post.js";
import { attach, getCookie, reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";


export async function homePage() {
    if (await getCookie("auth_token") === null) {
        reRoute("/login");
        return
    }

    const res = await SpecialFetch("/api/posts");
    /**
     * @type {import("../js/types").Post[]}
     */
    const posts = await res.json();



    attachBaseLayout(/*html*/`
        <div>
            ${PostList(posts)}
        </div>

    `, capabilities);
}

function capabilities() {

}



