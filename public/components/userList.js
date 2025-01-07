import { getCurrentUserId } from "../pages/post.js";
import { handleUserSelect, toggleSending } from "../pages/messages.js";
import { reRoute, SpecialFetch } from "../js/utils.js";

export const userList = async () => {
  return {
    ul: `
<link rel="stylesheet" href="public/css/userList.css" />
<div id="user-list-container">
  <ul id="user-list"></ul>
</div>
`,
    ulCap: () => {},
  };
};

export async function displayUserStatus() {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Clear the list before re-rendering

  //const currentUserId = await getCurrentUserId();
  //if (currentUserId == null) {
  //  return;
  //}
  //console.log(userStatuses);
  //console.log(currentUserId);

  //userStatuses = userStatuses.filter((v) => v.id != currentUserId);
  //
  //const userLastMessageTimes = await Promise.all(
  //  userStatuses.map((user) => fetchLastMessageTime(currentUserId, user)),
  //);
  //console.log("userLastMessageTimes", userLastMessageTimes);

  // Sort users based on last message timestamp
  //const sortedUsers = userLastMessageTimes.sort((a, b) => {
  //  // If both have last message times, sort by most recent
  //  if (a.lastMessageTime && b.lastMessageTime) {
  //    return b.lastMessageTime - a.lastMessageTime;
  //  }
  //
  //  // If one user has no messages, put them after users with messages
  //  if (a.lastMessageTime && !b.lastMessageTime) {
  //    return -1;
  //  }
  //  if (!a.lastMessageTime && b.lastMessageTime) {
  //    return 1;
  //  }
  //
  //  // If neither have messages, sort alphabetically by username
  //  return a.user.username.localeCompare(b.user.username);
  //});

  const res = await SpecialFetch("/api/get-sorted-user-list");
  if (res == null) {
    console.warn("fuck");
    return;
  }
  const sortedUsers = await res.json();

  sortedUsers.forEach(({ user }) => {
    const userElement = document.createElement("li");
    userElement.className = "user-item";
    userElement.innerHTML = `
      <i class="fa-solid fa-circle status-icon ${user.online ? "online" : "offline"}"></i>
      <span>${user.username}</span>
    `;

    try {
      userElement.addEventListener("click", async () => {
        if (window.location.href == "/messages") {
          handleUserSelect(user);
        } else {
          await reRoute("/messages");
          await new Promise((resolve) => setTimeout(resolve, 500));
          await handleUserSelect(user);
        }
        await toggleSending(false, user.id);
      });
    } catch (_error) {
      console.log(_error);
    }
    userList.appendChild(userElement);
  });
}

async function fetchLastMessageTime(currentUserId, user) {
  try {
    const response = await SpecialFetch("/api/messages", "POST", {
      senderid: currentUserId,
      receiverid: user.id,
      senderid_2: user.id,
      receiverid_2: currentUserId,
      limit: 1,
      offset: 0,
    });

    // fix: throwing is better
    if (!response.ok) {
      return {
        user,
        lastMessageTime: null,
      };
    }

    const messageHistory = await response.json();

    if (!messageHistory) {
      // console.log(
      //   `No message history found for user ${user.username} (ID: ${user.id})`,
      // );
      return {
        user,
        lastMessageTime: null,
      };
    }

    return {
      user,
      // fix: sorting on server is better
      lastMessageTime:
        messageHistory.length > 0
          ? new Date(messageHistory[0].created_at.Time).getTime()
          : null,
    };
  } catch (error) {
    console.error(`Error fetching last message for user ${user.id}:`, error);
    return {
      user,
      lastMessageTime: null,
    };
  }
}
