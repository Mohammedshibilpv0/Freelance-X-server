import { Router } from 'express';
import { adminLogin,listallusers,updateUserStatus,addCategory,getCategory,findCategory
    ,editCategory,deleteCategory,addSubcategory,getSubcategory,findSubcategorybyId,
    editSubCategory,deleteSubCategory
} from '../../../controllers/admin/adminController';
import adminMiddleware from '../../../infrastructure/middleware/adminmiddleware';

const  router=Router()

/////auth and user block
router.post('/auth/login',adminLogin)
router.get('/users',adminMiddleware,listallusers)
router.put('/updateUserBlockStatus',adminMiddleware,updateUserStatus)


/// category and subcategory
router.get('/categories',getCategory)
router.post('/category',adminMiddleware,addCategory)
router.put('/category',adminMiddleware,editCategory)
router.get('/findcategory/:id',findCategory)
router.put('/deletecategory/:id',adminMiddleware,deleteCategory)
router.post('/subcategory',adminMiddleware,addSubcategory)
router.get('/subcategories',getSubcategory)
router.get('/findsubcategory/:id',adminMiddleware,findSubcategorybyId)
router.put('/subcategory',adminMiddleware,editSubCategory)
router.put('/deleteSubCategory/:id',adminMiddleware,deleteSubCategory)


export default router