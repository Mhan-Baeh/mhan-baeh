import {
  Show,
  Box,
  TextField,
  FormControl,
  MenuItem,
  ListItemText,
  Checkbox,
  Typography,
  CircularDeterminate,
  CircularProgress,
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
import { ResultShowDataType } from "interfaces/result";
import { BaseResponse, Pagination, fileUpload } from "interfaces/common";
import { UploadFile } from "components/upload";
import { useNotification, useNavigation, useShow } from "@pankod/refine-core";
import ProductResultCard from "components/ProductResultCard";

export const ResultShow = () => {
  const {
    queryResult: { data, isLoading, isError },
  } = useShow<ResultShowDataType>();
  const inputData: ResultShowDataType | undefined = useMemo(() => {
    if (!!data) {
      return data?.data;
    }
    return undefined;
  }, [data]);

  const { push } = useNavigation();
  const { open } = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const videoUrl = useMemo(() => {
    if (!!inputData) {
      const uploadedVideo = inputData.video_url;
      let videoFileNameArray = uploadedVideo?.split("/");
      let videoFileName = videoFileNameArray?.pop();
      let videoFolderName = videoFileNameArray?.pop();
      console.log("videoFileName", videoFileName);
      console.log("videoFolderName", videoFolderName);
      let videoUrl =
        "https://ik.imagekit.io/openvid/" +
        videoFolderName +
        "/" +
        videoFileName;
      console.log("video_url", videoUrl);
      return videoUrl;
    }

    return "";
  }, [inputData]);

  const resultVideoUrl = useMemo(() => {
    if (!!inputData) {
      const uploadedVideo = inputData.detection_result_video_url;
      let videoFileNameArray = uploadedVideo?.split("/");
      let videoFileName = videoFileNameArray?.pop();
      let videoFolderName = videoFileNameArray?.pop();
      console.log("videoFileName", videoFileName);
      console.log("videoFolderName", videoFolderName);
      if (!videoFileName || !videoFolderName) {
        return "";
      }
      let resultVideoUrl =
        "https://ik.imagekit.io/openvid/" +
        videoFolderName +
        "/" +
        videoFileName;
      console.log("video_url", resultVideoUrl);

      return resultVideoUrl;
    }

    return "";
  }, [inputData]);

  const [result, setResult] = useState<ResultShowDataType>();
  useEffect(() => {
    const ResultFetching = async () => {
      setLoading(true);
      const { data } = await axiosInstance.get<
        BaseResponse<ResultShowDataType>
      >(`${REST_PUBLIC_URI}/results/${inputData?.result_uuid}`, {
        withCredentials: false,
      });
      setLoading(false);
      console.log("data", data);

      if (data.success) {
        setResult(data.data);
      } else {
        console.log("error", data.message);
        open?.({
          message: "Get result failed",
          description: "Please try again.",
          type: "error",
        });
      }
    };
    // Increment counter every second
    const intervalId = setInterval(async () => {
      console.log("execute get result api call");
      await ResultFetching();
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [inputData?.result_uuid, open]);

  const overallProductFound = useMemo(() => {
    if (!!result?.detection_score && result?.detection_score.length > 0) {
      let overallProductFound =
        result.detection_score
          .map((e) => e.avg_confidence * 100)
          .reduce((a, b) => a + b, 0) / result.detection_score.length;
      return `${overallProductFound.toFixed(0)}%`;
    }
    return "0%";
  }, [result?.detection_score]);

  const totalOnScreenProductDuration = useMemo(() => {
    if (!!result?.detection_score && result?.detection_score.length > 0) {
      let totalOnScreenProductDuration = result.detection_score
        .map((e) => e.screen_time)
        .reduce((a, b) => a + b, 0);
      if (totalOnScreenProductDuration > 60) {
        return `${totalOnScreenProductDuration / 60}m ${
          totalOnScreenProductDuration % 60
        }s`;
      }
      return `${totalOnScreenProductDuration.toFixed(2)}s`;
    }
    return "0.00s";
  }, [result?.detection_score]);

  const overallTopicCovered = useMemo(() => {
    if (!!result?.audio_score && result?.audio_score.length > 0) {
      let overallTopicCovered =
        result.audio_score.map((e) => e.score).reduce((a, b) => a + b, 0) /
        result.audio_score.length;
      return `${overallTopicCovered.toFixed(2)}%`;
    }
    return "0%";
  }, [result?.audio_score]);

  const isProcessingError = useMemo(() => {
    let audioStatus = result?.audio_status;
    let detectionStatus = result?.detection_status;
    if (audioStatus === "ERROR" || detectionStatus === "ERROR") {
      return true;
    }
    return false;
  }, [result?.audio_status, result?.detection_status]);

  const isDetectionInQueue = useMemo(() => {
    let detectionStatus = result?.detection_status;
    if (detectionStatus === "IN_QUEUE") {
      return true;
    }
    return false;
  }, [result?.detection_status]);

  const isAudioInQueue = useMemo(() => {
    let audioStatus = result?.audio_status;
    if (audioStatus === "IN_QUEUE") {
      return true;
    }
    return false;
  }, [result?.audio_status]);

  const isDetectionInProg = useMemo(() => {
    let detectionStatus = result?.detection_status;
    if (detectionStatus === "IN_PROGRESS") {
      return true;
    }
    return false;
  }, [result?.detection_status]);

  const isAudioInProg = useMemo(() => {
    let audioStatus = result?.audio_status;
    if (audioStatus === "IN_PROGRESS") {
      return true;
    }
    return false;
  }, [result?.audio_status]);

  const inQueueText = useMemo(() => {
    if (isProcessingError) {
      return "service processing error";
    }

    if (isDetectionInProg && isAudioInProg) {
      return ` (audio and detection processing currently in progress)`;
    } else if (isAudioInProg) {
      return ` (audio processing currently in progress)`;
    } else if (isDetectionInProg) {
      return ` (detection processing currently in progress)`;
    }
    return "";
  }, [isAudioInProg, isDetectionInProg, isProcessingError]);

  const [products, setProducts] = useState<ProductFormDataType[]>([]);

  useEffect(() => {
    const ProductFetching = async () => {
      setLoading(true);
      const { data } = await axiosInstance.get<
        BaseResponse<Pagination<ProductFormDataType>>
      >(`${REST_PUBLIC_URI}/products/?limit=1000`, {
        withCredentials: false,
      });
      setLoading(false);
      if (data.success) {
        setProducts(data.data.items);
      } else {
        console.log("error", data.message);
        open?.({
          message: "Get products failed",
          description: "Please try again.",
          type: "error",
        });
      }
    };
    ProductFetching();
  }, [open]);

  const mapProductUuidToImage = useMemo(() => {
    if (!!products && products.length > 0) {
      let mapProductUuidToImage = new Map();
      products.forEach((product) => {
        mapProductUuidToImage.set(product.product_uuid, product.image_urls[0]);
      });
      return mapProductUuidToImage;
    }
    return new Map();
  }, [products]);

  return (
    <Show isLoading={isLoading || loading}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <div className="flex flex-row gap-2">
          <Typography variant="h6" color={"text.primary"} className="flex">
            Topic:
          </Typography>
          <Typography
            variant="h6"
            color={"text.secondary"}
            className="flex break-all"
          >
            {inputData?.title}
          </Typography>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-md py-5 mt-3 px-2">
          <div className="flex flex-row flex-wrap justify-center items-start gap-x-28 gap-y-8">
            <div className="flex flex-col justify-center items-center gap-3 bg-indigo-500 pt-3 rounded-lg shadow-lg">
              <Typography variant="subtitle1" className="flex text-white">
                Video from Tiktok
              </Typography>
              {!!videoUrl && (
                <div className="flex">
                  <video
                    className="bg-white rounded-b-lg"
                    width="480"
                    height="360"
                    controls
                    preload="auto"
                    data-setup="{}"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video.
                  </video>
                </div>
              )}
            </div>
            {!isProcessingError ? (
              <div className="flex">
                {!!result && (!isDetectionInQueue || !isAudioInQueue) ? (
                  <div className="flex flex-col justify-start items-center gap-3 bg-indigo-500 pt-3 rounded-lg shadow-lg">
                    <Typography variant="subtitle1" className="flex text-white">
                      Result's video
                      {isAudioInQueue || isDetectionInQueue ? (
                        <Typography
                          variant="caption"
                          className="mx-3 mt-1"
                          fontSize={"12px"}
                          color="text.secondary"
                        >
                          {inQueueText}
                        </Typography>
                      ) : isProcessingError ? (
                        <Typography
                          variant="caption"
                          className="mx-3 mt-1"
                          fontSize={"12px"}
                          color="red"
                        >
                          {inQueueText}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Typography>
                    <div className=" flex">
                      {!!resultVideoUrl ? (
                        <video
                          className="bg-white rounded-b-lg"
                          width="480"
                          height="360"
                          controls
                          preload="auto"
                          data-setup="{}"
                        >
                          <source src={resultVideoUrl} type="video/mp4" />
                          Your browser does not support the video.
                        </video>
                      ) : (
                        <div
                          className="bg-white rounded-b-lg flex flex-col justify-center items-center gap-5"
                          style={{ width: 480, height: 360 }}
                        >
                          <CircularProgress
                            size={100}
                            variant="indeterminate"
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            className="opacity-80"
                          >
                            Please wait for a while, your request has been
                            received
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    className="mt-6 text-center"
                  >
                    <div
                      className="flex justify-center items-center"
                      style={{ width: 480, height: 360 }}
                    >
                      <div className="flex">
                        Please wait for a while, the result is waiting to be
                        process
                      </div>
                    </div>
                  </Typography>
                )}
              </div>
            ) : (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mt-6 text-center"
              >
                <div
                  className="flex justify-center items-center"
                  style={{ width: 480, height: 360 }}
                >
                  <div className="flex">
                    Please try again, the result is processing error
                  </div>
                </div>
              </Typography>
            )}
          </div>

          <div className="mt-10">
            {!isProcessingError ? (
              <div>
                {!!result && (!isDetectionInQueue || !isAudioInQueue) ? (
                  <div className="flex flex-row flex-wrap justify-center items-center gap-x-28 gap-y-8">
                    <div className="flex flex-col items-center gap-3 bg-indigo-500 pt-3 rounded-lg shadow-lg">
                      {(overallProductFound !== "0%" ||
                        totalOnScreenProductDuration !== "0s" ||
                        overallTopicCovered !== "0%") && (
                        <Typography
                          variant="subtitle1"
                          className="flex text-white"
                        >
                          Conclusion
                        </Typography>
                      )}
                      <div
                        className="flex flex-col items-center bg-white rounded-b-lg py-3"
                        style={{ width: 480 }}
                      >
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          className="flex px-3"
                        >
                          {totalOnScreenProductDuration !== "0.00s" && (
                            <li>
                              Products On-screen Duration:{" "}
                              {totalOnScreenProductDuration}
                            </li>
                          )}
                          {overallTopicCovered !== "0%" && (
                            <li>
                              Overall topics covered: {overallTopicCovered}
                            </li>
                          )}
                          {overallProductFound !== "0%" && (
                            <li>
                              Average AI Confidences: {overallProductFound}
                            </li>
                          )}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex flex-col pt-3 bg-indigo-500 rounded-lg shadow-lg">
                      <Typography
                        variant="subtitle1"
                        className="flex justify-center mb-3 text-white"
                      >
                        Product
                      </Typography>
                      <div
                        className=" flex flex-col overflow-y-auto bg-white rounded-b-lg"
                        style={{ width: 480, maxHeight: 360 }}
                      >
                        {inputData?.product_uuids.map(
                          (item: string, index: number) => (
                            <div>
                              <ProductResultCard
                                className="w-full h-1/3 justify-start items-center px-2"
                                productName={
                                  products.find((e) => e.product_uuid === item)
                                    ?.product_name_en ?? ""
                                }
                                productImage={mapProductUuidToImage.get(item)}
                                detectionScore={
                                  result?.detection_score.find(
                                    (e) => e.product_uuid === item
                                  )?.avg_confidence ?? undefined
                                }
                                detectionOnScreenDuration={
                                  result?.detection_score.find(
                                    (e) => e.product_uuid === item
                                  )?.screen_time ?? undefined
                                }
                                audioTopicCovered={
                                  result?.audio_score.find(
                                    (e) => e.product_uuid === item
                                  )?.score ?? undefined
                                }
                                audioMissingTopics={
                                  result?.audio_score.find(
                                    (e) => e.product_uuid === item
                                  )?.missing ?? undefined
                                }
                              />
                              <hr className="m-0"></hr>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Box>
    </Show>
  );
};
