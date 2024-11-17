import { SpecialFetch } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export async function profilePage(id) {
  await attachBaseLayout("<h1>Loading your profile page...</h1>", capabilities);

  const res = await SpecialFetch(`/api/profile/${id}`);
  if (!res.ok) return;

  /**
   * @type {import("../js/types").User}
   */
  const user = await res.json();

  document.title = user.nickname;

  await attachBaseLayout(GetProfilePageHTML(user), () => {
    capabilities();
  });
}

export async function ownProfilePage() {
  const res = await SpecialFetch(`/api/profile`);
  if (!res.ok) return;

  /**
   * @type {import("../js/types").User}
   */
  const user = await res.json();

  document.title = user.nickname;

  await attachBaseLayout(GetProfilePageHTML(user), () => {
    capabilities();
  });
}
/**
 *
 * @param {import("../js/types").User} user
 * @returns {string}
 */
function GetProfilePageHTML(user) {
  return /*html*/ `

<div class="flex flex-col items-center justify-center h-100vh">
  <div class="b-1px-border p-20px rounded w-600px">
    <div class="flex flex-row items-center mb-30px">
      <div id="profile-title" class="text-center w-full b-1px-border rounded p-10px">
        ${user.first_name} ${user.last_name}
      </div>
    </div>
    <div class="flex flex-col items-start gap-10px">
      <div class="label-value-pair">
        <span class="label-bold">Nickname:</span>
        <span class="value">${user.nickname}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">Age:</span>
        <span class="value">${user.age}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">Gender:</span>
        <span class="value">${user.gender}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">First Name:</span>
        <span class="value">${user.first_name}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">Last Name:</span>
        <span class="value">${user.last_name}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">Email:</span>
        <span class="value">${user.email}</span>
      </div>
      <div class="label-value-pair">
        <span class="label-bold">Joined On:</span>
        <span class="value">${user.created_at.Time}</span>
      </div>
    </div>
  </div>
</div>

<style>
  #profile-title {
    font-size: 2rem;
    font-weight: bold;
  }

  .label-bold {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .value {
    font-size: 1.2rem;
  }

  .label-value-pair {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    width: 100%;
  }
</style>

    `;
}

function capabilities() {
  // TODO: not sure what to add here for event listener, maybe edit but to change user data?
  console.log("Profile loaded for user:");
}
