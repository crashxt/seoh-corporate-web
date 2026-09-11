import { fallbackProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
export async function getProducts(includeInactive=false):Promise<Product[]>{if(!supabase)return fallbackProducts;let query=supabase.from('products').select('*, documents:product_documents(*)').order('sort_order');if(!includeInactive)query=query.eq('is_active',true);const{data,error}=await query;if(error)throw error;return(data??[])as Product[]}
export async function getProduct(slug:string):Promise<Product|undefined>{if(!supabase)return fallbackProducts.find(p=>p.slug===slug);const{data,error}=await supabase.from('products').select('*, documents:product_documents(*)').eq('slug',slug).eq('is_active',true).single();return error?undefined:data as Product}
export async function getDocumentUrl(path:string){if(!supabase)return null;const{data,error}=await supabase.storage.from('product-documents').createSignedUrl(path,60);if(error)throw error;return data.signedUrl}
