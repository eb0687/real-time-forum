import { Post } from "../components/post.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function postPage(id) {
 
    await attachBaseLayout("<h1>Loading post...</h1>", cap);

    const res = await SpecialFetch(`/api/posts/${id}`);
    if (!res.ok) return;

    const post = await res.json();

    document.title = post.title;
    await attachBaseLayout(Post(post), cap);
}

function cap() {
    
}