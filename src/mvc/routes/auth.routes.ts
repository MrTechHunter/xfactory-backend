import express from 'express';
import { authController, userController } from '../controllers';
import { Routes } from './routesStrings';
const router = express.Router();

router.post(Routes.login, authController.UserLogin);
router.post(Routes.register, authController.UserRegister);
router.get(Routes.users, userController.UsersList);
router.post(Routes.addFriend, userController.AddFriend);
router.post(Routes.removeFriend, userController.removeFriend);
router.post(Routes.currentUserInfo, userController.currentUserInfo);

router.post(Routes.updateProfileChanges, userController.updateProfileChanges);


export default router;
