import { reRoute, SpecialFetch } from "../js/utils.js";

export const managePostModal = (isEdit = false, post = {}) => {
  console.log("isEdit", isEdit);
  console.log("post", post);

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "create-post-modal";
  modal.innerHTML = /*html*/ `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>${isEdit ? "Edit Post" : "Create Post"}</h2>
            <form id="create-post-form">
                <label for="post-title">Title:</label>
                <input type="text" id="post-title" name="title" value="${isEdit ? post.title : ""}" required>
                <label for="post-body">Body:</label>
                <textarea id="post-body" name="body" required>${isEdit ? post.body : ""}</textarea>
                <button type="submit">${isEdit ? "Update" : "Submit"}</button>
            </form>
        </div>
    `;
  document.body.appendChild(modal);

  const modalElement = document.getElementById("create-post-modal");
  const closeButton = modalElement.querySelector(".close-button");

  closeButton.addEventListener("click", () => {
    modalElement.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      modalElement.style.display = "none";
    }
  });

  document
    .getElementById("create-post-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("post-title");
      const body = document.getElementById("post-body");
      const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await SpecialFetch(url, method, {
        title: title.value,
        body: body.value,
      });
      if (!res) {
        return;
      }
      if (!res.ok) {
        return;
      }
      modalElement.style.display = "none";
      title.value = ""; // Reset title field
      body.value = ""; // Reset body field
      await reRoute(document.location.pathname);
    });
};
