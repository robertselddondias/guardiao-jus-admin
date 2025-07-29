import { computed, ref } from 'vue';
import { useInformativoStore } from '@/stores/InformativoStore';
import { InformativoModel } from '@/models/InformativoModel';
import InformativoFileService, { UploadProgress, UploadResult } from '@/services/InformativoFileService';

export const useInformativo = () => {
    const store = useInformativoStore();

    // Form state para criar/editar informativos
    const formData = ref({
        titulo: '',
        conteudo: '',
        categoria: 'GERAL',
        imagemUrl: '',
        linkExterno: '',
        prioridade: 2,
        dataPublicacao: new Date(),
        dataExpiracao: null as Date | null,
        ativo: true,
        tags: [] as string[],
    });

    const formErrors = ref<{ [key: string]: string }>({});
    const isFormValid = ref(false);

    // Upload state
    const isUploadingImage = ref(false);
    const uploadProgress = ref(0);
    const uploadError = ref<string | null>(null);

    // Validation rules
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.value.titulo.trim()) {
            errors.titulo = 'Título é obrigatório';
        }

        if (!formData.value.conteudo.trim()) {
            errors.conteudo = 'Conteúdo é obrigatório';
        }

        if (!formData.value.categoria.trim()) {
            errors.categoria = 'Categoria é obrigatória';
        }

        if (formData.value.prioridade < 1 || formData.value.prioridade > 3) {
            errors.prioridade = 'Prioridade deve ser entre 1 (alta) e 3 (baixa)';
        }

        if (formData.value.dataExpiracao && formData.value.dataExpiracao <= formData.value.dataPublicacao) {
            errors.dataExpiracao = 'Data de expiração deve ser posterior à data de publicação';
        }

        formErrors.value = errors;
        isFormValid.value = Object.keys(errors).length === 0;

        return isFormValid.value;
    };

    // Form methods
    const resetForm = () => {
        formData.value = {
            titulo: '',
            conteudo: '',
            categoria: 'GERAL',
            imagemUrl: '',
            linkExterno: '',
            prioridade: 2,
            dataPublicacao: new Date(),
            dataExpiracao: null,
            ativo: true,
            tags: [],
        };
        formErrors.value = {};
        isFormValid.value = false;
        uploadProgress.value = 0;
        uploadError.value = null;
        isUploadingImage.value = false;
    };

    const loadInformativoToForm = (informativo: InformativoModel) => {
        formData.value = {
            titulo: informativo.titulo,
            conteudo: informativo.conteudo,
            categoria: informativo.categoria,
            imagemUrl: informativo.imagemUrl || '',
            linkExterno: informativo.linkExterno || '',
            prioridade: informativo.prioridade,
            dataPublicacao: informativo.dataPublicacao,
            dataExpiracao: informativo.dataExpiracao || null,
            ativo: informativo.ativo,
            tags: informativo.tags ? [...informativo.tags] : [],
        };
    };

    const createInformativoFromForm = (): InformativoModel => {
        return new InformativoModel(
            formData.value.titulo,
            formData.value.conteudo,
            formData.value.categoria,
            formData.value.dataPublicacao,
            undefined, // id será gerado
            formData.value.imagemUrl || undefined,
            formData.value.dataExpiracao || undefined,
            formData.value.ativo,
            formData.value.linkExterno || undefined,
            formData.value.prioridade,
            (formData.value.tags && formData.value.tags.length > 0) ? formData.value.tags : undefined
        );
    };

    // Image Upload Methods
    const uploadImage = async (file: File): Promise<UploadResult | null> => {
        try {
            isUploadingImage.value = true;
            uploadProgress.value = 0;
            uploadError.value = null;

            const result = await InformativoFileService.uploadImageWithProgress(
                file,
                (progress: UploadProgress) => {
                    uploadProgress.value = progress.percentage;
                }
            );

            // Atualizar URL da imagem no formulário
            formData.value.imagemUrl = result.downloadURL;

            return result;
        } catch (error: any) {
            uploadError.value = error.message || 'Erro ao fazer upload da imagem';
            return null;
        } finally {
            isUploadingImage.value = false;
        }
    };

    const uploadImageSimple = async (file: File): Promise<string | null> => {
        try {
            isUploadingImage.value = true;
            uploadError.value = null;

            const downloadURL = await InformativoFileService.uploadImage(file);
            formData.value.imagemUrl = downloadURL;

            return downloadURL;
        } catch (error: any) {
            uploadError.value = error.message || 'Erro ao fazer upload da imagem';
            return null;
        } finally {
            isUploadingImage.value = false;
        }
    };

    const deleteImage = async (imageUrl?: string): Promise<boolean> => {
        try {
            const urlToDelete = imageUrl || formData.value.imagemUrl;
            if (urlToDelete) {
                await InformativoFileService.deleteImage(urlToDelete);

                // Limpar URL do formulário se for a imagem atual
                if (!imageUrl || imageUrl === formData.value.imagemUrl) {
                    formData.value.imagemUrl = '';
                }

                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao deletar imagem:', error);
            return false;
        }
    };

    const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
        return InformativoFileService.validateFile(file);
    };

    const getFilePreview = async (file: File): Promise<string | null> => {
        try {
            return await InformativoFileService.getFilePreview(file);
        } catch (error: any) {
            console.error('Erro ao gerar preview:', error);
            return null;
        }
    };

    const resizeImage = async (file: File, maxWidth?: number, maxHeight?: number): Promise<File | null> => {
        try {
            return await InformativoFileService.resizeImage(file, maxWidth, maxHeight);
        } catch (error: any) {
            console.error('Erro ao redimensionar imagem:', error);
            return null;
        }
    };

    // CRUD operations with validation
    const createInformativo = async (): Promise<boolean> => {
        if (!validateForm()) {
            return false;
        }

        const informativo = createInformativoFromForm();
        const result = await store.createInformativo(informativo);

        if (result) {
            resetForm();
            return true;
        }
        return false;
    };

    const updateInformativo = async (id: string): Promise<boolean> => {
        if (!validateForm()) {
            return false;
        }

        const updates = {
            titulo: formData.value.titulo,
            conteudo: formData.value.conteudo,
            categoria: formData.value.categoria,
            imagemUrl: formData.value.imagemUrl || undefined,
            linkExterno: formData.value.linkExterno || undefined,
            prioridade: formData.value.prioridade,
            dataPublicacao: formData.value.dataPublicacao,
            dataExpiracao: formData.value.dataExpiracao || undefined,
            ativo: formData.value.ativo,
            tags: formData.value.tags.length > 0 ? formData.value.tags : undefined,
        };

        const result = await store.updateInformativo(id, updates);
        return !!result;
    };

    // Tag management
    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !formData.value.tags.includes(trimmedTag)) {
            formData.value.tags.push(trimmedTag);
        }
    };

    const removeTag = (index: number) => {
        formData.value.tags.splice(index, 1);
    };

    // Utility functions
    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatDateShort = (date: Date): string => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getPrioridadeColor = (prioridade: number): string => {
        switch (prioridade) {
            case 1: return 'danger'; // Alta
            case 2: return 'warning'; // Média
            case 3: return 'success'; // Baixa
            default: return 'warning';
        }
    };

    const getPrioridadeIcon = (prioridade: number): string => {
        switch (prioridade) {
            case 1: return 'alert-triangle'; // Alta
            case 2: return 'alert-circle'; // Média
            case 3: return 'info'; // Baixa
            default: return 'alert-circle';
        }
    };

    const getCategoriaColor = (categoria: string): string => {
        switch (categoria.toLowerCase()) {
            case 'pmdf': return 'primary';
            case 'cbmdf': return 'danger';
            case 'urgente': return 'warning';
            case 'geral': return 'info';
            default: return 'secondary';
        }
    };

    // Computed properties
    const isLoading = computed(() => store.loading);
    const error = computed(() => store.error);
    const informativos = computed(() => store.informativos);
    const informativoSelecionado = computed(() => store.informativoSelecionado);
    const informativosAtivos = computed(() => store.informativosAtivos);
    const informativosValidos = computed(() => store.informativosValidos);
    const informativosRecentes = computed(() => store.informativosRecentes);
    const categorias = computed(() => store.categorias);
    const hasMore = computed(() => store.hasMore);

    // Upload computed properties
    const isUploading = computed(() => isUploadingImage.value);
    const hasUploadError = computed(() => !!uploadError.value);

    // Statistics
    const statistics = computed(() => {
        const total = informativos.value.length;
        const ativos = informativosAtivos.value.length;
        const validos = informativosValidos.value.length;
        const altaPrioridade = informativos.value.filter(i => i.prioridade === 1).length;
        const expirados = informativos.value.filter(i => i.isExpirado).length;

        return {
            total,
            ativos,
            validos,
            altaPrioridade,
            expirados,
            inativos: total - ativos,
        };
    });

    return {
        // Store actions
        ...store,

        // Form state
        formData,
        formErrors,
        isFormValid,

        // Upload state
        isUploadingImage,
        uploadProgress,
        uploadError,
        isUploading,
        hasUploadError,

        // Form methods
        validateForm,
        resetForm,
        loadInformativoToForm,
        createInformativoFromForm,
        createInformativo,
        updateInformativo,

        // Image upload methods
        uploadImage,
        uploadImageSimple,
        deleteImage,
        validateImageFile,
        getFilePreview,
        resizeImage,

        // Tag management
        addTag,
        removeTag,

        // Utility functions
        formatDate,
        formatDateShort,
        formatFileSize,
        getPrioridadeColor,
        getPrioridadeIcon,
        getCategoriaColor,

        // Computed properties
        isLoading,
        error,
        informativos,
        informativoSelecionado,
        informativosAtivos,
        informativosValidos,
        informativosRecentes,
        categorias,
        hasMore,
        statistics,
    };
};
