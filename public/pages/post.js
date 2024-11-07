import { managePostModal } from "../components/managePost.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function postPage(id) {

    await attachBaseLayout("<h1>Loading post...</h1>", cap);

    const res = await SpecialFetch(`/api/posts/${id}`);
    if (!res.ok) return;

    /**
     * @type {import("../js/types").Post}
     */
    const post = await res.json();

    document.title = post.title;
    await attachBaseLayout(/*html*/`
        <h1>${post.title}</h1>
        <p>${post.body}</p>
        <p>${post.id}</p>
        <p>${post.created_at.Time}</p>
        <p>${post.updated_at.Time}</p>
        <button id="edit-post">edit</button>
    `, () => { cap(post) });
}

function cap(post) {
    const editButton = document.getElementById("edit-post");

    editButton?.addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.getElementById('create-post-modal')
        if (modal) {
            modal.parentNode.removeChild(modal);
        }
        managePostModal(true, post);
    });

}