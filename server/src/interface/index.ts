export interface JwtPayload {
    userId: string;
}

export interface Transaction {
    id: number;
    category: string;
    amount: number;
};
