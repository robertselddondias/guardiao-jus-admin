import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useInformativo } from '@/composables/useInformativo';<template>
    <div class="panel">
        <!-- Header -->
        <div class="panel-header">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <button @click="goBack" class="btn btn-outline-secondary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Voltar
                    </button>
                    <h5 class="font-semibold text-lg dark:text-white-light">
                        {{ isEditing ? 'Editar Informativo' : 'Criar Novo Informativo' }}
                    </h5>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        @click="resetForm"
                        type="button"
                        class="btn btn-outline-secondary"
                        :disabled="isLoading"
                    >
                        Limpar
                    </button>
                    <button
                        @click="saveInformativo"
                        type="button"
                        class="btn btn-primary"
                        :disabled="isLoading || !isFormValid"
                    >
                        <svg v-if="isLoading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ error }}
            </div>
        </div>

        <!-- Upload Error Alert -->
        <div v-if="uploadError" class="alert alert-warning mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ uploadError }}
            </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveInformativo" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Title -->
                <div class="lg:col-span-2">
                    <label for="titulo" class="form-label">
                        Título *
                    </label>
                    <input
                        id="titulo"
                        v-model="formData.titulo"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger': formErrors.titulo }"
                        placeholder="Digite o título do informativo"
                        @blur="validateForm"
                    />
                    <div v-if="formErrors.titulo" class="text-danger text-sm mt-1">
                        {{ formErrors.titulo }}
                    </div>
                </div>

                <!-- Category -->
                <div>
                    <label for="categoria" class="form-label">
                        Categoria *
                    </label>
                    <select
                        id="categoria"
                        v-model="formData.categoria"
                        class="form-select"
                        :class="{ 'border-danger': formErrors.categoria }"
                        @change="validateForm"
                    >
                        <option value="">Selecione uma categoria</option>
                        <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>
                    <div v-if="formErrors.categoria" class="text-danger text-sm mt-1">
                        {{ formErrors.categoria }}
                    </div>
                </div>

                <!-- Priority -->
                <div>
                    <label for="prioridade" class="form-label">
                        Prioridade *
                    </label>
                    <select
                        id="prioridade"
                        v-model.number="formData.prioridade"
                        class="form-select"
                        :class="{ 'border-danger': formErrors.prioridade }"
                        @change="validateForm"
                    >
                        <option :value="1">1 - Alta</option>
                        <option :value="2">2 - Média</option>
                        <option :value="3">3 - Baixa</option>
                    </select>
                    <div v-if="formErrors.prioridade" class="text-danger text-sm mt-1">
                        {{ formErrors.prioridade }}
                    </div>
                </div>

                <!-- Publication Date -->
                <div>
                    <label for="dataPublicacao" class="form-label">
                        Data de Publicação *
                    </label>
                    <input
                        id="dataPublicacao"
                        v-model="dataPublicacaoFormatted"
                        type="datetime-local"
                        class="form-input"
                        @change="updateDataPublicacao"
                    />
                </div>

                <!-- Expiration Date -->
                <div>
                    <label for="dataExpiracao" class="form-label">
                        Data de Expiração
                    </label>
                    <input
                        id="dataExpiracao"
                        v-model="dataExpiracaoFormatted"
                        type="datetime-local"
                        class="form-input"
                        :class="{ 'border-danger': formErrors.dataExpiracao }"
                        @change="updateDataExpiracao"
                    />
                    <div v-if="formErrors.dataExpiracao" class="text-danger text-sm mt-1">
                        {{ formErrors.dataExpiracao }}
                    </div>
                    <small class="text-gray-500">Opcional. Deixe em branco para não expirar.</small>
                </div>
            </div>

            <!-- Content -->
            <div>
                <label for="conteudo" class="form-label">
                    Conteúdo *
                </label>
                <textarea
                    id="conteudo"
                    v-model="formData.conteudo"
                    rows="8"
                    class="form-textarea"
                    :class="{ 'border-danger': formErrors.conteudo }"
                    placeholder="Digite o conteúdo do informativo"
                    @blur="validateForm"
                ></textarea>
                <div v-if="formErrors.conteudo" class="text-danger text-sm mt-1">
                    {{ formErrors.conteudo }}
                </div>
            </div>

            <!-- Media and Links -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Image Upload -->
                <div>
                    <label for="imagemFile" class="form-label">
                        Imagem do Informativo
                    </label>
                    <div class="space-y-3">
                        <!-- File Input -->
                        <div class="flex items-center justify-center w-full">
                            <label for="imagemFile" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                                <div v-if="!imagemPreview && !isUploadingImage" class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-semibold">Clique para fazer upload</span> ou arraste e solte
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (MAX. 5MB)</p>
                                </div>
                                <div v-else-if="isUploadingImage" class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                    <p class="text-sm text-gray-500">Fazendo upload...</p>
                                    <div v-if="uploadProgress > 0" class="w-32 bg-gray-200 rounded-full h-2 mt-2">
                                        <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                                        <p class="text-xs text-gray-500 mt-1 text-center">{{ uploadProgress }}%</p>
                                    </div>
                                </div>
                                <div v-else-if="imagemPreview" class="relative w-full h-full">
                                    <img :src="imagemPreview" alt="Preview" class="w-full h-full object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        @click.stop="removeImage"
                                        class="absolute top-2 right-2 bg-danger text-white rounded-full p-1 hover:bg-danger-dark"
                                    >
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    id="imagemFile"
                                    type="file"
                                    class="hidden"
                                    accept="image/*"
                                    @change="handleFileUpload"
                                />
                            </label>
                        </div>

                        <!-- Upload Progress -->
                        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                            <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}% concluído</p>
                        </div>

                        <!-- Image URL Display -->
                        <div v-if="formData.imagemUrl" class="text-sm text-gray-600 dark:text-gray-400">
                            <p class="font-medium">URL da imagem:</p>
                            <p class="break-all">{{ formData.imagemUrl }}</p>
                        </div>
                    </div>
                </div>

                <!-- External Link -->
                <div>
                    <label for="linkExterno" class="form-label">
                        Link Externo
                    </label>
                    <input
                        id="linkExterno"
                        v-model="formData.linkExterno"
                        type="url"
                        class="form-input"
                        placeholder="https://exemplo.com"
                    />
                    <small class="text-gray-500">Link para mais informações ou página externa</small>
                </div>
            </div>

            <!-- Image Preview -->
            <div v-if="imagemPreview" class="border rounded-lg p-4">
                <label class="form-label">Preview da Imagem</label>
                <div class="flex justify-center">
                    <div class="relative">
                        <img
                            :src="imagemPreview"
                            alt="Preview"
                            class="max-w-xs max-h-48 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            @click="removeImage"
                            class="absolute top-2 right-2 bg-danger text-white rounded-full p-2 hover:bg-danger-dark"
                        >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tags -->
            <div>
                <label for="tags" class="form-label">
                    Tags
                </label>
                <div class="space-y-3">
                    <!-- Tag Input -->
                    <div class="flex gap-2">
                        <input
                            v-model="newTag"
                            type="text"
                            class="form-input flex-1"
                            placeholder="Digite uma tag e pressione Enter"
                            @keydown.enter.prevent="addTagFromInput"
                            @keydown.space.prevent="addTagFromInput"
                        />
                        <button
                            type="button"
                            @click="addTagFromInput"
                            class="btn btn-outline-primary"
                            :disabled="!newTag.trim()"
                        >
                            Adicionar
                        </button>
                    </div>

                    <!-- Tags Display -->
                    <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
                        <span
                            v-for="(tag, index) in formData.tags"
                            :key="index"
                            class="badge badge-outline-info flex items-center gap-1"
                        >
                            #{{ tag }}
                            <button
                                type="button"
                                @click="removeTag(index)"
                                class="ml-1 text-danger hover:text-danger-dark"
                            >
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </span>
                    </div>
                    <small class="text-gray-500">Pressione Enter ou Espaço para adicionar uma tag</small>
                </div>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                    <label class="form-label mb-1">Status</label>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Defina se o informativo estará ativo após a criação
                    </p>
                </div>
                <label class="inline-flex items-center cursor-pointer">
                    <input
                        v-model="formData.ativo"
                        type="checkbox"
                        class="sr-only peer"
                    />
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span class="ml-3 text-sm font-medium">
                        {{ formData.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                </label>
            </div>

            <!-- Form Summary -->
            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h6 class="font-medium mb-3">Resumo do Informativo</h6>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium">Categoria:</span>
                        <span :class="`ml-2 badge badge-outline-${getCategoriaColor(formData.categoria)}`">
                            {{ formData.categoria || 'Não selecionada' }}
                        </span>
                    </div>
                    <div>
                        <span class="font-medium">Prioridade:</span>
                        <span :class="`ml-2 badge badge-outline-${getPrioridadeColor(formData.prioridade)}`">
                            {{ formData.prioridade === 1 ? 'Alta' : formData.prioridade === 2 ? 'Média' : 'Baixa' }}
                        </span>
                    </div>
                    <div>
                        <span class="font-medium">Publicação:</span>
                        <span class="ml-2 text-gray-600 dark:text-gray-400">
                            {{ formatDate(formData.dataPublicacao) }}
                        </span>
                    </div>
                    <div v-if="formData.dataExpiracao">
                        <span class="font-medium">Expiração:</span>
                        <span class="ml-2 text-gray-600 dark:text-gray-400">
                            {{ formatDate(formData.dataExpiracao) }}
                        </span>
                    </div>
                    <div>
                        <span class="font-medium">Status:</span>
                        <span :class="`ml-2 badge badge-outline-${formData.ativo ? 'success' : 'secondary'}`">
                            {{ formData.ativo ? 'Ativo' : 'Inativo' }}
                        </span>
                    </div>
                    <div v-if="formData.tags.length > 0">
                        <span class="font-medium">Tags:</span>
                        <span class="ml-2 text-gray-600 dark:text-gray-400">
                            {{ formData.tags.length }} tag(s)
                        </span>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useInformativo } from '@/composables/useInformativo';

    const router = useRouter();
    const route = useRoute();

    const {
        // Form state
        formData,
        formErrors,
        isFormValid,

        // State
        isLoading,
        error,
        categorias,
        informativoSelecionado,

        // Upload state
        isUploadingImage,
        uploadProgress,
        uploadError,

        // Actions
        validateForm,
        resetForm,
        createInformativo,
        updateInformativo,
        fetchInformativoById,
        loadInformativoToForm,
        addTag,
        removeTag,

        // Upload methods
        uploadImage,
        validateImageFile,
        getFilePreview,
        deleteImage,

        // Utils
        formatDate,
        formatFileSize,
        getPrioridadeColor,
        getCategoriaColor,
    } = useInformativo();

    // Local state para upload de imagem
    const newTag = ref('');
    const imagemPreview = ref('');
    const selectedImageFile = ref<File | null>(null);

    // Computed
    const isEditing = computed(() => !!route.params.id);

    const dataPublicacaoFormatted = computed({
        get() {
            return formData.value.dataPublicacao.toISOString().slice(0, 16);
        },
        set(value: string) {
            formData.value.dataPublicacao = new Date(value);
        }
    });

    const dataExpiracaoFormatted = computed({
        get() {
            return formData.value.dataExpiracao ? formData.value.dataExpiracao.toISOString().slice(0, 16) : '';
        },
        set(value: string) {
            formData.value.dataExpiracao = value ? new Date(value) : null;
        }
    });

    // Methods
    const goBack = () => {
        router.back();
    };

    const saveInformativo = async () => {
        if (!validateForm()) {
            return;
        }

        let success = false;

        if (isEditing.value && route.params.id) {
            success = await updateInformativo(route.params.id as string);
        } else {
            success = await createInformativo();
        }

        if (success) {
            router.push('/informativos');
        }
    };

    const updateDataPublicacao = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.value) {
            formData.value.dataPublicacao = new Date(target.value);
            validateForm();
        }
    };

    const updateDataExpiracao = (event: Event) => {
        const target = event.target as HTMLInputElement;
        formData.value.dataExpiracao = target.value ? new Date(target.value) : null;
        validateForm();
    };

    const addTagFromInput = () => {
        if (newTag.value.trim()) {
            addTag(newTag.value.trim());
            newTag.value = '';
        }
    };

    // Image Upload Methods
    const handleFileUpload = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        // Validar arquivo usando o service
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            alert(validation.error);
            return;
        }

        try {
            selectedImageFile.value = file;

            // Gerar preview local
            const preview = await getFilePreview(file);
            if (preview) {
                imagemPreview.value = preview;
            }

            // Fazer upload para Firebase Storage
            const result = await uploadImage(file);

            if (result) {
                console.log('Upload concluído:', result.downloadURL);
            } else if (uploadError.value) {
                alert(uploadError.value);
                removeImage();
            }

        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            alert('Erro ao processar arquivo. Tente novamente.');
            removeImage();
        }
    };

    const removeImage = async () => {
        // Se tem uma imagem já salva, deletar do storage
        if (formData.value.imagemUrl && !imagemPreview.value.startsWith('data:')) {
            await deleteImage(formData.value.imagemUrl);
        }

        imagemPreview.value = '';
        formData.value.imagemUrl = '';
        selectedImageFile.value = null;

        // Limpar o input file
        const fileInput = document.getElementById('imagemFile') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Lifecycle
    onMounted(async () => {
        if (isEditing.value && route.params.id) {
            const informativo = await fetchInformativoById(route.params.id as string);
            if (informativo) {
                loadInformativoToForm(informativo);
                // Se já tem imagem, carregar preview
                if (informativo.imagemUrl) {
                    imagemPreview.value = informativo.imagemUrl;
                }
            } else {
                // Informativo não encontrado, redirecionar
                router.push('/informativos');
            }
        } else {
            // Resetar formulário para criação
            resetForm();
        }
    });

    // Watch for route changes
    watch(() => route.params.id, async (newId) => {
        if (newId && isEditing.value) {
            const informativo = await fetchInformativoById(newId as string);
            if (informativo) {
                loadInformativoToForm(informativo);
                if (informativo.imagemUrl) {
                    imagemPreview.value = informativo.imagemUrl;
                }
            }
        } else {
            resetForm();
            removeImage();
        }
    });

    // Watch para atualizar preview quando a URL da imagem mudar
    watch(() => formData.value.imagemUrl, (newUrl) => {
        if (newUrl && !imagemPreview.value) {
            imagemPreview.value = newUrl;
        }
    });
</script>
