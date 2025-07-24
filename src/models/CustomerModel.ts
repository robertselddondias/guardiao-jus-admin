// src/models/UserModel.ts

import { AddressModel } from './AddressModel';
import { MilitaryModel } from './MilitaryModel';

export class CustomerModel {
    // Dados básicos
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    createdAt?: string;
    countryCode?: string;
    customerId?: string;

    contractId?: string;
    companyId?: string;
    isPlanoAtivo?: boolean;

    // Dados Pessoais
    cpf?: string;
    birthDate?: string;

    // Endereço
    address?: AddressModel;

    // Dados Militares
    militarData?: MilitaryModel;

    fcmToken?: string;

    // Flags de completude dos dados
    isPersonalInfoComplete?: boolean = false;
    isAdressInfoComplete?: boolean = false;
    isMilitaryInfoComplete?: boolean = false;
    isFirstAccess?: boolean = false;

    constructor(
        // Dados básicos
        uid?: string,
        name?: string,
        email?: string,
        phone?: string,
        photoUrl?: string,
        createdAt?: string,
        countryCode?: string,
        customerId?: string,
        contractId?: string,
        companyId?: string,
        isPlanoAtivo?: boolean,

        // Dados Pessoais
        cpf?: string,
        birthDate?: string,

        // Endereço
        address?: AddressModel,

        // Dados Militares
        militarData?: MilitaryModel,

        fcmToken?: string,
        isPersonalInfoComplete?: boolean,
        isAdressInfoComplete?: boolean,
        isMilitaryInfoComplete?: boolean,
        isFirstAccess?: boolean
    ) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.countryCode = countryCode;
        this.customerId = customerId;
        this.contractId = contractId;
        this.companyId = companyId;
        this.isPlanoAtivo = isPlanoAtivo;

        this.cpf = cpf;
        this.birthDate = birthDate;

        this.address = address;
        this.militarData = militarData;

        this.fcmToken = fcmToken;

        this.isPersonalInfoComplete = isPersonalInfoComplete ?? false;
        this.isAdressInfoComplete = isAdressInfoComplete ?? false;
        this.isMilitaryInfoComplete = isMilitaryInfoComplete ?? false;
        this.isFirstAccess = isFirstAccess ?? false;
    }

    toMap(): { [key: string]: any } {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            phone: this.phone,
            photoUrl: this.photoUrl,
            createdAt: this.createdAt,
            countryCode: this.countryCode,
            customerId: this.customerId,
            contractId: this.contractId,
            companyId: this.companyId,
            isPlanoAtivo: this.isPlanoAtivo,

            cpf: this.cpf,
            birthDate: this.birthDate,

            address: this.address?.toMap(),
            militarData: this.militarData?.toMap(),

            fcmToken: this.fcmToken,

            isPersonalInfoComplete: this.isPersonalInfoComplete,
            isAdressInfoComplete: this.isAdressInfoComplete,
            isMilitaryInfoComplete: this.isMilitaryInfoComplete,
            isFirstAccess: this.isFirstAccess,
        };
    }

    static fromMap(map: { [key: string]: any }): CustomerModel {
        return new CustomerModel(
            map['uid'],
            map['name'],
            map['email'],
            map['phone'],
            map['photoUrl'],
            map['createdAt'],
            map['countryCode'],
            map['customerId'],
            map['contractId'],
            map['companyId'],
            map['isPlanoAtivo'],

            map['cpf'],
            map['birthDate'],

            map['address'] ? AddressModel.fromMap(map['address']) : undefined,
            map['militarData'] ? MilitaryModel.fromMap(map['militarData']) : undefined,

            map['fcmToken'],

            map['isPersonalInfoComplete'],
            map['isAdressInfoComplete'],
            map['isMilitaryInfoComplete'],
            map['isFirstAccess']
        );
    }

    // Conversor do Firestore para o modelo (seguindo padrão existente)
    static fromFirestore(data: any): CustomerModel {
        console.info("UserModel.fromFirestore", data);
        return CustomerModel.fromMap(data);
    }

    // Conversor do modelo para o Firestore (seguindo padrão existente)
    toFirestore(): any {
        return this.toMap();
    }

    // Método para verificar se os dados básicos estão completos
    isBasicInfoComplete(): boolean {
        return !!(this.name && this.email && this.phone);
    }

    // Método para verificar se todos os dados obrigatórios estão completos
    isAllInfoComplete(): boolean {
        return !!(
            this.isPersonalInfoComplete &&
            this.isAdressInfoComplete &&
            this.isMilitaryInfoComplete
        );
    }

    // Método para obter o progresso de completude (0-100%)
    getCompletionProgress(): number {
        let completed = 0;
        let total = 3; // 3 seções: personal, address, military

        if (this.isPersonalInfoComplete) completed++;
        if (this.isAdressInfoComplete) completed++;
        if (this.isMilitaryInfoComplete) completed++;

        return Math.round((completed / total) * 100);
    }
}
