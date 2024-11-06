import { PostList } from "../components/post.js";
import { attach, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";


export async function homePage() {
    const res =await SpecialFetch("/api/posts");
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



