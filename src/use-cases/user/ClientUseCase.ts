import { IClientRepository } from "../../interface/IClientRepository";
import { IUserRepository } from "../../interface/IUserRepository";
import { IUserPost } from "../../doamin/entities/UserPost";

export default class ClientUseCase {
  private clientrepository: IClientRepository;
  private userepository: IUserRepository;

  constructor(
    clientrepository: IClientRepository,
    userepository: IUserRepository
  ) {
    this.clientrepository = clientrepository;
    this.userepository = userepository;
  }

  async userPost(data: IUserPost): Promise<IUserPost | undefined | null> {
    
    if (data.email) {
      const checkUser = await this.userepository.findByEmail(data.email);

      const updatedData = { ...data, userId: checkUser?._id };
      const addPost = await this.clientrepository.createPost(updatedData);
      if (addPost == null) {
        return undefined;
      }
      return addPost;
    } else {
      return null;
    }
  }


  async findPost(id:string):Promise<IUserPost|null>{
    const post=await this.clientrepository.findPost(id)
    if(post==null){
      return post
    }
    return post
  }

  async listposts (email:string): Promise<IUserPost[] | null | undefined>{
    if (email) {
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const getworks = await this.clientrepository.listUserPosts(
          checkUser._id
        );
        return getworks;
      }
      return null;
    }
    return undefined;
  }

}
