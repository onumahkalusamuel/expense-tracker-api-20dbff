import axios, {AxiosError} from "axios";
import {appConfig} from "../configs/app.config.ts";
import {notify} from "@kyvg/vue3-notification";

const BaseService = axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 50000,
    proxy: false,
    headers: {'Content-Type': 'application/json'},
})

BaseService.interceptors.response.use(async (response) => response, (error) => errorHandler(error));

function errorHandler(error: AxiosError) {
    if (error.response && error.response.status === 401) {
        notify({
            text: "Unauthorized access",
            type: 'error'
        });
        throw error;
    }

    let message;
    if (error.response && error.response.data) message = (error.response.data as { message: string; }).message;
    else message = error.message;

    notify({text: message, type: 'error'});
}

export default BaseService
