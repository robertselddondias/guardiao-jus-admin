// src/repositories/CustomerRepository.ts

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot
} from 'firebase/firestore';
import { CustomerModel } from '@/models/CustomerModel';

const db = getFirestore();

class CustomerRepository {

    // Método para criar um novo cliente
    async createCustomer(customer: CustomerModel): Promise<void> {
        try {
            let customerRef;

            // Se o cliente já tem um UID (ex: Firebase Auth), usa ele como ID do documento
            if (customer.uid) {
                customerRef = doc(db, 'users', customer.uid);
            } else {
                // Caso contrário, gera um novo ID
                customerRef = doc(collection(db, 'users'));
                customer.uid = customerRef.id;
            }

            await setDoc(customerRef, customer.toMap(), { merge: true });
            console.log('Cliente criado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar o cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar o cliente');
            }
        }
    }

    // Método para obter um cliente pelo UID
    async getCustomerById(uid: string): Promise<CustomerModel | null> {
        try {
            const customerDocRef = doc(db, 'users', uid);
            const customerDocSnap = await getDoc(customerDocRef);

            if (customerDocSnap.exists()) {
                return CustomerModel.fromMap(customerDocSnap.data());
            } else {
                console.log('Cliente não encontrado!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar o cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar o cliente');
            }
        }
    }

    // Método para obter cliente por CPF
    async getCustomerByCpf(cpf: string): Promise<CustomerModel | null> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                where('cpf', '==', cpf),
                limit(1)
            );
            const querySnapshot = await getDocs(customersQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return CustomerModel.fromMap(doc.data());
            } else {
                console.log('Cliente não encontrado pelo CPF!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar cliente por CPF: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar cliente por CPF');
            }
        }
    }

    // Método para obter cliente por email
    async getCustomerByEmail(email: string): Promise<CustomerModel | null> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                where('email', '==', email),
                limit(1)
            );
            const querySnapshot = await getDocs(customersQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return CustomerModel.fromMap(doc.data());
            } else {
                console.log('Cliente não encontrado pelo email!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar cliente por email: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar cliente por email');
            }
        }
    }

    // Método para atualizar os dados de um cliente
    async updateCustomer(customer: CustomerModel): Promise<void> {
        try {
            const customerDocRef = doc(db, 'users', customer.uid!);
            console.info(`JSON: ${JSON.stringify(customer.toMap())}`);
            await updateDoc(customerDocRef, customer.toMap());
            console.log('Cliente atualizado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar o cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar o cliente');
            }
        }
    }

    // Método para excluir um cliente
    async deleteCustomer(uid: string): Promise<void> {
        try {
            const customerDocRef = doc(db, 'users', uid);
            await deleteDoc(customerDocRef);
            console.log('Cliente excluído com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir o cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir o cliente');
            }
        }
    }

    // Método para obter todos os clientes
    async getAllCustomers(): Promise<CustomerModel[]> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            return customers;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao obter os clientes: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao obter os clientes');
            }
        }
    }

    // Método para obter clientes por empresa
    async getCustomersByCompany(companyId: string): Promise<CustomerModel[]> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                where('companyId', '==', companyId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            return customers;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar clientes da empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar clientes da empresa');
            }
        }
    }

    // Método para obter clientes com plano ativo
    async getActiveCustomers(): Promise<CustomerModel[]> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                where('isPlanoAtivo', '==', true),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            return customers;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar clientes ativos: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar clientes ativos');
            }
        }
    }

    // Método para buscar clientes com paginação
    async getCustomersPaginated(pageSize: number = 20, lastDoc?: DocumentSnapshot): Promise<{customers: CustomerModel[], lastDoc: DocumentSnapshot | null}> {
        try {
            let customersQuery = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc'),
                limit(pageSize)
            );

            // Se há um último documento, inicia a partir dele
            if (lastDoc) {
                customersQuery = query(
                    collection(db, 'users'),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            return { customers, lastDoc: lastDocument };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar clientes paginados: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar clientes paginados');
            }
        }
    }

    // Método para buscar clientes por nome (busca parcial)
    async searchCustomersByName(searchTerm: string): Promise<CustomerModel[]> {
        try {
            // Firestore não suporta busca parcial diretamente, então buscaremos nomes que começam com o termo
            const customersQuery = query(
                collection(db, 'users'),
                where('name', '>=', searchTerm),
                where('name', '<=', searchTerm + '\uf8ff'),
                orderBy('name'),
                limit(50)
            );

            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            return customers;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar clientes por nome: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar clientes por nome');
            }
        }
    }

    // Método para buscar clientes com filtros específicos
    async searchCustomersByField(field: string, value: any): Promise<CustomerModel[]> {
        try {
            const customersQuery = query(
                collection(db, 'users'),
                where(field, '==', value),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(customersQuery);
            const customers: CustomerModel[] = [];

            querySnapshot.forEach((doc) => {
                const customer = CustomerModel.fromMap(doc.data());
                customers.push(customer);
            });

            return customers;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar clientes: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar clientes');
            }
        }
    }
}

export default new CustomerRepository();
