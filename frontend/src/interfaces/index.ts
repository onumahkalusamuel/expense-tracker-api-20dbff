export interface IExpense {
    id: number;
    title: string;
    category: "Groceries" | "Leisure" | "Electronics" | "Utilities" | "Clothing" | "Health" | "Others";
    amount: number;
    createdAt?: string;
}

export interface IExpensesResponse {
    fromDate: string;
    toDate: string;
    data: IExpense[]
}


export type FilterType = 'PAST_WEEK' | 'PAST_MONTH' | 'PAST_3_MONTHS' | 'CUSTOM'

export interface IExpenseFilter {
    filter: FilterType,
    fromDate?: '',
    toDate?: '',
}
