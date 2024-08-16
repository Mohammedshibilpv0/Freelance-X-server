import { IUserPost } from "../doamin/entities/UserPost";


export interface IClientRepository{
    
    createPost(data:IUserPost):Promise<IUserPost>
}