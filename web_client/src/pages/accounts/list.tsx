import {
  Edit,
  Box,
  TextField,
  FormControl,
  MenuItem,
  Select,
  ImageList,
  ImageListItem,
} from "@pankod/refine-mui";
import { useForm } from "@pankod/refine-react-hook-form";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@pankod/refine-mui";

import { useEffect, useMemo, useState } from "react";
import { CustomerFormDataType } from "interfaces/customer";


const schema = Yup.object({
  customer_id: Yup.string().nullable(),
  email: Yup.string().required("This field is required"),
  password: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
});

export const AccountShow = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any, any, CustomerFormDataType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="p-5">
      <Edit
        isLoading={formLoading || loading}
        saveButtonProps={saveButtonPropsHandler()}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <TextField
            {...register("email", {
              required: "This field is required",
            })}
            required
            error={!!(errors as any)?.email}
            helperText={(errors as any)?.email?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="email"
            name="email"
          />
          <TextField
            {...register("password", {
              required: "This field is required",
            })}
            required
            error={!!(errors as any)?.password}
            helperText={(errors as any)?.password?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="password"
            label="password"
            name="password"
          />
          <TextField
            {...register("phone", {
              required: "This field is required",
            })}
            required
            error={!!(errors as any)?.phone}
            helperText={(errors as any)?.phone?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="phone"
            name="phone"
          />
          <TextField
            {...register("name", {
              required: "This field is required",
            })}
            required
            error={!!(errors as any)?.name}
            helperText={(errors as any)?.name?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="name"
            name="name"
          />
        </Box>
      </Edit>
    </div>
  );
};
