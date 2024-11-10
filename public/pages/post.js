import { managePostModal } from "../components/managePost.js";
import { reRoute, SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";
import { CommentList } from "../components/comment.js";

export async function postPage(id) {
  await attachBaseLayout("<h1>Loading post...</h1>", handleEditPost);

  const res = await SpecialFetch(`/api/posts/${id}`);
  if (!res.ok) return;

  /**
   * @type {import("../js/types").Post}
   */
  const post = await res.json();

  const comments = Comments(post);

  const commentsHtml = await fetchComments(post);

  document.title = post.title;
  await attachBaseLayout(
    /*html*/ `
        <h1>${post.title}</h1>
        <p>${post.body}</p>
        <p>${post.id}</p>
        <p>${post.created_at.Time}</p>
        <p>${post.updated_at.Time}</p>
        <button id="edit-post">edit</button>

        <h2>Comments</h2>
        ${comments}
        ${commentsHtml}

    `,
    () => {
      handleEditPost(post);
      handleCreateComment(post.id);
      handleDeleteComment(post.id);
      handleUpdateComment(post.id);
    },
  );
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

function handleUpdateComment(postId) {
  const editButtons = document.querySelectorAll(".edit-comment");

  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      const commentId = editButton.dataset.commentId;

      const contentDiv = document.getElementById(`comment-${commentId}`);
      const editForm = document.getElementById(`edit-form-${commentId}`);
      const textarea = editForm.querySelector(".edit-textarea");
      const saveButton = editForm.querySelector(".save-comment");
      const cancelButton = editForm.querySelector(".cancel-edit");

      if (!contentDiv || !editForm) {
        console.log("Could not find comment elements");
        return;
      }

      contentDiv.style.display = "none";
      editForm.style.display = "block";

      // Handle cancel button
      const cancelHandler = () => {
        contentDiv.style.display = "block";
        editForm.style.display = "none";
        // Remove event listener to prevent multiple bindings
        cancelButton.removeEventListener("click", cancelHandler);
      };
      cancelButton.addEventListener("click", cancelHandler);

      // Handle save button
      const saveHandler = async () => {
        const updatedText = textarea.value;
        if (!updatedText.trim()) {
          alert("Comment cannot be empty!");
          return;
        }

        const res = await SpecialFetch(`/api/comments/${commentId}`, "PUT", {
          body: updatedText,
        });
        if (!res || !res.ok) {
          console.log("Failed to update comment");
          return;
        }

        // Remove event listener to prevent multiple bindings
        saveButton.removeEventListener("click", saveHandler);
        await reRoute(`/posts/${postId}`);
      };
      saveButton.addEventListener("click", saveHandler);
    });
  });
}

function handleEditPost(post) {
  const editButton = document.getElementById("edit-post");

  editButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.getElementById("create-post-modal");
    if (modal) {
      modal.parentNode.removeChild(modal);
    }
    managePostModal(true, post);
  });
}
