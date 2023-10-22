import React from "react";
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ProductFormDataType, DescriptionJson } from "interfaces/product";

import { Button } from "@pankod/refine-mui";
import ProductDescriptionCard from "./ProductDescriptionCard";

interface FormListProps {
  field: DescriptionJson[];
  control: Control<ProductFormDataType>;
  register: UseFormRegister<ProductFormDataType>;
  setValue: UseFormSetValue<ProductFormDataType>;
  append: (arg: DescriptionJson) => void;
  remove: (arg: number) => void;
  watchProductDescription: DescriptionJson[];
  errors: FieldErrors<ProductFormDataType>;
  disabled?: boolean;
}

const ProductDescriptionList = ({
  field,
  control,
  register,
  setValue,
  append,
  remove,
  watchProductDescription,
  errors,
  disabled,
}: FormListProps) => {
  return (
    <>
      {field.map((field, i) => {
        const productDescription = watchProductDescription[i];
        return (
          <div key={i}>
            <ProductDescriptionCard
              control={control}
              disabled={disabled}
              productDescription={productDescription}
              nestIndex={i}
              register={register}
              removeProductDescription={remove}
              errors={errors}
              setValue={setValue}
            />
          </div>
        );
      })}

      {!disabled && (
        <div className="flex mt-2 gap-x-2">
          <Button
            onClick={() => append({ topic: "", description: "" })}
            type="button"
            variant="outlined"
          >
            Add new topic
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductDescriptionList;
