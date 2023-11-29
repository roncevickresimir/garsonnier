export enum ItemType {
    NJUSKALO = 'NJUSKALO',
    INDEXHR = 'INDEXHR',
    OGLASNIK = 'OGLASNIK',
}

export type Item = {
    title: string;
    url: string;
    image: string;
    type: ItemType;
};
