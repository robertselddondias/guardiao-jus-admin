// src/services/UserAdvService.ts

import UserAdvRepository from '@/repositories/UserAdvRepository';
import { UserAdvModel } from '@/models/UserAdvModel';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/firebase';

class UserAdvService {

    // Criar usuário advogado com Firebase Auth
    async createUserAdvWithAuth(userAdvData: UserAdvModel, sendEmailLink: boolean = true): Promise<UserAdvModel> {
        try {
            // Validar dados antes de criar
            this.validateUserAdvData(userAdvData);

            // Verificar duplicatas
            await this.checkDuplicateUserAdv(userAdvData);

            if (sendEmailLink && userAdvData.email) {
                // Criar usuário no Firebase Auth com senha temporária
                const tempPassword = this.generateTempPassword();
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userAdvData.email,
                    tempPassword
                );

                // Definir o UID do Firebase Auth no modelo
                userAdvData.uid = userCredential.user.uid;

                // Enviar email de verificação/configuração de senha
                await sendEmailVerification(userCredential.user, {
                    url: `${window.location.origin}/set-password?uid=${userCredential.user.uid}`,
                    handleCodeInApp: true
                });

                // Ou usar reset de senha para permitir que o usuário defina a própria senha
                await sendPasswordResetEmail(auth, userAdvData.email, {
                    url: `${window.location.origin}/login`,
                    handleCodeInApp: false
                });

                console.log('Email de configuração de senha enviado para:', userAdvData.email);
            }

            // Criar usuário advogado no Firestore
            await UserAdvRepository.createUserAdv(userAdvData);

            return userAdvData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar usuário advogado');
            }
        }
    }

    // Criar usuário advogado apenas no Firestore (sem Auth)
    async createUserAdv(userAdvData: UserAdvModel): Promise<UserAdvModel> {
        try {
            // Validar dados antes de criar
            this.validateUserAdvData(userAdvData);

            // Verificar duplicatas
            await this.checkDuplicateUserAdv(userAdvData);

            // Criar usuário advogado
            await UserAdvRepository.createUserAdv(userAdvData);
            return userAdvData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar usuário advogado');
            }
        }
    }

    // Reenviar email de configuração de senha
    async resendSetupEmail(email: string): Promise<void> {
        try {
            if (!email || email.trim() === '') {
                throw new Error('Email é obrigatório');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            // Verificar se o usuário existe
            const existingUser = await this.getUserAdvByEmail(email);
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            // Enviar email de reset de senha
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });

            console.log('Email de configuração de senha reenviado para:', email);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao reenviar email: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao reenviar email');
            }
        }
    }

    // Gerar senha temporária
    private generateTempPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Buscar usuário advogado por ID
    async getUserAdvById(uid: string): Promise<UserAdvModel | null> {
        try {
            if (!uid || uid.trim() === '') {
                throw new Error('UID do usuário advogado é obrigatório');
            }

            return await UserAdvRepository.getUserAdvById(uid);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuário advogado');
            }
        }
    }

    // Buscar usuário advogado por email
    async getUserAdvByEmail(email: string): Promise<UserAdvModel | null> {
        try {
            if (!email || email.trim() === '') {
                throw new Error('Email é obrigatório');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            return await UserAdvRepository.getUserAdvByEmail(email);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário advogado por email: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuário advogado por email');
            }
        }
    }

    // Buscar usuário advogado por CPF
    async getUserAdvByCpf(cpf: string): Promise<UserAdvModel | null> {
        try {
            if (!cpf || cpf.trim() === '') {
                throw new Error('CPF é obrigatório');
            }

            const cleanCpf = this.cleanCpf(cpf);
            if (!this.isValidCpf(cleanCpf)) {
                throw new Error('CPF inválido');
            }

            return await UserAdvRepository.getUserAdvByCpf(cleanCpf);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário advogado por CPF: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuário advogado por CPF');
            }
        }
    }

    // Buscar usuário advogado por OAB
    async getUserAdvByOab(oab: string): Promise<UserAdvModel | null> {
        try {
            if (!oab || oab.trim() === '') {
                throw new Error('OAB é obrigatório');
            }

            return await UserAdvRepository.getUserAdvByOab(oab.trim());
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário advogado por OAB: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuário advogado por OAB');
            }
        }
    }

    // Atualizar usuário advogado
    async updateUserAdv(userAdvData: UserAdvModel): Promise<UserAdvModel> {
        try {
            if (!userAdvData.uid) {
                throw new Error('UID do usuário advogado é obrigatório para atualização');
            }

            // Verificar se o usuário existe
            const existingUserAdv = await UserAdvRepository.getUserAdvById(userAdvData.uid);
            if (!existingUserAdv) {
                throw new Error('Usuário advogado não encontrado para atualização');
            }

            // Validar dados antes de atualizar
            this.validateUserAdvData(userAdvData, true);

            // Verificar duplicatas (excluindo o próprio usuário)
            await this.checkDuplicateUserAdv(userAdvData);

            await UserAdvRepository.updateUserAdv(userAdvData);
            return userAdvData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar usuário advogado');
            }
        }
    }

    // Excluir usuário advogado
    async deleteUserAdv(uid: string): Promise<void> {
        try {
            if (!uid || uid.trim() === '') {
                throw new Error('UID do usuário advogado é obrigatório');
            }

            // Verificar se o usuário existe
            const existingUserAdv = await UserAdvRepository.getUserAdvById(uid);
            if (!existingUserAdv) {
                throw new Error('Usuário advogado não encontrado para exclusão');
            }

            await UserAdvRepository.deleteUserAdv(uid);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir usuário advogado');
            }
        }
    }

    // Buscar todos os usuários advogados
    async getAllUsersAdv(): Promise<UserAdvModel[]> {
        try {
            return await UserAdvRepository.getAllUsersAdv();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados');
            }
        }
    }

    // Buscar usuários advogados por empresa
    async getUsersAdvByCompany(companyId: string): Promise<UserAdvModel[]> {
        try {
            if (!companyId || companyId.trim() === '') {
                throw new Error('ID da empresa é obrigatório');
            }

            return await UserAdvRepository.getUsersAdvByCompany(companyId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados por empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados por empresa');
            }
        }
    }

    // Buscar usuários advogados por UF
    async getUsersAdvByUf(uf: string): Promise<UserAdvModel[]> {
        try {
            if (!uf || uf.trim() === '') {
                throw new Error('UF é obrigatório');
            }

            return await UserAdvRepository.getUsersAdvByUf(uf.trim().toUpperCase());
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados por UF: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados por UF');
            }
        }
    }

    // Buscar com critério customizado
    async searchUsersAdvByField(field: string, value: string): Promise<UserAdvModel[]> {
        try {
            if (!field || field.trim() === '') {
                throw new Error('Campo de busca é obrigatório');
            }

            if (!value || value.trim() === '') {
                throw new Error('Valor de busca é obrigatório');
            }

            return await UserAdvRepository.searchUsersAdvByField(field, value);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados');
            }
        }
    }

    // Atualizar FCM Token
    async updateFcmToken(uid: string, fcmToken: string): Promise<void> {
        try {
            if (!uid || uid.trim() === '') {
                throw new Error('UID do usuário advogado é obrigatório');
            }

            if (!fcmToken || fcmToken.trim() === '') {
                throw new Error('FCM Token é obrigatório');
            }

            await UserAdvRepository.updateFcmToken(uid, fcmToken);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar FCM Token: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar FCM Token');
            }
        }
    }

    // Validações privadas
    private validateUserAdvData(userAdvData: UserAdvModel, isUpdate: boolean = false): void {
        if (!isUpdate) {
            // Validações para criação
            if (!userAdvData.name || userAdvData.name.trim() === '') {
                throw new Error('Nome é obrigatório');
            }

            if (!userAdvData.email || userAdvData.email.trim() === '') {
                throw new Error('Email é obrigatório');
            }
        }

        // Validações comuns (criação e atualização)
        if (userAdvData.email && !this.isValidEmail(userAdvData.email)) {
            throw new Error('Email inválido');
        }

        if (userAdvData.cpf && !this.isValidCpf(userAdvData.cpf)) {
            throw new Error('CPF inválido');
        }

        if (userAdvData.phone && userAdvData.phone.length < 10) {
            throw new Error('Telefone deve ter pelo menos 10 dígitos');
        }

        if (userAdvData.oab && userAdvData.oab.trim().length < 3) {
            throw new Error('OAB deve ter pelo menos 3 caracteres');
        }
        if(!userAdvData.photoUrl) {
            userAdvData.photoUrl = "";
        }
    }

    // Verificar duplicatas
    private async checkDuplicateUserAdv(userAdvData: UserAdvModel): Promise<void> {
        if (userAdvData.cpf) {
            const existingByCpf = await UserAdvRepository.getUserAdvByCpf(userAdvData.cpf);
            if (existingByCpf && existingByCpf.uid !== userAdvData.uid) {
                throw new Error('Já existe um usuário advogado cadastrado com este CPF');
            }
        }

        if (userAdvData.email) {
            const existingByEmail = await UserAdvRepository.getUserAdvByEmail(userAdvData.email);
            if (existingByEmail && existingByEmail.uid !== userAdvData.uid) {
                throw new Error('Já existe um usuário advogado cadastrado com este email');
            }
        }

        if (userAdvData.oab) {
            const existingByOab = await UserAdvRepository.getUserAdvByOab(userAdvData.oab);
            if (existingByOab && existingByOab.uid !== userAdvData.uid) {
                throw new Error('Já existe um usuário advogado cadastrado com esta OAB');
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
export default new UserAdvService();
