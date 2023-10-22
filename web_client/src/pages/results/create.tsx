import {
  Create,
  Box,
  TextField,
  FormControl,
  MenuItem,
  ListItemText,
  Checkbox,
  Typography,
} from "@pankod/refine-mui";

import {
  FieldValues,
  SubmitHandler,
  useForm,
} from "@pankod/refine-react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";
import { useState, useEffect, useMemo } from "react";
import { ProductFormDataType } from "interfaces/product";
import { formDataType } from "interfaces/result";
import { BaseResponse, Pagination, fileUpload } from "interfaces/common";
import { UploadFile } from "components/upload";
import { useNotification, useNavigation } from "@pankod/refine-core";
const schema = Yup.object().shape({
  result: Yup.object().shape({
    title: Yup.string()
      .label("Title")
      .trim()
      .required("This field is required"),
    result_uuid: Yup.string().nullable(),
    product_uuids: Yup.array()
      .of(Yup.string().required("Please select at least one product"))
      .min(1, "Please select at least one product"),
  }),
  video: Yup.object().shape({
    video_url: Yup.string()
      .label("Video_url")
      .required("This field is required"),
    video_duration: Yup.number().label("Video_duration"),
    video_width: Yup.number().label("Video_width"),
    video_height: Yup.number().label("Video_height"),
  }),
});

// select multi
const itemHeight = 72;
const itemPaddingTop = -48;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: itemHeight * 4.5 + itemPaddingTop,
    },
  },
};

export const ResultCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<formDataType>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      result: {
        title: "",
        product_uuids: [],
      },
      video: {
        video_url: "",
      },
    },
  });

  const { push } = useNavigation();
  const { open } = useNotification();

  const [productID, setProductID] = useState<string[]>([]);
  const [productData, setProductData] = useState<ProductFormDataType[]>([]);

  const [uploadedVideo, setUploadedVideo] = useState<fileUpload>(
    null as unknown as fileUpload
  );
  const [loading, setLoading] = useState<boolean>(false);

  const allowedExtension = ["video/mp4"];

  const getProductDataFromDb = async () => {
    const { data } = await axiosInstance.get<
      BaseResponse<Pagination<ProductFormDataType>>
    >(`${REST_PUBLIC_URI}/products`, {
      withCredentials: false,
    });
    setProductData(data.data.items);
  };

  const handleChangeMulti = async (
    event: SelectChangeEvent<typeof productID>
  ) => {
    const {
      target: { value },
    } = event;
    setProductID(typeof value === "string" ? value.split(",") : value);
    setValue("result.product_uuids", value);
    await trigger("result.product_uuids");
  };

  const video_url = useMemo(() => {
    if (!!uploadedVideo) {
      return "https://ik.imagekit.io/openvid/" + uploadedVideo.filename;
    }

    return "";
  }, [uploadedVideo]);
  useEffect(() => {
    getProductDataFromDb();
  }, [watch]);

  useEffect(() => {
    if (!!uploadedVideo) {
      setValue("video.video_url", uploadedVideo.url || "");
    }
  }, [setValue, uploadedVideo]);

  const OnChecking: SubmitHandler<FieldValues> = async (values) => {
    setLoading(true);
    try {

      const { data } = await axiosInstance.post(
        `${REST_PUBLIC_URI}/results/check-video`,
        {
          ...values,
        },
        {
          withCredentials: false,
        }
        );
        
        if (!!data) {
          setLoading(false);
          //push(`/results/${data.data.result_uuid}`)
          push(`/results`);
          
          open?.({
            message: "Start checking video successfully",
            description: "Please wait for a while.",
            type: "success",
          });
          
        }
        
        return data;
      } catch (error) {
        setLoading(false);
        open?.({
          message: "Start checking video failed",
          description: "Please try again.",
          type: "error",
        });
      }

  };
  return (
    <Create
      isLoading={formLoading || loading}
      saveButtonProps={{
        ...saveButtonProps,
        children: "Start Checking",
        disabled:
          formLoading ||
          loading ||
          !uploadedVideo ||
          (Array.isArray(uploadedVideo) && uploadedVideo.length === 0),
        onClick: handleSubmit(OnChecking),
      }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("result.title", {
            required: "This field is required",
          })}
          disabled={formLoading || loading}
          error={!!(errors as any)?.result?.title}
          helperText={(errors as any)?.result?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Title"
          name="result.title"
        />
        <FormControl fullWidth className="mt-3">
          <div className="flex">
            <Typography
              variant="caption"
              color={"text.secondary"}
              className="ml-3"
            >
              Select Product
            </Typography>
            {(errors as any).result?.product_uuids && (
              <Typography variant="caption" color="#FF0000" className="ml-3">
                Product is required at least one.
              </Typography>
            )}
          </div>
          <Select
            {...register(`result.product_uuids`)}
            error={!!(errors as any)?.result?.product_uuids}
            name="result.product_uuids"
            multiple
            value={productID}
            onChange={handleChangeMulti}
            disabled={formLoading || loading}
            displayEmpty={true}
            renderValue={(selected) => {
              if ((selected as string[]).length === 0) {
                return (
                  <Typography variant="subtitle2" color="secondary.main">
                    Click to select product
                  </Typography>
                );
              }

              if (productData?.length === 0) {
                return (
                  <Typography variant="subtitle2" color="secondary.main">
                    No product found, please create product first.
                  </Typography>
                );
              }

              return selected
                .map(
                  (uuid) =>
                    productData.find((item) => item.product_uuid === uuid)
                      ?.product_name_en
                )
                .join(", ");
            }}
            MenuProps={MenuProps}
          >
            {productData?.map((data: ProductFormDataType) => (
              <MenuItem key={data.product_uuid} value={data.product_uuid}>
                <Checkbox checked={productID.indexOf(data.product_uuid) > -1} />
                <ListItemText primary={data.product_name_en} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="mt-6">
          <Typography variant="caption" className="mx-3" color="text.secondary">
            Video from Tiktok
          </Typography>

          <UploadFile
            placeholder="Click here to upload a video"
            setValue={setValue}
            errorProp={!!(errors as any)?.video?.video_url}
            helperTextProp={(errors as any)?.video?.video_url?.message}
            setUploadedFiles={setUploadedVideo}
            multiple={false}
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
              * We currently support mp4 file with maximum size of 1GB.
            </Typography>
            <Typography
              variant="caption"
              className="mx-3"
              fontSize={"12px"}
              color="text.secondary"
            >
              * For a large file, there may takes about 3 - 5 minutes in
              uploading. Please wait for a while.
            </Typography>
          </div>
        </div>
        {!!uploadedVideo && (
          <div className="flex justify-center mt-6">
            <video
              className="rounded-lg shadow-lg"
              width="480"
              height="360"
              controls
              preload="auto"
              data-setup="{}"
            >
              <source src={video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Box>
    </Create>
  );
};
