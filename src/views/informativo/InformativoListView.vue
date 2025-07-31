<template>
    <div>
        <!-- Breadcrumb -->
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:" class="text-primary hover:underline">Dashboard</a>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Informativos</span>
            </li>
        </ul>

        <!-- Notifications -->
        <div v-if="notifications.length > 0" class="mb-4 space-y-2">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="`alert alert-${notification.type}`"
            >
                <span>{{ notification.message }}</span>
                <button @click="removeNotification(notification.id)" class="ml-auto">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Actions Bar -->
        <div class="pt-5">
            <div class="flex items-center justify-between mb-5">
                <h5 class="font-semibold text-lg dark:text-white-light">Lista de Informativos</h5>
                <div class="flex items-center gap-3">
                    <!-- Refresh Button -->
                    <button
                        @click="refreshInformativos"
                        :disabled="isLoading"
                        class="btn btn-outline-secondary"
                        title="Atualizar Lista"
                    >
                        <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </button>

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

        <!-- Header -->
        <div class="panel">
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
                                        <path d="M3 4H21L19 6.5V20L12 14L5 20V6.5L3 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="panel">
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
                    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
                >
                    <div class="flex items-start justify-between">
                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-3 mb-3">
                                <!-- Status Badge -->
                                <span
                                    :class="`badge ${informativo.ativo ? 'badge-success' : 'badge-secondary'}`"
                                >
                                    {{ informativo.ativo ? 'Ativo' : 'Inativo' }}
                                </span>

                                <!-- Category Badge -->
                                <span :class="`badge badge-${getCategoriaColor(informativo.categoria)}`">
                                    {{ informativo.categoria }}
                                </span>

                                <!-- Priority Badge -->
                                <span :class="`badge badge-${getPrioridadeColor(informativo.prioridade)}`">
                                    {{ informativo.prioridade === 1 ? 'Alta' : informativo.prioridade === 2 ? 'Média' : 'Baixa' }}
                                </span>

                                <!-- Invalid Badge -->
                                <span
                                    v-if="!informativo.isValido"
                                    class="badge badge-danger"
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
                            <div v-if="informativo.tags && informativo.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                                <span
                                    v-for="tag in informativo.tags.slice(0, 3)"
                                    :key="tag"
                                    class="badge badge-info text-xs"
                                >
                                    #{{ tag }}
                                </span>
                                <span
                                    v-if="informativo.tags.length > 3"
                                    class="badge badge-secondary text-xs"
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
                        <div v-if="informativo.imagemUrl" class="ml-6 flex-shrink-0">
                            <img
                                :src="informativo.imagemUrl"
                                :alt="informativo.titulo"
                                class="w-24 h-24 object-cover rounded-lg"
                                @error="handleImageError"
                            />
                        </div>

                        <!-- Actions - DROPDOWN CORRIGIDO -->
                        <div class="ml-4 flex-shrink-0">
                            <div class="dropdown relative">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    @click.stop="toggleDropdown(informativo.id)"
                                    :disabled="Object.values(loadingActions).some(loading => loading)"
                                >
                                    <svg v-if="!Object.values(loadingActions).some(loading => loading)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                    </svg>
                                    <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </button>

                                <!-- Dropdown menu -->
                                <div
                                    v-show="activeDropdown === informativo.id"
                                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                                    @click.stop="closeDropdown"
                                >
                                    <ul class="py-1">
                                        <!-- Visualizar -->
                                        <li>
                                            <button @click="viewInformativo(informativo)" type="button" class="dropdown-item">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                                                </svg>
                                                Visualizar
                                            </button>
                                        </li>

                                        <!-- Editar -->
                                        <li>
                                            <button @click="editInformativo(informativo)" type="button" class="dropdown-item">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                                </svg>
                                                Editar
                                            </button>
                                        </li>

                                        <!-- Duplicar -->
                                        <li>
                                            <button @click="duplicateInformativo(informativo)" type="button" class="dropdown-item">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/>
                                                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"/>
                                                </svg>
                                                Duplicar
                                            </button>
                                        </li>

                                        <li><hr class="my-1 border-gray-200 dark:border-gray-700" /></li>

                                        <!-- Ativar/Desativar -->
                                        <li>
                                            <button
                                                @click="toggleStatus(informativo)"
                                                type="button"
                                                :class="informativo.ativo ? 'text-warning' : 'text-success'"
                                                class="dropdown-item"
                                                :disabled="isActionLoading('toggle', informativo.id || '')"
                                            >
                                                <svg v-if="!isActionLoading('toggle', informativo.id || '') && informativo.ativo" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else-if="!isActionLoading('toggle', informativo.id || '') && !informativo.ativo" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {{ informativo.ativo ? 'Desativar' : 'Ativar' }}
                                            </button>
                                        </li>

                                        <li><hr class="my-1 border-gray-200 dark:border-gray-700" /></li>

                                        <!-- Prioridades -->
                                        <li>
                                            <button
                                                @click="changePriority(informativo, 1)"
                                                type="button"
                                                :class="informativo.prioridade === 1 ? 'text-danger font-bold' : ''"
                                                class="dropdown-item"
                                                :disabled="isActionLoading('priority', informativo.id || '')"
                                            >
                                                <svg v-if="!isActionLoading('priority', informativo.id || '')" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Prioridade Alta
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                @click="changePriority(informativo, 2)"
                                                type="button"
                                                :class="informativo.prioridade === 2 ? 'text-warning font-bold' : ''"
                                                class="dropdown-item"
                                                :disabled="isActionLoading('priority', informativo.id || '')"
                                            >
                                                <svg v-if="!isActionLoading('priority', informativo.id || '')" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Prioridade Média
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                @click="changePriority(informativo, 3)"
                                                type="button"
                                                :class="informativo.prioridade === 3 ? 'text-success font-bold' : ''"
                                                class="dropdown-item"
                                                :disabled="isActionLoading('priority', informativo.id || '')"
                                            >
                                                <svg v-if="!isActionLoading('priority', informativo.id || '')" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Prioridade Baixa
                                            </button>
                                        </li>

                                        <li><hr class="my-1 border-gray-200 dark:border-gray-700" /></li>

                                        <!-- Excluir -->
                                        <li>
                                            <button
                                                @click="confirmDelete(informativo)"
                                                type="button"
                                                class="dropdown-item text-danger"
                                                :disabled="isActionLoading('delete', informativo.id || '')"
                                            >
                                                <svg v-if="!isActionLoading('delete', informativo.id || '')" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                </svg>
                                                <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Excluir
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore && filteredInformativos.length > 0" class="flex justify-center mt-6">
                <button
                    @click="loadMoreInformativos"
                    :disabled="isLoading"
                    class="btn btn-outline-primary"
                >
                    <svg v-if="isLoading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? 'Carregando...' : 'Carregar Mais' }}
                </button>
            </div>
        </div>

        <!-- Modal de Confirmação de Exclusão -->
        <div v-if="deleteModal.show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    @click="closeDeleteModal"
                ></div>

                <!-- Modal content -->
                <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    Confirmar Exclusão
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        Tem certeza que deseja excluir permanentemente este informativo?
                                    </p>

                                    <div v-if="deleteModal.informativo" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                                        <div class="flex items-start gap-2">
                                            <span class="font-medium text-gray-700 dark:text-gray-300">Título:</span>
                                            <span class="text-gray-900 dark:text-white">{{ deleteModal.informativo.titulo }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-700 dark:text-gray-300">Categoria:</span>
                                            <span :class="`badge badge-${getCategoriaColor(deleteModal.informativo.categoria)}`">
                                                {{ deleteModal.informativo.categoria }}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-700 dark:text-gray-300">Publicado em:</span>
                                            <span class="text-gray-900 dark:text-white">{{ formatDate(deleteModal.informativo.dataPublicacao) }}</span>
                                        </div>
                                    </div>

                                    <p class="text-sm text-red-600 mt-3 font-medium">
                                        ⚠️ Esta ação não pode ser desfeita!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            @click="handleConfirmDelete"
                            type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            :disabled="deleteModal.loading"
                        >
                            <svg v-if="deleteModal.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ deleteModal.loading ? 'Excluindo...' : 'Sim, Excluir' }}
                        </button>
                        <button
                            @click="closeDeleteModal"
                            type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700"
                            :disabled="deleteModal.loading"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
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
        alterarPrioridade,
        deleteInformativo,
        searchInformativos,
        selectInformativo,
        createInformativo,
        loadInformativoToForm,
        createInformativoFromForm,

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

    // Estado do dropdown - CORREÇÃO PRINCIPAL
    const activeDropdown = ref<string | null>(null);

    // Loading states para ações individuais
    const loadingActions = ref<{ [key: string]: boolean }>({});

    // Toast/notification state
    const notifications = ref<Array<{ id: string; type: 'success' | 'error' | 'warning'; message: string }>>([]);

    // Modal de confirmação
    const deleteModal = ref({
        show: false,
        informativo: null as InformativoModel | null,
        loading: false,
    });

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

    // Methods - MÉTODOS DE DROPDOWN CORRIGIDOS
    const toggleDropdown = (id: string | undefined) => {
        if (!id) return;
        activeDropdown.value = activeDropdown.value === id ? null : id;
    };

    const closeDropdown = () => {
        activeDropdown.value = null;
    };

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

        const actionKey = `toggle_${informativo.id}`;
        loadingActions.value[actionKey] = true;

        try {
            const success = informativo.ativo
                ? await desativarInformativo(informativo.id)
                : await ativarInformativo(informativo.id);

            if (success) {
                showNotification('success', `Informativo ${informativo.ativo ? 'desativado' : 'ativado'} com sucesso`);
            } else {
                showNotification('error', 'Erro ao alterar status do informativo');
            }
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao alterar status');
        } finally {
            loadingActions.value[actionKey] = false;
        }
    };

    const changePriority = async (informativo: InformativoModel, novaPrioridade: number) => {
        if (!informativo.id || informativo.prioridade === novaPrioridade) return;

        const actionKey = `priority_${informativo.id}`;
        loadingActions.value[actionKey] = true;

        try {
            const success = await alterarPrioridade(informativo.id, novaPrioridade);
            if (success) {
                const prioridadeTexto = novaPrioridade === 1 ? 'Alta' : novaPrioridade === 2 ? 'Média' : 'Baixa';
                showNotification('success', `Prioridade alterada para ${prioridadeTexto}`);
            } else {
                showNotification('error', 'Erro ao alterar prioridade');
            }
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao alterar prioridade');
        } finally {
            loadingActions.value[actionKey] = false;
        }
    };

    const duplicateInformativo = async (informativo: InformativoModel) => {
        if (!informativo.id) return;

        const actionKey = `duplicate_${informativo.id}`;
        loadingActions.value[actionKey] = true;

        try {
            loadInformativoToForm(informativo);
            const novoInformativo = createInformativoFromForm();
            novoInformativo.titulo = `[CÓPIA] ${novoInformativo.titulo}`;
            novoInformativo.id = undefined;
            novoInformativo.dataPublicacao = new Date();

            const result = await createInformativo();
            if (result) {
                showNotification('success', 'Informativo duplicado com sucesso');
                refreshInformativos();
            } else {
                showNotification('error', 'Erro ao duplicar informativo');
            }
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao duplicar informativo');
        } finally {
            loadingActions.value[actionKey] = false;
        }
    };

    const confirmDelete = (informativo: InformativoModel) => {
        if (!informativo.id) return;
        deleteModal.value.informativo = informativo;
        deleteModal.value.show = true;
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.value.informativo?.id) return;

        deleteModal.value.loading = true;

        try {
            await deleteInformativo(deleteModal.value.informativo.id);
            showNotification('success', 'Informativo excluído com sucesso');
            closeDeleteModal();
            refreshInformativos();
        } catch (error: any) {
            showNotification('error', error.message || 'Erro ao excluir informativo');
        } finally {
            deleteModal.value.loading = false;
        }
    };

    const closeDeleteModal = () => {
        deleteModal.value.show = false;
        deleteModal.value.informativo = null;
        deleteModal.value.loading = false;
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

    // Utility methods
    const isActionLoading = (action: string, id: string): boolean => {
        return loadingActions.value[`${action}_${id}`] || false;
    };

    const handleImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    };

    // Lifecycle
    onMounted(async () => {
        await fetchInformativos(true);

        // Adicionar listener para fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target || !(e.target as Element).closest('.dropdown')) {
                closeDropdown();
            }
        });
    });

    watch(searchTerm, () => {
        // Could implement debounced search here
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

    .panel {
        @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6;
    }

    .panel-header {
        @apply border-b border-gray-200 dark:border-gray-700 pb-4 mb-4;
    }

    .dropdown ul {
        @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-48;
        z-index: 9999 !important;
    }

    .dropdown-item {
        @apply w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-150;
    }

    .dropdown-item:disabled {
        @apply opacity-50 cursor-not-allowed;
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
</style>
