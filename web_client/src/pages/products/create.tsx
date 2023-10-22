import {
  Create,
  Box,
  TextField,
  MenuItem,
  Select,
} from "@pankod/refine-mui";
import { useForm } from "@pankod/refine-react-hook-form";
import { ProductFormDataType, ProductCategoryType, DescriptionJson } from "interfaces/product";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from '@pankod/refine-mui';
import FormItem from 'components/FormItem';
import { useEffect, useMemo, useState } from 'react';
import ProductDescriptionList from "./ProductDescriptionList";
import { fileUpload } from "interfaces/common";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { UploadFile } from 'components/upload';



const schema = Yup.object({
  product_uuid: Yup.string().nullable(),
  product_name_en: Yup.string().required("This field is required"),
  product_name_th: Yup.string().required("This field is required"),
  product_description: Yup.array()
    .of(
      Yup.object().shape({
        topic: Yup.string().required("This field is required"),
        description: Yup.string().required("This field is required"),
      })
    )
    .min(1, "At least one is required")
    .required(),
  category: Yup.string().required("This field is required"),
  image_urls: Yup.array()
    .of(Yup.string().required("This field is required"))
    .min(1, "At least one is required")
    .required(),
});


export const ProductCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any,any,ProductFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      product_name_en: "",
      product_name_th: "",
      product_description: [],
      image_urls: [],
    },
  });

  const [uploadedImages, setUploadedImages] = useState< fileUpload[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageShowCols, setImageShowCols] = useState<number>(6);
  
  const allowedExtension = ["image/jpeg", "image/jpg", "image/png"];
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setImageShowCols(2);
      } else if (window.innerWidth <= 1050) {
        setImageShowCols(2);
      } else if (window.innerWidth <= 1350) {
        setImageShowCols(3);
      } else if (window.innerWidth <= 1650) {
        setImageShowCols(4);
      } else if (window.innerWidth <= 1950) {
        setImageShowCols(5);
      } else {
        setImageShowCols(6);
      }
    };

    handleResize(); // Initial call to set the class
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      setValue(
        "image_urls",
        uploadedImages.map((item: fileUpload) => item.url),
        {
          shouldValidate: true,
        }
      );
    }
  }, [uploadedImages]);


  const product_description = useMemo<DescriptionJson[]>(() => {
    if (watch("product_description")) {
      register("product_description", { required: true });
      return watch("product_description");
    } else {
      return [];
    }
  }, [register,watch,register("product_description"), watch("product_description")]);

   const appendProductDescription = (value: DescriptionJson) => {
     setValue("product_description", [...product_description, value]);
   };

   const removeProductDescription = (index: number) => {
     setValue(
       "product_description",
       watch("product_description").filter((_: any, i: number) => i !== index)
     );
   };

  const renderProductDescription = () => {
    return (
      <div>
        <Typography variant="caption" className="mx-3" color="text.secondary">
          Product Description
        </Typography>
        {!!errors.product_description && (
          <Typography variant="caption" color="#FF0000">
            Product Description is required at least one
          </Typography>
        )}
        <FormItem className="">
          <ProductDescriptionList
            field={product_description}
            append={appendProductDescription}
            control={control}
            register={register}
            remove={removeProductDescription}
            setValue={setValue}
            watchProductDescription={watch("product_description")}
            errors={errors}
          />
        </FormItem>
      </div>
    );
  };

  const saveButtonPropsHandler = () => {
    if (formLoading || loading) {
      return {
        ...saveButtonProps,
        disabled: true,
      };
    }
    return saveButtonProps;
  };
 
  return (
    <Create
      isLoading={formLoading || loading}
      saveButtonProps={saveButtonPropsHandler()}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("product_name_en", {
            required: "This field is required",
          })}
          required
          error={!!(errors as any)?.product_name_en}
          helperText={(errors as any)?.product_name_en?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Product Name En"
          name="product_name_en"
        />
        <TextField
          {...register("product_name_th", {
            required: "This field is required",
          })}
          required
          error={!!(errors as any)?.product_name_th}
          helperText={(errors as any)?.product_name_th?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Product Name Th"
          name="product_name_th"
        />
        <div className="w-full">
          <Typography variant="caption" className="mx-3" color="text.secondary">
            Category
          </Typography>
          <Select
            {...register("category", {
              required: "This field is required",
            })}
            error={!!(errors as any)?.category}
            name="category"
            value={watch("category") || ""}
            fullWidth
          >
            {ProductCategoryType.map((item, index) => {
              return (
                <MenuItem key={item.type} value={item.type}>
                  <div>{item.description}</div>
                </MenuItem>
              );
            })}
          </Select>
          <Typography
            variant="caption"
            className="mx-3 mt-1"
            color="error.main"
          >
            {(errors as any)?.category?.message}
          </Typography>
        </div>
        {renderProductDescription()}

        <div className="mt-6">
          <Typography variant="caption" className="mx-3" color="text.secondary">
            Product Images
          </Typography>
          <UploadFile
            setValue={setValue}
            errorProp={!!(errors as any)?.image_urls}
            helperTextProp={(errors as any)?.image_urls?.message}
            setUploadedFiles={setUploadedImages}
            loading={loading}
            setLoading={setLoading}
            allowedExtension={allowedExtension}
          />
          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="mx-3 mt-1"
              fontSize={"12px"}
              color="text.secondary"
            >
              * For better ai's prediction accuracy, we recommend images with transparent background.
            </Typography>
            <Typography
              variant="caption"
              className="mx-3"
              fontSize={"12px"}
              color="text.secondary"
            >
              * You can upload up to 10 images.
            </Typography>
          </div>
        </div>
        <ImageList
          sx={{ width: "full", height: 300 }}
          cols={imageShowCols}
          rowHeight={300}
        >
          {uploadedImages &&
            uploadedImages.map((item) => (
              <ImageListItem key={item.filename}>
                <img
                  srcSet={`${item.url}`}
                  src={`${item.url}`}
                  alt={item.filename}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
        </ImageList>
      </Box>
    </Create>
  );
};
