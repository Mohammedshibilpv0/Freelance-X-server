import { DataSizeOperatorReturningNumber } from "mongoose";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import { IUser, IUserSummary } from "../../doamin/entities/User";
import { IUserPost } from "../../doamin/entities/UserPost";
import AdminRepository from "../../infrastructure/repositories/AdminRepository";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { IReport } from "../../infrastructure/database/models/ReportModel";


const userepository=new UserRepository()

export default class handleIUser{
    private adminrepository:AdminRepository;

    constructor(adminrepository:AdminRepository){
        this.adminrepository=adminrepository
    }

    async findusers(page:number,limit:number):Promise<{users:IUserSummary[],totalPages:number}|null>{
        const {users,totalPages}=await this.adminrepository.findUsers(page,limit)
        return {users,totalPages};
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

      async userPosts (page:number,limit:number):Promise<{userPosts:IUserPost[],totalPages:number}|undefined>{
        const {userPosts,totalPages}=await this.adminrepository.userPosts(page,limit)

        if (userPosts.length === 0) {
          return undefined;
        }
        return {userPosts,totalPages}
      }

      async handleBlock (proId:string,status:boolean):Promise<IUserPost|null>{
        return await this.adminrepository.handleBlockUserPost(proId,status)
      }
       async handleBlockGig (proId:string,status:boolean):Promise<IFreelancerGig|null>{
        return await this.adminrepository.handleBlockGig(proId,status)
      }

      async freelancerGig(page:number,limit:number):Promise<{userPosts:IFreelancerGig[],totalPages:number}|undefined>{
        const {userPosts,totalPages}=await this.adminrepository.freelancerGig(page,limit)

        if (userPosts.length === 0) {
          return undefined;
        }
        return {userPosts,totalPages}
      }


      async reports(page: number, limit: number): Promise<{ reports: IReport[], totalPages: number } | null> {
        try {
          const result = await this.adminrepository.getReports(page, limit);
      
          if (result && 'reports' in result && 'totalPages' in result) {
            const { reports, totalPages } = result;
            return { reports, totalPages };
          } else {
            return null;
          }
        } catch (err) {
          console.error('Error in reports method:', err);
          return null;
        }
      }

      async dashboard ():Promise<any[]>{
        return await this.adminrepository.dashboard()
      }

}