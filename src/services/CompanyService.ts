import CompanyRepository from "@/repositories/CompanyRepository";
import { CompanyModel } from '@/models/company_model';

class CompanyService {

    async createCompany(companyData: CompanyModel): Promise<CompanyModel> {
        try {
            await CompanyRepository.createCompany(companyData);
            return companyData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar a empresa');
            }
        }
    }

    // Método para buscar uma empresa por ID
    async getCompanyById(id: string): Promise<CompanyModel | null> {
        try {
            const company = await CompanyRepository.getCompanyById(id);
            if (!company) {
                throw new Error('Empresa não encontrada');
            }
            return company;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao obter a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao obter a empresa');
            }
        }
    }

    // Método para atualizar os dados de uma empresa
    async updateCompany(companyData: CompanyModel): Promise<CompanyModel> {
        try {
            // Atualizando a empresa no Firestore
            await CompanyRepository.updateCompany(companyData);
            return companyData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar a empresa');
            }
        }
    }

    // Método para excluir uma empresa
    async deleteCompany(id: string): Promise<void> {
        try {
            // Excluindo a empresa do Firestore
            await CompanyRepository.deleteCompany(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir a empresa');
            }
        }
    }

    // Método para buscar todas as empresas
    async getAllCompanies(): Promise<CompanyModel[]> {
        try {
            return await CompanyRepository.getAllCompanies();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao obter as empresas: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao obter as empresas');
            }
        }
    }

    // Método para buscar empresas por um critério específico
    async searchCompaniesByField(field: string, value: string): Promise<CompanyModel[]> {
        try {
            return await CompanyRepository.searchCompaniesByField(field, value);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar empresas: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar empresas');
            }
        }
    }
}

// Exportando uma instância do serviço
export default new CompanyService();
