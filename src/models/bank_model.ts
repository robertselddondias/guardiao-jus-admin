
export class BankModel {

    code?: string;
    name?: string;
    agency?: string;
    account?: string;
    payDay?: string;

    constructor(code?: string, name?: string, agency?: string, account?: string, payDay?: string) {
        this.code = code;
        this.name = name;
        this.agency = agency;
        this.account = account;
        this.payDay = payDay;
    }

    toMap(): { [key: string]: any } {
        return {
            code: this.code,
            name: this.name,
            agency: this.agency,
            account: this.account,
            payDay: this.payDay,
        }
    }

    static fromMap(map: { [key: string]: any }): BankModel {
        return new BankModel(
            map['code'],
            map['name'],
            map['agency'],
            map['account'],
            map['payDay'],
        )
    }
}
