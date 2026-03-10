import { Router } from "express";
import { userController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/', userController.getUsers)
userRouter.get('/:id', userController.getuserById)
userRouter.put('/:id', userController.updateUser)
userRouter.get('/:id/posts', userController.getPost)

export default userRouter;