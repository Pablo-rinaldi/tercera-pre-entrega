const socket = require("socket.io");
const MessageModel = require("../models/message.model.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un cliente se conectó");

      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }
}

module.exports = SocketManager;
