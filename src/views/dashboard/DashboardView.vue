<template>
    <div class="dashboard-container">
        <!-- Header Section -->
        <div class="mb-6">
            <h1 class="text-3xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('dashboard') }}</h1>
            <p class="text-gray-600 dark:text-gray-400">Visão geral do sistema e métricas principais</p>
        </div>

        <!-- Stats Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total de Empresas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Empresas</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalCompanies }}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-green-600 text-sm font-medium">{{ stats.activeCompanies }} ativas</span>
                        </div>
                    </div>
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <IconBuilding class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </div>

            <!-- Total de Clientes -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Clientes</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalCustomers }}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-green-600 text-sm font-medium">{{ stats.activeCustomers }} com plano ativo</span>
                        </div>
                    </div>
                    <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <IconUser class="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </div>

            <!-- Receita Total -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">R$ {{ formatCurrency(stats.totalRevenue) }}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-purple-600 text-sm font-medium">R$ {{ formatCurrency(stats.monthlyRevenue) }} mensal</span>
                        </div>
                    </div>
                    <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <IconDollarSign class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </div>

            <!-- Transações -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Transações</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTransactions }}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-yellow-600 text-sm font-medium">{{ stats.pendingTransactions }} pendentes</span>
                        </div>
                    </div>
                    <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <IconBarChart class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Revenue Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Receita Mensal por Empresa</h3>
                    <button @click="refreshData" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        <IconRefresh class="w-4 h-4" />
                    </button>
                </div>
                <div class="h-64">
                    <LineChart
                        :width="600"
                        :height="250"
                        :data="revenueChartData"
                        :margin="{ top: 5, right: 30, left: 20, bottom: 5 }"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
<!--                        <Tooltip formatter="(value) => ['R$ ' + formatCurrency(value), 'Receita']" />-->
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </div>
            </div>

            <!-- Payment Status Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status de Pagamentos</h3>
                <div class="h-64 flex items-center justify-center">
                    <PieChart :width="300" :height="250">
                        <Pie
                            :data="paymentStatusData"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            <Cell v-for="(entry, index) in paymentStatusData" :key="`cell-${index}`" :fill="entry.color" />
                        </Pie>
<!--                        <Tooltip formatter="(value) => [value + '%', 'Percentual']" />-->
                    </PieChart>
                </div>
                <div class="mt-4 space-y-2">
                    <div v-for="item in paymentStatusData" :key="item.name" class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }"></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.name }}</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.value }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Companies and Customers Distribution -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Top Companies -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top 5 Empresas</h3>
                    <router-link to="/company/list" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Ver todas
                    </router-link>
                </div>
                <div class="space-y-4">
                    <div v-for="(company, index) in topCompanies" :key="company.id" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mr-3">
                                {{ index + 1 }}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ company.name || 'Nome não informado' }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ stats.value.totalCustomers || 0 }} clientes</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">R$ {{ formatCurrency(company.monthlyValue || 0) }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">mensal</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Growth -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métodos de Pagamento</h3>
                <div class="h-64">
                    <BarChart
                        :width="400"
                        :height="250"
                        :data="paymentMethodsData"
                        :margin="{ top: 20, right: 30, left: 20, bottom: 5 }"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="method" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                </div>
            </div>
        </div>

        <!-- Recent Activity & Quick Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Transactions -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h3>
                    <router-link to="/pagamentos" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Ver todas
                    </router-link>
                </div>
                <div class="space-y-4">
                    <div v-if="recentTransactions.length === 0" class="text-center py-8">
                        <p class="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada</p>
                    </div>
                    <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full mr-3" :class="getTransactionStatusClass(transaction.status)">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="transaction.status === 'paid'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    <path v-else-if="transaction.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.transactionId || 'ID não informado' }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(transaction.createdAt) }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">R$ {{ formatCurrency(transaction.amount || 0) }}</p>
                            <span class="text-xs px-2 py-1 rounded-full" :class="getStatusBadgeClass(transaction.status)">
                                {{ getStatusText(transaction.status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
                <div class="space-y-3">
                    <router-link to="/company/add" class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                            <IconPlus class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Nova Empresa</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Cadastrar empresa</p>
                        </div>
                    </router-link>

                    <router-link to="/customers" class="flex items-center p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group">
                        <div class="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                            <IconUser class="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Ver Clientes</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Gerenciar clientes</p>
                        </div>
                    </router-link>

                    <router-link to="/informativos/criar" class="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group">
                        <div class="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                            <IconEdit class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Novo Informativo</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Criar informativo</p>
                        </div>
                    </router-link>

                    <button @click="refreshData" class="flex items-center w-full p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                        <div class="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                            <IconRefresh class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Atualizar Dados</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Recarregar dashboard</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <div class="animate-spin border-4 border-blue-600 border-l-transparent rounded-full w-8 h-8 mx-auto mb-3"></div>
                <p class="text-gray-900 dark:text-white">Carregando dashboard...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useI18n } from 'vue-i18n';

    // Recharts components
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

    // Services
    import CompanyService from '@/services/CompanyService';
    import CustomerService from '@/services/CustomerService';
    import { PaymentGatewayTransactionService } from '@/services/PaymentGatewayTransactionService';

    // Models
    import { CompanyModel } from '@/models/CompanyModel';
    import { CustomerModel } from '@/models/CustomerModel';
    import { PaymentGatewayTransaction } from '@/models/PaymentGatewayTransaction';

    // Icons
    import IconUser from '@/components/icon/icon-user.vue';
    import IconBuilding from '@/components/icon/icon-building.vue';
    import IconDollarSign from '@/components/icon/icon-dollar-sign.vue';
    import IconBarChart from '@/components/icon/icon-bar-chart.vue';
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconRefresh from '@/components/icon/icon-refresh.vue';

    const { t } = useI18n();

    // State
    const isLoading = ref(true);

    // Dashboard stats
    const stats = ref({
        totalCompanies: 0,
        activeCompanies: 0,
        totalCustomers: 0,
        activeCustomers: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalTransactions: 0,
        pendingTransactions: 0
    });

    // Data arrays
    const topCompanies = ref<CompanyModel[]>([]);
    const recentTransactions = ref<PaymentGatewayTransaction[]>([]);
    const companies = ref<CompanyModel[]>([]);
    const customers = ref<CustomerModel[]>([]);

    // Chart data
    const revenueChartData = ref<Array<{name: string, revenue: number}>>([]);
    const paymentStatusData = ref<Array<{name: string, value: number, color: string}>>([]);
    const paymentMethodsData = ref<Array<{method: string, count: number}>>([]);

    // Services
    const paymentService = new PaymentGatewayTransactionService();

    // Methods
    const formatCurrency = (value: number) => {
        if (!value && value !== 0) return '0,00';
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'Data não informada';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const getTransactionStatusClass = (status: string | undefined) => {
        switch (status) {
            case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
            case 'refused': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
        }
    };

    const getStatusBadgeClass = (status: string | undefined) => {
        switch (status) {
            case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            case 'refused': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'pending': return 'Pendente';
            case 'refused': return 'Recusado';
            default: return 'Desconhecido';
        }
    };

    const loadDashboardData = async () => {
        isLoading.value = true;

        try {
            // Carregar dados das empresas
            await loadCompaniesData();

            // Carregar dados dos clientes
            await loadCustomersData();

            // Carregar dados das transações
            await loadTransactionsData();

            // Processar dados para gráficos
            await processChartData();

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const loadCompaniesData = async () => {
        try {
            const companiesData = await CompanyService.getAllCompanies();
            companies.value = companiesData;

            stats.value.totalCompanies = companiesData.length;
            stats.value.activeCompanies = companiesData.filter(c => c.isActive !== false).length;

            // Calcular receita mensal total
            stats.value.monthlyRevenue = companiesData.reduce((total, company) => {
                return total + (company.monthlyValue || 0);
            }, 0);

            // Top 5 empresas por valor mensal
            topCompanies.value = companiesData
                .filter(c => c.monthlyValue && c.monthlyValue > 0)
                .sort((a, b) => (b.monthlyValue || 0) - (a.monthlyValue || 0))
                .slice(0, 5);

        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
        }
    };

    const loadCustomersData = async () => {
        try {
            const customersData = await CustomerService.getAllCustomers();
            customers.value = customersData;

            stats.value.totalCustomers = customersData.length;
            stats.value.activeCustomers = customersData.filter(c => c.isPlanoAtivo).length;

            // Contar clientes por empresa para o topCompanies
            topCompanies.value.forEach(company => {
                stats.value.totalCustomers = customersData.filter(c => c.companyId === company.id).length;
            });

        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    };

    const loadTransactionsData = async () => {
        try {
            // Carregar estatísticas de transações
            const transactionStats = await paymentService.getTransactionStatistics();

            stats.value.totalTransactions = transactionStats.total || 0;
            stats.value.pendingTransactions = transactionStats.pending || 0;
            stats.value.totalRevenue = (transactionStats.totalAmount || 0) / 100; // Converter de centavos

            // Carregar transações recentes (últimas 5)
            const allTransactions = await paymentService.getAllTransactions(5);
            recentTransactions.value = allTransactions;

            // Dados para gráfico de status de pagamentos
            const totalTx = transactionStats.total || 1; // Evitar divisão por zero
            paymentStatusData.value = [
                {
                    name: 'Pagos',
                    value: Math.round(((transactionStats.paid || 0) / totalTx) * 100),
                    color: '#10b981'
                },
                {
                    name: 'Pendentes',
                    value: Math.round(((transactionStats.pending || 0) / totalTx) * 100),
                    color: '#f59e0b'
                },
                {
                    name: 'Recusados',
                    value: Math.round(((transactionStats.refused || 0) / totalTx) * 100),
                    color: '#ef4444'
                }
            ];

            // Carregar estatísticas por método de pagamento
            const paymentMethods = await paymentService.getPaymentMethodStatistics();
            paymentMethodsData.value = paymentMethods.map(pm => ({
                method: pm.paymentMethod === 'credit_card' ? 'Cartão' :
                    pm.paymentMethod === 'pix' ? 'PIX' :
                        pm.paymentMethod === 'boleto' ? 'Boleto' : pm.paymentMethod,
                count: pm.count
            }));

        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    };

    const processChartData = () => {
        // Processar dados de receita por empresa para o gráfico
        revenueChartData.value = topCompanies.value.map(company => ({
            name: company.name?.substring(0, 10) + '...' || 'Nome não informado',
            revenue: company.monthlyValue || 0
        }));
    };

    const refreshData = async () => {
        await loadDashboardData();
    };

    // Lifecycle
    onMounted(async () => {
        await loadDashboardData();
    });
</script>

<style scoped>
    .dashboard-container {
        padding: 24px;
        min-height: 100vh;
        background-color: #f9fafb;
    }

    .dark .dashboard-container {
        background-color: #111827;
    }

    /* Responsividade adicional */
    @media (max-width: 768px) {
        .dashboard-container {
            padding: 16px;
        }

        .grid {
            gap: 16px;
        }
    }

    /* Animações suaves para os cards */
    .hover-card {
        transition: all 0.3s ease;
    }

    .hover-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dark .hover-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* Loading animation */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    /* Smooth transitions for icons */
    .group:hover .group-hover\:scale-110 {
        transform: scale(1.1);
    }

    /* Chart container styling */
    .recharts-wrapper {
        font-family: inherit;
    }

    /* Custom scrollbar for transaction list */
    .space-y-4::-webkit-scrollbar {
        width: 4px;
    }

    .space-y-4::-webkit-scrollbar-track {
        background: transparent;
    }

    .space-y-4::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 2px;
    }

    .dark .space-y-4::-webkit-scrollbar-thumb {
        background: #4a5568;
    }
</style>
