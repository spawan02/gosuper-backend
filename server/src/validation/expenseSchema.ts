import { z } from "zod";

export const expenseSchema = z.object({
    amount: z.number(),
    category: z.enum(["Income", "Expense"]),
    description: z.string().optional(),
});
