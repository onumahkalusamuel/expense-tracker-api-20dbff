import BaseService from "./base.service.ts";
import {IExpensesResponse} from "../interfaces";

export const apiGetExpenses = async (filters: object = {}): Promise<IExpensesResponse> => {
    return (await BaseService.get(`/expenses?${new URLSearchParams(filters as Record<string, string>).toString()}`)).data;
}

export const apiGetExpense = async (id: number) => {
    return (await BaseService.get(`/expenses/${id}`)).data;
};

export const apiCreateExpense = async (formData: object) => {
    return (await BaseService.post('/expenses', formData)).data;
}

export const apiUpdateExpense = async (id: number, formData: object) => {
    return (await BaseService.put(`/expenses/${id}`, formData)).data;
}

export const apiDeleteExpense = async (id: number) => {
    return (await BaseService.delete(`/expenses/${id}`)).data;
}
