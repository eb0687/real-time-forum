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
  const createdDate = new Date(user.created_at.Time).toLocaleString();
  return /*html*/ `
<link rel="stylesheet" href="/public/css/profile.css">
<div id="main" class="">
  <div id="profile-container" class="">
    <div id="profile-title" class="">
      ${user.first_name} ${user.last_name}
    </div>
    <div id="user-details-container" class="">
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
        <span class="value">${createdDate}</span>
      </div>
    </div>
  </div>
</div>
    `;
}

function capabilities() {
  // TODO: not sure what to add here for event listener, maybe edit but to change user data?
  console.log("Profile loaded for user:");
}
