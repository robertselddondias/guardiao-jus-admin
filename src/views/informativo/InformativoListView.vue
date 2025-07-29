<template>
    <div class="panel">
        <!-- Header -->
        <div class="panel-header">
            <div class="flex items-center justify-between">
                <h5 class="font-semibold text-lg dark:text-white-light">
                    Informativos
                </h5>
                <div class="flex items-center gap-3">
                    <!-- Filtros -->
                    <div class="dropdown">
                        <Popper :arrow="false" offsetDistance="0" placement="bottom-start">
                            <button type="button" class="btn btn-outline-primary dropdown-toggle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                                    <path d="M3 7H21L19 2H5L3 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 7L19 22H5L3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 2V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Filtros
                            </button>
                            <template #content="{ close }">
                                <ul @click="close()">
                                    <li>
                                        <button @click="filterByStatus('all')" type="button">
                                            Todos
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="filterByStatus('ativo')" type="button">
                                            Ativos
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="filterByStatus('valido')" type="button">
                                            Válidos
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="filterByStatus('alta')" type="button">
                                            Alta Prioridade
                                        </button>
                                    </li>
                                </ul>
                            </template>
                        </Popper>
                    </div>

                    <!-- Categoria Filter -->
                    <select v-model="selectedCategory" @change="onCategoryChange" class="form-select">
                        <option value="">Todas as Categorias</option>
                        <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>

                    <!-- Search -->
                    <div class="relative">
                        <input
                            v-model="searchTerm"
                            type="text"
                            placeholder="Buscar informativos..."
                            class="form-input pr-10"
                            @input="onSearch"
                        />
                        <svg
                            class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <!-- Add Button -->
                    <router-link to="/informativos/criar" class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Novo Informativo
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold">{{ statistics.total }}</div>
                        <div class="text-sm text-gray-500">Total</div>
                    </div>
                    <div class="bg-primary/10 p-3 rounded-full">
                        <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-success">{{ statistics.ativos }}</div>
                        <div class="text-sm text-gray-500">Ativos</div>
                    </div>
                    <div class="bg-success/10 p-3 rounded-full">
                        <svg class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-warning">{{ statistics.altaPrioridade }}</div>
                        <div class="text-sm text-gray-500">Alta Prioridade</div>
                    </div>
                    <div class="bg-warning/10 p-3 rounded-full">
                        <svg class="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-danger">{{ statistics.expirados }}</div>
                        <div class="text-sm text-gray-500">Expirados</div>
                    </div>
                    <div class="bg-danger/10 p-3 rounded-full">
                        <svg class="w-6 h-6 text-danger" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && filteredInformativos.length === 0" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p class="mt-4 text-gray-500">Carregando informativos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <svg class="w-16 h-16 text-danger mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-danger font-medium">{{ error }}</p>
            <button @click="refreshInformativos" class="btn btn-primary mt-4">
                Tentar Novamente
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredInformativos.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum informativo encontrado
            </h3>
            <p class="text-gray-500 mb-4">
                {{ searchTerm ? 'Tente ajustar sua busca ou filtros.' : 'Comece criando seu primeiro informativo.' }}
            </p>
            <router-link to="/informativos/criar" class="btn btn-primary">
                Criar Primeiro Informativo
            </router-link>
        </div>

        <!-- Informativos List -->
        <div v-else class="space-y-4">
            <div
                v-for="informativo in filteredInformativos"
                :key="informativo.id"
                class="panel hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                @click="viewInformativo(informativo)"
            >
                <div class="flex items-start justify-between">
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-2">
                            <!-- Status Badge -->
                            <span
                                :class="`badge badge-outline-${informativo.ativo ? 'success' : 'secondary'}`"
                            >
                                {{ informativo.ativo ? 'Ativo' : 'Inativo' }}
                            </span>

                            <!-- Category Badge -->
                            <span
                                :class="`badge badge-outline-${getCategoriaColor(informativo.categoria)}`"
                            >
                                {{ informativo.categoria }}
                            </span>

                            <!-- Priority Badge -->
                            <span
                                :class="`badge badge-outline-${getPrioridadeColor(informativo.prioridade)}`"
                            >
                                <svg :class="`w-3 h-3 mr-1`" fill="currentColor" viewBox="0 0 20 20">
                                    <path v-if="informativo.prioridade === 1" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clip-rule="evenodd"/>
                                    <path v-else-if="informativo.prioridade === 2" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                                </svg>
                                {{ informativo.prioridadeString }}
                            </span>

                            <!-- Validity Badge -->
                            <span
                                v-if="!informativo.isValido"
                                class="badge badge-outline-danger"
                            >
                                {{ informativo.isExpirado ? 'Expirado' : 'Inválido' }}
                            </span>
                        </div>

                        <!-- Title -->
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {{ informativo.titulo }}
                        </h3>

                        <!-- Content Preview -->
                        <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                            {{ informativo.conteudo }}
                        </p>

                        <!-- Tags -->
                        <div v-if="informativo.tags && informativo.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                            <span
                                v-for="tag in informativo.tags.slice(0, 3)"
                                :key="tag"
                                class="badge badge-outline-info text-xs"
                            >
                                #{{ tag }}
                            </span>
                            <span
                                v-if="informativo.tags.length > 3"
                                class="badge badge-outline-secondary text-xs"
                            >
                                +{{ informativo.tags.length - 3 }}
                            </span>
                        </div>

                        <!-- Meta Info -->
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <div class="flex items-center gap-4">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                    </svg>
                                    {{ formatDate(informativo.dataPublicacao) }}
                                </span>

                                <span
                                    v-if="informativo.dataExpiracao"
                                    class="flex items-center gap-1"
                                    :class="{ 'text-danger': informativo.isExpirado }"
                                >
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                                    </svg>
                                    Expira: {{ formatDateShort(informativo.dataExpiracao) }}
                                </span>

                                <span v-if="informativo.linkExterno" class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                    </svg>
                                    Link externo
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Image -->
                    <div v-if="informativo.imagemUrl" class="ml-4 flex-shrink-0">
                        <img
                            :src="informativo.imagemUrl"
                            :alt="informativo.titulo"
                            class="w-20 h-20 object-cover rounded-lg"
                            @error="handleImageError"
                        />
                    </div>

                    <!-- Actions -->
                    <div class="ml-4 flex-shrink-0">
                        <div class="dropdown">
                            <Popper :arrow="false" offsetDistance="0" placement="bottom-end">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    @click.stop
                                >
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                    </svg>
                                </button>
                                <template #content="{ close }">
                                    <ul @click="close()">
                                        <li>
                                            <button @click="editInformativo(informativo)" type="button">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                                </svg>
                                                Editar
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                @click="toggleStatus(informativo)"
                                                type="button"
                                                :class="informativo.ativo ? 'text-warning' : 'text-success'"
                                            >
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path v-if="informativo.ativo" fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                                                    <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                </svg>
                                                {{ informativo.ativo ? 'Desativar' : 'Ativar' }}
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                @click="confirmDelete(informativo)"
                                                type="button"
                                                class="text-danger"
                                            >
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                </svg>
                                                Excluir
                                            </button>
                                        </li>
                                    </ul>
                                </template>
                            </Popper>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore && !isLoading" class="text-center py-4">
                <button
                    @click="loadMoreInformativos"
                    class="btn btn-outline-primary"
                    :disabled="isLoading"
                >
                    <svg v-if="isLoading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? 'Carregando...' : 'Carregar Mais' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useInformativo } from '@/composables/useInformativo';
    import { InformativoModel } from '@/models/InformativoModel';

    const router = useRouter();
    const {
        // State
        informativos,
        isLoading,
        error,
        statistics,
        categorias,
        hasMore,

        // Actions
        fetchInformativos,
        fetchInformativosByCategoria,
        fetchInformativosAtivos,
        fetchInformativosValidos,
        refreshInformativos,
        loadMoreInformativos,
        ativarInformativo,
        desativarInformativo,
        deleteInformativo,
        searchInformativos,
        selectInformativo,

        // Utils
        formatDate,
        formatDateShort,
        getPrioridadeColor,
        getCategoriaColor,
    } = useInformativo();

    // Local state
    const searchTerm = ref('');
    const selectedCategory = ref('');
    const currentFilter = ref('all');

    // Computed
    const filteredInformativos = computed(() => {
        let filtered = informativos.value;

        // Apply search
        if (searchTerm.value) {
            filtered = searchInformativos(searchTerm.value);
        }

        // Apply category filter
        if (selectedCategory.value) {
            filtered = filtered.filter(i => i.categoria === selectedCategory.value);
        }

        // Apply status filter
        switch (currentFilter.value) {
            case 'ativo':
                filtered = filtered.filter(i => i.ativo);
                break;
            case 'valido':
                filtered = filtered.filter(i => i.isValido);
                break;
            case 'alta':
                filtered = filtered.filter(i => i.prioridade === 1);
                break;
        }

        return filtered;
    });

    // Methods
    const filterByStatus = (status: string) => {
        currentFilter.value = status;

        switch (status) {
            case 'ativo':
                fetchInformativosAtivos();
                break;
            case 'valido':
                fetchInformativosValidos();
                break;
            case 'all':
            default:
                fetchInformativos(true);
                break;
        }
    };

    const onCategoryChange = () => {
        if (selectedCategory.value) {
            fetchInformativosByCategoria(selectedCategory.value);
        } else {
            fetchInformativos(true);
        }
    };

    const onSearch = () => {
        // Debounce search could be implemented here
    };

    const viewInformativo = (informativo: InformativoModel) => {
        selectInformativo(informativo);
        router.push(`/informativos/${informativo.id}`);
    };

    const editInformativo = (informativo: InformativoModel) => {
        selectInformativo(informativo);
        router.push(`/informativos/${informativo.id}/editar`);
    };

    const toggleStatus = async (informativo: InformativoModel) => {
        if (!informativo.id) return;

        const success = informativo.ativo
            ? await desativarInformativo(informativo.id)
            : await ativarInformativo(informativo.id);

        if (success) {
            // Optionally show success message
            console.log(`Informativo ${informativo.ativo ? 'desativado' : 'ativado'} com sucesso`);
        }
    };

    const confirmDelete = (informativo: InformativoModel) => {
        if (!informativo.id) return;

        if (confirm(`Tem certeza que deseja excluir o informativo "${informativo.titulo}"?`)) {
            handleDelete(informativo.id);
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deleteInformativo(id);
        if (success) {
            // Optionally show success message
            console.log('Informativo excluído com sucesso');
        }
    };

    const handleImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    };

    // Lifecycle
    onMounted(() => {
        fetchInformativos(true);
    });

    // Watch for route changes to refresh data
    watch(() => router.currentRoute.value.path, (newPath) => {
        if (newPath === '/informativos') {
            refreshInformativos();
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

    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .panel:hover {
        transform: translateY(-1px);
    }

    .dropdown ul {
        @apply bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-48;
    }

    .dropdown li button {
        @apply w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center;
    }
</style>
