import { getCookieWithoutRequest, SpecialFetch } from "../js/utils.js";
import { getUsernameByUserId } from "./home.js";
import { attachBaseLayout } from "./layouts.js";
import { getCurrentUserId } from "./post.js";

export async function messagesPage() {
  const cookie = getCookieWithoutRequest("auth_token");
  console.log(document.cookie);
  if (cookie === null) {
    return;
  }

  const socket = new WebSocket(`ws://localhost:8080/ws?token=${cookie}`);

  socket.addEventListener("open", async () => {
    console.log("Connected to the WebSocket server");
    await handleSendMessage(socket);
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error observed:", event);
  });

  socket.onmessage = async (event) => {
    try {
      const payload = JSON.parse(event.data);

      // Check if its a user status list
      if (Array.isArray(payload)) {
        displayUserStatus(payload);
      } else {
        // Otherwise, handle it as a chat message
        await handleIncomingMessage(event);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  };

  await attachBaseLayout(
    /*html*/ `
<link rel="stylesheet" href="public/css/messages.css">
<div id="main">
  <div id="private-messages-container" class="">
    <h2>Private Messages</h2>
    <div id="messages-container"></div>
    <div class="message-input-container">
      <input type="text" id="message-input" placeholder="Type your message here..." />
      <button id="send-message-button">Send</button>
    </div>
  </div>
  <div id="user-list-container">
    <ul id="user-list"></ul>
  </div>
</div>
    `,
    capabilities,
  );
}

function capabilities() {}

async function handleIncomingMessage(event) {
  try {
    const message = JSON.parse(event.data);
    const output = document.getElementById("messages-container");

    if (
      message.senderid === selectedReceiverId ||
      message.receiverid === selectedReceiverId
    ) {
      const senderUserName = await getUsernameByUserId(message.senderid);
      const date = new Date(message.created_at.Time);
      const prettyDate = date.toLocaleString();

      output.innerHTML += `
        <div class="message ${message.senderid === selectedReceiverId ? "received" : "sent"}">
          <span class="${message.senderid === selectedReceiverId ? "receiver-name" : "sender-name"}">
            (${prettyDate}) ${senderUserName}:
          </span>
          <span class="${message.senderid === selectedReceiverId ? "received-message" : "sent-message"}">
            ${message.body}
          </span>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error parsing message:", error, "Data:", event.data);
  }
}

async function handleSendMessage(socket) {
  const sendButton = document.getElementById("send-message-button");
  const messageInput = document.getElementById("message-input");

  const senderId = await getCurrentUserId();

  sendButton.addEventListener("click", () => {
    const messageBody = messageInput.value.trim();
    if (messageBody && selectedReceiverId) {
      const messageData = {
        body: messageBody,
        senderid: senderId,
        receiverid: selectedReceiverId,
      };

      socket.send(JSON.stringify(messageData));
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });
}

function displayUserStatus(userStatuses) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Clear the list before re-rendering

  userStatuses.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.className = "user-item";
    userElement.innerHTML = `
      <i class="fa-solid fa-circle status-icon ${user.online ? "online" : "offline"}"></i>
      <span>${user.username}</span>
    `;

    userElement.addEventListener("click", () => handleUserSelect(user));

    userList.appendChild(userElement);
  });
}

let selectedReceiverId = null;
async function handleUserSelect(user) {
  selectedReceiverId = user.id;

  const messageInput = document.getElementById("message-input");
  messageInput.placeholder = `Type your message to ${user.username}...`;

  const messagesContainer = document.getElementById("messages-container");
  messagesContainer.innerHTML = "";

  offset = 0;
  await fetchMessageHistory(selectedReceiverId, 10, offset);

  offset += 10;

  await ensureScrollableContent();
  setupScrollLoading();
}

async function fetchMessageHistory(receiverId, limit = 10, offset = 0) {
  try {
    const currentUserId = await getCurrentUserId();
    console.log(
      `Fetching messages for user ${receiverId} with offset ${offset}`,
    );

    const response = await SpecialFetch("/api/messages", "POST", {
      senderid: currentUserId,
      receiverid: receiverId,
      senderid_2: receiverId,
      receiverid_2: currentUserId,
      limit: limit,
      offset: offset,
    });

    if (!response.ok) {
      console.error("Failed to fetch message history:", response);
      return false;
    }

    const messageHistory = await response.json();
    if (!messageHistory || messageHistory.length === 0) {
      console.log("No more messages found.");
      return null;
    }

    const messagesContainer = document.getElementById("messages-container");

    messageHistory.reverse().forEach(async (message) => {
      const senderUserName = await getUsernameByUserId(message.senderid);
      const date = new Date(message.created_at.Time);
      const prettyDate = date.toLocaleString();

      const messageHTML = `
        <div class="message ${
          message.senderid === currentUserId ? "sent" : "received"
        }">
          <span class="${
            message.senderid === currentUserId ? "sender-name" : "receiver-name"
          }">
            (${prettyDate}) ${senderUserName}:
          </span>
          <span class="${
            message.senderid === currentUserId
              ? "sent-message"
              : "received-message"
          }">
            ${message.body}
          </span>
        </div>
      `;

      // Use `insertAdjacentHTML` to prepend messages
      messagesContainer.insertAdjacentHTML("afterbegin", messageHTML);
    });

    return true;
  } catch (error) {
    console.error("Error fetching message history:", error);
    return false;
  }
}

let offset = 0;
async function loadPreviousMessages() {
  try {
    const success = await fetchMessageHistory(selectedReceiverId, 10, offset);
    if (success) {
      offset += 10;
    } else {
      // console.log("No more messages to load.");
      return;
    }
    return success;
  } catch (error) {
    console.error("Error loading previous messages:", error);
    return false;
  }
}

function setupScrollLoading() {
  const messagesContainer = document.getElementById("messages-container");

  messagesContainer.addEventListener(
    "scroll",
    debounce(async () => {
      if (messagesContainer.scrollTop <= 50) {
        const success = await loadPreviousMessages();
        if (success) {
          const currentScrollTop = messagesContainer.scrollTop;
          const newScrollHeight = messagesContainer.scrollHeight;
          const scrollDownAmount = 1; // Adjust this value as needed for slight scroll

          messagesContainer.scrollTop = Math.min(
            currentScrollTop + scrollDownAmount,
            newScrollHeight - messagesContainer.clientHeight,
          );
        }
      }
    }, 300),
  );
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function ensureScrollableContent() {
  const messagesContainer = document.getElementById("messages-container");

  let messagesLoaded = false;

  // Load messages until the content is scrollable or no more messages are available
  while (messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
    const success = await loadPreviousMessages();
    if (!success) {
      console.log("No more messages to load.");
      break;
    }
    messagesLoaded = true;
  }

  // Scroll to the bottom if messages were loaded
  if (messagesLoaded) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
