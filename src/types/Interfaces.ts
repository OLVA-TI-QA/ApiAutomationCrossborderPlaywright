export enum tokenType {
    Eduardo = 'MTE5NjM2ODppQlMweTIzeGhHbWxTcWxWZHVxbnpMUFRndTlvc1M5c1c2NGVNaklGSG1v',
    Homecenters = 'NDAyNDU0OnZEUUhCaUhyNlJzWklqZG1FbHZFZ1ZYbXhjazE0TERDbjJLRjdlRXVTTm8=',
    TiendasPeruanas = 'MzkxNTgwOmVjOW1pMjhFbjMxSzd2NEtnVWp3MlpUTXduTU1pTlVIenJSWk1VTDhmRk0=',
    ClientIdInvalido = 'OTk5OTk5OmlCUzB5MjN4aEdtbFNxbFZkdXFuekxQVGd1OW9zUzlzVzY0ZU1qSUZIbW8=',
    AlgoritmoInvalido = 'NDAyNDU0PXZEUUhCaUhyNlJzWklqZG1FbHZFZ1ZYbXhjazE0TERDbjJLRjdlRXVTTm8=',
    ClientSecretInvalido = 'MzkxNTgwOnRlc3RpdG9hbGVtdGVzdGl0b2F1dG9tYXRpemFkbw===',
    TokenSqlInjection = 'MTE5NjM2OD1zZWxlY3QqZnJvbXVzdWFyaW9zd2hlcmVpZD0x',
    TokenMalFormado = 'ZWM5bWkyOEVuMzFLN3Y0S2dVancyWlRNd25NTWlOVUh6clJaTVVMOGZGTTozOTE1ODA='
}

export interface Welcome {
    countryManufacture: string;
    logisticsCode: string;
    currency: string;
    grossWeight: string;
    packageCount: string;
    purchaseWebsite: string;
    valueAddedTax: string;
    shipping: string;
    ctnNumber: string;
    wayBillNo: string;
    insurance: string;
    receiverInfo: Info;
    senderInfo: Info;
    returnInfo: Info;
    itemList: ItemList[];
}

export interface ItemList {
    currency: string;
    itemSequenceNumber: string;
    descriptionGoods: string;
    price: string;
    qty: string;
    grossWeight: string;
    brand: string;
    model: string;
    productUrl: string;
}

export interface Info {
    address: string;
    email: string;
    fullName: string;
    mobilePhone: string;
    idUbigeo: string;
    zipCode: string;
    identityNumber: string;
}