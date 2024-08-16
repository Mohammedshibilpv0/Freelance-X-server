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
}
