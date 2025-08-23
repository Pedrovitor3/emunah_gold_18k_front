import type { ProductImageInterface } from "./ProductInterfaceInterface";

export interface ProductInterface {
  id: string;
  category_id: string;
  name: string;
  description: string;
  sku: string;
  price: string;
  weight: string;
  gold_purity: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    description: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  images: ProductImageInterface[];
}
