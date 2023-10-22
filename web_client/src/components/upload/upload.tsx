import { fileUpload } from "interfaces/common";
import React, { useState, useEffect, useMemo } from "react";
import { MuiFileInput } from "mui-file-input";
import { AxiosInstance } from "axios";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";
import { LinearProgress } from "@mui/material";

type UploadFileProps<T extends fileUpload | fileUpload[]> = {
  placeholder?: string;
  multiple?: boolean;
  setValue: any;
  errorProp?: any;
  helperTextProp?: any;
  setUploadedFiles: React.Dispatch<React.SetStateAction<T>>;
  loading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  allowedExtension?: string[];
  maxUploadSizeMb?: number;
};

export const UploadFile = <
  T extends fileUpload | fileUpload[],
  U extends File | File[] | null
>({
  placeholder,
  multiple = true,
  setValue,
  errorProp,
  helperTextProp,
  setUploadedFiles,
  loading,
  setLoading,
  maxUploadSizeMb = 1024,
  allowedExtension = ["image/jpeg", "image/jpg", "image/png"],
}: UploadFileProps<T>) => {
  const [clientImages, setClientImages] = useState<U>(null as unknown as U);
  const [errorSelf, setErrorSelf] = useState<boolean>(false);
  const [helperTextSelf, setHelperTextSelf] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0.0);
  const memoizedErrorProp = useMemo(() => errorProp, [errorProp]);
  const memoizedHelperTextProp = useMemo(
    () => helperTextProp,
    [helperTextProp]
  );

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const throttleProgressUpdates = (newProgress: number) => {
    if (!isUploading) {
      setIsUploading(true);
      requestAnimationFrame(() => {
        setProgressValue(newProgress);
        setIsUploading(false);
      });
    }
  };
  const upload = async (files: File[]) => {
    try {
      setLoading(true);
      const formData = new FormData();


      if (Array.isArray(files)) {
        files.forEach((file: File) => {
          formData.append(`files`, file);
        });
      } else {
        formData.append(`files`, files);
      }

      const httpClient: AxiosInstance = axiosInstance;
      const url = `${REST_PUBLIC_URI}/files/upload-files`;
      const data = await httpClient.post(url, formData, {
        withCredentials: false,
        onUploadProgress: (progressEvent) => {
          const newProgress =
            (progressEvent.loaded / progressEvent.total) * 100;
          throttleProgressUpdates(newProgress); // Throttle progress updates
        },
      });
      let uploadedData = data.data.data;
      if (multiple) {
        setUploadedFiles(uploadedData);
      } else {
        setUploadedFiles(uploadedData[0]);
      }
    } catch (err) {
      setErrorSelf(true);
      setHelperTextSelf(
        err && (err as Error).message
          ? (err as Error).message
          : "Error occurred, please try again"
      );
    } finally {
      setLoading(false);
      setProgressValue(0);
    }
  };

  const onChangeHandler = async (files: File | File[] | null) => {
    // Pass the files directly
    try {
      setError(false);
      setHelperText("");
      setErrorSelf(false);
      setHelperTextSelf("");
      let filesToUpload = [];
      setClientImages(files as U);

      // validate
      if (multiple) {
        // file is null
        if (!files || (Array.isArray(files) && files.length === 0)) {
          setValue("image_urls", []);
          setUploadedFiles([] as fileUpload[] as T);
          return;
        }
        // file length
        if (Array.isArray(files) && files.length > 10) {
          setErrorSelf(true);
          setHelperTextSelf("You can only upload a maximum of 10 images.");
          return;
        }
        // validate file size no more than 1GB
        if (Array.isArray(files)) {
          for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxUploadSizeMb * 1000000) {
              setErrorSelf(true);
              setHelperTextSelf(
                `You can only upload a maximum of ${maxUploadSizeMb}MB per image.`
              );
              return;
            }
          }
        }
      } else {
        // file is null
        if (!files) {
          setValue("image_urls", undefined);
          setUploadedFiles(undefined as unknown as T);
          return;
        }
        // validate file size no more than 1GB
        if (!Array.isArray(files) && files.size > 1000000000) {
          setErrorSelf(true);
          setHelperTextSelf("You can only upload a maximum of 1GB per image.");
          return;
        }
      }

      if (Array.isArray(files)) {
        filesToUpload.push(...files);
      } else {
        filesToUpload.push(files);
      }
      await upload(filesToUpload);
    } catch (error) {
      setHelperTextSelf(
        error && (error as Error).message
          ? (error as Error).message
          : "Error occurred, please try again"
      );
      setErrorSelf(true);
    }
  };

  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");
  useEffect(() => {
    // error multiplexing

    if (!!memoizedErrorProp) {
      setError(memoizedErrorProp);
      setHelperText(memoizedHelperTextProp);
    } else if (!!errorSelf && !memoizedErrorProp) {
      setError(errorSelf);
      setHelperText(helperTextSelf);
    } else {
      setError(false);
      setHelperText("");
    }
  }, [errorSelf, helperTextSelf, memoizedErrorProp, memoizedHelperTextProp]);

  return (
    <div>
      <MuiFileInput
        placeholder={placeholder ?? "Click here to upload files"}
        value={clientImages}
        multiple={multiple}
        onChange={onChangeHandler}
        error={!!error}
        disabled={loading}
        helperText={!!error ? helperText : ""}
        fullWidth
        inputProps={{ accept: allowedExtension.join(",") }}
      />
      {loading && progressValue < 100 && (
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ width: "100%" }}
        />
      )}
      {loading && progressValue === 100 && (
        <LinearProgress sx={{ width: "100%" }} />
      )}
    </div>
  );
};
