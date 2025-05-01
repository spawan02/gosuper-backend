import { Router } from "express";
import {
    addExpense,
    deleteExpense,
    listExpenses,
} from "../controllers/expenseController";
import { userMiddleware } from "../middleware";

const router = Router();

router.use(userMiddleware);
router.post("/", addExpense);
router.get("/", listExpenses);
router.delete("/:id", deleteExpense);

export default router;
