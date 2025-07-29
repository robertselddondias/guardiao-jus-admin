// src/services/InformativoService.ts

import InformativoRepository, { IInformativoRepository } from '@/repositories/InformativoRepository';
import { InformativoModel } from '@/models/InformativoModel';

export interface IInformativoService {
    createInformativo(informativo: InformativoModel): Promise<InformativoModel>;
    getInformativoById(id: string): Promise<InformativoModel | null>;
    updateInformativo(id: string, informativo: Partial<InformativoModel>): Promise<InformativoModel>;
    deleteInformativo(id: string): Promise<void>;
    getAllInformativos(limit?: number, lastDocId?: string): Promise<InformativoModel[]>;
    getInformativosByCategoria(categoria: string): Promise<InformativoModel[]>;
    getInformativosAtivos(): Promise<InformativoModel[]>;
    getInformativosValidos(): Promise<InformativoModel[]>;
    getInformativosByPrioridade(prioridade: number): Promise<InformativoModel[]>;
    getInformativosRecentes(categoria?: string, limit?: number): Promise<InformativoModel[]>;
    ativarInformativo(id: string): Promise<InformativoModel>;
    desativarInformativo(id: string): Promise<InformativoModel>;
    alterarPrioridade(id: string, prioridade: number): Promise<InformativoModel>;
}

class InformativoService implements IInformativoService {
    private repository: IInformativoRepository;

    constructor(repository?: IInformativoRepository) {
        this.repository = repository || InformativoRepository;
    }

    async createInformativo(informativo: InformativoModel): Promise<InformativoModel> {
        try {
            // Validações básicas
            if (!informativo.titulo) {
                throw new Error('Título é obrigatório');
            }

            if (!informativo.conteudo) {
                throw new Error('Conteúdo é obrigatório');
            }

            if (!informativo.categoria) {
                throw new Error('Categoria é obrigatória');
            }

            // Validar prioridade
            if (informativo.prioridade < 1 || informativo.prioridade > 3) {
                throw new Error('Prioridade deve ser entre 1 (alta) e 3 (baixa)');
            }

            // Validar data de expiração
            if (informativo.dataExpiracao && informativo.dataExpiracao <= informativo.dataPublicacao) {
                throw new Error('Data de expiração deve ser posterior à data de publicação');
            }

            // Limpar campos undefined antes de salvar
            const informativoLimpo = informativo.copyWith({
                imagemUrl: informativo.imagemUrl || undefined,
                linkExterno: informativo.linkExterno || undefined,
                dataExpiracao: informativo.dataExpiracao || undefined,
                tags: (informativo.tags && informativo.tags.length > 0) ? informativo.tags : undefined,
            });

            const id = await this.repository.create(informativoLimpo);
            informativoLimpo.id = id;

            return informativoLimpo;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar informativo');
            }
        }
    }

    async getInformativoById(id: string): Promise<InformativoModel | null> {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            return await this.repository.findById(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativo');
            }
        }
    }

    async updateInformativo(id: string, informativo: Partial<InformativoModel>): Promise<InformativoModel> {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            // Validar se o informativo existe
            const existingInformativo = await this.repository.findById(id);
            if (!existingInformativo) {
                throw new Error('Informativo não encontrado');
            }

            // Validações de campos se estiverem sendo atualizados
            if (informativo.prioridade !== undefined && (informativo.prioridade < 1 || informativo.prioridade > 3)) {
                throw new Error('Prioridade deve ser entre 1 (alta) e 3 (baixa)');
            }

            if (informativo.dataExpiracao && informativo.dataExpiracao <= (informativo.dataPublicacao || existingInformativo.dataPublicacao)) {
                throw new Error('Data de expiração deve ser posterior à data de publicação');
            }

            // Preparar dados para atualização, removendo undefined
            const updateData: { [key: string]: any } = {};

            Object.keys(informativo).forEach(key => {
                const value = (informativo as any)[key];
                if (value !== undefined) {
                    if (key === 'dataPublicacao' || key === 'dataExpiracao') {
                        updateData[key] = value instanceof Date ? value.toISOString() : value;
                    } else if (key === 'tags' && Array.isArray(value) && value.length === 0) {
                        // Não incluir arrays vazios
                    } else if (key === 'imagemUrl' || key === 'linkExterno') {
                        // Só incluir se não for string vazia
                        if (value !== '') {
                            updateData[key] = value;
                        }
                    } else {
                        updateData[key] = value;
                    }
                }
            });

            await this.repository.update(id, updateData);

            // Retornar o informativo atualizado
            const updatedInformativo = await this.repository.findById(id);
            if (!updatedInformativo) {
                throw new Error('Erro ao recuperar informativo atualizado');
            }

            return updatedInformativo;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar informativo');
            }
        }
    }

    async deleteInformativo(id: string): Promise<void> {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            // Verificar se o informativo existe antes de deletar
            const existingInformativo = await this.repository.findById(id);
            if (!existingInformativo) {
                throw new Error('Informativo não encontrado');
            }

            await this.repository.delete(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao deletar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao deletar informativo');
            }
        }
    }

    async getAllInformativos(limit: number = 50, lastDocId?: string): Promise<InformativoModel[]> {
        try {
            return await this.repository.findAll(limit, lastDocId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos');
            }
        }
    }

    async getInformativosByCategoria(categoria: string): Promise<InformativoModel[]> {
        try {
            if (!categoria) {
                throw new Error('Categoria é obrigatória');
            }

            return await this.repository.findByCategoria(categoria);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos por categoria: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos por categoria');
            }
        }
    }

    async getInformativosAtivos(): Promise<InformativoModel[]> {
        try {
            return await this.repository.findAtivos();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos ativos: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos ativos');
            }
        }
    }

    async getInformativosValidos(): Promise<InformativoModel[]> {
        try {
            return await this.repository.findValidos();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos válidos: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos válidos');
            }
        }
    }

    async getInformativosByPrioridade(prioridade: number): Promise<InformativoModel[]> {
        try {
            if (prioridade < 1 || prioridade > 3) {
                throw new Error('Prioridade deve ser entre 1 (alta) e 3 (baixa)');
            }

            return await this.repository.findByPrioridade(prioridade);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos por prioridade: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos por prioridade');
            }
        }
    }

    async getInformativosRecentes(categoria?: string, limit: number = 10): Promise<InformativoModel[]> {
        try {
            if (categoria) {
                return await this.repository.findRecentsByCategoria(categoria, limit);
            } else {
                return await this.repository.findValidos();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos recentes: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos recentes');
            }
        }
    }

    async ativarInformativo(id: string): Promise<InformativoModel> {
        try {
            return await this.updateInformativo(id, { ativo: true });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao ativar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao ativar informativo');
            }
        }
    }

    async desativarInformativo(id: string): Promise<InformativoModel> {
        try {
            return await this.updateInformativo(id, { ativo: false });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao desativar informativo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao desativar informativo');
            }
        }
    }

    async alterarPrioridade(id: string, prioridade: number): Promise<InformativoModel> {
        try {
            if (prioridade < 1 || prioridade > 3) {
                throw new Error('Prioridade deve ser entre 1 (alta) e 3 (baixa)');
            }

            return await this.updateInformativo(id, { prioridade });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao alterar prioridade: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao alterar prioridade');
            }
        }
    }

    // Método adicional para buscar informativos usando paginação do repository
    async getInformativosPaginatedFromRepo(limit: number = 20, lastDocId?: string): Promise<{
        informativos: InformativoModel[];
        lastDocId: string | null;
        hasMore: boolean;
    }> {
        try {
            // Se o repository tiver o método de paginação avançada, usa ele
            if ('findAllPaginated' in this.repository && typeof this.repository.findAllPaginated === 'function') {
                return await (this.repository as any).findAllPaginated(limit, lastDocId);
            }

            // Fallback para o método básico
            const informativos = await this.repository.findAll(limit, lastDocId);
            return {
                informativos,
                lastDocId: informativos.length > 0 ? informativos[informativos.length - 1].id || null : null,
                hasMore: informativos.length === limit
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar informativos paginados: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao buscar informativos paginados');
            }
        }
    }
}

// Exportando uma instância do serviço
export default new InformativoService();
