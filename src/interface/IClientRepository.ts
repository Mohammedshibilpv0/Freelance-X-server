import { IUserPost } from "../doamin/entities/UserPost";


export interface IClientRepository{
    
    createPost(data:IUserPost):Promise<IUserPost>
    listUserPosts(id:string):Promise<IUserPost[]|null>
    findPost(id:string):Promise<IUserPost|null>
}