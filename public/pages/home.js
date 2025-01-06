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
<link rel="stylesheet" href="/public/css/home.css">
<div id="home-header" class="">
  <h1>Real time forum (placeholder)</h1>
  <p id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit ratione quisquam accusantium magni distinctio hic, cum doloremque, qui quae veritatis harum sequi at vero ducimus magnam tenetur laboriosam fuga. Officia molestiae similique esse dicta laborum, natus error aliquid atque nobis repellat vero velit doloremque, provident illum laudantium facilis expedita, voluptates alias eius nesciunt! Porro, asperiores! Soluta sapiente nemo magnam necessitatibus perferendis commodi esse quaerat modi dicta? Reiciendis veritatis laborum, inventore architecto similique quae voluptates nam, dignissimos distinctio, fuga impedit incidunt ut laudantium? Animi non exercitationem rem eaque cumque inventore mollitia, quos modi saepe molestias omnis facere minus, officia doloribus accusantium.</p>
</div>
<div id="categories-container" class="">
  ${categoriesHtml}
</div>
<div id="main-posts-container" class="">
  ${PostList(enrichedPosts)}
</div>
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
