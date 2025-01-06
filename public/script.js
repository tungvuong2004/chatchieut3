const socket = io();

// Display existing messages and uploaded files on initial load
socket.on("initialData", (data) => {
  const messagesList = document.getElementById("messages-list");
  const filesList = document.getElementById("files-list");

  data.messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    messagesList.appendChild(li);
  });

  data.uploadedFiles.forEach((file) => {
    const li = document.createElement("li");
    li.textContent = file;
    filesList.appendChild(li);
  });
});

// Add new message in real-time
socket.on("newMessage", (msg) => {
  const messagesList = document.getElementById("messages-list");
  const li = document.createElement("li");
  li.textContent = msg;
  messagesList.appendChild(li);
});

// Add new file in real-time
socket.on("newFile", (file) => {
  const filesList = document.getElementById("files-list");
  const li = document.createElement("li");
  li.textContent = file;
  filesList.appendChild(li);
});

// Clear chat messages in real-time
socket.on("clearMessages", () => {
  const messagesList = document.getElementById("messages-list");
  messagesList.innerHTML = "";
});

// Clear chat function for button
function clearChat() {
  fetch("/clear", { method: "POST" });
}
