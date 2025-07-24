// src/models/MilitaryModel.ts

export class MilitaryModel {
    registrationNumber?: string;
    rank?: string;
    militaryUf?: string;
    entity?: string;

    constructor(
        registrationNumber?: string,
        rank?: string,
        militaryUf?: string,
        entity?: string
    ) {
        this.registrationNumber = registrationNumber;
        this.rank = rank;
        this.militaryUf = militaryUf;
        this.entity = entity;
    }

    toMap(): { [key: string]: any } {
        return {
            registrationNumber: this.registrationNumber,
            rank: this.rank,
            militaryUf: this.militaryUf,
            entity: this.entity,
        };
    }

    static fromMap(map: { [key: string]: any }): MilitaryModel {
        return new MilitaryModel(
            map['registrationNumber'],
            map['rank'],
            map['militaryUf'],
            map['entity']
        );
    }
}
