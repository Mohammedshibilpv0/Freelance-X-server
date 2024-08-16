import { IUserPost } from "../../doamin/entities/UserPost";
import { IClientRepository } from "../../interface/IClientRepository";
import UserPost from "../database/models/UserPostModal";


export default class ClientRepository implements IClientRepository {


    async createPost(data: IUserPost): Promise<IUserPost> {
        return UserPost.create(data)        
    }
}