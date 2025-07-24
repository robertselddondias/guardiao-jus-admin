import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appSetting from '@/app-setting';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import EmpresaListView from '@/views/empresa/EmpresaListView.vue';
import { useAppStore } from '@/stores';
import EmpresaAddView from '@/views/empresa/EmpresaAddView.vue';
import EmpresaViewView from '@/views/empresa/EmpresaViewView.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/company/list', name: 'companyList', component: EmpresaListView, meta: { requiresAuth: true } },
    { path: '/company/add', name: 'companyAdd', component: EmpresaAddView, meta: { requiresAuth: true } },
    { path: '/company/:id', name: 'companyEdit', component: EmpresaAddView, meta: { requiresAuth: true } },
    { path: '/company/view/:id', name: 'companyView', component: EmpresaViewView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView, meta: { layout: 'auth' } },
    {
        path: '/customers',
        children: [
            {
                path: '',
                name: 'customers-list',
                component: () => import('@/views/customer/CustomerListView.vue'),
                meta: { title: 'Lista de Clientes', requiresAuth: true },
            },
            // {
            //     path: 'add',
            //     name: 'customers-add',
            //     component: () => import('@/views/customer/CustomerAddView.vue'),
            //     meta: { title: 'Adicionar Cliente', requiresAuth: true },
            // },
            // {
            //     path: 'edit/:id',
            //     name: 'customers-edit',
            //     component: () => import('@/views/customer/CustomerEditView.vue'),
            //     meta: { title: 'Editar Cliente', requiresAuth: true },
            // },
            {
                path: 'view/:id',
                name: 'customers-view',
                component: () => import('@/views/customer/CustomerViewView.vue'),
                meta: { title: 'Visualizar Cliente', requiresAuth: true },
            }
        ]
    }
];


const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { left: 0, top: 0 };
        }
    },
});

router.beforeEach((to, from, next) => {
    const store = useAppStore();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        console.info(`ENTROU ${JSON.stringify(to.meta)}`);
        if (to.meta.requiresAuth && !user) {
            console.info(`ENTROU LOGIN`);
            next('/login');
        } else {
            next();
        }
    });

    if (to.meta.layout === 'auth') {
        store.setMainLayout('auth');
    } else {
        store.setMainLayout('app');
    }
});

router.afterEach(() => {
    appSetting.changeAnimation();
});

export default router;
