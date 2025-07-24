// repositories/PaymentGatewayTransactionRepository.ts

import { PaymentGatewayTransaction, PaymentGatewayTransactionModel } from '../models/PaymentGatewayTransaction';

export interface IPaymentGatewayTransactionRepository {
    create(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction>;
    findById(id: string): Promise<PaymentGatewayTransaction | null>;
    findByUserId(userId: string): Promise<PaymentGatewayTransaction[]>;
    findByCompanyId(companyId: string): Promise<PaymentGatewayTransaction[]>;
    findByCustomerId(customerId: string): Promise<PaymentGatewayTransaction[]>;
    findByTransactionId(transactionId: string): Promise<PaymentGatewayTransaction | null>;
    findByStatus(status: string): Promise<PaymentGatewayTransaction[]>;
    findByPaymentMethod(paymentMethod: string): Promise<PaymentGatewayTransaction[]>;
    update(id: string, transaction: Partial<PaymentGatewayTransactionModel>): Promise<PaymentGatewayTransaction>;
    delete(id: string): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<PaymentGatewayTransaction[]>;
    findPaidTransactions(): Promise<PaymentGatewayTransaction[]>;
    findPendingTransactions(): Promise<PaymentGatewayTransaction[]>;
}

export class PaymentGatewayTransactionRepository implements IPaymentGatewayTransactionRepository {
    private dbConnection: any; // Substitua pelo tipo da sua conexão (ex: Pool do pg, Connection do mysql, etc.)

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
    }

    async create(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction> {
        const paymentTransaction = new PaymentGatewayTransaction(transaction);
        const data = paymentTransaction.toMap();

        try {
            // Exemplo usando SQL - adapte para seu banco de dados
            const query = `
        INSERT INTO payment_gateway_transactions
        (id, user_id, company_id, credit_card_id, contract_id, customer_id, transaction_id,
         amount, paid, status, payment_method, created_at, card_brand, card_last_four_digits,
         pix_qr_code_url, pix_emv)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

            const values = [
                data.id || this.generateId(),
                data.userId,
                data.companyId,
                data.creditCardId,
                data.contractId,
                data.customerId,
                data.transactionId,
                data.amount,
                data.paid,
                data.status,
                data.paymentMethod,
                data.createdAt,
                data.cardBrand,
                data.cardLastFourDigits,
                data.pixQrCodeUrl,
                data.pixEmv
            ];

            const result = await this.dbConnection.query(query, values);
            return PaymentGatewayTransaction.fromMap(this.mapRowToObject(result.rows[0]));
        } catch (error) {
            throw new Error(`Erro ao criar transação: ${error}`);
        }
    }

    async findById(id: string): Promise<PaymentGatewayTransaction | null> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE id = $1';
            const result = await this.dbConnection.query(query, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            return PaymentGatewayTransaction.fromMap(this.mapRowToObject(result.rows[0]));
        } catch (error) {
            throw new Error(`Erro ao buscar transação por ID: ${error}`);
        }
    }

    async findByUserId(userId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE user_id = $1 ORDER BY created_at DESC';
            const result = await this.dbConnection.query(query, [userId]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar transações por usuário: ${error}`);
        }
    }

    async findByCompanyId(companyId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE company_id = $1 ORDER BY created_at DESC';
            const result = await this.dbConnection.query(query, [companyId]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar transações por empresa: ${error}`);
        }
    }

    async findByCustomerId(customerId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE customer_id = $1 ORDER BY created_at DESC';
            const result = await this.dbConnection.query(query, [customerId]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar transações por cliente: ${error}`);
        }
    }

    async findByTransactionId(transactionId: string): Promise<PaymentGatewayTransaction | null> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE transaction_id = $1';
            const result = await this.dbConnection.query(query, [transactionId]);

            if (result.rows.length === 0) {
                return null;
            }

            return PaymentGatewayTransaction.fromMap(this.mapRowToObject(result.rows[0]));
        } catch (error) {
            throw new Error(`Erro ao buscar transação por transaction_id: ${error}`);
        }
    }

    async findByStatus(status: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE status = $1 ORDER BY created_at DESC';
            const result = await this.dbConnection.query(query, [status]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar transações por status: ${error}`);
        }
    }

    async findByPaymentMethod(paymentMethod: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_gateway_transactions WHERE payment_method = $1 ORDER BY created_at DESC';
            const result = await this.dbConnection.query(query, [paymentMethod]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar transações por método de pagamento: ${error}`);
        }
    }

    async update(id: string, transaction: Partial<PaymentGatewayTransactionModel>): Promise<PaymentGatewayTransaction> {
        try {
            const updates: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            // Constrói dinamicamente a query de update
            Object.entries(transaction).forEach(([key, value]) => {
                if (value !== undefined) {
                    const dbKey = this.camelToSnakeCase(key);
                    updates.push(`${dbKey} = $${paramCount}`);
                    values.push(value instanceof Date ? value.toISOString() : value);
                    paramCount++;
                }
            });

            if (updates.length === 0) {
                throw new Error('Nenhum campo para atualizar');
            }

            values.push(id);
            const query = `
        UPDATE payment_gateway_transactions
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

            const result = await this.dbConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Transação não encontrada');
            }

            return PaymentGatewayTransaction.fromMap(this.mapRowToObject(result.rows[0]));
        } catch (error) {
            throw new Error(`Erro ao atualizar transação: ${error}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM payment_gateway_transactions WHERE id = $1';
            const result = await this.dbConnection.query(query, [id]);

            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar transação: ${error}`);
        }
    }

    async findAll(limit: number = 100, offset: number = 0): Promise<PaymentGatewayTransaction[]> {
        try {
            const query = `
        SELECT * FROM payment_gateway_transactions
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
            const result = await this.dbConnection.query(query, [limit, offset]);

            return result.rows.map((row: any) =>
                PaymentGatewayTransaction.fromMap(this.mapRowToObject(row))
            );
        } catch (error) {
            throw new Error(`Erro ao buscar todas as transações: ${error}`);
        }
    }

    async findPaidTransactions(): Promise<PaymentGatewayTransaction[]> {
        return this.findByStatus('paid');
    }

    async findPendingTransactions(): Promise<PaymentGatewayTransaction[]> {
        return this.findByStatus('pending');
    }

    // Métodos auxiliares
    private generateId(): string {
        return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private camelToSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    private mapRowToObject(row: any): Record<string, any> {
        // Converte snake_case para camelCase
        const mapped: Record<string, any> = {};
        Object.keys(row).forEach(key => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            mapped[camelKey] = row[key];
        });
        return mapped;
    }
}
