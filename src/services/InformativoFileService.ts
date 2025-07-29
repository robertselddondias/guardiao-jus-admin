// src/services/InformativoFileService.ts

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase';
import FileService from '@/services/FileService';

export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
}

export interface UploadResult {
    downloadURL: string;
    fullPath: string;
    name: string;
    size: number;
}

class InformativoFileService {
    private readonly basePath = 'informativos';
    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Validar arquivo antes do upload
    validateFile(file: File): { isValid: boolean; error?: string } {
        if (!file) {
            return { isValid: false, error: 'Nenhum arquivo selecionado' };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG ou WebP.'
            };
        }

        if (file.size > this.maxFileSize) {
            return {
                isValid: false,
                error: `Arquivo muito grande. O tamanho máximo é ${this.maxFileSize / (1024 * 1024)}MB.`
            };
        }

        return { isValid: true };
    }

    // Upload de imagem com progresso
    async uploadImageWithProgress(
        file: File,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<UploadResult> {
        // Validar arquivo
        const validation = this.validateFile(file);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        try {
            // Gerar nome único para o arquivo
            const fileName = this.generateFileName(file);
            const filePath = `${this.basePath}/${fileName}`;

            // Criar referência no storage
            const storageRef = ref(storage, filePath);

            // Iniciar upload com monitoramento de progresso
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Calcular progresso
                        const progress: UploadProgress = {
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes,
                            percentage: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                        };

                        // Chamar callback de progresso se fornecido
                        if (onProgress) {
                            onProgress(progress);
                        }
                    },
                    (error) => {
                        console.error('Erro no upload:', error);
                        reject(new Error(`Erro ao fazer upload: ${error.message}`));
                    },
                    async () => {
                        try {
                            // Upload concluído com sucesso
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                            const result: UploadResult = {
                                downloadURL,
                                fullPath: uploadTask.snapshot.ref.fullPath,
                                name: uploadTask.snapshot.ref.name,
                                size: file.size
                            };

                            resolve(result);
                        } catch (error) {
                            reject(new Error('Erro ao obter URL do arquivo'));
                        }
                    }
                );
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro ao iniciar upload: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido no upload');
            }
        }
    }

    // Upload simples usando o FileService existente
    async uploadImage(file: File): Promise<string> {
        const validation = this.validateFile(file);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const fileName = this.generateFileName(file);
        const filePath = `${this.basePath}/${fileName}`;

        return await FileService.uploadFile(file, filePath);
    }

    // Deletar imagem do storage
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            // Extrair o path da URL
            const path = this.extractPathFromUrl(imageUrl);
            if (path) {
                await FileService.deleteFile(path);
            }
        } catch (error) {
            console.error('Erro ao deletar imagem:', error);
            // Não propagar o erro para não quebrar o fluxo principal
        }
    }

    // Deletar imagem pelo path
    async deleteImageByPath(path: string): Promise<void> {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro ao deletar arquivo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao deletar arquivo');
            }
        }
    }

    // Obter preview local do arquivo
    getFilePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            reader.readAsDataURL(file);
        });
    }

    // Redimensionar imagem (opcional)
    async resizeImage(file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calcular novas dimensões mantendo proporção
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Desenhar imagem redimensionada
                ctx?.drawImage(img, 0, 0, width, height);

                // Converter para blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(resizedFile);
                        } else {
                            reject(new Error('Erro ao redimensionar imagem'));
                        }
                    },
                    file.type,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Erro ao carregar imagem'));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Métodos utilitários privados
    private generateFileName(file: File): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        return `informativo_${timestamp}_${randomString}.${extension}`;
    }

    private extractPathFromUrl(url: string): string | null {
        try {
            // URL padrão do Firebase Storage
            const regex = /\/o\/(.+?)\?/;
            const match = url.match(regex);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
            return null;
        } catch (error) {
            console.error('Erro ao extrair path da URL:', error);
            return null;
        }
    }

    // Obter informações do arquivo
    getFileInfo(file: File) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            sizeFormatted: this.formatFileSize(file.size),
            isValid: this.validateFile(file).isValid
        };
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Exportando uma instância do serviço
export default new InformativoFileService();
