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

  const commentsBox = CommentsBox(post);

  const commentsHtml = await fetchComments(post);

  const categories = await fetchCategoriesForPost(post.id);
  const categoryList = categories.length
    ? categories
        .map((cat) => `<span class="post-category">${cat.name}</span>`)
        .join(", ")
    : "";
  const postUserName = await getUsernameByUserId(post.userid);

  const createdDate = new Date(post.created_at.Time).toLocaleString();
  const updatedDate = new Date(post.updated_at.Time).toLocaleString();

  document.title = post.title;

  await attachBaseLayout(
    /*html*/ `
    <link rel="stylesheet" href="/public/css/post.css" />
    <div id="main" class="">
      <div id="main-container" class="">
        <div id="post-title" class="">${post.title}</div>
        <div id="post-categories">Categories: ${categoryList}</div>
        <div id="post-details" class="">
          <div id="post-author" class="">
            <i class="fa-regular fa-user"></i>
            <p>${postUserName}</p>
          </div>
          <p>postid: ${post.id}</p>
          <p>created: ${createdDate}</p>
          <p>updated: ${updatedDate}</p>
          <button id="edit-post">Edit</button>
        </div>
        <div id="post-body-container">
          <p>${post.body}</p>
        </div>
        ${commentsBox} ${commentsHtml}
      </div>
    </div>
    `,
    async () => {
      handleCreateComment(post.id);
      const currentUserId = await getCurrentUserId();
      handleEditPost(post, post.userid, currentUserId);
      handleDeleteComment(post.id, currentUserId);
      handleUpdateComment(post.id, currentUserId);
    },
  );
}

function CommentsBox() {
  return /*html*/ `

    <link rel="stylesheet" href="/public/css/post.css" />
    <div id="comment-box-container" class="">
      <textarea
        class=""
        id="comment-text"
        rows="10"
        cols="80"
        placeholder="Write your comment here..."
      ></textarea>
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

  if (!comments || comments.length === 0) {
    return "<p>No comments available.</p>";
  }

  const enrichedComments = await Promise.all(
    comments.map(async (comment) => {
      const username = await getUsernameByUserId(comment.userid);
      return { ...comment, username };
    }),
  );
  return CommentList(enrichedComments);
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

function handleDeleteComment(postId, currentUserId) {
  const deleteButtons = document.querySelectorAll(".delete-comment");

  deleteButtons.forEach((button) => {
    const commentId = button.dataset.commentId;
    const contentDiv = document.getElementById(`comment-${commentId}`);
    const commentUserId = contentDiv.dataset.userid;

    if (String(commentUserId) !== String(currentUserId)) {
      button.style.display = "none";
    }

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

function handleUpdateComment(postId, currentUserId) {
  const editButtons = document.querySelectorAll(".edit-comment");

  editButtons.forEach((editButton) => {
    const commentId = editButton.dataset.commentId;
    const contentDiv = document.getElementById(`comment-${commentId}`);
    const commentUserId = contentDiv.dataset.userid;

    if (String(commentUserId) !== String(currentUserId)) {
      // editButton.disabled = true;
      editButton.style.display = "none";
    }

    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      const commentId = editButton.dataset.commentId;

      const contentDiv = document.getElementById(`comment-${commentId}`);
      const editForm = document.getElementById(`edit-form-${commentId}`);
      const textarea = editForm.querySelector(".edit-textarea");
      const saveButton = editForm.querySelector(".save-comment");
      const cancelButton = editForm.querySelector(".cancel-edit");

      const contentBody = contentDiv.querySelector("#comment-body-container");
      const contentButtons = contentDiv.querySelector(
        "#comment-buttons-container",
      );

      if (!contentDiv || !editForm) {
        console.log("Could not find comment elements");
        return;
      }

      contentBody.style.display = "none";
      contentButtons.style.display = "none";
      editForm.style.display = "flex";

      // Handle cancel button
      const cancelHandler = () => {
        contentBody.style.display = "flex";
        contentButtons.style.display = "flex";
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

function handleEditPost(post, postUserId, currentUserId) {
  const editButton = document.getElementById("edit-post");

  // console.log("postUserId (String):", String(postUserId));
  // console.log("currentUserId (String):", String(currentUserId));

  if (String(postUserId) !== String(currentUserId)) {
    console.log("postUserId and currentUserId are not equal");
    editButton.style.display = "none";
    return;
  }

  editButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.getElementById("create-post-modal");
    if (modal) {
      modal.parentNode.removeChild(modal);
    }
    managePostModal(true, post);
  });
}

export async function getCurrentUserId() {
  try {
    const res = await SpecialFetch("/api/profile");
    if (!res.ok) {
      console.log("Failed to fetch the user profile.");
    }
    const user = await res.json();
    // console.log("user", user.id);
    return user.id;
  } catch (error) {
    console.log("An error occurred:", error);
    return null;
  }
}

export async function getUsernameByUserId(userId) {
  try {
    const res = await SpecialFetch(`/api/users/${userId}`);
    if (!res.ok) {
      console.log(`Failed to fetch the username for userId: ${userId}`);
      return;
    }
    const user = await res.json();
    return user.nickname;
  } catch (error) {
    console.error("An error occurred:", error);
    return;
  }
}

async function fetchCategoriesForPost(postId) {
  try {
    const res = await SpecialFetch(`/api/post/${postId}/categories`, "GET");
    if (!res.ok) {
      console.error("Failed to fetch categories for the post");
      return [];
    }
    const categories = await res.json();
    return Array.isArray(categories) ? categories : []; // Ensure it's an array
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
