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
import { useState, useEffect, useMemo } from "react";
import { BaseResponse, Pagination, fileUpload } from "interfaces/common";
import { useNotification, useNavigation, useShow } from "@pankod/refine-core";
import { AppointmentFormDataType } from "interfaces/appointment";

const schema = Yup.object().shape({
  appointment_id: Yup.string().nullable(),
  customer_id: Yup.string().required("This field is required"),
  housekeeper_id: Yup.string().required("This field is required"),
  address_id: Yup.string().required("This field is required"),
  start_date_time: Yup.date().required("This field is required").transform((value, originalValue) => {
    const parsedValue = new Date(originalValue);
    
    if (isNaN(parsedValue.getTime())) {
      throw new Yup.ValidationError('Invalid date format', originalValue);
    }
    
    return parsedValue;
  }),
  end_date_time: Yup.date().required("This field is required").transform((value, originalValue) => {
    const parsedValue = new Date(originalValue);
    
    if (isNaN(parsedValue.getTime())) {
      throw new Yup.ValidationError('Invalid date format', originalValue);
    }
    
    return parsedValue;
  }),
  hour: Yup.number().required("This field is required").transform((value, originalValue) => {
    const parsedValue = parseInt(originalValue);
      
    if (isNaN(parsedValue)) {
      throw new Yup.ValidationError('Invalid hour format', originalValue);
    } 
    return parsedValue;
  }),
  price: Yup.number().required("This field is required").transform((value, originalValue) => {
    const parsedValue = parseFloat(originalValue);
    
    if (isNaN(parsedValue)) {
      throw new Yup.ValidationError('Invalid price format', originalValue);
    }
    
    return parsedValue;
  }),
  note: Yup.string().required("This field is required"),
  to_do_list: Yup.array()
  .of(Yup.string().required("Please select at least one to do list"))
  .min(1, "Please select at least one to do list"),
});

export const HiringCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any,any,AppointmentFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      location: "",         
      to_do_list: [],
      hour: 0
    },
  });
  return (
    <div className="p-5">
      
    </div>
  );
};
