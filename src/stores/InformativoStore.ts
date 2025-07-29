// src/stores/InformativoStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { InformativoModel } from '@/models/InformativoModel';
import InformativoService, { IInformativoService } from '@/services/InformativoService';

export const useInformativoStore = defineStore('informativo', () => {
    // State
    const informativos = ref<InformativoModel[]>([]);
    const informativoSelecionado = ref<InformativoModel | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const categorias = ref<string[]>(['PMDF', 'CBMDF', 'GERAL', 'URGENTE']);

    // Paginação
    const currentPage = ref(1);
    const hasMore = ref(true);
    const lastDocId = ref<string | null>(null);

    // Service
    const service: IInformativoService = InformativoService;

    // Getters (Computed)
    const informativosAtivos = computed(() =>
        informativos.value.filter(informativo => informativo.ativo)
    );

    const informativosValidos = computed(() =>
        informativos.value.filter(informativo => informativo.isValido)
    );

    const informativosAltaPrioridade = computed(() =>
        informativos.value.filter(informativo => informativo.prioridade === 1)
    );

    const informativosPorCategoria = computed(() => {
        const grouped: { [key: string]: InformativoModel[] } = {};
        informativos.value.forEach(informativo => {
            if (!grouped[informativo.categoria]) {
                grouped[informativo.categoria] = [];
            }
            grouped[informativo.categoria].push(informativo);
        });
        return grouped;
    });

    const totalInformativos = computed(() => informativos.value.length);

    const informativosRecentes = computed(() =>
        informativos.value
            .filter(informativo => informativo.isValido)
            .sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime())
            .slice(0, 10)
    );

    // Actions
    const setLoading = (value: boolean) => {
        loading.value = value;
    };

    const setError = (message: string | null) => {
        error.value = message;
    };

    const clearError = () => {
        error.value = null;
    };

    // CRUD Operations
    const createInformativo = async (informativo: InformativoModel): Promise<InformativoModel | null> => {
        try {
            setLoading(true);
            clearError();

            const novoInformativo = await service.createInformativo(informativo);
            informativos.value.unshift(novoInformativo);

            return novoInformativo;
        } catch (err: any) {
            setError(err.message || 'Erro ao criar informativo');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchInformativoById = async (id: string): Promise<InformativoModel | null> => {
        try {
            setLoading(true);
            clearError();

            const informativo = await service.getInformativoById(id);
            if (informativo) {
                informativoSelecionado.value = informativo;
            }

            return informativo;
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar informativo');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchInformativos = async (forceRefresh: boolean = false): Promise<void> => {
        try {
            setLoading(true);
            clearError();

            if (forceRefresh) {
                informativos.value = [];
                currentPage.value = 1;
                lastDocId.value = null;
                hasMore.value = true;
            }

            const result = await service.getAllInformativos(20, lastDocId.value || undefined);

            if (forceRefresh) {
                informativos.value = result;
            } else {
                informativos.value.push(...result);
            }

            // Para paginação simples, assumimos que se retornou menos que o limite, não há mais dados
            hasMore.value = result.length === 20;
            if (result.length > 0) {
                lastDocId.value = result[result.length - 1].id || null;
            }

        } catch (err: any) {
            setError(err.message || 'Erro ao buscar informativos');
        } finally {
            setLoading(false);
        }
    };

    const fetchInformativosByCategoria = async (categoria: string): Promise<void> => {
        try {
            setLoading(true);
            clearError();

            const result = await service.getInformativosByCategoria(categoria);
            informativos.value = result;

        } catch (err: any) {
            setError(err.message || 'Erro ao buscar informativos por categoria');
        } finally {
            setLoading(false);
        }
    };

    const fetchInformativosAtivos = async (): Promise<void> => {
        try {
            setLoading(true);
            clearError();

            const result = await service.getInformativosAtivos();
            informativos.value = result;

        } catch (err: any) {
            setError(err.message || 'Erro ao buscar informativos ativos');
        } finally {
            setLoading(false);
        }
    };

    const fetchInformativosValidos = async (): Promise<void> => {
        try {
            setLoading(true);
            clearError();

            const result = await service.getInformativosValidos();
            informativos.value = result;

        } catch (err: any) {
            setError(err.message || 'Erro ao buscar informativos válidos');
        } finally {
            setLoading(false);
        }
    };

    const updateInformativo = async (id: string, informativo: Partial<InformativoModel>): Promise<InformativoModel | null> => {
        try {
            setLoading(true);
            clearError();

            const informativoAtualizado = await service.updateInformativo(id, informativo);

            // Atualizar na lista
            const index = informativos.value.findIndex(i => i.id === id);
            if (index !== -1) {
                informativos.value[index] = informativoAtualizado;
            }

            // Atualizar o selecionado se for o mesmo
            if (informativoSelecionado.value?.id === id) {
                informativoSelecionado.value = informativoAtualizado;
            }

            return informativoAtualizado;
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar informativo');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteInformativo = async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            clearError();

            await service.deleteInformativo(id);

            // Remover da lista
            informativos.value = informativos.value.filter(i => i.id !== id);

            // Limpar selecionado se for o mesmo
            if (informativoSelecionado.value?.id === id) {
                informativoSelecionado.value = null;
            }

            return true;
        } catch (err: any) {
            setError(err.message || 'Erro ao deletar informativo');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Actions específicas
    const ativarInformativo = async (id: string): Promise<boolean> => {
        try {
            const result = await service.ativarInformativo(id);
            if (result) {
                await updateLocalInformativo(id, { ativo: true });
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Erro ao ativar informativo');
            return false;
        }
    };

    const desativarInformativo = async (id: string): Promise<boolean> => {
        try {
            const result = await service.desativarInformativo(id);
            if (result) {
                await updateLocalInformativo(id, { ativo: false });
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Erro ao desativar informativo');
            return false;
        }
    };

    const alterarPrioridade = async (id: string, prioridade: number): Promise<boolean> => {
        try {
            const result = await service.alterarPrioridade(id, prioridade);
            if (result) {
                await updateLocalInformativo(id, { prioridade });
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Erro ao alterar prioridade');
            return false;
        }
    };

    // Utility functions
    const updateLocalInformativo = (id: string, updates: Partial<InformativoModel>) => {
        const index = informativos.value.findIndex(i => i.id === id);
        if (index !== -1) {
            informativos.value[index] = informativos.value[index].copyWith(updates);
        }

        if (informativoSelecionado.value?.id === id) {
            informativoSelecionado.value = informativoSelecionado.value.copyWith(updates);
        }
    };

    const selectInformativo = (informativo: InformativoModel) => {
        informativoSelecionado.value = informativo;
    };

    const clearSelectedInformativo = () => {
        informativoSelecionado.value = null;
    };

    const loadMoreInformativos = async (): Promise<void> => {
        if (!hasMore.value || loading.value) return;
        await fetchInformativos(false);
    };

    const refreshInformativos = async (): Promise<void> => {
        await fetchInformativos(true);
    };

    // Filtros e busca
    const getInformativosByCategoria = (categoria: string): InformativoModel[] => {
        return informativos.value.filter(informativo => informativo.categoria === categoria);
    };

    const getInformativosByPrioridade = (prioridade: number): InformativoModel[] => {
        return informativos.value.filter(informativo => informativo.prioridade === prioridade);
    };

    const searchInformativos = (searchTerm: string): InformativoModel[] => {
        const term = searchTerm.toLowerCase();
        return informativos.value.filter(informativo =>
            informativo.titulo.toLowerCase().includes(term) ||
            informativo.conteudo.toLowerCase().includes(term) ||
            informativo.categoria.toLowerCase().includes(term) ||
            (informativo.tags && informativo.tags.some(tag => tag.toLowerCase().includes(term)))
        );
    };

    // Reset store
    const resetStore = () => {
        informativos.value = [];
        informativoSelecionado.value = null;
        loading.value = false;
        error.value = null;
        currentPage.value = 1;
        hasMore.value = true;
        lastDocId.value = null;
    };

    return {
        // State
        informativos,
        informativoSelecionado,
        loading,
        error,
        categorias,
        currentPage,
        hasMore,
        lastDocId,

        // Getters
        informativosAtivos,
        informativosValidos,
        informativosAltaPrioridade,
        informativosPorCategoria,
        totalInformativos,
        informativosRecentes,

        // Actions
        setLoading,
        setError,
        clearError,
        createInformativo,
        fetchInformativoById,
        fetchInformativos,
        fetchInformativosByCategoria,
        fetchInformativosAtivos,
        fetchInformativosValidos,
        updateInformativo,
        deleteInformativo,
        ativarInformativo,
        desativarInformativo,
        alterarPrioridade,
        selectInformativo,
        clearSelectedInformativo,
        loadMoreInformativos,
        refreshInformativos,
        getInformativosByCategoria,
        getInformativosByPrioridade,
        searchInformativos,
        resetStore,
    };
});
