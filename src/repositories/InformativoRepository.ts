// src/repositories/InformativoRepository.ts

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase';
import { InformativoModel } from '@/models/InformativoModel';

export interface IInformativoRepository {
    create(informativo: InformativoModel): Promise<string>;
    findById(id: string): Promise<InformativoModel | null>;
    findAll(limitCount?: number, lastDocId?: string): Promise<InformativoModel[]>;
    update(id: string, informativo: Partial<InformativoModel>): Promise<void>;
    delete(id: string): Promise<void>;
    findByCategoria(categoria: string): Promise<InformativoModel[]>;
    findAtivos(): Promise<InformativoModel[]>;
    findByPrioridade(prioridade: number): Promise<InformativoModel[]>;
    findValidos(): Promise<InformativoModel[]>;
    findRecentsByCategoria(categoria: string, limitCount?: number): Promise<InformativoModel[]>;
}

class InformativoRepository implements IInformativoRepository {
    private collectionName = 'informativo_noticias';

    async create(informativo: InformativoModel): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, this.collectionName), informativo.toFirestore());
            return docRef.id;
        } catch (error) {
            console.error('Erro ao criar informativo:', error);
            throw new Error('Falha ao criar informativo');
        }
    }

    async findById(id: string): Promise<InformativoModel | null> {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return InformativoModel.fromFirestore(docSnap.data(), docSnap.id);
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar informativo por ID:', error);
            throw new Error('Falha ao buscar informativo');
        }
    }

    async findAll(limitCount: number = 50, lastDocId?: string): Promise<InformativoModel[]> {
        try {
            let q = query(
                collection(db, this.collectionName),
                orderBy('dataPublicacao', 'desc'),
                limit(limitCount)
            );

            if (lastDocId) {
                const lastDoc = await getDoc(doc(db, this.collectionName, lastDocId));
                if (lastDoc.exists()) {
                    q = query(q, startAfter(lastDoc));
                }
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );
        } catch (error) {
            console.error('Erro ao buscar todos os informativos:', error);
            throw new Error('Falha ao buscar informativos');
        }
    }

    async update(id: string, informativo: Partial<InformativoModel>): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);

            // Preparar dados para atualização, filtrando undefined
            const updateData: { [key: string]: any } = {};

            Object.keys(informativo).forEach(key => {
                const value = (informativo as any)[key];
                if (value !== undefined && value !== null) {
                    if (key === 'dataPublicacao' || key === 'dataExpiracao') {
                        updateData[key] = value instanceof Date ? value.toISOString() : value;
                    } else if (key === 'tags' && Array.isArray(value)) {
                        if (value.length > 0) {
                            updateData[key] = value;
                        }
                    } else if (key === 'imagemUrl' || key === 'linkExterno') {
                        if (value !== '') {
                            updateData[key] = value;
                        }
                    } else {
                        updateData[key] = value;
                    }
                }
            });

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error('Erro ao atualizar informativo:', error);
            throw new Error('Falha ao atualizar informativo');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Erro ao deletar informativo:', error);
            throw new Error('Falha ao deletar informativo');
        }
    }

    async findByCategoria(categoria: string): Promise<InformativoModel[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('categoria', '==', categoria),
                orderBy('dataPublicacao', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );
        } catch (error) {
            console.error('Erro ao buscar informativos por categoria:', error);
            throw new Error('Falha ao buscar informativos por categoria');
        }
    }

    async findAtivos(): Promise<InformativoModel[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('ativo', '==', true),
                orderBy('dataPublicacao', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );
        } catch (error) {
            console.error('Erro ao buscar informativos ativos:', error);
            throw new Error('Falha ao buscar informativos ativos');
        }
    }

    async findByPrioridade(prioridade: number): Promise<InformativoModel[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('prioridade', '==', prioridade),
                orderBy('dataPublicacao', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );
        } catch (error) {
            console.error('Erro ao buscar informativos por prioridade:', error);
            throw new Error('Falha ao buscar informativos por prioridade');
        }
    }

    async findValidos(): Promise<InformativoModel[]> {
        try {
            const now = new Date().toISOString();

            const q = query(
                collection(db, this.collectionName),
                where('ativo', '==', true),
                orderBy('dataPublicacao', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const informativos = querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );

            // Filtrar válidos no lado cliente (data de expiração)
            return informativos.filter(informativo => informativo.isValido);
        } catch (error) {
            console.error('Erro ao buscar informativos válidos:', error);
            throw new Error('Falha ao buscar informativos válidos');
        }
    }

    async findRecentsByCategoria(categoria: string, limitCount: number = 10): Promise<InformativoModel[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('categoria', '==', categoria),
                where('ativo', '==', true),
                orderBy('dataPublicacao', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const informativos = querySnapshot.docs.map(doc =>
                InformativoModel.fromFirestore(doc.data(), doc.id)
            );

            // Filtrar válidos no lado cliente
            return informativos.filter(informativo => informativo.isValido);
        } catch (error) {
            console.error('Erro ao buscar informativos recentes por categoria:', error);
            throw new Error('Falha ao buscar informativos recentes por categoria');
        }
    }

    // Método adicional para buscar informativos com paginação avançada
    async findAllPaginated(limitCount: number = 20, lastDocId?: string): Promise<{
        informativos: InformativoModel[];
        lastDocId: string | null;
        hasMore: boolean;
    }> {
        try {
            let q = query(
                collection(db, this.collectionName),
                orderBy('dataPublicacao', 'desc'),
                limit(limitCount + 1) // +1 para verificar se há mais dados
            );

            if (lastDocId) {
                const lastDoc = await getDoc(doc(db, this.collectionName, lastDocId));
                if (lastDoc.exists()) {
                    q = query(q, startAfter(lastDoc));
                }
            }

            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs;

            const hasMore = docs.length > limitCount;
            const informativos = docs
                .slice(0, limitCount)
                .map(doc => InformativoModel.fromFirestore(doc.data(), doc.id));

            return {
                informativos,
                lastDocId: informativos.length > 0 ? informativos[informativos.length - 1].id || null : null,
                hasMore
            };
        } catch (error) {
            console.error('Erro ao buscar informativos paginados:', error);
            throw new Error('Falha ao buscar informativos paginados');
        }
    }
}

// Exportando uma instância do repositório
export default new InformativoRepository();
