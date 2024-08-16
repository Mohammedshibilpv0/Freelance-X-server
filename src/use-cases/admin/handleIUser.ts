import AdminRepository from "../../infrastructure/repositories/AdminRepository";
import UserRepository from "../../infrastructure/repositories/UserRepository";


const userepository=new UserRepository()

export default class handleIUser{
    private adminrepository:AdminRepository;

    constructor(adminrepository:AdminRepository){
        this.adminrepository=adminrepository
    }

    async findusers():Promise<object>{
        const user=this.adminrepository.findUsers()
        return user
    }

    async updateUser(action: string, email: string) {
        const user = await userepository.findByEmail(email);
        if (!user) {
          return { error: 'User not found' };
        }
      
        switch (action) {
          case 'block':
            user.isBlock = true;
            break;
          case 'unblock':
            user.isBlock = false;
            break;
          default:
            return { message: 'Invalid action' };
        }
         await userepository.updateUser(user,user.email)
      
         return { message: `User ${action}ed successfully`};
      }

}