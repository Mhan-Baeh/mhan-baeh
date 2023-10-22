import { TextField  } from "@mui/material";
import React from "react";
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { DescriptionJson, ProductFormDataType } from "interfaces/product";
import { IconButton } from "@pankod/refine-mui";

type BaseDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface FormCardProps extends BaseDivProps {
  nestIndex: number;
  control: Control<ProductFormDataType>;
  register: UseFormRegister<ProductFormDataType>;
  productDescription: DescriptionJson;
  setValue: UseFormSetValue<ProductFormDataType>;
  removeProductDescription: (arg: number) => void;
  errors: FieldErrors<ProductFormDataType>;
  disabled?: boolean;
}

const ProductDescriptionCard = ({
  nestIndex,
  control,
  register,
  productDescription,
  setValue,
  removeProductDescription,
  className,
  errors,
  disabled,

  ...rest
}: FormCardProps) => {
  return (
    <div
      className={`flex flex-col items-center w-full border p-4 gap-4 mb-3 `}
      {...rest}
    >
      <div className="w-full flex gap-2">
        {!disabled && (
          <>
            <div className="flex justify-start">
              <IconButton
                className="p-2 self-end"
                onClick={() => removeProductDescription(nestIndex)}
              >
                <MdDelete className="text-lg" size={24} />
              </IconButton>
            </div>
          </>
        )}
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          inputProps={{
            ...register(`product_description.${nestIndex}.topic` as const, {
              setValueAs: (value) => value?.trim() ?? "",
              required: "This field is required",
            }),
          }}
          error={!!errors?.product_description?.[nestIndex]?.topic}
          helperText={
            errors?.product_description?.[nestIndex]?.topic
              ? "This field is required"
              : ""
          }
          label="Topic"
          variant="filled"
          className="w-96"
          name={`product_description.${nestIndex}.topic`}
        />

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          inputProps={{
            ...register(
              `product_description.${nestIndex}.description` as const,
              {
                setValueAs: (value) => value?.trim() ?? "",
                required: "This field is required",
              }
            ),
          }}
          error={!!errors?.product_description?.[nestIndex]?.description}
          helperText={
            errors?.product_description?.[nestIndex]?.description
              ? "This field is required"
              : ""
          }
          label="Description"
          variant="filled"
          name={`product_description.${nestIndex}.description`}
        />
      </div>
    </div>
  );
};

export default ProductDescriptionCard;
