import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../interface/security/jwt'; 
import { CustomRequest } from './customReq';
import UserRepository from '../repositories/UserRepository';
import { COOKIESECURE } from '../../config/env';

const userRepository = new UserRepository();

const authMiddleware = (requireAdmin: boolean = false) => {


  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    let  token = req.cookies.accessToken; 
    console.log(COOKIESECURE)
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        const _id = decoded.id;
        const user = await userRepository.findById(_id);

        if (user) {
          if (user.isBlock) {
            return res.status(403).json({ error: 'User is blocked' });
          }

          if (requireAdmin && !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
          }

          req.user = { id: decoded.id, email: decoded.email, isAdmin: user.isAdmin };
          next();
        } else {
          return res.status(401).json({ error: 'Invalid token' });
        }
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

export default authMiddleware;
