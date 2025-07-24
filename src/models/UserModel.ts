// src/models/UserModel.ts

export interface UserModel {
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    createdAt?: string;
    companyId?: string;
}

export class UserModel {
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    createdAt?: string;
    companyId?: string;

    constructor(uid?: string,
                name?: string,
                email?: string,
                phone?: string,
                photoUrl?: string,
                createdAt?: string,
                companyId?: string) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.companyId = companyId;
    }

    // Conversor do Firestore para o modelo
    static fromFirestore(data: any): UserModel {
        console.info("UserModel.fromFirestore", data);
        return new UserModel(
            data.uid,
            data.name,
            data.email,
            data.phone,
            data.photoUrl,
            data.createdAt,
            data.companyId,
        );
    }

    // Conversor do modelo para o Firestore
    toFirestore(): any {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            phone: this.phone,
            photoUrl: this.photoUrl,
            createdAt: this.createdAt,
            companyId: this.companyId,
        };
    }
}
