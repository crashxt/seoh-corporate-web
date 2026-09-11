export type ProductDocument = { id:string; name:string; file_path:string; mime_type:string; file_size:number; is_active:boolean; sort_order:number };
export type Product = { id:string; slug:string; name:string; category:string; summary:string; description:string; image_url?:string|null; image_path?:string|null; is_active:boolean; sort_order:number; documents?:ProductDocument[] };
