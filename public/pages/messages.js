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

  socket.addEventListener("open", async (event) => {
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

  await fetchMessageHistory(selectedReceiverId);
}

async function fetchMessageHistory(receiverId, limit = 10) {
  try {
    const currentUserId = await getCurrentUserId();
    const response = await SpecialFetch("/api/messages", "POST", {
      senderid: currentUserId,
      receiverid: receiverId,
      senderid_2: receiverId,
      receiverid_2: currentUserId,
      limit: limit,
      offset: 0,
    });
    if (!response.ok) {
      console.log("Failed to fetch message history:", response);
    }

    const messageHistory = await response.json();
    console.log("Message History:", messageHistory); // Add this log
    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.innerHTML = "";
    if (messageHistory == null) {
      throw new Error("you don't have any chat with this person");
    }

    messageHistory.reverse().forEach(async (message) => {
      const senderUserName = await getUsernameByUserId(message.senderid);

      const date = new Date(message.created_at.Time);
      const prettyDate = date.toLocaleString();

      messagesContainer.innerHTML += `
        <div class="message ${message.senderid === currentUserId ? "sent" : "received"}">
          <span class="${message.senderid === currentUserId ? "sender-name" : "receiver-name"}">
            (${prettyDate}) ${senderUserName}:
          </span>
          <span class="${message.senderid === currentUserId ? "sent-message" : "received-message"}">
            ${message.body}
          </span>
        </div> 
      `;
    });
  } catch (error) {
    console.error("Error fetching message history:", error);
  }
}
