export interface Item {
    id: string | number;
    title: string;
    url: string;
    summary?: string;
    addedAt: Date;
}