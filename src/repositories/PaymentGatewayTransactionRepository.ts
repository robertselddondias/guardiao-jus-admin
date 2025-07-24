// src/repositories/PaymentGatewayTransactionRepository.ts

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    updateDoc,
    where,
    orderBy,
    limit,
    startAfter,
    QueryConstraint,
    Timestamp
} from 'firebase/firestore';
import { PaymentGatewayTransaction, PaymentGatewayTransactionModel } from '../models/PaymentGatewayTransaction';

const db = getFirestore();
const COLLECTION_NAME = 'payment_gateway_transactions';

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
    findAll(limitCount?: number, offset?: number): Promise<PaymentGatewayTransaction[]>;
    findPaidTransactions(): Promise<PaymentGatewayTransaction[]>;
    findPendingTransactions(): Promise<PaymentGatewayTransaction[]>;
}

export class PaymentGatewayTransactionRepository implements IPaymentGatewayTransactionRepository {

    constructor() {}

    async create(transaction: PaymentGatewayTransactionModel): Promise<PaymentGatewayTransaction> {
        try {
            const paymentTransaction = new PaymentGatewayTransaction(transaction);
            const transactionRef = doc(collection(db, COLLECTION_NAME));

            // Define o ID se não foi fornecido
            if (!paymentTransaction.id) {
                paymentTransaction.id = transactionRef.id;
            }

            // Define createdAt se não foi fornecido
            if (!paymentTransaction.createdAt) {
                paymentTransaction.createdAt = new Date();
            }

            const data = paymentTransaction.toMap();

            // Converte Date para Timestamp do Firestore
            if (data.createdAt instanceof Date) {
                data.createdAt = Timestamp.fromDate(data.createdAt);
            }

            await setDoc(transactionRef, data, { merge: true });

            console.log('Transação criada com sucesso!');
            return paymentTransaction;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar transação: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar transação');
            }
        }
    }

    async findById(id: string): Promise<PaymentGatewayTransaction | null> {
        try {
            const transactionDocRef = doc(db, COLLECTION_NAME, id);
            const transactionDocSnap = await getDoc(transactionDocRef);

            if (transactionDocSnap.exists()) {
                const data = transactionDocSnap.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                return PaymentGatewayTransaction.fromMap(data);
            } else {
                console.log('Transação não encontrada!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transação por ID: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transação por ID');
            }
        }
    }

    async findByUserId(userId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações por usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações por usuário');
            }
        }
    }

    async findByCompanyId(companyId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('companyId', '==', companyId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações por empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações por empresa');
            }
        }
    }

    async findByCustomerId(customerId: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('customerId', '==', customerId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações por cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações por cliente');
            }
        }
    }

    async findByTransactionId(transactionId: string): Promise<PaymentGatewayTransaction | null> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('transactionId', '==', transactionId),
                limit(1)
            );

            const querySnapshot = await getDocs(transactionsQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                return PaymentGatewayTransaction.fromMap(data);
            }

            return null;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transação por transaction_id: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transação por transaction_id');
            }
        }
    }

    async findByStatus(status: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações por status: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações por status');
            }
        }
    }

    async findByPaymentMethod(paymentMethod: string): Promise<PaymentGatewayTransaction[]> {
        try {
            const transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                where('paymentMethod', '==', paymentMethod),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações por método de pagamento: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações por método de pagamento');
            }
        }
    }

    async update(id: string, transaction: Partial<PaymentGatewayTransactionModel>): Promise<PaymentGatewayTransaction> {
        try {
            const transactionDocRef = doc(db, COLLECTION_NAME, id);

            // Verifica se a transação existe
            const transactionDoc = await getDoc(transactionDocRef);
            if (!transactionDoc.exists()) {
                throw new Error('Transação não encontrada');
            }

            // Prepara os dados para atualização
            const updateData: Record<string, any> = {};

            Object.entries(transaction).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (value instanceof Date) {
                        updateData[key] = Timestamp.fromDate(value);
                    } else {
                        updateData[key] = value;
                    }
                }
            });

            if (Object.keys(updateData).length === 0) {
                throw new Error('Nenhum campo para atualizar');
            }

            await updateDoc(transactionDocRef, updateData);

            console.log('Transação atualizada com sucesso!');

            // Retorna a transação atualizada
            const updatedTransactionSnap = await getDoc(transactionDocRef);
            const updatedData = updatedTransactionSnap.data()!;

            // Converte Timestamp para Date
            if (updatedData.createdAt && updatedData.createdAt.toDate) {
                updatedData.createdAt = updatedData.createdAt.toDate();
            }

            return PaymentGatewayTransaction.fromMap(updatedData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar transação: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar transação');
            }
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const transactionDocRef = doc(db, COLLECTION_NAME, id);

            // Verifica se a transação existe
            const transactionDoc = await getDoc(transactionDocRef);
            if (!transactionDoc.exists()) {
                return false;
            }

            await deleteDoc(transactionDocRef);
            console.log('Transação excluída com sucesso!');
            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao deletar transação: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao deletar transação');
            }
        }
    }

    async findAll(limitCount: number = 100, offset: number = 0): Promise<PaymentGatewayTransaction[]> {
        try {
            let transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            // Firestore usa cursor-based pagination ao invés de offset
            // Para implementar offset, seria necessário manter o último documento da página anterior
            // Por simplicidade, vamos implementar apenas o limit aqui

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            return transactions;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar todas as transações: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar todas as transações');
            }
        }
    }

    async findPaidTransactions(): Promise<PaymentGatewayTransaction[]> {
        return this.findByStatus('paid');
    }

    async findPendingTransactions(): Promise<PaymentGatewayTransaction[]> {
        return this.findByStatus('pending');
    }

    // Métodos auxiliares para paginação avançada com Firestore
    async findAllPaginated(limitCount: number = 100, lastDocId?: string): Promise<{
        transactions: PaymentGatewayTransaction[];
        lastDocId: string | null;
        hasMore: boolean;
    }> {
        try {
            let transactionsQuery = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc'),
                limit(limitCount + 1) // +1 para verificar se há mais documentos
            );

            // Se fornecido um lastDocId, inicia a partir dele
            if (lastDocId) {
                const lastDocRef = doc(db, COLLECTION_NAME, lastDocId);
                const lastDocSnap = await getDoc(lastDocRef);
                if (lastDocSnap.exists()) {
                    transactionsQuery = query(
                        collection(db, COLLECTION_NAME),
                        orderBy('createdAt', 'desc'),
                        startAfter(lastDocSnap),
                        limit(limitCount + 1)
                    );
                }
            }

            const querySnapshot = await getDocs(transactionsQuery);
            const transactions: PaymentGatewayTransaction[] = [];

            const docs = querySnapshot.docs;
            const hasMore = docs.length > limitCount;

            // Remove o documento extra se houver
            const actualDocs = hasMore ? docs.slice(0, limitCount) : docs;

            actualDocs.forEach((doc) => {
                const data = doc.data();

                // Converte Timestamp para Date
                if (data.createdAt && data.createdAt.toDate) {
                    data.createdAt = data.createdAt.toDate();
                }

                const transaction = PaymentGatewayTransaction.fromMap(data);
                transactions.push(transaction);
            });

            const newLastDocId = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1].id : null;

            return {
                transactions,
                lastDocId: newLastDocId,
                hasMore
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar transações paginadas: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar transações paginadas');
            }
        }
    }
}

// Exporta uma instância do repositório
export default new PaymentGatewayTransactionRepository();
