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
            BankModel.fromMap(map['bank'])
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
}
