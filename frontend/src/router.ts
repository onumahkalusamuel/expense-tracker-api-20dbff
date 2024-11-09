import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import LoginPage from "./views/LoginPage.vue";
import RegisterPage from "./views/RegisterPage.vue";
import AppLayout from "./layouts/AppLayout.vue";
import DashboardPage from "./views/app/DashboardPage.vue";
import ViewExpensePage from "./views/app/ViewExpensePage.vue";
import AddExpensePage from "./views/app/AddExpensePage.vue";

const routes: RouteRecordRaw[] = [
    {path: '/', component: LoginPage, name: 'login'},
    {path: '/register', component: RegisterPage, name: 'register'},
    {
        path: '/app',
        component: AppLayout,
        children: [
            {path: '', component: DashboardPage, name: 'dashboard'},
            {path: '/expenses', component: AddExpensePage, name: 'add-expense'},
            {path: '/expenses/:id', component: ViewExpensePage, name: 'view-expense'},
        ],
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
