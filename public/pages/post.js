import { managePostModal } from "../components/managePost.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function postPage(id) {

    await attachBaseLayout("<h1>Loading post...</h1>", handleEditPost);

    const res = await SpecialFetch(`/api/posts/${id}`);
    if (!res.ok) return;

    /**
     * @type {import("../js/types").Post}
     */
    const post = await res.json();


    const comments = Comments(post);

    document.title = post.title;
    await attachBaseLayout(/*html*/`
        <h1>${post.title}</h1>
        <p>${post.body}</p>
        <p>${post.id}</p>
        <p>${post.created_at.Time}</p>
        <p>${post.updated_at.Time}</p>
        <button id="edit-post">edit</button>

        <h2>Comments</h2>
        ${comments}

    `, () => {
        handleEditPost(post);
    });
}


/**
 * 
 * @param {import("../js/types").Post} post 
 * @returns {string}
 */
function Comments(post) {

    return /*html*/`
        <h1></h1>
    `

}

function handleDeleteComment(comment) {

}

function handleUpdateComment(comment) {

}

function handleEditPost(post)   {
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