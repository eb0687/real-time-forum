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

  await attachBaseLayout(
    GetProfilePageHTML(user),
    () => {
      capabilities();
    },
  );
}




export async function ownProfilePage() {

  const res = await SpecialFetch(`/api/profile`);
  if (!res.ok) return;

  /**
   * @type {import("../js/types").User}
   */
  const user = await res.json();

  document.title = user.nickname;

  await attachBaseLayout(
    GetProfilePageHTML(user),
    () => {
      capabilities();
    },
  );
}
/**
 * 
 * @param {import("../js/types").User} user 
 * @returns {string}
 */
function GetProfilePageHTML(user ) {
    return /*html*/ `
        <h1>Profile of ${user.nickname}</h1>
        <p><strong>Nickname:</strong> ${user.nickname}</p>
        <p><strong>Age:</strong> ${user.age}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        <p><strong>First Name:</strong> ${user.first_name}</p>
        <p><strong>Last Name:</strong> ${user.last_name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Joined On:</strong> ${user.created_at.Time}</p>
    `;
}

function capabilities() {
  // TODO: not sure what to add here for event listener, maybe edit but to change user data?
  console.log("Profile loaded for user:");
}
