import { PostList } from "../components/post.js";
import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function homePage() {
  const res = await SpecialFetch("/api/posts");
  if (!res.ok) return;
  /**
   * @type {import("../js/types").Post[]}
   */
  const posts = await res.json();

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      const username = await getUsernameByUserId(post.userid);
      return { ...post, username };
    }),
  );

  // console.log("enrichedPosts", enrichedPosts);

  const categories = await fetchCategories();
  const categoriesHtml = categories
    ? categories
        .map(
          (category) =>
            `<button class="category-button" data-category-id="${category.id}">${category.name}</button>`,
        )
        .join("")
    : "<p>No categories available.</p>";

  await attachBaseLayout(
    /*html*/ `
<div id="home-header" class="flex flex-col justify-center items-center p-10px">
  <h1>Real time forum (placeholder)</h1>
  <p>Some text describing the project goes here</p>
</div>
<div id="categories-container" class="flex flex-row gap-10px justify-center pt-20px">
  ${categoriesHtml}
</div>
<div id="main-posts-container" class="flex flex-row gap-40px justify-between pl-120px pr-120px pt-50px pb-50px">
  ${PostList(enrichedPosts)}
</div>

<style>
  #main-posts-container {
    flex-wrap: wrap;
    justify-content: center;
  }
  #categories-container {
    flex-wrap: wrap;
    justify-content: center;
  }
  .category-button {
    font-size: 0.7rem;
    padding: 10px 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    cursor: pointer;
    border-radius: 5px;
  }
  .category-button:hover {
    background-color: #ddd;
  }
</style>
    `,
    capabilities,
  );

  document.querySelectorAll(".category-button").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const categoryId = event.target.dataset.categoryId;
      const filteredPosts = await filterPostsByCategory(
        enrichedPosts,
        categoryId,
      );
      updatePosts(filteredPosts);
    });
  });
}

function capabilities() {}

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
    console.log("An error occurred:", error);
    return;
  }
}

export async function fetchCategories() {
  const response = await SpecialFetch(`/api/categories`);

  if (!response) {
    return "<p>Failed to load categories.</p>";
  }
  if (!response.ok) {
    return "<p>Failed to load categories.</p>";
  }

  const categories = await response.json();
  return categories;
}

async function filterPostsByCategory(posts, categoryId) {
  const res = await SpecialFetch(`/api/post-categories/${categoryId}`);
  if (!res.ok) return posts;

  let filteredCategoryPosts = await res.json();
  // this is a fix for categories with no posts assosiated to it
  if (!Array.isArray(filteredCategoryPosts)) {
    filteredCategoryPosts = [];
  }

  return posts.filter((post) =>
    filteredCategoryPosts.some(
      (filteredPost) => filteredPost.post_id === post.id,
    ),
  );
}

function updatePosts(filteredPosts) {
  const postsContainer = document.getElementById("main-posts-container");
  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = `
      <p>No posts available for this category...</p>
`;
  } else {
    postsContainer.innerHTML = PostList(filteredPosts);
  }
}
