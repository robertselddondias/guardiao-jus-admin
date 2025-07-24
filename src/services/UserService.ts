// src/services/UserService.ts
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { UserModel } from '@/models/UserModel';

const db = getFirestore();

class UserService {

    async createUser(userModel: UserModel): Promise<void> {
        try {
            const userDocRef = doc(db, 'users_admin', userModel.uid!); // Garantir que o uid seja fornecido
            await setDoc(userDocRef, userModel.toFirestore());
            console.log('Usuário criado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar o usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar o usuário');
            }
        }
    }

    // Método para obter um usuário do Firestore pelo UID
    async getUser(uid: string): Promise<UserModel | null> {
        try {
            const userDocRef = doc(db, 'users_admin', uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                return UserModel.fromFirestore(userDocSnap.data());
            } else {
                console.log('Usuário não encontrado!');
                return null;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar o usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar o usuário');
            }
        }
    }

    // Método para atualizar os dados de um usuário no Firestore
    async updateUser(userModel: UserModel): Promise<void> {
        try {
            const userDocRef = doc(db, 'users_admin', userModel.uid!);
            await updateDoc(userDocRef, userModel.toFirestore()); // Atualiza os dados do usuário
            console.log('Usuário atualizado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar o usuário');
            }
        }
    }

    // Método para excluir um usuário do Firestore
    async deleteUser(uid: string): Promise<void> {
        try {
            const userDocRef = doc(db, 'users_admin', uid);
            await deleteDoc(userDocRef); // Exclui o documento do usuário
            console.log('Usuário excluído com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir o usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir o usuário');
            }
        }
    }
}

// Exportando uma instância do serviço
export default new UserService();
