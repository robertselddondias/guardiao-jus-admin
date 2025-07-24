// src/models/UserAdvModel.ts

export class UserAdvModel {
    // Dados básicos
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    createdAt?: string;

    // Dados Pessoais
    cpf?: string;
    oab?: string;
    birthDate?: string;
    companyId?: string;

    uf?: string;

    fcmToken?: string;

    constructor(
        // Dados básicos
        uid?: string,
        name?: string,
        email?: string,
        phone?: string,
        photoUrl?: string,
        createdAt?: string,

        // Dados Pessoais
        cpf?: string,
        oab?: string,
        birthDate?: string,
        companyId?: string,

        uf?: string,
        fcmToken?: string
    ) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;

        this.cpf = cpf;
        this.oab = oab;
        this.birthDate = birthDate ?? "";
        this.companyId = companyId;

        this.uf = uf;
        this.fcmToken = fcmToken ?? "";
    }

    // Converte para Map (equivalente ao toMap do Flutter)
    toMap(): { [key: string]: any } {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            phone: this.phone,
            photoUrl: this.photoUrl,
            createdAt: this.createdAt || new Date().toISOString(),
            cpf: this.cpf,
            oab: this.oab,
            birthDate: this.birthDate,
            companyId: this.companyId,
            uf: this.uf,
            fcmToken: this.fcmToken,
        };
    }

    // Converte de Map para UserAdvModel (equivalente ao fromMap do Flutter)
    static fromMap(map: { [key: string]: any }): UserAdvModel {
        return new UserAdvModel(
            map['uid'],
            map['name'],
            map['email'],
            map['phone'],
            map['photoUrl'],
            map['createdAt'] ? new Date(map['createdAt']).toISOString() : "",
            map['cpf'],
            map['oab'],
            map['birthDate'] ? new Date(map['birthDate']).toISOString() : "",
            map['companyId'],
            map['uf'],
            map['fcmToken']
        );
    }

    // Conversor do Firestore para o modelo
    static fromFirestore(data: any): UserAdvModel {
        return UserAdvModel.fromMap(data);
    }

    // Conversor do modelo para o Firestore
    toFirestore(): any {
        return this.toMap();
    }

    // Método para verificar se os dados básicos estão completos
    isBasicInfoComplete(): boolean {
        return !!(this.name && this.email && this.phone);
    }

    // Método para verificar se é um advogado (tem OAB)
    isLawyer(): boolean {
        return !!(this.oab && this.oab.trim() !== '');
    }

    // Método para obter o nome de exibição
    getDisplayName(): string {
        return this.name || this.email || 'Usuário';
    }

    // Método para validar email
    hasValidEmail(): boolean {
        if (!this.email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    // Método para formatar CPF
    getFormattedCpf(): string {
        if (!this.cpf) return '';
        const cleanCpf = this.cpf.replace(/\D/g, '');
        if (cleanCpf.length === 11) {
            return cleanCpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        }
        return this.cpf;
    }

    // Método para formatar telefone
    getFormattedPhone(): string {
        if (!this.phone) return '';
        const cleanPhone = this.phone.replace(/\D/g, '');
        if (cleanPhone.length === 11) {
            return cleanPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (cleanPhone.length === 10) {
            return cleanPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return this.phone;
    }
}
