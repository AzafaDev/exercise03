import { Router } from "express";
import { postController } from "../controllers/post.controller";

const postRouter = Router()

postRouter.get('/', postController.getPosts)
postRouter.get('/:id', postController.getPostById)
postRouter.post('/', postController.createPost)
postRouter.put('/:id', postController.updatePost)

export default postRouter