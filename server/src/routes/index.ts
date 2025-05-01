import express from "express";
import authRoutes from "./authRoutes";
import expenseRoutes from "./expenseRoutes";
const router = express.Router();

router.get("/", (_, res) => {
    res.json({
        message: "server is healthy",
    });
});

router.use("/expenses", expenseRoutes);
router.use("/auth", authRoutes);

export default router;
