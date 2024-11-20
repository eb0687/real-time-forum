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

  await attachBaseLayout(
    /*html*/ `
<div id="home-header" class="flex flex-col justify-center items-center p-10px">
  <h1>Real time forum (placeholder)</h1>
  <p>Some text describing the project goes here</p>
</div>
<div id="main-posts-container" class="flex flex-row gap-40px justify-between pl-120px pr-120px pt-50px pb-50px">
  ${PostList(enrichedPosts)}
</div>

<style>
  #main-posts-container {
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
    `,
    capabilities,
  );
}

function capabilities() {}

async function getUsernameByUserId(userId) {
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
