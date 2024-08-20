import { IUserPost } from "../doamin/entities/UserPost";


export interface IClientRepository{
    
    createPost(data:IUserPost):Promise<IUserPost>
    listUserPosts(id:string,page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
    findPost(id:string):Promise<IUserPost|null>
    allPost(page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
}