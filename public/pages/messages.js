import { getCookieWithoutRequest, SpecialFetch } from "../js/utils.js";
import { WebSocketSingleton } from "../js/WebSocketSingleton.js";
import { getUsernameByUserId } from "./home.js";
import { attachBaseLayout } from "./layouts.js";
import { getCurrentUserId } from "./post.js";

export async function messagesPage() {
  const cookie = getCookieWithoutRequest("auth_token");
  console.log(document.cookie);
  if (cookie === null) {
    return;
  }

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
</div>
    `,
    capabilities,
  );
}

async function capabilities() {
  const socket = WebSocketSingleton.getInstance();
  await handleSendMessage(socket);
}

export async function handleIncomingMessage(event) {
  try {
    const message = JSON.parse(event.data);
    const output = document.getElementById("messages-container");
    const currentUserId = await getCurrentUserId();

    // Check if the message is related to the current conversation
    if (
      (message.senderid === selectedReceiverId &&
        message.receiverid === currentUserId) ||
      (message.senderid === currentUserId &&
        message.receiverid === selectedReceiverId)
    ) {
      const senderUserName = await getUsernameByUserId(message.senderid);
      const date = new Date(message.created_at.Time);
      const prettyDate = date.toLocaleString();

      output.innerHTML += `
        <div class="message ${message.senderid === currentUserId ? "sent" : "received"}">
          <span class="${message.senderid === currentUserId ? "sender-name" : "receiver-name"}">
            (${prettyDate}) ${senderUserName}:
          </span>
          <span class="${message.senderid === currentUserId ? "sent-message" : "received-message"}">
            ${message.body}
          </span>
        </div>
      `;

      // Scroll to the bottom of the messages
      output.scrollTop = output.scrollHeight;
    }

    // Notification logic - separate from message display
    if (
      message.receiverid === currentUserId &&
      message.senderid !== selectedReceiverId
    ) {
      showNotification(message);
    }
  } catch (error) {
    console.error("Error parsing message:", error, "Data:", event.data);
  }
}

export async function handleSendMessage(socket) {
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

let selectedReceiverId = null;
export async function handleUserSelect(user) {
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

    // Display messages in the correct order (oldest to newest)
    for (const message of messageHistory) {
      //const senderUserName = await getUsernameByUserId(message.senderid);
      const date = new Date(message.created_at.Time);
      const prettyDate = date.toLocaleString();

      const messageHTML = `
        <div class="message ${
          message.senderid === currentUserId ? "sent" : "received"
        }">
          <span class="${
            message.senderid === currentUserId ? "sender-name" : "receiver-name"
          }">
            (${prettyDate}) ${message.User.nickname}:
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

      // Append messages to ensure correct order
      messagesContainer.insertAdjacentHTML("afterbegin", messageHTML);
    }

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

function showNotification(message) {
  // Request notification permission if not already granted
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
    return;
  }

  // Create a notification
  getUsernameByUserId(message.senderid).then((senderName) => {
    new Notification(`New Message from: ${senderName}`, {
      body: message.body,
    });
  });
}
