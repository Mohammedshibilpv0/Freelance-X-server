export interface IFriendsLists{
    friends: IFriend[];
}

export interface IFriend {
    id: string;
    conversationId: string; 
    firstName?: string;   
    secondName?: string;    
    onlineStatus?: boolean; 
    profilePictureUrl?: string; 
  }
  