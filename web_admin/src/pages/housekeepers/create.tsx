import React, { useEffect } from "react";

import {
  Create,
  Box,
  TextField,
} from "@pankod/refine-mui";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "@pankod/refine-react-hook-form";
import { HousekeeperFormDataType } from "interfaces/housekeeper";

export const HouseKeeperCreate = () => {
  const schema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    name: Yup.string().required(),
    phone: Yup.string().required(),
  });

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any, any, HousekeeperFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    console.log(errors);
  }, []);

  return (
    <div className="p-5">
      <Create saveButtonProps={ saveButtonProps}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <div className="p-3 flex flex-col gap-y-4">
            <TextField
              {...register("email", {
                required: "This field is required",
              })}
              required
              error={!!(errors as any)?.email}
              helperText={(errors as any)?.email?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="email"
              label="Email"
              name="email"
            />
            <TextField
              {...register("password", {
                required: "This field is required",
              })}
              required
              error={!!(errors as any)?.password}
              helperText={(errors as any)?.password?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="password"
              label="Password"
              name="password"
            />
            <TextField
              {...register("name", {
                required: "This field is required",
              })}
              required
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Name"
              name="name"
            />
            <TextField
              {...register("phone", {
                required: "This field is required",
              })}
              required
              error={!!(errors as any)?.phone}
              helperText={(errors as any)?.phone?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Phone"
              name="phone"
            />
          </div>
        </Box>
      </Create>
    </div>
  );
};
