// services/PaymentGatewayTransactionService.ts

import { PaymentGatewayTransaction, PaymentGatewayTransactionModel } from '../models/PaymentGatewayTransaction';
import { IPaymentGatewayTransactionRepository } from '../repositories/PaymentGatewayTransactionRepository';

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
    getTransactionStatistics(companyId?: string): Promise<TransactionStatistics>;
    validateTransaction(transaction: PaymentGatewayTransactionModel): ValidationResult;
}

export interface TransactionStatistics {
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

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class PaymentGatewayTransactionService implements IPaymentGatewayTransactionService {
    private repository: IPaymentGatewayTransactionRepository;

    constructor(repository: IPaymentGatewayTransactionRepository) {
        this.repository = repository;
    }

    async createTransaction(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction> {
        // Validação antes de criar
        const validation = this.validateTransaction(transaction);
        if (!validation.isValid) {
            throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
        }

        // Define valores padrão se não fornecidos
        const transactionData: PaymentGatewayTransactionModel = {
            ...transaction,
            createdAt: transaction.createdAt || new Date(),
            status: transaction.status || 'pending',
            paid: transaction.paid || false,
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

        const validStatuses = ['pending', 'paid', 'refused', 'cancelled', 'processing'];
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

    calculateTotalAmount(transactions: PaymentGatewayTransaction[]): number {
        return transactions.reduce((total, transaction) => {
            return total + (transaction.amount || 0);
        }, 0);
    }

    async getTransactionStatistics(companyId?: string): Promise<TransactionStatistics> {
        let transactions: PaymentGatewayTransaction[];

        if (companyId) {
            transactions = await this.getCompanyTransactions(companyId);
        } else {
            transactions = await this.repository.findAll();
        }

        const statistics: TransactionStatistics = {
            totalTransactions: transactions.length,
            totalAmount: this.calculateTotalAmount(transactions),
            paidTransactions: 0,
            paidAmount: 0,
            pendingTransactions: 0,
            pendingAmount: 0,
            refusedTransactions: 0,
            refusedAmount: 0,
            paymentMethods: {},
        };

        transactions.forEach(transaction => {
            const amount = transaction.amount || 0;

            // Estatísticas por status
            switch (transaction.status) {
                case 'paid':
                    statistics.paidTransactions++;
                    statistics.paidAmount += amount;
                    break;
                case 'pending':
                    statistics.pendingTransactions++;
                    statistics.pendingAmount += amount;
                    break;
                case 'refused':
                    statistics.refusedTransactions++;
                    statistics.refusedAmount += amount;
                    break;
            }

            // Estatísticas por método de pagamento
            const method = transaction.paymentMethod || 'unknown';
            statistics.paymentMethods[method] = (statistics.paymentMethods[method] || 0) + 1;
        });

        return statistics;
    }

    validateTransaction(transaction: PaymentGatewayTransactionModel): ValidationResult {
        const errors: string[] = [];

        // Validações obrigatórias
        if (!transaction.userId) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!transaction.amount || transaction.amount <= 0) {
            errors.push('Valor deve ser maior que zero');
        }

        if (!transaction.paymentMethod) {
            errors.push('Método de pagamento é obrigatório');
        }

        // Validações condicionais
        if (transaction.paymentMethod === 'credit_card') {
            if (!transaction.creditCardId) {
                errors.push('ID do cartão de crédito é obrigatório para pagamentos com cartão');
            }
        }

        if (transaction.paymentMethod === 'pix') {
            if (!transaction.pixQrCodeUrl && !transaction.pixEmv) {
                errors.push('URL do QR Code ou código EMV é obrigatório para pagamentos PIX');
            }
        }

        // Validação de status
        const validStatuses = ['pending', 'paid', 'refused', 'cancelled', 'processing'];
        if (transaction.status && !validStatuses.includes(transaction.status)) {
            errors.push(`Status inválido. Status válidos: ${validStatuses.join(', ')}`);
        }

        // Validação de método de pagamento
        const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto', 'bank_transfer'];
        if (transaction.paymentMethod && !validPaymentMethods.includes(transaction.paymentMethod)) {
            errors.push(`Método de pagamento inválido. Métodos válidos: ${validPaymentMethods.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    // Métodos auxiliares para conversão de valores
    convertCentsToReais(cents: number): number {
        return cents / 100;
    }

    convertReaisToCents(reais: number): number {
        return Math.round(reais * 100);
    }

    formatAmount(amount: number, inCents: boolean = true): string {
        const value = inCents ? this.convertCentsToReais(amount) : amount;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    }

    // Método para buscar transações por período
    async getTransactionsByDateRange(
        startDate: Date,
        endDate: Date,
        companyId?: string
    ): Promise<PaymentGatewayTransaction[]> {
        let transactions: PaymentGatewayTransaction[];

        if (companyId) {
            transactions = await this.getCompanyTransactions(companyId);
        } else {
            transactions = await this.repository.findAll();
        }

        return transactions.filter(transaction => {
            if (!transaction.createdAt) return false;
            const transactionDate = new Date(transaction.createdAt);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }
}
