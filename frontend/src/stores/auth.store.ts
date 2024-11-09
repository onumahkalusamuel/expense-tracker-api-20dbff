import {defineStore} from 'pinia'
import BaseService from "../services/base.service.ts";

export const useAuthStore = defineStore('todoList', {
    state: () => ({token: '', name: ''}),
    actions: {
        updateToken(taken: string) {
            BaseService.defaults.headers.common.Authorization = 'Bearer ' + taken;
        }
    },
    persist: true,
});
