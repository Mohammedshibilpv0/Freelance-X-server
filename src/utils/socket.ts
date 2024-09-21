import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import UserRepository from "../infrastructure/repositories/UserRepository";
import { IMessage } from "../doamin/entities/Message";
import Message from "../infrastructure/database/models/Message";
import { CLIENTURL } from "../config/env";

interface SocketUser {
  id: string;
  socketId: string;
}

const userrepository = new UserRepository();

const initializeSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: CLIENTURL,
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
        io.to(user.socketId).emit('messagecount',{count:1,senderId})
        io.to(user.socketId).emit("messageContent", messages);
      }

    });

    socket.on('sendAudioMessage',async(data)=>{
      const {senderId, audio, receiverId,messageId}=data
      const storeVoice= await userrepository.uploadAudio(audio)
      if (!storeVoice) {
        throw new Error('Audio upload failed or storeVoice is undefined');
      }
       await userrepository.saveAudio(senderId,receiverId,storeVoice,messageId)
      const message = {
        messageId,
        sender:senderId,
        audio:storeVoice,
        timeStamp:new Date()
      }
      const user = getUser(receiverId);
      if(user){
        io.to(user.socketId).emit('messagecount',{count:1,senderId})
        io.to(user.socketId).emit("messageContent", message);
      }
    })

    socket.on('sendFileMessage',async(fileData)=>{
      const {file,senderId,receiverId,messageId}=fileData
      await userrepository.saveImage(file,senderId,receiverId,messageId)
      const user = getUser(receiverId)
      const message = {
        messageId,
        sender:senderId,
        file:file,
        timeStamp:new Date()
      }
      if(user){
        io.to(user.socketId).emit('messagecount',{count:1,senderId})
        io.to(user.socketId).emit("messageContent", message);
      }
    })

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

    socket.on('typing',async(data)=>{
    const {conversationId,type,receiverId} = data
    const sender=getUser(receiverId)
    if(sender){
      io.to(sender.socketId).emit('changestatus',{conversationId,type,receiverId})
    }
    })

    socket.on("sendNotification",async(messageData)=>{
      console.log(messageData)
      const {userId,receiverId,text,link,type}=messageData
      const user = getUser(receiverId);
      const notification={
        sender:userId,
        receiver:receiverId,
        message:text,
        link,
        read:false,
        type,
        time:new Date()
      }
      await userrepository.saveNotification(userId,receiverId,text,link,'message')
      if(user){
        io.to(user.socketId).emit("notification", notification);
      }
    });

    socket.on('markNotificationAsRead', async ({ notificationId, userId }) => {
      await userrepository.changeNotificationStatus(notificationId,userId)
      socket.emit('notificationMarkedAsRead', notificationId);
    });

    socket.on('videoCall',(data)=>{
      const {senderId,name,receiverId,conversatioId} = data
      const user = getUser(receiverId);
      if(user){
        io.to(user.socketId).emit("videocallAlert", data);
      }
    })

    socket.on('videoDecline',(data)=>{
      const {senderId,name,receiverId} = data
      const user = getUser(receiverId);
      if(user){
        io.to(user.socketId).emit("declineVideoCall", data);
      }

    })
    
    

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("removeUser", users);
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;

