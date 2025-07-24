import { auth } from '@/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useAppStore } from '@/stores';
import { UserModel } from '@/models/UserModel'; // Importação necessária para o Firestore

// Definindo a interface para um usuário
export interface IUser {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    uid: string;
}

class AuthService {

    async register(email: string, password: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Erro desconhecido');
            }
        }
    }

    async login(email: string, password: string): Promise<User> {
        try {
            // Realiza o login do usuário com e-mail e senha
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verifica se o usuário existe na coleção "user_admin"
            const userDocRef = doc(getFirestore(), 'users_admin', user.uid); // Usando getFirestore para pegar a instância do Firestore
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const appStore = useAppStore();
                const userObject = UserModel.fromFirestore(userDocSnap.data());
                appStore.setUser(userObject);
                return user;
            } else {
                throw new Error('Usuário não encontrado na coleção user_admin');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Erro desconhecido');
            }
        }
    }

    // Função para deslogar usuário
    async logout(): Promise<void> {
        try {
            await signOut(auth);
            const appStore = useAppStore();
            appStore.clearUser();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Erro desconhecido');
            }
        }
    }

    // Função para verificar se há usuário logado
    onAuthStateChanged(callback: (user: IUser | null) => void): void {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                callback({
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                });
            } else {
                callback(null);
            }
        });
    }

    // Função para resetar a senha
    async resetPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Erro desconhecido');
            }
        }
    }

    // Função para atualizar a senha do usuário
    async updatePassword(newPassword: string): Promise<void> {
        const user = auth.currentUser;
        if (user) {
            try {
                await updatePassword(user, newPassword);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error('Erro desconhecido');
                }
            }
        } else {
            throw new Error('Usuário não está logado');
        }
    }

    // Função para obter o usuário atual
    getCurrentUser(): UserModel | null {
        if(useAppStore().user) {
            const userAppStore = useAppStore();
            const user = UserModel.fromFirestore(userAppStore.user);
            if (user) {
                return user;
            }
        }
        return null;
    }
}

// Exportando uma instância do serviço
export default new AuthService();
