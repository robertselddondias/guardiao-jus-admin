<template>
    <div>
        <!-- Breadcrumb -->
        <ul class="flex space-x-2 rtl:space-x-reverse mb-6">
            <li>
                <router-link to="/informativos" class="text-primary hover:underline">Informativos</router-link>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Visualizar</span>
            </li>
        </ul>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p class="mt-4 text-gray-500">Carregando informativo...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <svg class="w-16 h-16 text-danger mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-danger font-medium mb-4">{{ error }}</p>
            <router-link to="/informativos" class="btn btn-primary">
                Voltar para Lista
            </router-link>
        </div>

        <!-- Content -->
        <div v-else-if="informativo" class="space-y-6">
            <!-- Header -->
            <div class="panel">
                <div class="flex items-start justify-between mb-6">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <button @click="goBack" class="btn btn-outline-secondary">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                                Voltar
                            </button>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ informativo.titulo }}
                            </h1>
                        </div>

                        <!-- Status Badges -->
                        <div class="flex flex-wrap items-center gap-3 mb-4">
                            <span :class="`badge ${informativo.ativo ? 'badge-success' : 'badge-secondary'}`">
                                {{ informativo.ativo ? 'Ativo' : 'Inativo' }}
                            </span>
                            <span :class="`badge badge-${getCategoriaColor(informativo.categoria)}`">
                                {{ informativo.categoria }}
                            </span>
                            <span :class="`badge badge-${getPrioridadeColor(informativo.prioridade)}`">
                                {{ informativo.prioridade === 1 ? 'Alta Prioridade' : informativo.prioridade === 2 ? 'Média Prioridade' : 'Baixa Prioridade' }}
                            </span>
                            <span v-if="!informativo.isValido" class="badge badge-danger">
                                {{ informativo.isExpirado ? 'Expirado' : 'Inválido' }}
                            </span>
                        </div>

                        <!-- Meta Information -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                </svg>
                                <span><strong>Publicado:</strong> {{ formatDate(informativo.dataPublicacao) }}</span>
                            </div>
                            <div v-if="informativo.dataExpiracao" class="flex items-center gap-2" :class="{ 'text-danger': informativo.isExpirado }">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                                </svg>
                                <span><strong>Expira:</strong> {{ formatDate(informativo.dataExpiracao) }}</span>
                            </div>
                            <div v-if="informativo.linkExterno" class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                </svg>
                                <a :href="informativo.linkExterno" target="_blank" class="text-primary hover:underline">
                                    Link Externo
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <button
                            @click="editInformativo"
                            class="btn btn-outline-primary"
                        >
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                            Editar
                        </button>
                        <button
                            @click="duplicateInformativo"
                            class="btn btn-outline-secondary"
                            :disabled="isActionLoading"
                        >
                            <svg v-if="!isActionLoading" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/>
                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"/>
                            </svg>
                            <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isActionLoading ? 'Duplicando...' : 'Duplicar' }}
                        </button>
                        <button
                            @click="toggleStatus"
                            :class="informativo.ativo ? 'btn btn-outline-warning' : 'btn btn-outline-success'"
                            :disabled="isActionLoading"
                        >
                            <svg v-if="!isActionLoading && informativo.ativo" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                            </svg>
                            <svg v-else-if="!isActionLoading && !informativo.ativo" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isActionLoading ? (informativo.ativo ? 'Desativando...' : 'Ativando...') : (informativo.ativo ? 'Desativar' : 'Ativar') }}
                        </button>
                        <button
                            @click="confirmDelete"
                            class="btn btn-outline-danger"
                            :disabled="isActionLoading"
                        >
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Image -->
                    <div v-if="informativo.imagemUrl" class="panel">
                        <img
                            :src="informativo.imagemUrl"
                            :alt="informativo.titulo"
                            class="w-full h-64 object-cover rounded-lg"
                            @error="handleImageError"
                        />
                    </div>

                    <!-- Content -->
                    <div class="panel">
                        <h3 class="text-lg font-semibold mb-4">Conteúdo</h3>
                        <div class="prose prose-lg max-w-none dark:prose-invert">
                            <div v-html="formattedContent"></div>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div v-if="informativo.tags && informativo.tags.length > 0" class="panel">
                        <h3 class="text-lg font-semibold mb-4">Tags</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="tag in informativo.tags"
                                :key="tag"
                                class="badge badge-info"
                            >
                                #{{ tag }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Quick Actions -->
                    <div class="panel">
                        <h3 class="text-lg font-semibold mb-4">Ações Rápidas</h3>
                        <div class="space-y-3">
                            <button
                                @click="shareInformativo"
                                class="w-full btn btn-outline-primary"
                            >
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                                </svg>
                                Compartilhar
                            </button>
                            <button
                                @click="printInformativo"
                                class="w-full btn btn-outline-secondary"
                            >
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm6 0v2H9v-2h2zM9 14h2v-3H9v3zm6 0h1v-3h-1v3z" clip-rule="evenodd"/>
                                </svg>
                                Imprimir
                            </button>
                            <button
                                @click="exportToPDF"
                                class="w-full btn btn-outline-secondary"
                            >
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 14a1.998 1.998 0 01-2.828 0l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    <!-- Information -->
                    <div class="panel">
                        <h3 class="text-lg font-semibold mb-4">Informações</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                                <code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ informativo.id?.slice(-8) }}</code>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Categoria:</span>
                                <span>{{ informativo.categoria }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Prioridade:</span>
                                <span>{{ informativo.prioridade === 1 ? 'Alta' : informativo.prioridade === 2 ? 'Média' : 'Baixa' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                                <span>{{ informativo.ativo ? 'Ativo' : 'Inativo' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Validade:</span>
                                <span :class="{ 'text-danger': !informativo.isValido }">
                                    {{ informativo.isValido ? 'Válido' : (informativo.isExpirado ? 'Expirado' : 'Inválido') }}
                                </span>
                            </div>
                            <div v-if="informativo.tags" class="flex justify-between items-center">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Tags:</span>
                                <span>{{ informativo.tags.length }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Related Informativos -->
                    <div v-if="relatedInformativos.length > 0" class="panel">
                        <h3 class="text-lg font-semibold mb-4">Informativos Relacionados</h3>
                        <div class="space-y-3">
                            <div
                                v-for="related in relatedInformativos"
                                :key="related.id"
                                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                @click="viewRelated(related)"
                            >
                                <h4 class="font-medium text-sm line-clamp-2">{{ related.titulo }}</h4>
                                <div class="flex items-center gap-2 mt-1">
                                    <span :class="`badge badge-${getCategoriaColor(related.categoria)} text-xs`">
                                        {{ related.categoria }}
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        {{ formatDateShort(related.dataPublicacao) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação de Exclusão -->
        <div v-if="deleteModal.show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDeleteModal"></div>
                <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        Tem certeza que deseja excluir permanentemente este informativo?
                                    </p>
                                    <p class="text-sm text-red-600 mt-2 font-medium">⚠️ Esta ação não pode ser desfeita!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            @click="handleConfirmDelete"
                            type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                            :disabled="deleteModal.loading"
                        >
                            {{ deleteModal.loading ? 'Excluindo...' : 'Sim, Excluir' }}
                        </button>
                        <button
                            @click="closeDeleteModal"
                            type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700"
                            :disabled="deleteModal.loading"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div v-if="notifications.length > 0" class="fixed top-4 right-4 z-50 space-y-2">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="`alert alert-${notification.type} shadow-lg`"
            >
                <span>{{ notification.message }}</span>
                <button @click="removeNotification(notification.id)" class="ml-auto">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useInformativo } from '@/composables/useInformativo';
    import { InformativoModel } from '@/models/InformativoModel';

    const router = useRouter();
    const route = useRoute();

    const {
        // State
        informativos,
        informativoSelecionado,
        isLoading,
        error,

        // Actions
        fetchInformativoById,
        ativarInformativo,
        desativarInformativo,
        deleteInformativo,
        createInformativo,
        selectInformativo,
        loadInformativoToForm,
        createInformativoFromForm,

        // Utils
        formatDate,
        formatDateShort,
        getPrioridadeColor,
        getCategoriaColor,
    } = useInformativo();

    // Local state
    const informativo = ref<InformativoModel | null>(null);
    const isActionLoading = ref(false);
    const notifications = ref<Array<{ id: string; type: 'success' | 'error' | 'warning'; message: string }>>([]);
    const deleteModal = ref({
        show: false,
        loading: false,
    });

    // Computed
    const formattedContent = computed(() => {
        if (!informativo.value?.conteudo) return '';
        // Convert line breaks to HTML
        return informativo.value.conteudo.replace(/\n/g, '<br>');
    });

    const relatedInformativos = computed(() => {
        if (!informativo.value) return [];

        return informativos.value
            .filter(i =>
                i.id !== informativo.value?.id &&
                i.categoria === informativo.value?.categoria &&
                i.ativo
            )
            .slice(0, 3);
    });

    // Methods
    const goBack = () => {
        router.push('/informativos');
    };

    const editInformativo = () => {
        if (informativo.value?.id) {
            router.push(`/informativos/${informativo.value.id}/editar`);
        }
    };

    const duplicateInformativo = async () => {
        if (!informativo.value?.id) return;

        isActionLoading.value = true;

        try {
            loadInformativoToForm(informativo.value);
            const novoInformativo = createInformativoFromForm();

            novoInformativo.titulo = `[CÓPIA] ${novoInformativo.titulo}`;
            novoInformativo.id = undefined;
            novoInformativo.dataPublicacao = new Date();

            const result = await createInformativo();
            if (result) {
                showNotification('success', 'Informativo duplicado com sucesso');
                router.push('/informativos');
            } else {
                showNotification('error', 'Erro ao duplicar informativo');
            }
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao duplicar informativo');
        } finally {
            isActionLoading.value = false;
        }
    };

    const toggleStatus = async () => {
        if (!informativo.value?.id) return;

        isActionLoading.value = true;

        try {
            const success = informativo.value.ativo
                ? await desativarInformativo(informativo.value.id)
                : await ativarInformativo(informativo.value.id);

            if (success) {
                informativo.value.ativo = !informativo.value.ativo;
                showNotification('success', `Informativo ${informativo.value.ativo ? 'ativado' : 'desativado'} com sucesso`);
            } else {
                showNotification('error', 'Erro ao alterar status do informativo');
            }
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao alterar status');
        } finally {
            isActionLoading.value = false;
        }
    };

    const confirmDelete = () => {
        deleteModal.value.show = true;
    };

    const handleConfirmDelete = async () => {
        if (!informativo.value?.id) return;

        deleteModal.value.loading = true;

        try {
            await deleteInformativo(informativo.value.id);
            showNotification('success', 'Informativo excluído com sucesso');
            router.push('/informativos');
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao excluir informativo');
        } finally {
            deleteModal.value.loading = false;
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        deleteModal.value.show = false;
        deleteModal.value.loading = false;
    };

    const shareInformativo = () => {
        if (navigator.share && informativo.value) {
            navigator.share({
                title: informativo.value.titulo,
                text: informativo.value.conteudo.substring(0, 200) + '...',
                url: window.location.href,
            }).catch(err => {
                copyToClipboard();
            });
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('success', 'Link copiado para a área de transferência');
        }).catch(() => {
            showNotification('error', 'Erro ao copiar link');
        });
    };

    const printInformativo = () => {
        window.print();
    };

    const exportToPDF = () => {
        // Implementar exportação para PDF
        showNotification('warning', 'Funcionalidade de exportação em desenvolvimento');
    };

    const viewRelated = (related: InformativoModel) => {
        if (related.id) {
            router.push(`/informativos/${related.id}`);
        }
    };

    const handleImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    };

    // Notification helpers
    const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
        const id = Date.now().toString();
        notifications.value.push({ id, type, message });

        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index > -1) {
            notifications.value.splice(index, 1);
        }
    };

    // Lifecycle
    onMounted(async () => {
        const id = route.params.id as string;
        if (id) {
            const fetchedInformativo = await fetchInformativoById(id);
            if (fetchedInformativo) {
                informativo.value = fetchedInformativo;
                selectInformativo(fetchedInformativo);
            } else {
                showNotification('error', 'Informativo não encontrado');
                router.push('/informativos');
            }
        } else {
            router.push('/informativos');
        }
    });
</script>

<style scoped>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .panel {
        @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6;
    }

    .badge {
        @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
    }

    .badge-success {
        @apply bg-green-100 text-green-800 border border-green-200;
    }

    .badge-secondary {
        @apply bg-gray-100 text-gray-800 border border-gray-200;
    }

    .badge-info {
        @apply bg-blue-100 text-blue-800 border border-blue-200;
    }

    .badge-warning {
        @apply bg-yellow-100 text-yellow-800 border border-yellow-200;
    }

    .badge-danger {
        @apply bg-red-100 text-red-800 border border-red-200;
    }

    .badge-primary {
        @apply bg-blue-100 text-blue-800 border border-blue-200;
    }

    .alert {
        @apply px-4 py-3 rounded-md transition-all duration-300 ease-in-out flex items-center justify-between;
        animation: slideInRight 0.3s ease-out;
    }

    .alert-success {
        @apply bg-green-100 border border-green-200 text-green-800;
    }

    .alert-error {
        @apply bg-red-100 border border-red-200 text-red-800;
    }

    .alert-warning {
        @apply bg-yellow-100 border border-yellow-200 text-yellow-800;
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .prose {
        line-height: 1.6;
    }

    .prose p {
        margin-bottom: 1rem;
    }

    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .prose ul, .prose ol {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }

    .prose a {
        color: rgb(59 130 246);
        text-decoration: underline;
    }

    .prose a:hover {
        color: rgb(37 99 235);
    }

    @media print {
        .no-print {
            display: none !important;
        }

        .panel {
            border: none !important;
            box-shadow: none !important;
        }
    }
</style>
