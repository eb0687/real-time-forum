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

  await attachBaseLayout(
    /*html*/ `
<div id="home-header" class="flex flex-col justify-center items-center p-10px">
  <h1>Real time forum (placeholder)</h1>
  <p>Some text describing the project goes here</p>
</div>
<div id="main-posts-container" class="flex flex-row gap-40px justify-between pl-120px pr-120px pt-50px pb-50px">
  ${PostList(posts)}
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
