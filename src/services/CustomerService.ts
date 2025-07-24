// src/services/CustomerService.ts

import { CustomerModel } from '@/models/CustomerModel';
import CustomerRepository from '@/repositories/CustomerRepository';
import { DocumentSnapshot } from 'firebase/firestore';

class CustomerService {

    // Criar um novo cliente
    async createCustomer(customerData: CustomerModel): Promise<void> {
        try {
            // Validações básicas antes de criar
            this.validateCustomerData(customerData);

            // Verificar se já existe cliente com este CPF ou email
            await this.checkDuplicateCustomer(customerData);

            // Definir data de criação se não existir
            if (!customerData.createdAt) {
                customerData.createdAt = new Date().toISOString();
            }

            await CustomerRepository.createCustomer(customerData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao criar cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao criar cliente');
            }
        }
    }

    // Obter cliente por UID
    async getCustomerById(uid: string): Promise<CustomerModel | null> {
        try {
            if (!uid || uid.trim() === '') {
                throw new Error('UID do cliente é obrigatório');
            }

            return await CustomerRepository.getCustomerById(uid);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao buscar cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao buscar cliente');
            }
        }
    }

    // Obter cliente por CPF
    async getCustomerByCpf(cpf: string): Promise<CustomerModel | null> {
        try {
            if (!cpf || cpf.trim() === '') {
                throw new Error('CPF é obrigatório');
            }

            // Limpar formatação do CPF
            const cleanCpf = this.cleanCpf(cpf);
            return await CustomerRepository.getCustomerByCpf(cleanCpf);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao buscar cliente por CPF: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao buscar cliente por CPF');
            }
        }
    }

    // Obter cliente por email
    async getCustomerByEmail(email: string): Promise<CustomerModel | null> {
        try {
            if (!email || email.trim() === '') {
                throw new Error('Email é obrigatório');
            }

            return await CustomerRepository.getCustomerByEmail(email.toLowerCase());
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao buscar cliente por email: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao buscar cliente por email');
            }
        }
    }

    // Atualizar dados do cliente
    async updateCustomer(customerData: CustomerModel): Promise<void> {
        try {
            if (!customerData.uid) {
                throw new Error('UID do cliente é obrigatório para atualização');
            }

            // Verificar se o cliente existe
            const existingCustomer = await CustomerRepository.getCustomerById(customerData.uid);
            if (!existingCustomer) {
                throw new Error('Cliente não encontrado para atualização');
            }

            // Validar dados antes de atualizar
            this.validateCustomerData(customerData, true);

            await CustomerRepository.updateCustomer(customerData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao atualizar cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao atualizar cliente');
            }
        }
    }

    // Excluir cliente
    async deleteCustomer(uid: string): Promise<void> {
        try {
            if (!uid || uid.trim() === '') {
                throw new Error('UID do cliente é obrigatório');
            }

            // Verificar se o cliente existe
            const existingCustomer = await CustomerRepository.getCustomerById(uid);
            if (!existingCustomer) {
                throw new Error('Cliente não encontrado para exclusão');
            }

            await CustomerRepository.deleteCustomer(uid);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao excluir cliente: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao excluir cliente');
            }
        }
    }

    // Obter todos os clientes
    async getAllCustomers(): Promise<CustomerModel[]> {
        try {
            return await CustomerRepository.getAllCustomers();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao obter todos os clientes: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao obter todos os clientes');
            }
        }
    }

    // Obter clientes por empresa
    async getCustomersByCompany(companyId: string): Promise<CustomerModel[]> {
        try {
            if (!companyId || companyId.trim() === '') {
                throw new Error('ID da empresa é obrigatório');
            }

            return await CustomerRepository.getCustomersByCompany(companyId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao obter clientes da empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao obter clientes da empresa');
            }
        }
    }

    // Obter clientes ativos
    async getActiveCustomers(): Promise<CustomerModel[]> {
        try {
            return await CustomerRepository.getActiveCustomers();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao obter clientes ativos: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao obter clientes ativos');
            }
        }
    }

    // Obter clientes com paginação
    async getCustomersPaginated(pageSize: number = 20, lastDoc?: DocumentSnapshot): Promise<{customers: CustomerModel[], lastDoc: DocumentSnapshot | null}> {
        try {
            return await CustomerRepository.getCustomersPaginated(pageSize, lastDoc);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao obter clientes paginados: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao obter clientes paginados');
            }
        }
    }

    // Buscar clientes por nome
    async searchCustomersByName(searchTerm: string): Promise<CustomerModel[]> {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                throw new Error('Termo de busca é obrigatório');
            }

            return await CustomerRepository.searchCustomersByName(searchTerm.trim());
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao buscar clientes por nome: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao buscar clientes por nome');
            }
        }
    }

    // Ativar plano do cliente
    async activateCustomerPlan(uid: string): Promise<void> {
        try {
            const customer = await CustomerRepository.getCustomerById(uid);
            if (!customer) {
                throw new Error('Cliente não encontrado');
            }

            customer.isPlanoAtivo = true;
            await CustomerRepository.updateCustomer(customer);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao ativar plano: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao ativar plano');
            }
        }
    }

    // Desativar plano do cliente
    async deactivateCustomerPlan(uid: string): Promise<void> {
        try {
            const customer = await CustomerRepository.getCustomerById(uid);
            if (!customer) {
                throw new Error('Cliente não encontrado');
            }

            customer.isPlanoAtivo = false;
            await CustomerRepository.updateCustomer(customer);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao desativar plano: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao desativar plano');
            }
        }
    }

    // Atualizar progresso de completude dos dados
    async updateCustomerCompletionStatus(uid: string, section: 'personal' | 'address' | 'military', isComplete: boolean): Promise<void> {
        try {
            const customer = await CustomerRepository.getCustomerById(uid);
            if (!customer) {
                throw new Error('Cliente não encontrado');
            }

            switch (section) {
                case 'personal':
                    customer.isPersonalInfoComplete = isComplete;
                    break;
                case 'address':
                    customer.isAdressInfoComplete = isComplete;
                    break;
                case 'military':
                    customer.isMilitaryInfoComplete = isComplete;
                    break;
            }

            await CustomerRepository.updateCustomer(customer);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no serviço ao atualizar status de completude: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no serviço ao atualizar status de completude');
            }
        }
    }

    // MÉTODOS PRIVADOS DE VALIDAÇÃO

    // Validar dados do cliente
    private validateCustomerData(customerData: CustomerModel, isUpdate: boolean = false): void {
        if (!isUpdate) {
            // Validações para criação
            if (!customerData.name || customerData.name.trim() === '') {
                throw new Error('Nome é obrigatório');
            }

            if (!customerData.email || customerData.email.trim() === '') {
                throw new Error('Email é obrigatório');
            }
        }

        // Validações comuns (criação e atualização)
        if (customerData.email && !this.isValidEmail(customerData.email)) {
            throw new Error('Email inválido');
        }

        if (customerData.cpf && !this.isValidCpf(customerData.cpf)) {
            throw new Error('CPF inválido');
        }

        if (customerData.phone && customerData.phone.length < 10) {
            throw new Error('Telefone deve ter pelo menos 10 dígitos');
        }
    }

    // Verificar duplicatas
    private async checkDuplicateCustomer(customerData: CustomerModel): Promise<void> {
        if (customerData.cpf) {
            const existingByCpf = await CustomerRepository.getCustomerByCpf(customerData.cpf);
            if (existingByCpf && existingByCpf.uid !== customerData.uid) {
                throw new Error('Já existe um cliente cadastrado com este CPF');
            }
        }

        if (customerData.email) {
            const existingByEmail = await CustomerRepository.getCustomerByEmail(customerData.email);
            if (existingByEmail && existingByEmail.uid !== customerData.uid) {
                throw new Error('Já existe um cliente cadastrado com este email');
            }
        }
    }

    // Limpar formatação do CPF
    private cleanCpf(cpf: string): string {
        return cpf.replace(/[^\d]/g, '');
    }

    // Validar email
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar CPF
    private isValidCpf(cpf: string): boolean {
        const cleanCpf = this.cleanCpf(cpf);

        if (cleanCpf.length !== 11) return false;

        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

        // Algoritmo de validação do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
        }
        let digit1 = (sum * 10) % 11;
        if (digit1 === 10) digit1 = 0;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
        }
        let digit2 = (sum * 10) % 11;
        if (digit2 === 10) digit2 = 0;

        return digit1 === parseInt(cleanCpf.charAt(9)) && digit2 === parseInt(cleanCpf.charAt(10));
    }
}

// Exportando uma instância do serviço
export default new CustomerService();
