import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';

class FileService {
    private storage = getStorage(app);

    // Método para fazer upload de um arquivo para o Firebase Storage
    async uploadFile(file: File, path: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, path);

            const uploadTask = uploadBytesResumable(storageRef, file);

            const snapshot = await uploadTask;

            const downloadURL = await getDownloadURL(snapshot.ref);

            console.log('File available at', downloadURL);
            return downloadURL; // Retorna a URL do arquivo no Firebase Storage
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao fazer upload do arquivo');
            }
        }
    }

    // Método para obter a URL de um arquivo já carregado no Firebase Storage
    async getFileUrl(path: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, path);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao obter a URL do arquivo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao obter a URL do arquivo');
            }
        }
    }

    // Método para excluir um arquivo do Firebase Storage
    async deleteFile(path: string): Promise<void> {
        try {
            const fileRef = ref(this.storage, path);
            await deleteObject(fileRef); // Deleta o arquivo
            console.log('Arquivo excluído com sucesso');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao excluir o arquivo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao excluir o arquivo');
            }
        }
    }
}

// Exportando uma instância do serviço
export default new FileService();
