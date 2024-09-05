export interface IMessage{
    senderId:string
    text:string
    receiverId:string
    timestamp:Date
    status: 'sent' | 'delivered' | 'read';
    messageId:string
}