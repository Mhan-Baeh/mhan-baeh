import {
  Show,
  Box,
  ImageList,
  ImageListItem,
} from "@pankod/refine-mui";
import { DescriptionJson } from "interfaces/product";
import { Typography } from '@pankod/refine-mui';
import {useShow} from "@pankod/refine-core";
import { ProductFormDataType } from "interfaces/product";
import { useEffect, useMemo, useState } from "react";

export const ProductShow = () => {
  const { queryResult: data } = useShow<ProductFormDataType>();
  const inputData: ProductFormDataType | undefined = useMemo(() => {
    if (!!data) {
      return data?.data?.data;
    }
    return undefined;
  }, [data]);

  const [imageShowCols, setImageShowCols] = useState<number>(6);
  // const [currentImageLength]

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

  return (
    <Show>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <div className="flex flex-col justify-center items-center">
          <Typography variant="h6"  gutterBottom>
            Product Images
          </Typography>
          <div className="mt-5" style={{height:350}}>
            <ImageList
              sx={{ width: "full", height: 300 }}
              cols={imageShowCols}
              rowHeight={300}
              className="text-center"
            >
            
              {!!inputData?.image_urls &&
                inputData?.image_urls.map((item) => (
                  <ImageListItem key={item}
                    className="flex"
                  >
                    
                    <img
                      srcSet={`${item}`}
                      src={`${item}`}
                      alt={item}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </ImageListItem>
                ))}
            </ImageList>
          </div>
        </div>

        <div className="bg-blue-50 pt-10 pb-3 shadow-lg rounded-lg px-2">
          
          <div className="flex flex-col justify-start items-center 2xl:flex-row 2xl:justify-center 2xl:items-start gap-5">
            <div className="flex flex-row flex-wrap justify-center items-center gap-5 w-full xl:w-11/12 2xl:w-5/12">
              <div className="flex flex-col items-center w-60 bg-indigo-500 rounded-lg shadow-md">
                <Typography variant="h6" className="flex mt-3 text-white mb-3" style={{height: 30}}>
                  Product Id
                </Typography>
                <Typography
                  className="break-all flex bg-white p-3 rounded-b-lg shadow-md w-full justify-center items-start overflow-y-auto"
                  variant="body1"
                  color="textSecondary"
                  style={{height: 60}}
                >
                  {inputData?.product_uuid}
                </Typography>
              </div>
              <div className="flex flex-col items-center w-60 bg-indigo-500 rounded-lg shadow-md">
                <Typography variant="h6" className="flex mt-3 text-white mb-3" style={{height: 30}}>
                Product Name (EN)
                </Typography>
                <Typography
                  className="break-all flex bg-white p-3 rounded-b-lg shadow-md w-full justify-center items-start overflow-y-auto"
                  variant="body1"
                  color="textSecondary"
                  style={{height: 60}}
                >
                  {inputData?.product_name_en}
                </Typography>
              </div>
              <div className="flex flex-col items-center w-60 bg-indigo-500 rounded-lg shadow-md">
                <Typography variant="h6" className="flex mt-3 text-white mb-3" style={{height: 30}}>
                  Product Name (TH)
                </Typography>
                <Typography
                  className="break-all flex bg-white p-3 rounded-b-lg shadow-md w-full justify-center items-start overflow-y-auto"
                  variant="body1"
                  color="textSecondary"
                  style={{height: 60}}
                >
                  {inputData?.product_name_th}
                </Typography>
              </div>
              <div className="flex flex-col items-center w-60 bg-indigo-500 rounded-lg shadow-md">
                <Typography variant="h6" className="flex mt-3 text-white mb-3" style={{height: 30}}>
                  Category
                </Typography>
                <Typography
                  className="break-all flex bg-white p-3 rounded-b-lg shadow-md w-full justify-center items-start"
                  variant="body1"
                  color="textSecondary"
                  style={{height: 60}}
                >
                  {inputData?.category}
                </Typography>
              </div>
          </div>
            <div className="flex flex-col justify-start w-96 md:w-11/12 xl:10/12 2xl:w-7/12 bg-indigo-500 rounded-lg shadow-md">
                <Typography variant="h6" className="flex justify-center my-3 text-white" style={{maxHeight: 30}}>
                  Product Description
                </Typography>
                <div className="flex flex-col justify-start items-center overflow-y-auto bg-white p-3 rounded-b-lg shadow-md items-center" style={{maxHeight: 195}}>
                  {inputData?.product_description.map(
                    (item: DescriptionJson, index: number) => (
                      <div key={index} className="flex flex-row justify-start flex-wrap md:flex-nowrap items-center gap-3 p-2 w-full">
                        <div className="flex flex-row items-center w-full md:w-5/12 gap-3">
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            className="flex justify-center shadow-md rounded-lg bg-blue-100 p-2 w-2/7 md:w-2/5"
                          >
                            Topic
                          </Typography>
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            className="flex break-all w-5/7 md:w-3/5"
                          >
                            {item.topic}
                          </Typography>  
                        </div>
                        <div className="flex flex-row items-center w-full md:w-7/12 gap-3">
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            className="flex justify-center shadow-md rounded-lg bg-amber-50 p-2 w-2/7"
                          >
                            Description
                          </Typography>
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            className="flex break-all w-5/7"
                          >
                            {item.description}
                          </Typography>
                        </div>
                      </div>
                    )
                  )}
                </div>
            </div>
          </div>
          
          <div className="flex justify-between mx-5 opacity-50 mt-5">
            <div className="flex flex-col flex-wrap justify-center items-start">
              <div className="flex">
                <Typography
                  className="break-all flex text-center mb-0"
                  variant="caption"
                  gutterBottom
                  color="textSecondary"
                >
                  Created At : {!!inputData?.created_at &&
                    new Date(inputData?.created_at)?.toLocaleString()}
                </Typography>
              </div>
              <div className="flex">
                <Typography
                  className="break-all flex text-center mb-0"
                  variant="caption"
                  gutterBottom
                  color="textSecondary"
                >
                  Created By : {inputData?.created_by}
                </Typography>
              </div>
            </div>  
            <div className="flex flex-col flex-wrap justify-center items-start">
              <div className="flex">
                <Typography
                  className="break-all flex text-center mb-0"
                  variant="caption"
                  gutterBottom
                  color="textSecondary"
                >
                  Updated At : {!!inputData?.updated_at &&
                    new Date(inputData?.updated_at).toLocaleString()}
                </Typography>
              </div>

              <div className="flex">
                <Typography
                  className="break-all flex text-center mb-0"
                  variant="caption"
                  gutterBottom
                  color="textSecondary"
                >
                  Updated By : {inputData?.updated_by}
                </Typography>
              </div>
            </div>                
          </div>          
        </div>
                
      </Box>
    </Show>
  );
};
