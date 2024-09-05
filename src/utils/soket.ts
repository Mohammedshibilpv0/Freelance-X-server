import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import UserRepository from "../infrastructure/repositories/UserRepository";
import { IMessage } from "../doamin/entities/Message";
import Message from "../infrastructure/database/models/Message";
interface SocketUser {
  id: string;
  socketId: string;
}

const userrepository = new UserRepository();
const initializeSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      // origin:"https://qnn863k8-5173.inc1.devtunnels.ms",
      methods: ["GET", "POST"],
    },
  });

  let users: SocketUser[] = [];

  const addUser = (id: string, socketId: string) => {
    if (!users.some((user) => user.id === id)) {
      users.push({ id, socketId });
    }
  };
  

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("initialMessage",async(messageData)=>{
      const {currentUserId,message,id,messageId}=messageData
      let a:any= await userrepository.saveMessage(currentUserId, id,message,true,messageId);
      io.emit("getinitialMessage", a.conversationId);
    });

    socket.on("addUser", (id: string) => {
      addUser(id, socket.id);
      io.emit("getUser", users);
    });

    socket.on("message",async (message: IMessage) => {
      const user = getUser(message.receiverId);

      const { senderId, text, receiverId,messageId} = message;
      const messages = {
        messageId,
        sender: senderId,
        text,
        timestamp: new Date(),
      };
      await userrepository.saveMessage(senderId, receiverId, text,false,messageId);
      if (user) {
        console.log(message)
        io.to(user.socketId).emit("messageContent", messages);
      }

    });


socket.on("messageRead", async (messageId: string) => {
  const message = await Message.findOne({messageId});
  if (message) {
    message.status = 'read';
    await message.save();
    const sender = getUser(message.sender.toString());
    if (sender) {
      io.to(sender.socketId).emit("messageReadConfirmation", messageId);
    }
  }
});

   
    socket.on("notification",async(messageData)=>{
      const {senderId,receiverId,text}=messageData
      const user = getUser(receiverId);
      const notification={
        sender:senderId,
        receiver:receiverId,
        text,
        time:new Date()
      }
      if(user){
        io.to(user.socketId).emit("notification", notification);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("removeUser", users);
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;

