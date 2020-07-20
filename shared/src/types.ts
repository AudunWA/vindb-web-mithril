export interface Product {
    varenummer: number;
    first_seen: Date;
    last_seen: Date;
    varenavn: string;
    volum: number;
    pris: number;
    varetype: string;
    produktutvalg: string;
    butikkategori: string;
    fylde: number;
    friskhet: number;
    garvestoffer: number;
    bitterhet: number;
    sodme: number;
    farge: string | null;
    lukt: string | null;
    smak: string | null;
    passer_til_1: string | null;
    passer_til_2: string | null;
    passer_til_3: string | null;
    land: string | null;
    distrikt: string | null;
    underdistrikt: string | null;
    argang: number | null;
    rastoff: string | null;
    metode: string | null;
    alkohol: number;
    sukker: "Ukjent" | number | null;
    syre: number | null;
    lagringsgrad: string | null;
    produsent: string | null;
    grossist: string;
    distributor: string;
    emballasjetype: string | null;
    korktype: string | null;
    okologisk: boolean;
    biodynamisk: boolean;
    fairtrade: boolean;
    miljosmart_emballasje: boolean;
    gluten_lav_pa: boolean;
    kosher: boolean;
    hoved_gtin: string | null;
    andre_gtiner: string | null;

    // Generated fields
    epk: number;
    literspris: number;
}

export interface ProductResponse {
    product: Product;
    changes: ProductChange[];
}

export interface ProductListResponse {
    products: Product[];
    currentPage: number;
    productsPerPage: number;
    pageCount: number;
}

export type PriceChangeListResponse = PriceChange[];

export interface ProductChange {
    time: Date;
    varenavn: string;
    product_id: number;
    field_id: number;
    change_id: number;
    old_value: string;
    new_value: string;
    name: string;
}

export interface PriceChange extends Omit<Product, "epk" | "literspris"> {
    old_value: string;
    new_value: string;
    time: Date;
}

export function sharedPrint() {
    console.log("Shared print has changed again and again (x2)!");
}

export function sharedPrintClient() {
    console.log("Shared print has changed again and again (x2)!");
}
