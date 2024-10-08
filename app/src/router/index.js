import Vue from 'vue';
import Router from 'vue-router';
import ApplicationsList from '@/components/ApplicationsList.vue';
import UserLogin from '@/components/UserLogin.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'ApplicationsList',
            component: ApplicationsList,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'UserLogin',
            component: UserLogin
        }
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next({ name: 'UserLogin' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
