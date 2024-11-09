import BaseService from "./base.service.ts";

export const apiLogin = async (formData: object) => {
    return (await BaseService.post('/log-in', formData)).data;
}

export const apiSignup = async (formData: object) => {
    return (await BaseService.post('/sign-up', formData))?.data;
}
