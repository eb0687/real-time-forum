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

function Comments() {
  return /*html*/ `
        <div>
            <textarea id="comment-text" placeholder="Write your comment here..."></textarea>
            <button id="submit-comment-button">Submit</button>
        </div>
    `;
}

/**
 *
 * @param {import("../js/types").Post} post
 * @returns {string}
 */
async function fetchComments(post) {
  const commentsRes = await SpecialFetch(`/api/comments/${post.id}`);
  if (!commentsRes) {
    return "<p>Failed to load comments.</p>";
  }
  if (!commentsRes.ok) {
    return "<p>Failed to load comments.</p>";
  }
  const comments = await commentsRes.json();
  return CommentList(comments);
}

function handleCreateComment(postId) {
  const submitButton = document.getElementById("submit-comment-button");
  const commentText = document.getElementById("comment-text");

  submitButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    const comment = commentText.value;
    if (comment) {
      const res = await SpecialFetch("/api/comments", "POST", {
        body: comment,
        postid: postId,
      });
      if (!res) {
        return;
      }
      if (!res.ok) {
        return;
      }
      console.log("comment created successfully");
      await reRoute(`/posts/${postId}`);
    }
  });
}

function handleDeleteComment(postId) {
  const deleteButtons = document.querySelectorAll(".delete-comment");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const commentId = button.dataset.commentId;
      if (!confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      const res = await SpecialFetch(`/api/comments/${commentId}`, "DELETE");

      if (!res || !res.ok) {
        console.error("Failed to delete comment");
        return;
      }
      await reRoute(`/posts/${postId}`);
    });
  });
}

// TODO:
// TODO: Naser says you can ignore this 
// async function handleUpdateComment(comment) {}

function handleEditPost(post) {
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