// src/services/PaymentGatewayTransactionService.ts

import { PaymentGatewayTransaction, PaymentGatewayTransactionModel } from '../models/PaymentGatewayTransaction';
import PaymentGatewayTransactionRepository, { IPaymentGatewayTransactionRepository } from '../repositories/PaymentGatewayTransactionRepository';

export interface IPaymentGatewayTransactionService {
    createTransaction(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction>;
    getTransactionById(id: string): Promise<PaymentGatewayTransaction>;
    getTransactionByTransactionId(transactionId: string): Promise<PaymentGatewayTransaction>;
    getUserTransactions(userId: string): Promise<PaymentGatewayTransaction[]>;
    getCompanyTransactions(companyId: string): Promise<PaymentGatewayTransaction[]>;
    getCustomerTransactions(customerId: string): Promise<PaymentGatewayTransaction[]>;
    updateTransactionStatus(id: string, status: string): Promise<PaymentGatewayTransaction>;
    markTransactionAsPaid(id: string): Promise<PaymentGatewayTransaction>;
    markTransactionAsRefused(id: string): Promise<PaymentGatewayTransaction>;
    getTransactionsByStatus(status: string): Promise<PaymentGatewayTransaction[]>;
    getTransactionsByPaymentMethod(paymentMethod: string): Promise<PaymentGatewayTransaction[]>;
    getPaidTransactions(): Promise<PaymentGatewayTransaction[]>;
    getPendingTransactions(): Promise<PaymentGatewayTransaction[]>;
    calculateTotalAmount(transactions: PaymentGatewayTransaction[]): number;
    getTransactionStatistics(companyId?: string): Promise<{
        total: number;
        paid: number;
        pending: number;
        refused: number;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
    }>;
    getAllTransactions(limit?: number, offset?: number): Promise<PaymentGatewayTransaction[]>;
    getAllTransactionsPaginated(limit?: number, lastDocId?: string): Promise<{
        transactions: PaymentGatewayTransaction[];
        lastDocId: string | null;
        hasMore: boolean;
    }>;
    deleteTransaction(id: string): Promise<boolean>;
    updateTransaction(id: string, transaction: Partial<PaymentGatewayTransactionModel>): Promise<PaymentGatewayTransaction>;
}

export class PaymentGatewayTransactionService implements IPaymentGatewayTransactionService {
    private repository: IPaymentGatewayTransactionRepository;

    constructor(repository?: IPaymentGatewayTransactionRepository) {
        this.repository = repository || PaymentGatewayTransactionRepository;
    }

    async createTransaction(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction> {
        // Validações básicas
        if (!transaction.userId && !transaction.customerId) {
            throw new Error('ID do usuário ou cliente é obrigatório');
        }

        if (!transaction.amount || transaction.amount <= 0) {
            throw new Error('Valor da transação deve ser maior que zero');
        }

        if (!transaction.paymentMethod) {
            throw new Error('Método de pagamento é obrigatório');
        }

        const transactionData: PaymentGatewayTransactionModel = {
            ...transaction,
            createdAt: transaction.createdAt || new Date(),
            status: transaction.status || 'pending',
            paid: transaction.paid !== undefined ? transaction.paid : false,
        };

        try {
            return await this.repository.create(transactionData);
        } catch (error) {
            throw new Error(`Erro ao criar transação: ${error}`);
        }
    }

    async getTransactionById(id: string): Promise<PaymentGatewayTransaction> {
        if (!id) {
            throw new Error('ID da transação é obrigatório');
        }

        const transaction = await this.repository.findById(id);
        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        return transaction;
    }

    async getTransactionByTransactionId(transactionId: string): Promise<PaymentGatewayTransaction> {
        if (!transactionId) {
            throw new Error('Transaction ID é obrigatório');
        }

        const transaction = await this.repository.findByTransactionId(transactionId);
        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        return transaction;
    }

    async getUserTransactions(userId: string): Promise<PaymentGatewayTransaction[]> {
        if (!userId) {
            throw new Error('ID do usuário é obrigatório');
        }

        return await this.repository.findByUserId(userId);
    }

    async getCompanyTransactions(companyId: string): Promise<PaymentGatewayTransaction[]> {
        if (!companyId) {
            throw new Error('ID da empresa é obrigatório');
        }

        return await this.repository.findByCompanyId(companyId);
    }

    async getCustomerTransactions(customerId: string): Promise<PaymentGatewayTransaction[]> {
        if (!customerId) {
            throw new Error('ID do cliente é obrigatório');
        }

        return await this.repository.findByCustomerId(customerId);
    }

    async updateTransactionStatus(id: string, status: string): Promise<PaymentGatewayTransaction> {
        if (!id || !status) {
            throw new Error('ID e status são obrigatórios');
        }

        const validStatuses = ['pending', 'paid', 'refused', 'cancelled', 'processing', 'failed'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Status inválido. Status válidos: ${validStatuses.join(', ')}`);
        }

        const updateData: Partial<PaymentGatewayTransactionModel> = {
            status,
            paid: status === 'paid',
        };

        return await this.repository.update(id, updateData);
    }

    async markTransactionAsPaid(id: string): Promise<PaymentGatewayTransaction> {
        return await this.updateTransactionStatus(id, 'paid');
    }

    async markTransactionAsRefused(id: string): Promise<PaymentGatewayTransaction> {
        return await this.updateTransactionStatus(id, 'refused');
    }

    async markTransactionAsCancelled(id: string): Promise<PaymentGatewayTransaction> {
        return await this.updateTransactionStatus(id, 'cancelled');
    }

    async markTransactionAsProcessing(id: string): Promise<PaymentGatewayTransaction> {
        return await this.updateTransactionStatus(id, 'processing');
    }

    async getTransactionsByStatus(status: string): Promise<PaymentGatewayTransaction[]> {
        if (!status) {
            throw new Error('Status é obrigatório');
        }

        return await this.repository.findByStatus(status);
    }

    async getTransactionsByPaymentMethod(paymentMethod: string): Promise<PaymentGatewayTransaction[]> {
        if (!paymentMethod) {
            throw new Error('Método de pagamento é obrigatório');
        }

        return await this.repository.findByPaymentMethod(paymentMethod);
    }

    async getPaidTransactions(): Promise<PaymentGatewayTransaction[]> {
        return await this.repository.findPaidTransactions();
    }

    async getPendingTransactions(): Promise<PaymentGatewayTransaction[]> {
        return await this.repository.findPendingTransactions();
    }

    async getRefusedTransactions(): Promise<PaymentGatewayTransaction[]> {
        return await this.getTransactionsByStatus('refused');
    }

    async getCancelledTransactions(): Promise<PaymentGatewayTransaction[]> {
        return await this.getTransactionsByStatus('cancelled');
    }

    async getAllTransactions(limit: number = 100, offset: number = 0): Promise<PaymentGatewayTransaction[]> {
        return await this.repository.findAll(limit, offset);
    }

    async getAllTransactionsPaginated(limit: number = 100, lastDocId?: string): Promise<{
        transactions: PaymentGatewayTransaction[];
        lastDocId: string | null;
        hasMore: boolean;
    }> {
        // Se o repository tiver o método de paginação avançada, usa ele
        if ('findAllPaginated' in this.repository && typeof this.repository.findAllPaginated === 'function') {
            return await (this.repository as any).findAllPaginated(limit, lastDocId);
        }

        // Fallback para o método básico
        const transactions = await this.repository.findAll(limit);
        return {
            transactions,
            lastDocId: transactions.length > 0 ? transactions[transactions.length - 1].id || null : null,
            hasMore: transactions.length === limit
        };
    }

    calculateTotalAmount(transactions: PaymentGatewayTransaction[]): number {
        return transactions.reduce((total, transaction) => {
            return total + (transaction.amount || 0);
        }, 0);
    }

    async getTransactionStatistics(companyId?: string): Promise<{
        total: number;
        paid: number;
        pending: number;
        refused: number;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
    }> {
        try {
            let transactions: PaymentGatewayTransaction[];

            if (companyId) {
                transactions = await this.repository.findByCompanyId(companyId);
            } else {
                transactions = await this.repository.findAll(10000); // Limit alto para estatísticas
            }

            const paidTransactions = transactions.filter(t => t.status === 'paid');
            const pendingTransactions = transactions.filter(t => t.status === 'pending');
            const refusedTransactions = transactions.filter(t => t.status === 'refused');

            return {
                total: transactions.length,
                paid: paidTransactions.length,
                pending: pendingTransactions.length,
                refused: refusedTransactions.length,
                totalAmount: this.calculateTotalAmount(transactions),
                paidAmount: this.calculateTotalAmount(paidTransactions),
                pendingAmount: this.calculateTotalAmount(pendingTransactions),
            };
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas de transações: ${error}`);
        }
    }

    async updateTransaction(id: string, transaction: Partial<PaymentGatewayTransactionModel>): Promise<PaymentGatewayTransaction> {
        if (!id) {
            throw new Error('ID da transação é obrigatório');
        }

        if (!transaction || Object.keys(transaction).length === 0) {
            throw new Error('Dados para atualização são obrigatórios');
        }

        return await this.repository.update(id, transaction);
    }

    async deleteTransaction(id: string): Promise<boolean> {
        if (!id) {
            throw new Error('ID da transação é obrigatório');
        }

        return await this.repository.delete(id);
    }

    // Métodos auxiliares para análise de dados
    async getTransactionsByDateRange(
        startDate: Date,
        endDate: Date,
        companyId?: string
    ): Promise<PaymentGatewayTransaction[]> {
        try {
            let transactions: PaymentGatewayTransaction[];

            if (companyId) {
                transactions = await this.repository.findByCompanyId(companyId);
            } else {
                transactions = await this.repository.findAll(10000);
            }

            // Filtra por intervalo de datas
            return transactions.filter(transaction => {
                if (!transaction.createdAt) return false;
                const transactionDate = new Date(transaction.createdAt);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        } catch (error) {
            throw new Error(`Erro ao buscar transações por intervalo de datas: ${error}`);
        }
    }

    async getMonthlyRevenue(year: number, companyId?: string): Promise<{
        month: number;
        revenue: number;
        transactionCount: number;
    }[]> {
        try {
            const startDate = new Date(year, 0, 1); // 1º de janeiro
            const endDate = new Date(year, 11, 31, 23, 59, 59); // 31 de dezembro

            const transactions = await this.getTransactionsByDateRange(startDate, endDate, companyId);
            const paidTransactions = transactions.filter(t => t.status === 'paid');

            const monthlyData: { [key: number]: { revenue: number; count: number } } = {};

            // Inicializa todos os meses
            for (let i = 0; i < 12; i++) {
                monthlyData[i] = { revenue: 0, count: 0 };
            }

            // Agrupa por mês
            paidTransactions.forEach(transaction => {
                if (transaction.createdAt) {
                    const month = new Date(transaction.createdAt).getMonth();
                    monthlyData[month].revenue += transaction.amount || 0;
                    monthlyData[month].count += 1;
                }
            });

            return Object.keys(monthlyData).map(month => ({
                month: parseInt(month) + 1, // Mês 1-12 ao invés de 0-11
                revenue: monthlyData[parseInt(month)].revenue,
                transactionCount: monthlyData[parseInt(month)].count
            }));
        } catch (error) {
            throw new Error(`Erro ao obter receita mensal: ${error}`);
        }
    }

    async getPaymentMethodStatistics(companyId?: string): Promise<{
        paymentMethod: string;
        count: number;
        totalAmount: number;
        percentage: number;
    }[]> {
        try {
            let transactions: PaymentGatewayTransaction[];

            if (companyId) {
                transactions = await this.repository.findByCompanyId(companyId);
            } else {
                transactions = await this.repository.findAll(10000);
            }

            const paymentMethodData: { [key: string]: { count: number; amount: number } } = {};
            const totalTransactions = transactions.length;

            transactions.forEach(transaction => {
                const method = transaction.paymentMethod || 'unknown';
                if (!paymentMethodData[method]) {
                    paymentMethodData[method] = { count: 0, amount: 0 };
                }
                paymentMethodData[method].count += 1;
                paymentMethodData[method].amount += transaction.amount || 0;
            });

            return Object.keys(paymentMethodData).map(method => ({
                paymentMethod: method,
                count: paymentMethodData[method].count,
                totalAmount: paymentMethodData[method].amount,
                percentage: totalTransactions > 0 ? (paymentMethodData[method].count / totalTransactions) * 100 : 0
            }));
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas de métodos de pagamento: ${error}`);
        }
    }

    async getCustomerTransactionSummary(customerId: string): Promise<{
        totalTransactions: number;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        lastTransaction: PaymentGatewayTransaction | null;
        averageAmount: number;
        paymentMethods: string[];
    }> {
        try {
            const transactions = await this.repository.findByCustomerId(customerId);
            const paidTransactions = transactions.filter(t => t.status === 'paid');
            const pendingTransactions = transactions.filter(t => t.status === 'pending');

            const totalAmount = this.calculateTotalAmount(transactions);
            const paidAmount = this.calculateTotalAmount(paidTransactions);
            const pendingAmount = this.calculateTotalAmount(pendingTransactions);

            const paymentMethods = [...new Set(transactions.map(t => t.paymentMethod).filter(Boolean))];

            const lastTransaction = transactions.length > 0 ? transactions[0] : null; // Assumindo que vem ordenado por data DESC

            return {
                totalTransactions: transactions.length,
                totalAmount,
                paidAmount,
                pendingAmount,
                lastTransaction,
                averageAmount: transactions.length > 0 ? totalAmount / transactions.length : 0,
                paymentMethods: paymentMethods as string[]
            };
        } catch (error) {
            throw new Error(`Erro ao obter resumo de transações do cliente: ${error}`);
        }
    }

    async getTopCustomers(limit: number = 10, companyId?: string): Promise<{
        customerId: string;
        totalAmount: number;
        transactionCount: number;
        lastTransactionDate: Date | null;
    }[]> {
        try {
            let transactions: PaymentGatewayTransaction[];

            if (companyId) {
                transactions = await this.repository.findByCompanyId(companyId);
            } else {
                transactions = await this.repository.findAll(10000);
            }

            const paidTransactions = transactions.filter(t => t.status === 'paid');
            const customerData: { [key: string]: {
                    totalAmount: number;
                    count: number;
                    lastDate: Date | null
                } } = {};

            paidTransactions.forEach(transaction => {
                const customerId = transaction.customerId;
                if (!customerId) return;

                if (!customerData[customerId]) {
                    customerData[customerId] = {
                        totalAmount: 0,
                        count: 0,
                        lastDate: null
                    };
                }

                customerData[customerId].totalAmount += transaction.amount || 0;
                customerData[customerId].count += 1;

                const transactionDate = transaction.createdAt;
                if (transactionDate && (!customerData[customerId].lastDate || transactionDate > customerData[customerId].lastDate)) {
                    customerData[customerId].lastDate = transactionDate;
                }
            });

            return Object.keys(customerData)
                .map(customerId => ({
                    customerId,
                    totalAmount: customerData[customerId].totalAmount,
                    transactionCount: customerData[customerId].count,
                    lastTransactionDate: customerData[customerId].lastDate
                }))
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, limit);
        } catch (error) {
            throw new Error(`Erro ao obter top clientes: ${error}`);
        }
    }

    async processRefund(transactionId: string, amount?: number, reason?: string): Promise<PaymentGatewayTransaction> {
        try {
            const transaction = await this.getTransactionById(transactionId);

            if (transaction.status !== 'paid') {
                throw new Error('Apenas transações pagas podem ser estornadas');
            }

            const refundAmount = amount || transaction.amount || 0;

            if (refundAmount > (transaction.amount || 0)) {
                throw new Error('Valor do estorno não pode ser maior que o valor da transação');
            }

            // Atualiza a transação original
            const updateData: Partial<PaymentGatewayTransactionModel> = {
                status: 'refunded',
                paid: false
            };

            return await this.repository.update(transactionId, updateData);
        } catch (error) {
            throw new Error(`Erro ao processar estorno: ${error}`);
        }
    }

    async validateTransaction(transaction: PaymentGatewayTransactionModel): Promise<boolean> {
        try {
            // Validações básicas
            if (!transaction.userId && !transaction.customerId) {
                throw new Error('ID do usuário ou cliente é obrigatório');
            }

            if (!transaction.amount || transaction.amount <= 0) {
                throw new Error('Valor deve ser maior que zero');
            }

            if (!transaction.paymentMethod) {
                throw new Error('Método de pagamento é obrigatório');
            }

            const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto', 'bank_transfer'];
            if (!validPaymentMethods.includes(transaction.paymentMethod)) {
                throw new Error(`Método de pagamento inválido. Métodos válidos: ${validPaymentMethods.join(', ')}`);
            }

            // Validações específicas por método de pagamento
            if (transaction.paymentMethod === 'credit_card' || transaction.paymentMethod === 'debit_card') {
                if (!transaction.creditCardId && !transaction.cardBrand) {
                    throw new Error('Dados do cartão são obrigatórios para pagamento com cartão');
                }
            }

            return true;
        } catch (error) {
            throw new Error(`Validação falhou: ${error}`);
        }
    }

    // Método para sincronizar status com gateway de pagamento externo
    async syncTransactionWithGateway(transactionId: string, gatewayStatus: string, gatewayData?: any): Promise<PaymentGatewayTransaction> {
        try {
            const transaction = await this.getTransactionById(transactionId);

            // Mapeia status do gateway para status interno
            const statusMapping: { [key: string]: string } = {
                'paid': 'paid',
                'authorized': 'processing',
                'pending': 'pending',
                'refused': 'refused',
                'canceled': 'cancelled',
                'refunded': 'refunded',
                'failed': 'failed'
            };

            const newStatus = statusMapping[gatewayStatus] || 'pending';

            const updateData: Partial<PaymentGatewayTransactionModel> = {
                status: newStatus,
                paid: newStatus === 'paid'
            };

            // Adiciona dados específicos do gateway se fornecidos
            if (gatewayData) {
                if (gatewayData.cardBrand) updateData.cardBrand = gatewayData.cardBrand;
                if (gatewayData.cardLastFourDigits) updateData.cardLastFourDigits = gatewayData.cardLastFourDigits;
                if (gatewayData.pixQrCodeUrl) updateData.pixQrCodeUrl = gatewayData.pixQrCodeUrl;
                if (gatewayData.pixEmv) updateData.pixEmv = gatewayData.pixEmv;
            }

            return await this.repository.update(transactionId, updateData);
        } catch (error) {
            throw new Error(`Erro ao sincronizar transação com gateway: ${error}`);
        }
    }
}

// Exporta uma instância do serviço
export default new PaymentGatewayTransactionService();
