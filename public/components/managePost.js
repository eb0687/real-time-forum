import { reRoute, SpecialFetch } from "../js/utils.js";
import { fetchCategories } from "../pages/home.js";

export const managePostModal = async (isEdit = false, post = {}) => {
  const categories = await fetchCategories();

  console.log("isEdit", isEdit);
  console.log("post", post);
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "create-post-modal";
  modal.innerHTML = /*html*/ `
      <div class="modal-content">
        <span class="close-button">
          <i class="fa-solid fa-square-xmark"></i>
            </span>
            <h2 class="create-post-form-header">${isEdit ? "Edit Post" : "Create Post"}</h2>
            <form id="create-post-form">
                <label for="post-title">Title:</label>
                <input type="text" id="post-title" name="title" value="${isEdit ? post.title : ""}" required>
                <label for="post-body">Body:</label>
                <textarea id="post-body" name="body" required>${isEdit ? post.body : ""}</textarea>

                <label for="post-category">Category:</label>
                <select id="post-category" name="category" multiple required>
                  ${categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("")}
                </select>

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
      const categorySelect = document.getElementById("post-category");
      const selectedCategories = Array.from(categorySelect.selectedOptions).map(
        (option) => parseInt(option.value, 10),
      );

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

      const post = await res.json();

      // create categories
      if (selectedCategories.length > 0) {
        const categoryRequests = selectedCategories.map((categoryId) =>
          SpecialFetch("/api/post-categories", "POST", {
            post_id: post.id,
            category_id: categoryId,
          }),
        );

        const categoryResponses = await Promise.all(categoryRequests);
        if (categoryResponses.some((res) => !res.ok)) {
          console.log("Failed to associate one or more categories.");
          return;
        }
      }

      //  TODO: handle editing form, deleting and updating categories

      modalElement.style.display = "none";
      title.value = ""; // Reset title field
      body.value = ""; // Reset body field
      await reRoute(document.location.pathname);
    });
};
