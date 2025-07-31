// src/router/index.ts - Rotas atualizadas com sistema completo de informativos

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appSetting from '@/app-setting';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import EmpresaListView from '@/views/empresa/EmpresaListView.vue';
import { useAppStore } from '@/stores';
import EmpresaAddView from '@/views/empresa/EmpresaAddView.vue';
import EmpresaViewView from '@/views/empresa/EmpresaViewView.vue';
import PaymentsListView from '@/views/pagamento/PaymentsListView.vue';
import InformativoListView from '@/views/informativo/InformativoListView.vue';
import InformativoCreateView from '@/views/informativo/InformativoCreateView.vue';
import InformativoDetailsView from '@/views/informativo/InformativoDetailsView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/company/list', name: 'companyList', component: EmpresaListView, meta: { requiresAuth: true } },
    { path: '/company/add', name: 'companyAdd', component: EmpresaAddView, meta: { requiresAuth: true } },
    { path: '/company/:id', name: 'companyEdit', component: EmpresaAddView, meta: { requiresAuth: true } },
    { path: '/company/view/:id', name: 'companyView', component: EmpresaViewView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView, meta: { layout: 'auth' } },

    { path: '/pagamentos', name: 'pagamentosView', component: PaymentsListView, meta: { requiresAuth: true } },
    {
        path: '/informativos',
        children: [
            {
                path: '',
                name: 'informativos-list',
                component: InformativoListView,
                meta: {
                    title: 'Lista de Informativos',
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Dashboard', path: '/' },
                        { name: 'Informativos', path: '/informativos' }
                    ]
                },
            },
            {
                path: 'criar',
                name: 'informativos-create',
                component: InformativoCreateView,
                meta: {
                    title: 'Criar Informativo',
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Dashboard', path: '/' },
                        { name: 'Informativos', path: '/informativos' },
                        { name: 'Criar', path: '/informativos/criar' }
                    ]
                },
            },
            {
                path: ':id',
                name: 'informativos-view',
                component: InformativoDetailsView,
                meta: {
                    title: 'Visualizar Informativo',
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Dashboard', path: '/' },
                        { name: 'Informativos', path: '/informativos' },
                        { name: 'Visualizar', path: '/informativos/:id' }
                    ]
                },
            },
            {
                path: ':id/editar',
                name: 'informativos-edit',
                component: InformativoCreateView,
                meta: {
                    title: 'Editar Informativo',
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Dashboard', path: '/' },
                        { name: 'Informativos', path: '/informativos' },
                        { name: 'Editar', path: '/informativos/:id/editar' }
                    ]
                },
            },
            // {
            //     path: 'relatorios',
            //     name: 'informativos-reports',
            //     component: InformativoReportsView,
            //     meta: {
            //         title: 'Relatórios de Informativos',
            //         requiresAuth: true,
            //         breadcrumb: [
            //             { name: 'Dashboard', path: '/' },
            //             { name: 'Informativos', path: '/informativos' },
            //             { name: 'Relatórios', path: '/informativos/relatorios' }
            //         ]
            //     },
            // },
            // {
            //     path: 'busca-avancada',
            //     name: 'informativos-advanced-search',
            //     component: () => import('@/views/informativo/InformativoAdvancedSearchView.vue'),
            //     meta: {
            //         title: 'Busca Avançada',
            //         requiresAuth: true,
            //         breadcrumb: [
            //             { name: 'Dashboard', path: '/' },
            //             { name: 'Informativos', path: '/informativos' },
            //             { name: 'Busca Avançada', path: '/informativos/busca-avancada' }
            //         ]
            //     },
            // }
        ]
    },

    // =================== ROTAS DE CUSTOMERS ===================
    {
        path: '/customers',
        children: [
            {
                path: '',
                name: 'customers-list',
                component: () => import('@/views/customer/CustomerListView.vue'),
                meta: { title: 'Lista de Clientes', requiresAuth: true },
            },
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

    // Set page title
    if (to.meta.title) {
        document.title = `${to.meta.title} - Guardião Jus`;
    } else {
        document.title = 'Guardião Jus';
    }
});

router.afterEach(() => {
    appSetting.changeAnimation();
});

export default router;
