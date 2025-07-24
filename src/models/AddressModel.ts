// src/models/AddressModel.ts

export class AddressModel {
    cep?: string;
    uf?: string;
    city?: string;
    district?: string;
    street?: string;
    number?: string;
    complement?: string;

    constructor(
        cep?: string,
        uf?: string,
        city?: string,
        district?: string,
        street?: string,
        number?: string,
        complement?: string
    ) {
        this.cep = cep;
        this.uf = uf;
        this.city = city;
        this.district = district;
        this.street = street;
        this.number = number;
        this.complement = complement;
    }

    toMap(): { [key: string]: any } {
        return {
            cep: this.cep,
            uf: this.uf,
            city: this.city,
            district: this.district,
            street: this.street,
            number: this.number,
            complement: this.complement,
        };
    }

    static fromMap(map: { [key: string]: any }): AddressModel {
        return new AddressModel(
            map['cep'],
            map['uf'],
            map['city'],
            map['district'],
            map['street'],
            map['number'],
            map['complement']
        );
    }
}
