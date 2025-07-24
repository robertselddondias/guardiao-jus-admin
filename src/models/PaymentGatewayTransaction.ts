// models/PaymentGatewayTransaction.ts

export interface PaymentGatewayTransactionModel {
    id?: string;
    userId?: string;
    companyId?: string;
    creditCardId?: string;
    contractId?: string;
    customerId?: string;
    transactionId?: string;
    amount?: number; // Valor em centavos (padrão do Pagar.me)
    paid?: boolean;
    status?: string; // "paid", "pending", "refused", etc.
    paymentMethod?: string; // "credit_card", "pix", "boleto", etc.
    createdAt?: Date;

    // Campos opcionais
    cardBrand?: string;
    cardLastFourDigits?: string;
    pixQrCodeUrl?: string; // se método for PIX, pode armazenar a URL do QR Code
    pixEmv?: string; // Código EMV do pix
}

export class PaymentGatewayTransaction implements PaymentGatewayTransactionModel {
    id?: string;
    userId?: string;
    companyId?: string;
    creditCardId?: string;
    contractId?: string;
    customerId?: string;
    transactionId?: string;
    amount?: number;
    paid?: boolean;
    status?: string;
    paymentMethod?: string;
    createdAt?: Date;
    cardBrand?: string;
    cardLastFourDigits?: string;
    pixQrCodeUrl?: string;
    pixEmv?: string;

    constructor(data: PaymentGatewayTransactionModel = {}) {
        this.id = data.id;
        this.userId = data.userId;
        this.companyId = data.companyId;
        this.creditCardId = data.creditCardId;
        this.contractId = data.contractId;
        this.customerId = data.customerId;
        this.transactionId = data.transactionId;
        this.amount = data.amount;
        this.paid = data.paid;
        this.status = data.status;
        this.paymentMethod = data.paymentMethod;
        this.createdAt = data.createdAt;
        this.cardBrand = data.cardBrand;
        this.cardLastFourDigits = data.cardLastFourDigits;
        this.pixQrCodeUrl = data.pixQrCodeUrl;
        this.pixEmv = data.pixEmv;
    }

    toMap(): Record<string, any> {
        const map: Record<string, any> = {
            id: this.id,
            userId: this.userId,
            companyId: this.companyId,
            customerId: this.customerId,
            transactionId: this.transactionId,
            amount: this.amount,
            paid: this.paid,
            status: this.status,
            paymentMethod: this.paymentMethod,
            creditCardId: this.creditCardId,
            createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
            contractId: this.contractId,
        };

        // Adiciona campos opcionais apenas se existirem
        if (this.cardBrand) map.cardBrand = this.cardBrand;
        if (this.cardLastFourDigits) map.cardLastFourDigits = this.cardLastFourDigits;
        if (this.pixQrCodeUrl) map.pixQrCodeUrl = this.pixQrCodeUrl;
        if (this.pixEmv) map.pixEmv = this.pixEmv;

        return map;
    }

    static fromMap(map: Record<string, any>): PaymentGatewayTransaction {
        return new PaymentGatewayTransaction({
            id: map.id as string,
            userId: map.userId as string,
            companyId: map.companyId as string,
            customerId: map.customerId as string,
            transactionId: map.transactionId as string,
            amount: typeof map.amount === 'number' ? map.amount : parseInt(map.amount),
            paid: map.paid as boolean,
            status: map.status as string,
            paymentMethod: map.paymentMethod as string,
            createdAt: map.createdAt ? new Date(map.createdAt) : undefined,
            cardBrand: map.cardBrand as string,
            cardLastFourDigits: map.cardLastFourDigits as string,
            pixQrCodeUrl: map.pixQrCodeUrl as string,
            pixEmv: map.pixEmv as string,
            creditCardId: map.creditCardId as string,
            contractId: map.contractId as string,
        });
    }

    toJSON(): Record<string, any> {
        return this.toMap();
    }
}
