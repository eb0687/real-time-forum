import { Post } from "../components/post.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function postPage(id) {
    const postContainer = document.getElementById("app");
    postContainer.innerHTML = `<h1>Post ${id}</h1><p>Loading post content...</p>`;
    
    const res = await SpecialFetch(`/api/posts/${id}`);
    if (!res) {
        postContainer.innerHTML = `<p>Error loading post: ${res.error}</p>`;
        return;
    }
    const post = await res.json();

    document.title = post.title;
    attachBaseLayout(Post(post), cap);
}

function cap() {
    
}