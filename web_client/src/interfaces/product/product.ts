import { BaseModel } from "interfaces/common";
export type CategoryEnum = "RESTAURANT" | "APP" | "INSTRUMENT" | "FOOD" | "COSMETIC"

export interface DescriptionJson{
    topic: string;
    description: string;
}

export interface ProductFormDataType extends BaseModel {
  product_uuid: string;
  product_name_en: string;
  product_name_th: string;
  product_description: DescriptionJson[];
  category: CategoryEnum;
  label: string;
  image_urls: string[];
}

export const ProductCategoryType: { type: CategoryEnum; description: string }[] = [
  { type: "RESTAURANT", description: "Restaurant" },
  { type: "APP", description: "App" },
  { type: "INSTRUMENT", description: "Instrument" },
  { type: "FOOD", description: "Food" },
  { type: "COSMETIC", description: "Cosmetic" }
];


