export interface IProducts {
    message: string;
    Products: Product[];
}

export interface Product{
    ID: string;
    Title: string;
    Description: string;
    Price: number;
    Rating: number;
    Stock: number;
    Category: string;
    Thumbnail: string;
}