import { Typography } from "@pankod/refine-mui";
import { DescriptionJson } from "interfaces/product";
import React from "react";

type Props = {
  className?: string;
  productName?: string;
  productImage?: string;
  detectionScore?: number;
  detectionOnScreenDuration?: number;
  audioTopicCovered?: number;
  audioMissingTopics?: DescriptionJson[];
};

const ProductResultCard = ({
  className,
  productName,
  productImage,
  detectionScore,
  detectionOnScreenDuration,
  audioTopicCovered,
  audioMissingTopics,
}: Props) => (
  <div className={`border-y-2 flex flex-row ${className}`}>
    <img
      className="p-2 rounded-md flex"
      alt={productName}
      src={productImage}
      width={"100"}
      height={"100"}
    />
    <div className="flex flex-col">
      <Typography variant="h6" className="mx-3" color="text.primary">
        {productName ?? "Product Name"}
      </Typography>
      {!!detectionOnScreenDuration && (
        <Typography variant="caption" className="mx-3" color="text.primary">
          On-screen duration:{" "}
          {detectionOnScreenDuration
            ? detectionOnScreenDuration > 60
            ? `${Math.floor(detectionOnScreenDuration / 60).toFixed(0)}m ${(
              detectionOnScreenDuration % 60
              ).toFixed(2)}s`
              : `${detectionOnScreenDuration.toFixed(2)}s`
              : "0s"}
        </Typography>
      )}
      {!!audioTopicCovered && (
        <Typography variant="caption" className="mx-3" color="text.primary">
          Script-Content Relevance: {`${audioTopicCovered.toFixed(0)}%` ?? "0%"}
        </Typography>
      )}
      {!!audioMissingTopics && (
        <Typography
        variant="caption"
        className="mx-3 pb-2 break-all"
        color="text.primary"
        >
          Missing Topics:{" "}
          {audioMissingTopics?.map((e) => {
            return e.topic + ", ";
          }) ?? ""}
        </Typography>
      )}
      {!!detectionScore && (
        <Typography variant="caption" className="mx-3" color="text.primary">
          AI Confidence:{" "}
          {`${(detectionScore * 100).toFixed(0)}%` ?? "0%"}
        </Typography>
      )}

      {!audioMissingTopics &&
        !audioTopicCovered &&
        !detectionOnScreenDuration &&
        !detectionScore && (
          <Typography
            variant="caption"
            className="mx-3 my-2 pb-2"
            color="text.primary"
          >
            Please wait for a moment...
          </Typography>
        )}
    </div>
  </div>
);

export default ProductResultCard;
