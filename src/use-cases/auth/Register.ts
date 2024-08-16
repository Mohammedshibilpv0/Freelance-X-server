import bcrypt from 'bcrypt'
import { IUser } from '../../doamin/entities/User';
import UserRepository from '../../infrastructure/repositories/UserRepository';
import CheckuserExists from './CheckuserExists';


const isValidateEmail = (email: string): boolean => {
  const allowedDomains = ['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};


const isValidatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};


export default class RegisterUserUseCase {
  private userRepository: UserRepository;
  private checkUserExistsUseCase: CheckuserExists;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.checkUserExistsUseCase = new CheckuserExists(userRepository);
  }

  async execute(user: IUser): Promise<void> {
    const emailExists = await this.checkUserExistsUseCase.execute(user.email);
   
    if (emailExists) {
      throw new Error('Email is already in use');
    }

   
    if (!isValidateEmail(user.email)) {
      throw new Error('Invalid email format');
    }

    if (!isValidatePassword(user.password)) {
      throw new Error('Weak password');
    }


    user.password = await bcrypt.hash(user.password, 10);
    await this.userRepository.create(user);
  }
}
