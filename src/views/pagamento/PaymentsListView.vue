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
            <div class="mt-4 sm:mt-0 flex gap-3">
                <button
                    @click="refreshData"
                    :disabled="isLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    <icon-refresh class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
                    Atualizar
                </button>
                <button
                    @click="exportTransactions"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <icon-download class="w-4 h-4 mr-2" />
                    Exportar
                </button>
            </div>
        </div>

        <!-- Métricas Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Total de Transações -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-500/10 rounded-lg">
                        <icon-cash-banknotes class="w-6 h-6 text-blue-500" />
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
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
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
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-emerald-500/10 rounded-lg">
                        <icon-circle-check class="w-6 h-6 text-emerald-500" />
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
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
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
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Métodos de Pagamento
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div
                    v-for="(count, method) in statistics.paymentMethods"
                    :key="method"
                    class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                    <div class="flex justify-center mb-2">
                        <component :is="getPaymentMethodIcon(method)" class="w-8 h-8 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ count }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {{ getPaymentMethodName(method) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
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
                        <option value="refunded">Estornados</option>
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
                    />
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
                    />
                </div>
            </div>

            <!-- Ações de Filtro -->
            <div class="mt-4 flex flex-wrap gap-3">
                <button
                    @click="clearFilters"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Limpar Filtros
                </button>

                <!-- Busca rápida -->
                <div class="flex-1 max-w-md">
                    <input
                        type="text"
                        v-model="searchQuery"
                        @input="applyFilters"
                        placeholder="Buscar por ID, valor, cliente..."
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>
        </div>

        <!-- Tabela de Transações -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Transações ({{ paginatedTransactions.length }} de {{ filteredTransactions.length }})
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
                    <thead class="bg-gray-50 dark:bg-gray-900">
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
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                        v-for="transaction in paginatedTransactions"
                        :key="transaction.id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <!-- ID da Transação -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-col">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    #{{ transaction.transactionId || transaction.id?.slice(-8) }}
                                </div>
                                <div v-if="transaction.contractId" class="text-xs text-gray-500 dark:text-gray-400">
                                    Contrato: {{ transaction.contractId }}
                                </div>
                            </div>
                        </td>

                        <!-- Cliente -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-col">
                                <div class="text-sm text-gray-900 dark:text-white">
                                    {{ getCustomerName(transaction.customerId) }}
                                </div>
                                <div v-if="transaction.userId" class="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {{ transaction.userId }}
                                </div>
                            </div>
                        </td>

                        <!-- Valor -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ formatCurrency(transaction.amount) }}
                            </div>
                        </td>

                        <!-- Método de Pagamento -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <component
                                    :is="getPaymentMethodIcon(transaction.paymentMethod)"
                                    class="w-5 h-5 mr-2 text-gray-500"
                                />
                                <div class="flex flex-col">
                                        <span class="text-sm text-gray-900 dark:text-white">
                                            {{ getPaymentMethodName(transaction.paymentMethod) }}
                                        </span>
                                    <span v-if="transaction.cardBrand" class="text-xs text-gray-500 dark:text-gray-400">
                                            {{ transaction.cardBrand }} ****{{ transaction.cardLastFourDigits }}
                                        </span>
                                </div>
                            </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusBadgeClass(transaction.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    <component :is="getStatusIcon(transaction.status)" class="w-3 h-3 mr-1" />
                                    {{ getStatusText(transaction.status) }}
                                </span>
                        </td>

                        <!-- Data -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div class="flex flex-col">
                                <span>{{ formatDate(transaction.createdAt) }}</span>
                                <span class="text-xs">{{ formatTime(transaction.createdAt) }}</span>
                            </div>
                        </td>

                        <!-- Ações -->
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end space-x-2">
                                <button
                                    @click="viewTransaction(transaction)"
                                    class="text-primary hover:text-primary-dark"
                                    title="Visualizar"
                                >
                                    <icon-eye class="w-4 h-4" />
                                </button>

                                <button
                                    v-if="transaction.status === 'pending'"
                                    @click="markAsPaid(transaction.id!)"
                                    class="text-green-600 hover:text-green-800"
                                    title="Marcar como Pago"
                                >
                                    <icon-check class="w-4 h-4" />
                                </button>

                                <button
                                    v-if="transaction.status === 'pending'"
                                    @click="markAsRefused(transaction.id!)"
                                    class="text-red-600 hover:text-red-800"
                                    title="Marcar como Recusado"
                                >
                                    <icon-x class="w-4 h-4" />
                                </button>

                                <button
                                    v-if="transaction.status === 'paid'"
                                    @click="processRefund(transaction)"
                                    class="text-orange-600 hover:text-orange-800"
                                    title="Processar Estorno"
                                >
                                    <icon-refresh-ccw class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginação -->
            <div v-if="filteredTransactions.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div class="flex items-center justify-between">
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
                                <span class="font-medium">{{ startItem }}</span>
                                a
                                <span class="font-medium">{{ endItem }}</span>
                                de
                                <span class="font-medium">{{ filteredTransactions.length }}</span>
                                resultados
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    @click="previousPage"
                                    :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    <icon-chevron-left class="w-5 h-5" />
                                </button>

                                <button
                                    v-for="page in visiblePages"
                                    :key="page"
                                    @click="goToPage(page)"
                                    :class="[
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                        page === currentPage
                                            ? 'z-10 bg-primary border-primary text-white'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    ]"
                                >
                                    {{ page }}
                                </button>

                                <button
                                    @click="nextPage"
                                    :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    <icon-chevron-right class="w-5 h-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Detalhes da Transação -->
        <div v-if="selectedTransaction" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="selectedTransaction = null"></div>

                <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    Detalhes da Transação
                                </h3>
                                <div class="mt-4 space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.id }}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.transactionId }}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Valor</label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{ formatCurrency(selectedTransaction.amount) }}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                            <span :class="getStatusBadgeClass(selectedTransaction.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {{ getStatusText(selectedTransaction.status) }}
                                            </span>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Método</label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{ getPaymentMethodName(selectedTransaction.paymentMethod) }}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Data</label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedTransaction.createdAt) }}</p>
                                        </div>
                                    </div>

                                    <div v-if="selectedTransaction.cardBrand" class="pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Cartão</label>
                                        <p class="text-sm text-gray-900 dark:text-white">
                                            {{ selectedTransaction.cardBrand }} ****{{ selectedTransaction.cardLastFourDigits }}
                                        </p>
                                    </div>

                                    <div v-if="selectedTransaction.pixQrCodeUrl" class="pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">PIX QR Code</label>
                                        <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.pixQrCodeUrl }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            @click="selectedTransaction = null"
                            type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useAppStore } from '@/stores';
    import { PaymentGatewayTransaction, PaymentGatewayTransactionModel } from '@/models/PaymentGatewayTransaction';
    import { PaymentGatewayTransactionRepository } from '@/repositories/PaymentGatewayTransactionRepository';
    import { PaymentGatewayTransactionService } from '@/services/PaymentGatewayTransactionService';

    // Importar ícones baseados na estrutura existente
    import IconRefresh from '@/components/icon/icon-refresh.vue';
    import IconDownload from '@/components/icon/icon-download.vue';
    import IconCashBanknotes from '@/components/icon/icon-cash-banknotes.vue';
    import IconTrendingUp from '@/components/icon/icon-trending-up.vue';
    import IconCircleCheck from '@/components/icon/icon-circle-check.vue';
    import IconClock from '@/components/icon/icon-clock.vue';
    import IconInbox from '@/components/icon/icon-inbox.vue';
    import IconEye from '@/components/icon/icon-eye.vue';
    import IconCheck from '@/components/icon/icon-check.vue';
    import IconX from '@/components/icon/icon-x.vue';
    import IconChevronLeft from '@/components/icon/icon-chevron-left.vue';
    import IconChevronRight from '@/components/icon/icon-chevron-right.vue';
    import IconCreditCard from '@/components/icon/icon-credit-card.vue';
    import IconQrCode from '@/components/icon/icon-qr-code.vue';
    import IconDocument from '@/components/icon/icon-document.vue';
    import IconBuilding from '@/components/icon/icon-building.vue';
    import IconRefreshCcw from '@/components/icon/icon-refresh-ccw.vue';

    // Interfaces para tipagem
    interface TransactionStatistics {
        totalTransactions: number;
        totalAmount: number;
        paidTransactions: number;
        paidAmount: number;
        pendingTransactions: number;
        pendingAmount: number;
        refusedTransactions: number;
        refusedAmount: number;
        paymentMethods: { [key: string]: number };
    }

    // Serviços
    const store = useAppStore();
    const paymentRepository = new PaymentGatewayTransactionRepository();
    const paymentService = new PaymentGatewayTransactionService(paymentRepository);

    // Estados reativos
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

    const searchQuery = ref('');

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

        // Filtro por status
        if (filters.value.status) {
            filtered = filtered.filter(t => t.status === filters.value.status);
        }

        // Filtro por método de pagamento
        if (filters.value.paymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === filters.value.paymentMethod);
        }

        // Filtro por data
        if (filters.value.startDate) {
            const startDate = new Date(filters.value.startDate);
            filtered = filtered.filter(t => t.createdAt && new Date(t.createdAt) >= startDate);
        }

        if (filters.value.endDate) {
            const endDate = new Date(filters.value.endDate);
            endDate.setHours(23, 59, 59, 999); // Fim do dia
            filtered = filtered.filter(t => t.createdAt && new Date(t.createdAt) <= endDate);
        }

        // Busca por texto
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            filtered = filtered.filter(t =>
                t.id?.toLowerCase().includes(query) ||
                t.transactionId?.toLowerCase().includes(query) ||
                t.amount?.toString().includes(query) ||
                t.customerId?.toLowerCase().includes(query) ||
                t.userId?.toLowerCase().includes(query)
            );
        }

        return filtered;
    });

    const paginatedTransactions = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredTransactions.value.slice(start, end);
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
    });

    const startItem = computed(() => {
        return (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const endItem = computed(() => {
        const end = currentPage.value * itemsPerPage.value;
        return Math.min(end, filteredTransactions.value.length);
    });

    const visiblePages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const pages = [];

        let start = Math.max(1, current - 2);
        let end = Math.min(total, current + 2);

        if (end - start < 4) {
            if (start === 1) {
                end = Math.min(total, 5);
            } else {
                start = Math.max(1, end - 4);
            }
        }

        for (let i: number = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    });

    // Métodos
    const loadTransactions = async () => {
        isLoading.value = true;
        try {
            const data = await paymentService.getAllTransactions(1000);
            transactions.value = data;
            calculateStatistics();
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            // Adicionar notificação de erro aqui
        } finally {
            isLoading.value = false;
        }
    };

    const calculateStatistics = () => {
        const stats: TransactionStatistics = {
            totalTransactions: transactions.value.length,
            totalAmount: 0,
            paidTransactions: 0,
            paidAmount: 0,
            pendingTransactions: 0,
            pendingAmount: 0,
            refusedTransactions: 0,
            refusedAmount: 0,
            paymentMethods: {}
        };

        transactions.value.forEach(transaction => {
            const amount = transaction.amount || 0;
            stats.totalAmount += amount;

            // Estatísticas por status
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

            // Estatísticas por método de pagamento
            const method = transaction.paymentMethod || 'unknown';
            stats.paymentMethods[method] = (stats.paymentMethods[method] || 0) + 1;
        });

        statistics.value = stats;
    };

    const refreshData = async () => {
        await loadTransactions();
    };

    const applyFilters = () => {
        currentPage.value = 1; // Reset para primeira página
    };

    const clearFilters = () => {
        filters.value = {
            status: '',
            paymentMethod: '',
            startDate: '',
            endDate: ''
        };
        searchQuery.value = '';
        currentPage.value = 1;
    };

    const exportTransactions = () => {
        const csvData = filteredTransactions.value.map(t => ({
            ID: t.id,
            TransactionID: t.transactionId,
            Amount: t.amount,
            Status: t.status,
            PaymentMethod: t.paymentMethod,
            CreatedAt: t.createdAt?.toISOString(),
            CustomerID: t.customerId,
            UserID: t.userId
        }));

        const csv = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Métodos de paginação
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

    // Métodos de ação
    const viewTransaction = (transaction: PaymentGatewayTransaction) => {
        selectedTransaction.value = transaction;
    };

    const markAsPaid = async (transactionId: string) => {
        try {
            await paymentService.markTransactionAsPaid(transactionId);
            await refreshData();
            // Adicionar notificação de sucesso
        } catch (error) {
            console.error('Erro ao marcar como pago:', error);
            // Adicionar notificação de erro
        }
    };

    const markAsRefused = async (transactionId: string) => {
        try {
            await paymentService.markTransactionAsRefused(transactionId);
            await refreshData();
            // Adicionar notificação de sucesso
        } catch (error) {
            console.error('Erro ao marcar como recusado:', error);
            // Adicionar notificação de erro
        }
    };

    const processRefund = async (transaction: PaymentGatewayTransaction) => {
        // Implementar modal de confirmação de estorno
        const confirmed = confirm(`Deseja processar o estorno da transação ${transaction.transactionId}?`);
        if (confirmed) {
            try {
                // Implementar método de estorno no service
                await refreshData();
                // Adicionar notificação de sucesso
            } catch (error) {
                console.error('Erro ao processar estorno:', error);
                // Adicionar notificação de erro
            }
        }
    };

    // Métodos de formatação e utilitários
    const formatCurrency = (amount?: number): string => {
        if (!amount) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount); // Assumindo que o valor está em centavos
    };

    const formatDate = (date?: Date): string => {
        if (!date) return '-';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    };

    const formatTime = (date?: Date): string => {
        if (!date) return '-';
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const getPaymentMethodName = (method?: string): string => {
        const methods: { [key: string]: string } = {
            'credit_card': 'Cartão de Crédito',
            'debit_card': 'Cartão de Débito',
            'pix': 'PIX',
            'boleto': 'Boleto',
            'bank_transfer': 'Transferência'
        };
        return methods[method || ''] || method || 'Desconhecido';
    };

    const getPaymentMethodIcon = (method?: string) => {
        const icons: { [key: string]: any } = {
            'credit_card': IconCreditCard,
            'debit_card': IconCreditCard,
            'pix': IconQrCode,
            'boleto': IconDocument,
            'bank_transfer': IconBuilding
        };
        return icons[method || ''] || IconCreditCard;
    };

    const getStatusText = (status?: string): string => {
        const statuses: { [key: string]: string } = {
            'paid': 'Pago',
            'pending': 'Pendente',
            'refused': 'Recusado',
            'cancelled': 'Cancelado',
            'processing': 'Processando',
            'refunded': 'Estornado',
            'failed': 'Falhou'
        };
        return statuses[status || ''] || status || 'Desconhecido';
    };

    const getStatusBadgeClass = (status?: string): string => {
        const classes: { [key: string]: string } = {
            'paid': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
            'refused': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
            'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
            'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
            'refunded': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
            'failed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        };
        return classes[status || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    };

    const getStatusIcon = (status?: string) => {
        const icons: { [key: string]: any } = {
            'paid': IconCircleCheck,
            'pending': IconClock,
            'refused': IconX,
            'cancelled': IconX,
            'processing': IconClock,
            'refunded': IconRefreshCcw,
            'failed': IconX
        };
        return icons[status || ''] || IconClock;
    };

    const getCustomerName = (customerId?: string): string => {
        // Implementar busca do nome do cliente
        return customerId ? `Cliente ${customerId.slice(-8)}` : 'Cliente não identificado';
    };

    // Lifecycle
    onMounted(() => {
        loadTransactions();
    });
</script>

<style scoped>
    /* Estilos específicos do componente se necessário */
    .transition-colors {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
    }
</style>
