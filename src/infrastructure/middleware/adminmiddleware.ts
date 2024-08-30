// import { Response, NextFunction } from 'express';
// import { verifyAccessToken } from '../../interface/security/jwt'; 
// import { CustomRequest } from './customReq';
// import UserRepository from '../repositories/UserRepository';

// const userepository=new UserRepository()

// const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   const token = req.cookies.adminaccessToken; 
  
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   try {
//     const decoded = verifyAccessToken(token);
//     if (decoded) {
//       const _id=decoded.id
//       const user= await userepository.findById(_id)
//       if (user && !user.isAdmin) {
//         return res.status(403).json({ error: 'Admin is not valid' });
//       }
//        req.user = { id: decoded.id, email: decoded.email };

//       next();
//     } else {
//       res.status(401).json({ error: 'Invalid token' });
//     }
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// export default authMiddleware;
