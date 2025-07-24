// src/models/CompanyModel.ts

import BeneficioType from '@/enums/BeneficioType';
import { BankModel } from '@/models/BankModel';

export class CompanyModel {
    id?: string;
    name?: string;
    logoUrl?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    description?: string;
    urlContract?: string;
    oab?: string;
    phoneEmergencia?: string;
    whatsapp?: string;
    monthlyValue?: number;
    beneficios?: BeneficioType[] = [];
    isActive?: boolean = true; // Novo campo para controlar status da empresa

    bank?: BankModel;

    constructor(
        id?: string,
        name?: string,
        logoUrl?: string,
        cnpj?: string,
        email?: string,
        phone?: string,
        description?: string,
        urlContract?: string,
        beneficios?: any[],
        oab?: string,
        phoneEmergencia?: string,
        whatsapp?: string,
        monthlyValue?: number,
        bank?: BankModel,
        isActive?: boolean
    ) {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
        this.cnpj = cnpj;
        this.email = email;
        this.phone = phone;
        this.description = description;
        this.urlContract = urlContract;
        this.beneficios = beneficios;
        this.oab = oab;
        this.phoneEmergencia = phoneEmergencia;
        this.whatsapp = whatsapp;
        this.monthlyValue = monthlyValue;
        this.bank = bank;
        this.isActive = isActive ?? true; // Default: empresa ativa
    }

    toMap(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            logoUrl: this.logoUrl,
            cnpj: this.cnpj,
            email: this.email,
            phone: this.phone,
            description: this.description,
            urlContract: this.urlContract,
            beneficios: this.beneficios,
            oab: this.oab,
            phoneEmergencia: this.phoneEmergencia,
            whatsapp: this.whatsapp,
            monthlyValue: this.monthlyValue,
            bank: this.bank?.toMap(),
            isActive: this.isActive,
        };
    }

    static fromMap(map: { [key: string]: any }): CompanyModel {
        return new CompanyModel(
            map['id'],
            map['name'],
            map['logoUrl'],
            map['cnpj'],
            map['email'],
            map['phone'],
            map['description'],
            map['urlContract'],
            CompanyModel.parseBeneficios(map['beneficios']),
            map['oab'],
            map['phoneEmergencia'],
            map['whatsapp'],
            map['monthlyValue'],
            map['bank'] ? BankModel.fromMap(map['bank']) : undefined,
            map['isActive'] ?? true // Default: empresa ativa se não especificado
        );
    }

    private static parseBeneficios(beneficios: any): BeneficioType[] {
        if (!beneficios || !Array.isArray(beneficios)) {
            return [];
        }

        return beneficios
            .filter(item => Object.values(BeneficioType).includes(item as BeneficioType))
            .map(item => item as BeneficioType);
    }

    // Método para verificar se a empresa está ativa
    isCompanyActive(): boolean {
        return this.isActive !== false;
    }

    // Método para ativar empresa
    activate(): void {
        this.isActive = true;
    }

    // Método para desativar empresa
    deactivate(): void {
        this.isActive = false;
    }

    // Método para alternar status
    toggleStatus(): void {
        this.isActive = !this.isActive;
    }
}
