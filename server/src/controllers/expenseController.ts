import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { expenseSchema } from "../validation/expenseSchema";
import { Transaction } from "../interface/index";

export const listExpenses = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const expenses = await prisma.expense.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        const totalIncome = expenses
            .filter((e: Transaction) => e.category === "Income")
            .reduce((sum: number, e: Transaction) => sum + e.amount, 0);

        const totalExpense = expenses
            .filter((e: Transaction) => e.category === "Expense")
            .reduce((sum: number, e: Transaction) => sum + e.amount, 0);

        res.json({ totalIncome, totalExpense, expenses });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const addExpense = async (req: Request, res: Response) => {
    try {
        const { amount, category, description } = expenseSchema.parse(req.body);

        const expense = await prisma.expense.create({
            data: {
                amount,
                category,
                description,
                userId: (req as any).userId,
            },
        });

        res.status(201).json({expenses: {
            id: expense.id,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            createdAt: expense.createdAt
        }});
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = (req as any).userId;

        const expense = await prisma.expense.findUnique({ where: { id } });
        if (!expense || expense.userId !== userId) {
            res.status(404).json({
                error: "Expense not found or unauthorized",
            });
            return;
        }

        await prisma.expense.delete({ where: { id } });
        res.json({ message: "Expense deleted" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
