import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { CompanyModel } from '@/models/company_model'; // O modelo CompanyModel
import { getAuth } from 'firebase/auth';

const db = getFirestore();

class CompanyRepository {

    async createCompany(company: CompanyModel): Promise<void> {
        try {
            const companyRef = doc(collection(db, 'companies'));
            company.id = companyRef.id;

            await setDoc(companyRef, company.toMap(), { merge: true });
            console.log('Empresa criada com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar a empresa');
            }
        }
    }

    // Método para obter uma empresa do Firestore pelo ID
    async getCompanyById(id: string): Promise<CompanyModel | null> {
        try {
            const companyDocRef = doc(db, 'companies', id);
            const companyDocSnap = await getDoc(companyDocRef);

            if (companyDocSnap.exists()) {
                return CompanyModel.fromMap(companyDocSnap.data());
            } else {
                console.log('Empresa não encontrada!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar a empresa');
            }
        }
    }

    // Método para atualizar os dados de uma empresa no Firestore
    async updateCompany(company: CompanyModel): Promise<void> {
        try {
            const companyDocRef = doc(db, 'companies', company.id!);
            console.info(`JSON: ${JSON.stringify(company.toMap())}`);
            await updateDoc(companyDocRef, company.toMap());
            console.log('Empresa atualizada com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar a empresa');
            }
        }
    }

    // Método para excluir uma empresa do Firestore
    async deleteCompany(id: string): Promise<void> {
        try {
            const companyDocRef = doc(db, 'companies', id);
            await deleteDoc(companyDocRef);
            console.log('Empresa excluída com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir a empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir a empresa');
            }
        }
    }

    // Método para obter todas as empresas
    async getAllCompanies(): Promise<CompanyModel[]> {
        try {
            const companiesQuery = query(collection(db, 'companies'));
            const querySnapshot = await getDocs(companiesQuery);
            const companies: CompanyModel[] = [];
            querySnapshot.forEach((doc) => {
                const company = CompanyModel.fromMap(doc.data());
                companies.push(company);
            });
            return companies;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao obter as empresas: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao obter as empresas');
            }
        }
    }

    // Método para buscar empresas com base em um critério específico
    async searchCompaniesByField(field: string, value: string): Promise<CompanyModel[]> {
        try {
            const companiesQuery = query(collection(db, 'companies'), where(field, '==', value));
            const querySnapshot = await getDocs(companiesQuery);
            const companies: CompanyModel[] = [];
            querySnapshot.forEach((doc) => {
                const company = CompanyModel.fromMap(doc.data());
                companies.push(company);
            });
            return companies;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar empresas: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar empresas');
            }
        }
    }
}

export default new CompanyRepository();
