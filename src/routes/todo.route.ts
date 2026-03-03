import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";

const router = Router()

router.get('/', todoController.get)
router.get('/:id', todoController.getById)
router.post('/', todoController.create)
router.put('/:id', todoController.update)
router.delete('/:id', todoController.delete)

export default router