<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Pagamentos</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Gerencie e monitore todas as transações de pagamento
                </p>
            </div>
            <div class="mt-4 sm:mt-0">
                <button
                    @click="refreshData"
                    :disabled="isLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    <icon-refresh class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
                    Atualizar
                </button>
            </div>
        </div>

        <!-- Métricas Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Total de Transações -->
            <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-500/10 rounded-lg">
                        <icon-cash class="w-6 h-6 text-blue-500" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Transações</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ statistics.totalTransactions.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Total em Valor -->
            <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-green-500/10 rounded-lg">
                        <icon-trending-up class="w-6 h-6 text-green-500" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ formatCurrency(statistics.totalAmount) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Transações Pagas -->
            <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-emerald-500/10 rounded-lg">
                        <icon-check-circle class="w-6 h-6 text-emerald-500" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pagas</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ statistics.paidTransactions }}
                        </p>
                        <p class="text-sm text-emerald-600">
                            {{ formatCurrency(statistics.paidAmount) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Transações Pendentes -->
            <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-500/10 rounded-lg">
                        <icon-clock class="w-6 h-6 text-yellow-500" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ statistics.pendingTransactions }}
                        </p>
                        <p class="text-sm text-yellow-600">
                            {{ formatCurrency(statistics.pendingAmount) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráfico de Métodos de Pagamento -->
        <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Métodos de Pagamento
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div
                    v-for="(count, method) in statistics.paymentMethods"
                    :key="method"
                    class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ count }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {{ getPaymentMethodName(method) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white dark:bg-dark rounded-lg p-6 shadow">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Filtro de Status -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                    </label>
                    <select
                        v-model="filters.status"
                        @change="applyFilters"
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Todos</option>
                        <option value="paid">Pagos</option>
                        <option value="pending">Pendentes</option>
                        <option value="refused">Recusados</option>
                        <option value="cancelled">Cancelados</option>
                        <option value="processing">Processando</option>
                    </select>
                </div>

                <!-- Filtro de Método de Pagamento -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Método de Pagamento
                    </label>
                    <select
                        v-model="filters.paymentMethod"
                        @change="applyFilters"
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Todos</option>
                        <option value="credit_card">Cartão de Crédito</option>
                        <option value="debit_card">Cartão de Débito</option>
                        <option value="pix">PIX</option>
                        <option value="boleto">Boleto</option>
                        <option value="bank_transfer">Transferência</option>
                    </select>
                </div>

                <!-- Filtro de Data Inicial -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data Inicial
                    </label>
                    <input
                        type="date"
                        v-model="filters.startDate"
                        @change="applyFilters"
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    >
                </div>

                <!-- Filtro de Data Final -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data Final
                    </label>
                    <input
                        type="date"
                        v-model="filters.endDate"
                        @change="applyFilters"
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    >
                </div>
            </div>

            <!-- Ações de Filtro -->
            <div class="mt-4 flex space-x-3">
                <button
                    @click="clearFilters"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Limpar Filtros
                </button>
                <button
                    @click="exportTransactions"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                    Exportar CSV
                </button>
            </div>
        </div>

        <!-- Tabela de Transações -->
        <div class="bg-white dark:bg-dark rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Transações ({{ filteredTransactions.length }})
                </h3>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
                <icon-inbox class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nenhuma transação encontrada
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Tente ajustar os filtros ou aguarde por novas transações.
                </p>
            </div>

            <!-- Tabela -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Transação
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cliente
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Valor
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Método
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Data
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-dark divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                        v-for="transaction in paginatedTransactions"
                        :key="transaction.id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <!-- ID da Transação -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                #{{ transaction.transactionId || transaction.id?.substring(0, 8) }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {{ transaction.id }}
                            </div>
                        </td>

                        <!-- Cliente -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white">
                                {{ getCustomerName(transaction.customerId) }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                ID: {{ transaction.customerId }}
                            </div>
                        </td>

                        <!-- Valor -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ formatCurrency(transaction.amount || 0) }}
                            </div>
                        </td>

                        <!-- Método de Pagamento -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <component
                                    :is="getPaymentMethodIcon(transaction.paymentMethod)"
                                    class="w-4 h-4 mr-2"
                                    :class="getPaymentMethodColor(transaction.paymentMethod)"
                                />
                                <span class="text-sm text-gray-900 dark:text-white">
                                        {{ getPaymentMethodName(transaction.paymentMethod) }}
                                    </span>
                            </div>
                            <div v-if="transaction.cardLastFourDigits" class="text-xs text-gray-500 dark:text-gray-400">
                                **** {{ transaction.cardLastFourDigits }}
                            </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="getStatusColor(transaction.status)"
                                >
                                    {{ getStatusName(transaction.status) }}
                                </span>
                        </td>

                        <!-- Data -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ formatDate(transaction.createdAt) }}
                        </td>

                        <!-- Ações -->
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end space-x-2">
                                <button
                                    @click="viewTransaction(transaction)"
                                    class="text-primary hover:text-primary-dark"
                                    title="Ver detalhes"
                                >
                                    <icon-eye class="w-4 h-4" />
                                </button>
                                <button
                                    v-if="transaction.status === 'pending'"
                                    @click="markAsPaid(transaction.id!)"
                                    class="text-green-600 hover:text-green-900"
                                    title="Marcar como pago"
                                >
                                    <icon-check class="w-4 h-4" />
                                </button>
                                <button
                                    v-if="transaction.status === 'pending'"
                                    @click="markAsRefused(transaction.id!)"
                                    class="text-red-600 hover:text-red-900"
                                    title="Marcar como recusado"
                                >
                                    <icon-x class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginação -->
            <div class="bg-white dark:bg-dark px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Próximo
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando
                            <span class="font-medium">{{ startIndex + 1 }}</span>
                            até
                            <span class="font-medium">{{ Math.min(endIndex, filteredTransactions.length) }}</span>
                            de
                            <span class="font-medium">{{ filteredTransactions.length }}</span>
                            transações
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                @click="previousPage"
                                :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                <icon-chevron-left class="h-5 w-5" />
                            </button>
                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="goToPage(page)"
                                :class="[
                                    page === currentPage
                                        ? 'z-10 bg-primary border-primary text-white'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                                ]"
                            >
                                {{ page }}
                            </button>
                            <button
                                @click="nextPage"
                                :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                <icon-chevron-right class="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Detalhes da Transação -->
    <TransactionDetailModal
        v-if="selectedTransaction"
        :transaction="selectedTransaction"
        @close="selectedTransaction = null"
    />
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { PaymentGatewayTransaction } from '@/models/PaymentGatewayTransaction';
    import { PaymentGatewayTransactionService, TransactionStatistics } from '@/services/PaymentGatewayTransactionService';
    import { PaymentGatewayTransactionRepository } from '@/repositories/PaymentGatewayTransactionRepository';
    import CustomerService from '@/services/CustomerService'; // Assumindo que existe
    import { useAppStore } from '@/stores';
    import Swal from 'sweetalert2';

    // Importar ícones (ajuste conforme sua biblioteca de ícones)
    import IconRefresh from '@/components/icon/IconRefresh.vue';
    import IconCash from '@/components/icon/IconCash.vue';
    import IconTrendingUp from '@/components/icon/IconTrendingUp.vue';
    import IconCheckCircle from '@/components/icon/IconCheckCircle.vue';
    import IconClock from '@/components/icon/IconClock.vue';
    import IconInbox from '@/components/icon/IconInbox.vue';
    import IconEye from '@/components/icon/IconEye.vue';
    import IconCheck from '@/components/icon/IconCheck.vue';
    import IconX from '@/components/icon/IconX.vue';
    import IconChevronLeft from '@/components/icon/IconChevronLeft.vue';
    import IconChevronRight from '@/components/icon/IconChevronRight.vue';
    import IconCreditCard from '@/components/icon/IconCreditCard.vue';
    import IconQrCode from '@/components/icon/IconQrCode.vue';
    import IconFileText from '@/components/icon/IconFileText.vue';
    import IconBuildingBank from '@/components/icon/IconBuildingBank.vue';

    // Serviços
    const store = useAppStore();
    // Inicializar serviços (você precisará ajustar a conexão do banco conforme sua implementação)
    const paymentRepository = new PaymentGatewayTransactionRepository(/* sua conexão de banco */);
    const paymentService = new PaymentGatewayTransactionService(paymentRepository);

    // Estados reativas
    const isLoading = ref(false);
    const transactions = ref<PaymentGatewayTransaction[]>([]);
    const customers = ref<any[]>([]);
    const selectedTransaction = ref<PaymentGatewayTransaction | null>(null);

    // Paginação
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Filtros
    const filters = ref({
        status: '',
        paymentMethod: '',
        startDate: '',
        endDate: ''
    });

    // Estatísticas
    const statistics = ref<TransactionStatistics>({
        totalTransactions: 0,
        totalAmount: 0,
        paidTransactions: 0,
        paidAmount: 0,
        pendingTransactions: 0,
        pendingAmount: 0,
        refusedTransactions: 0,
        refusedAmount: 0,
        paymentMethods: {}
    });

    // Computed Properties
    const filteredTransactions = computed(() => {
        let filtered = [...transactions.value];

        if (filters.value.status) {
            filtered = filtered.filter(t => t.status === filters.value.status);
        }

        if (filters.value.paymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === filters.value.paymentMethod);
        }

        if (filters.value.startDate) {
            const startDate = new Date(filters.value.startDate);
            filtered = filtered.filter(t => t.createdAt && new Date(t.createdAt) >= startDate);
        }

        if (filters.value.endDate) {
            const endDate = new Date(filters.value.endDate);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => t.createdAt && new Date(t.createdAt) <= endDate);
        }

        return filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA; // Mais recentes primeiro
        });
    });

    const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value));

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
    const endIndex = computed(() => startIndex.value + itemsPerPage.value);

    const paginatedTransactions = computed(() =>
        filteredTransactions.value.slice(startIndex.value, endIndex.value)
    );

    const visiblePages = computed(() => {
        const pages: number[] = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(1, currentPage.value - half);
        let end = Math.min(totalPages.value, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    });

    // Métodos
    const loadData = async () => {
        isLoading.value = true;
        try {
            await Promise.all([
                loadTransactions(),
                loadCustomers(),
                loadStatistics()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire('Erro', 'Erro ao carregar transações', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    const loadTransactions = async () => {
        try {
            // Carregar todas as transações ou por empresa se o usuário pertencer a uma
            if (store.user?.companyId) {
                transactions.value = await paymentService.getCompanyTransactions(store.user.companyId);
            } else {
                // Se for admin geral, carrega todas
                transactions.value = await paymentRepository.findAll();
            }
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            throw error;
        }
    };

    const loadCustomers = async () => {
        try {
            // Carregar clientes (você precisa ajustar conforme seu CustomerService)
            if (typeof CustomerService !== 'undefined') {
                customers.value = await CustomerService.getAllCustomers();
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            // Não falha se não conseguir carregar clientes
        }
    };

    const loadStatistics = async () => {
        try {
            // Carregar estatísticas usando o serviço
            const companyId = store.user?.companyId;
            statistics.value = await paymentService.getTransactionStatistics(companyId);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            throw error;
        }
    };

    const calculateStatistics = () => {
        const stats = {
            totalTransactions: transactions.value.length,
            totalAmount: 0,
            paidTransactions: 0,
            paidAmount: 0,
            pendingTransactions: 0,
            pendingAmount: 0,
            refusedTransactions: 0,
            refusedAmount: 0,
            paymentMethods: {} as { [key: string]: number }
        };

        transactions.value.forEach(transaction => {
            const amount = transaction.amount || 0;
            stats.totalAmount += amount;

            switch (transaction.status) {
                case 'paid':
                    stats.paidTransactions++;
                    stats.paidAmount += amount;
                    break;
                case 'pending':
                    stats.pendingTransactions++;
                    stats.pendingAmount += amount;
                    break;
                case 'refused':
                    stats.refusedTransactions++;
                    stats.refusedAmount += amount;
                    break;
            }

            const method = transaction.paymentMethod || 'unknown';
            stats.paymentMethods[method] = (stats.paymentMethods[method] || 0) + 1;
        });

        statistics.value = stats;
    };

    const refreshData = () => {
        loadData();
    };

    const applyFilters = () => {
        currentPage.value = 1;
    };

    const clearFilters = () => {
        filters.value = {
            status: '',
            paymentMethod: '',
            startDate: '',
            endDate: ''
        };
        currentPage.value = 1;
    };

    const exportTransactions = () => {
        const csvData = filteredTransactions.value.map(transaction => ({
            'ID': transaction.id,
            'Transaction ID': transaction.transactionId,
            'Cliente': getCustomerName(transaction.customerId),
            'Valor': formatCurrency(transaction.amount || 0),
            'Método': getPaymentMethodName(transaction.paymentMethod),
            'Status': getStatusName(transaction.status),
            'Data': formatDate(transaction.createdAt)
        }));

        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const viewTransaction = (transaction: PaymentGatewayTransaction) => {
        selectedTransaction.value = transaction;
    };

    const markAsPaid = async (transactionId: string) => {
        try {
            const result = await Swal.fire({
                title: 'Confirmar Pagamento',
                text: 'Tem certeza que deseja marcar esta transação como paga?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sim, marcar como paga',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                // Usar o serviço real para marcar como paga
                await paymentService.markTransactionAsPaid(transactionId);

                // Recarregar dados após atualização
                await loadData();

                Swal.fire('Sucesso!', 'Transação marcada como paga.', 'success');
            }
        } catch (error) {
            console.error('Erro ao marcar como pago:', error);
            Swal.fire('Erro', 'Erro ao atualizar status da transação', 'error');
        }
    };

    const markAsRefused = async (transactionId: string) => {
        try {
            const result = await Swal.fire({
                title: 'Recusar Transação',
                text: 'Tem certeza que deseja marcar esta transação como recusada?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sim, recusar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                // Usar o serviço real para marcar como recusada
                await paymentService.markTransactionAsRefused(transactionId);

                // Recarregar dados após atualização
                await loadData();

                Swal.fire('Sucesso!', 'Transação marcada como recusada.', 'success');
            }
        } catch (error) {
            console.error('Erro ao marcar como recusado:', error);
            Swal.fire('Erro', 'Erro ao atualizar status da transação', 'error');
        }
    };

    // Paginação
    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const goToPage = (page: number) => {
        currentPage.value = page;
    };

    // Funções de formatação
    const formatCurrency = (value: number): string => {
        return paymentService.formatAmount(value, true); // true indica que o valor está em centavos
    };

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '-';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const getCustomerName = (customerId: string | undefined): string => {
        if (!customerId) return '-';
        const customer = customers.value.find(c => c.id === customerId);
        return customer?.name || 'Cliente não encontrado';
    };

    const getPaymentMethodName = (method: string | undefined): string => {
        const methods: { [key: string]: string } = {
            'credit_card': 'Cartão de Crédito',
            'debit_card': 'Cartão de Débito',
            'pix': 'PIX',
            'boleto': 'Boleto',
            'bank_transfer': 'Transferência',
            'unknown': 'Desconhecido'
        };
        return methods[method || 'unknown'] || method || 'Desconhecido';
    };

    const getPaymentMethodIcon = (method: string | undefined): string => {
        const icons: { [key: string]: string } = {
            'credit_card': 'IconCreditCard',
            'debit_card': 'IconCreditCard',
            'pix': 'IconQrCode',
            'boleto': 'IconFileText',
            'bank_transfer': 'IconBuildingBank'
        };
        return icons[method || 'unknown'] || 'IconCreditCard';
    };

    const getPaymentMethodColor = (method: string | undefined): string => {
        const colors: { [key: string]: string } = {
            'credit_card': 'text-blue-500',
            'debit_card': 'text-purple-500',
            'pix': 'text-green-500',
            'boleto': 'text-yellow-500',
            'bank_transfer': 'text-gray-500'
        };
        return colors[method || 'unknown'] || 'text-gray-500';
    };

    const getStatusName = (status: string | undefined): string => {
        const statuses: { [key: string]: string } = {
            'paid': 'Pago',
            'pending': 'Pendente',
            'refused': 'Recusado',
            'cancelled': 'Cancelado',
            'processing': 'Processando'
        };
        return statuses[status || 'unknown'] || status || 'Desconhecido';
    };

    const getStatusColor = (status: string | undefined): string => {
        const colors: { [key: string]: string } = {
            'paid': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
            'refused': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
            'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
            'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
        };
        return colors[status || 'unknown'] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    };

    // Lifecycle
    onMounted(() => {
        loadData();
    });
</script>
