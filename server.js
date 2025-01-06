const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" }); // Set upload folder

let messages = [];
let uploadedFiles = [];

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle chat messages
app.post("/chat", (req, res) => {
  const { username, message } = req.body;
  if (username && message) {
    const chatMessage = `${username}: ${message}`;
    messages.push(chatMessage);
    io.emit("newMessage", chatMessage); // Broadcast to all clients
  }
  res.redirect("/");
});

// Clear chat messages
app.post("/clear", (req, res) => {
  messages = [];
  io.emit("clearMessages"); // Notify all clients to clear chat
  res.redirect("/");
});

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    uploadedFiles.push(req.file.originalname);
    io.emit("newFile", req.file.originalname); // Notify clients of the new file
  }
  res.redirect("/");
});

// Real-time chat connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send existing messages and files to the newly connected client
  socket.emit("initialData", { messages, uploadedFiles });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
http.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
