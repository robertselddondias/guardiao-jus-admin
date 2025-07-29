// src/repositories/UserAdvRepository.ts

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
    QueryConstraint
} from 'firebase/firestore';
import { UserAdvModel } from '@/models/UserAdvModel';

const db = getFirestore();
const COLLECTION_NAME = 'users_adv';

class UserAdvRepository {

    // Criar um novo usuário advogado
    async createUserAdv(userAdv: UserAdvModel): Promise<void> {
        try {
            const userAdvRef = doc(collection(db, COLLECTION_NAME));
            userAdv.uid = userAdvRef.id;
            userAdv.createdAt = new Date().toISOString();

            await setDoc(userAdvRef, userAdv.toMap(), { merge: true });
            console.log('Usuário advogado criado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário advogado: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar usuário advogado');
            }
        }
    }

    // Buscar usuário advogado por ID
    async getUserAdvById(uid: string): Promise<UserAdvModel | null> {
        try {
            const userAdvDocRef = doc(db, COLLECTION_NAME, uid);
            const userAdvDocSnap = await getDoc(userAdvDocRef);

            if (userAdvDocSnap.exists()) {
                return UserAdvModel.fromMap(userAdvDocSnap.data());
            } else {
                console.log('Usuário advogado não encontrado!');
                return null;
            }
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
            const userAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where('email', '==', email),
                limit(1)
            );
            const querySnapshot = await getDocs(userAdvQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return UserAdvModel.fromMap(doc.data());
            }
            return null;
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
            const userAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where('cpf', '==', cpf),
                limit(1)
            );
            const querySnapshot = await getDocs(userAdvQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return UserAdvModel.fromMap(doc.data());
            }
            return null;
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
            const userAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where('oab', '==', oab),
                limit(1)
            );
            const querySnapshot = await getDocs(userAdvQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return UserAdvModel.fromMap(doc.data());
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário advogado por OAB: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuário advogado por OAB');
            }
        }
    }

    // Atualizar usuário advogado
    async updateUserAdv(userAdv: UserAdvModel): Promise<void> {
        try {
            if (!userAdv.uid) {
                throw new Error('UID do usuário advogado é obrigatório para atualização');
            }

            const userAdvDocRef = doc(db, COLLECTION_NAME, userAdv.uid);
            await updateDoc(userAdvDocRef, userAdv.toMap());
            console.log('Usuário advogado atualizado com sucesso!');
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
            const userAdvDocRef = doc(db, COLLECTION_NAME, uid);
            await deleteDoc(userAdvDocRef);
            console.log('Usuário advogado excluído com sucesso!');
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
            const usersAdvQuery = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(usersAdvQuery);
            const usersAdv: UserAdvModel[] = [];

            querySnapshot.forEach((doc) => {
                const userAdv = UserAdvModel.fromMap(doc.data());
                usersAdv.push(userAdv);
            });

            return usersAdv;
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
            const usersAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where('companyId', '==', companyId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(usersAdvQuery);
            const usersAdv: UserAdvModel[] = [];

            console.info(`USER: ${querySnapshot.docs[0].data()}`);

            querySnapshot.forEach((doc) => {

                const userAdv = UserAdvModel.fromMap(doc.data());
                usersAdv.push(userAdv);
            });

            return usersAdv;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados por empresa: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados por empresa');
            }
            console.info(`ERRO CONSULTA: ${JSON.stringify(error)}`);
        }
    }

    // Buscar usuários advogados por UF
    async getUsersAdvByUf(uf: string): Promise<UserAdvModel[]> {
        try {
            const usersAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where('uf', '==', uf),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(usersAdvQuery);
            const usersAdv: UserAdvModel[] = [];

            querySnapshot.forEach((doc) => {
                const userAdv = UserAdvModel.fromMap(doc.data());
                usersAdv.push(userAdv);
            });

            return usersAdv;
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
            const usersAdvQuery = query(
                collection(db, COLLECTION_NAME),
                where(field, '==', value)
            );
            const querySnapshot = await getDocs(usersAdvQuery);
            const usersAdv: UserAdvModel[] = [];

            querySnapshot.forEach((doc) => {
                const userAdv = UserAdvModel.fromMap(doc.data());
                usersAdv.push(userAdv);
            });

            return usersAdv;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuários advogados por campo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar usuários advogados por campo');
            }
        }
    }

    // Atualizar FCM Token
    async updateFcmToken(uid: string, fcmToken: string): Promise<void> {
        try {
            const userAdvDocRef = doc(db, COLLECTION_NAME, uid);
            await updateDoc(userAdvDocRef, { fcmToken });
            console.log('FCM Token atualizado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar FCM Token: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar FCM Token');
            }
        }
    }
}

export default new UserAdvRepository();
