import { reRoute, SpecialFetch } from "../js/utils.js";
import { fetchCategories } from "../pages/home.js";

export const managePostModal = async (isEdit = false, post = {}) => {
  const categories = await fetchCategories();

  if (isEdit) {
    try {
      const categoriesRes = await SpecialFetch(
        `/api/post/${post.id}/categories`,
        "GET",
      );
      post.categories = await categoriesRes.json();
    } catch (error) {
      console.error("Failed to fetch post categories:", error);
      post.categories = [];
    }
  }

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
        <label>Categories:</label>
        <div id="post-categories" class="category-checkboxes">
          ${categories
            .map((category) => {
              const isChecked =
                isEdit &&
                post.categories &&
                post.categories.some((c) => c.category_id === category.id);
              return `
                <label class="category-checkbox">
                  <input 
                    type="checkbox" 
                    name="category" 
                    value="${category.id}"
                    ${isChecked ? "checked" : ""}
                  >
                  ${category.name}
                </label>
              `;
            })
            .join("")}
        </div>
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
      const categoryCheckboxes = document.querySelectorAll(
        'input[name="category"]:checked',
      );

      const selectedCategories = Array.from(categoryCheckboxes).map(
        (checkbox) => parseInt(checkbox.value, 10),
      );

      const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await SpecialFetch(url, method, {
        title: title.value,
        body: body.value,
      });

      if (!res || !res.ok) {
        return;
      }

      const newPost = await res.json();

      if (isEdit) {
        try {
          const existingCategoriesRes = await SpecialFetch(
            `/api/post/${newPost.id}/categories`,
            "GET",
          );
          const existingCategories = await existingCategoriesRes.json();
          console.log("existingCategories", existingCategories);

          const deleteCategoryRequests = existingCategories.map(
            (postCategory) =>
              SpecialFetch(`/api/post-categories`, "DELETE", {
                post_id: newPost.id,
                category_id: postCategory.category_id,
              }),
          );
          await Promise.all(deleteCategoryRequests);
        } catch (error) {
          console.log("Failed to delete existing categories:", error);
          return;
        }
      }

      // create categories
      if (selectedCategories.length > 0) {
        const categoryRequests = selectedCategories.map((categoryId) =>
          SpecialFetch("/api/post-categories", "POST", {
            post_id: newPost.id,
            category_id: categoryId,
          }),
        );

        const categoryResponses = await Promise.all(categoryRequests);

        if (categoryResponses.some((res) => !res.ok)) {
          console.log("Failed to associate one or more categories.");
          return;
        }
      }

      modalElement.style.display = "none";
      title.value = ""; // Reset title field
      body.value = ""; // Reset body field
      await reRoute(document.location.pathname);
    });
};
