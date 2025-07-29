// src/models/InformativoModel.ts

export class InformativoModel {
    id?: string;
    titulo: string;
    conteudo: string;
    imagemUrl?: string;
    categoria: string; // ex: "PMDF", "CBMDF", "GERAL", etc.
    dataPublicacao: Date;
    dataExpiracao?: Date;
    ativo: boolean;
    linkExterno?: string;
    prioridade: number; // 1 = alta, 2 = média, 3 = baixa
    tags?: string[];

    constructor(
        titulo: string,
        conteudo: string,
        categoria: string,
        dataPublicacao: Date,
        id?: string,
        imagemUrl?: string,
        dataExpiracao?: Date,
        ativo: boolean = true,
        linkExterno?: string,
        prioridade: number = 2,
        tags?: string[]
    ) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.imagemUrl = imagemUrl;
        this.categoria = categoria;
        this.dataPublicacao = dataPublicacao;
        this.dataExpiracao = dataExpiracao;
        this.ativo = ativo;
        this.linkExterno = linkExterno;
        this.prioridade = prioridade;
        this.tags = tags;
    }

    // Converter para Map (para salvar no Firestore)
    toMap(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            titulo: this.titulo,
            conteudo: this.conteudo,
            categoria: this.categoria,
            dataPublicacao: this.dataPublicacao.toISOString(),
            ativo: this.ativo,
            prioridade: this.prioridade,
        };

        // Adicionar campos opcionais apenas se não forem undefined/null
        if (this.imagemUrl !== undefined && this.imagemUrl !== null) {
            data.imagemUrl = this.imagemUrl;
        }

        if (this.dataExpiracao !== undefined && this.dataExpiracao !== null) {
            data.dataExpiracao = this.dataExpiracao.toISOString();
        }

        if (this.linkExterno !== undefined && this.linkExterno !== null) {
            data.linkExterno = this.linkExterno;
        }

        if (this.tags !== undefined && this.tags !== null && this.tags.length > 0) {
            data.tags = this.tags;
        }

        return data;
    }

    // Converter de Map (para ler do Firestore)
    static fromMap(map: { [key: string]: any }, docId?: string): InformativoModel {
        return new InformativoModel(
            map['titulo'] || '',
            map['conteudo'] || '',
            map['categoria'] || 'GERAL',
            new Date(map['dataPublicacao']),
            docId,
            map['imagemUrl'],
            map['dataExpiracao'] ? new Date(map['dataExpiracao']) : undefined,
            map['ativo'] !== undefined ? map['ativo'] : true,
            map['linkExterno'],
            map['prioridade'] || 2,
            map['tags'] ? [...map['tags']] : undefined
        );
    }

    // Conversor do Firestore para o modelo
    static fromFirestore(data: any, docId?: string): InformativoModel {
        return InformativoModel.fromMap(data, docId);
    }

    // Conversor do modelo para o Firestore
    toFirestore(): any {
        return this.toMap();
    }

    // Verificar se o informativo ainda está válido
    get isValido(): boolean {
        if (!this.ativo) return false;
        if (this.dataExpiracao && new Date() > this.dataExpiracao) {
            return false;
        }
        return true;
    }

    // Copy with para facilitar edições
    copyWith(params: {
        id?: string;
        titulo?: string;
        conteudo?: string;
        imagemUrl?: string;
        categoria?: string;
        dataPublicacao?: Date;
        dataExpiracao?: Date;
        ativo?: boolean;
        linkExterno?: string;
        prioridade?: number;
        tags?: string[];
    }): InformativoModel {
        return new InformativoModel(
            params.titulo ?? this.titulo,
            params.conteudo ?? this.conteudo,
            params.categoria ?? this.categoria,
            params.dataPublicacao ?? this.dataPublicacao,
            params.id ?? this.id,
            params.imagemUrl ?? this.imagemUrl,
            params.dataExpiracao ?? this.dataExpiracao,
            params.ativo ?? this.ativo,
            params.linkExterno ?? this.linkExterno,
            params.prioridade ?? this.prioridade,
            params.tags ?? this.tags
        );
    }

    // Método para verificar se o informativo é de alta prioridade
    get isAltaPrioridade(): boolean {
        return this.prioridade === 1;
    }

    // Método para verificar se o informativo está expirado
    get isExpirado(): boolean {
        return this.dataExpiracao ? new Date() > this.dataExpiracao : false;
    }

    // Método para obter a prioridade como string
    get prioridadeString(): string {
        switch (this.prioridade) {
            case 1:
                return 'Alta';
            case 2:
                return 'Média';
            case 3:
                return 'Baixa';
            default:
                return 'Média';
        }
    }
}
