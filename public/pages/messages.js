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
<div id="main">
  <div id="private-messages-container" class="flex flex-col pl-120px pr-20px gap-20px">
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

<style>
  #main {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    height: 100dvh;
  }
  #private-messages-container {
    width: 95%
  }
  .message-input-container {
    display: flex; 
    flex-direction: row; 
    gap: 10px;
  }
  .message-input-container input#message-input {
    width: 100%; 
    padding: 10px 15px; 
    border: 2px solid ; 
    border-radius: 8px; 
    font-size: 16px; 
    color: #ddd; 
    outline: none; 
  }
  #messages-container {
    height: 90%; 
    overflow-y: auto;
    border: 2px solid; 
    border-radius: 8px; 
    padding: 10px; 
  }
  .message-input-container button#send-message-button {
    padding: 10px 20px; 
    background-color: #007BFF; 
    color: white; 
    font-size: 16px; 
    font-weight: bold; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: background-color 0.3s ease, transform 0.2s ease; 
  }
  .message-input-container button#send-message-button:hover {
    background-color: #0056b3; 
    transform: translateY(-2px); 
  }
  .message-input-container button#send-message-button:active {
    background-color: #004494; 
    transform: translateY(1px); 
  }
  .status-icon.online {
    color: green;
  }
  .status-icon.offline {
    color: red;
  }
  #user-list-container {
      position: fixed;
      top: 7.9%;
      right: 2rem;
      width: 40px;
      height: 100%;
      max-height: 810px;
      overflow-y: auto;
      background-color: #000000;
      border: 2px solid white;
      border-radius: 8px;
      padding: 10px 5px;
      box-sizing: border-box;
      transition: width 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  #user-list-container:hover {
    width: 200px;
  }
  #user-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .user-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.2s ease, color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-item:hover {
    background-color: #f0f0f0;
  }
  .user-item span {
    opacity: 0; 
    transition: opacity 0.3s ease;
  }
  #user-list-container:hover .user-item span {
    opacity: 1; 
  }
  .status-icon {
    font-size: 14px;
  }
.sent .sender-name {
  color: blue;
  font-weight: bold;
}
.sent .sent-message {
  color: #000000;
  background-color: #d0e0f0;
  border-radius: 5px;
  padding: 5px;
  margin-top: 5px;
  display: inline-block;
}
.received .receiver-name {
  color: green;
  font-weight: bold;
}
.received .received-message {
  color: #000000;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 5px;
  margin-top: 5px;
  display: inline-block;
}

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
