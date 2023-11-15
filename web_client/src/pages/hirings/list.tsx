import {
  Box,
  Checkbox,
  Chip,
  Create,
  Input,
  ListItemText,
  TextField,
  TextareaAutosize,
  NumberField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@pankod/refine-mui";
import { useForm } from "@pankod/refine-react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AppointmentFormDataType } from "interfaces/appointment";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@pankod/refine-mui";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";
import { getEndpoint } from "endpoints";
import { useModal } from "@pankod/refine-core";
import { parseJwt } from "utils";

const moment = require("moment-timezone");
interface IAddress {
  address_id: string;
  customer_id: string;
  name: string;
  address: string;
  note: string;
  house_size: number;
  created_at: string;
}

interface IBaseAddressResponse {
  results: IAddress[];
}

interface IJob {
  JobId: string;
  job_name: string;
  job_rate: number;
}

interface IBaseJobResponse {
  data: IJob[];
}

const schema = Yup.object().shape({
  customer_id: Yup.string().required("This field is required"),
  address_id: Yup.string().required("This field is required"),
  start_date_time: Yup.string()
    .required("This field is required")
    .transform((curr, orig) => {
      // 2006-01-02T15:04:05Z07:00
      return moment(curr).tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ssZ");
    }),
  end_date_time: Yup.string()
    .required("This field is required")
    .transform((curr, orig) => {
      return moment(curr).tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ssZ");
    }),
  hour: Yup.number().required("This field is required"),
  price: Yup.number().required("This field is required"),
  note: Yup.string().required("This field is required"),
  to_do_list: Yup.array()
    .of(Yup.string().required("Please select at least one to do list"))
    .min(1, "Please select at least one to do list"),
});

export const HiringCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm<any, any, AppointmentFormDataType>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      to_do_list: [],
      hour: 0,
      status: "BOOKED",
      // set timezone to Thailand
      start_date_time: moment().tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm"),
      end_date_time: moment().tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm"),
    },
    refineCoreProps: {
      redirect: false,
    },
  });
  const handleLocChange = (event: SelectChangeEvent) => {
    console.log("address_id", event.target.value);
    setValue("address_id", event.target.value, { shouldValidate: true });
  };

  const handleJobsChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    var jobs = [];
    if (!Array.isArray(value)) {
      jobs.push(value);
    } else {
      jobs = value;
    }
    setValue("to_do_list", jobs, { shouldValidate: true });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // get customer id from jwt token and parse token back to json
  const uid = parseJwt(localStorage.getItem("auth_customer") || "")["uuid"];
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const endTime = useMemo(() => {
    const startedAt = watch(`start_date_time`);
    const hour = watch("hour");
    if (!!startedAt && !!hour) {
      const date = moment(startedAt)
        .add(hour, "hours")
        .format("YYYY-MM-DDTHH:mm");

      console.log("date", date);
      setValue("end_date_time", date, { shouldValidate: true });
      return date;
    }
    return null;
  }, [watch, watch("start_date_time"), watch("hour")]);

  useEffect(() => {
    console.log("ERRORS", errors);
  }, [errors]);
  const estimatedHour = useMemo(() => {
    // calculate hour for job and house size
    const hour = watch("to_do_list").reduce((acc, cur) => {
      const job = jobs.find((job) => job.JobId === cur);
      if (job) {
        return acc + job.job_rate;
      }
      return acc;
    }, 0);

    const houseSize =
      addresses.find((address) => address.address_id === watch("address_id"))
        ?.house_size || 0;
    setValue("price", hour * houseSize, { shouldValidate: true });
    return hour * houseSize;
  }, [
    addresses,
    jobs,
    watch,
    watch("address_id"),
    watch("to_do_list"),
    setValue,
  ]);

  const getAddressByCustomerId = async (
    id: string
  ): Promise<IBaseAddressResponse> => {
    const url = getEndpoint("customerAddress", "GET");
    const { data } = await axiosInstance.get(
      `${REST_PUBLIC_URI}/${url}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_customer")}`,
        },
      }
    );
    return data;
  };

  const getJobList = async (): Promise<IBaseJobResponse> => {
    const url = getEndpoint("jobs", "GET");
    const { data } = await axiosInstance.get(`${REST_PUBLIC_URI}/${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_customer")}`,
      },
    });
    return data;
  };

  useEffect(() => {
    setValue("customer_id", uid);
    getAddressByCustomerId(uid).then((res) => {
      setAddresses(res.results);
    });
  }, [setValue, uid]);

  useEffect(() => {
    getJobList().then((res) => {
      setJobs(res.data);
    });
  }, []);

  const selfHandleFinish = async () => {
    // onfinish
    // change date data into date format string
    const data = {
      ...watch(),
      start_date_time: moment(watch("start_date_time"))
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DDTHH:mm:ssZ"),
      end_date_time: moment(watch("end_date_time"))
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DDTHH:mm:ssZ"),
    };
    let response = await onFinish(data);
    console.log(response);
    setOpen(true);
  };

  const saveButtonPropsHandler = () => {
    return {
      ...saveButtonProps,
      onClick: handleSubmit(selfHandleFinish),
    };
  };
  useEffect(() => {
    if (watch("hour") < estimatedHour) {
      setValue("hour", estimatedHour, { shouldValidate: true });
    }
  }, [estimatedHour, setValue, watch]);

  useEffect(() => {
    console.log("error", errors);
    console.log("watch", watch());
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-5">
      <Create saveButtonProps={saveButtonPropsHandler()}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <div className="ml-3 w-7/12">
            <div className="flex justify-between">
              <Typography
                variant="subtitle1"
                alignSelf="center"
                className="mr-3"
              >
                Location
              </Typography>
              <FormControl sx={{ m: 1, width: 450 }}>
                <Select
                  {...register("address_id")}
                  className="w-2/3"
                  value={watch("address_id") || ""}
                  onChange={handleLocChange}
                >
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <MenuItem
                        key={address.address_id}
                        value={address.address_id}
                      >
                        {address.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={"noItem"} value={""}>
                      No address
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
            {errors.address_id && (
              <Typography color="error" variant="caption">
                {errors.address_id.message}
              </Typography>
            )}
            <div className="flex justify-between">
              <Typography
                variant="subtitle1"
                alignSelf="center"
                className="mr-3"
              >
                To Do List
              </Typography>
              <FormControl sx={{ m: 1, width: 450 }}>
                <Select
                  className="w-2/3"
                  multiple
                  value={watch("to_do_list") || []}
                  onChange={handleJobsChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            jobs.find((job) => job.JobId === value)?.job_name
                          }
                        />
                      ))}
                    </Box>
                  )}
                  placeholder="jobs"
                  MenuProps={MenuProps}
                >
                  {jobs.map((job) => (
                    <MenuItem key={job.JobId} value={job.JobId}>
                      <Checkbox
                        checked={watch("to_do_list").indexOf(job.JobId) > -1}
                      />
                      <ListItemText primary={job.job_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {errors.to_do_list && (
              <Typography color="error" variant="caption">
                {errors.to_do_list.message}
              </Typography>
            )}
          </div>

          <div className="flex justify-end">
            <div className=" w-fit border-2 rounded-md bg-[#283DA0]">
              <Typography className="p-2" color={"white"}>
                Estimated time: {estimatedHour} hours
              </Typography>
            </div>
          </div>

          <div className="ml-3 py-2 w-full">
            <Typography variant="subtitle1" className="mr-3">
              Hour
            </Typography>
            <TextField
              {...register("hour", {
                required: "This field is required",
                setValueAs: (value) => Number(value),
                validate: (value) => {
                  if (value > estimatedHour) {
                    return "Hour must be less than estimated hour";
                  }
                  if (value <= 0) {
                    return "Hour must be greater than 0";
                  }
                  return true;
                },
                onChange: (e) => {
                  setValue("hour", Number(e.target.value), {
                    shouldValidate: true,
                  });
                },
                onBlur: (e) => {
                  let val = Number(e.target.value);
                  setValue("hour", val < estimatedHour ? estimatedHour : val, {
                    shouldValidate: true,
                  });
                },
              })}
              className="w-full pr-3"
              type="number"
              error={!!errors.hour}
              helperText={errors.hour?.message}
            />
          </div>
          <div className="flex ml-3 pt-4">
            <div className="w-full">
              <Typography variant="subtitle1" className="mr-3">
                Start date time
              </Typography>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                inputProps={{
                  ...register(`start_date_time` as const, {
                    required: true,
                  }),
                }}
                error={!!(errors as any)?.start_date_time}
                type="datetime-local"
                className="pr-3"
                name="start_date_time"
              />
            </div>
            <div className="w-full">
              <Typography variant="subtitle1" className="mr-3">
                End date time
              </Typography>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                value={endTime || watch("start_date_time")}
                disabled
                error={!!(errors as any)?.end_date_time}
                type="datetime-local"
                name="end_date_time"
              />
            </div>
          </div>

          <div className="ml-3 py-4 w-full">
            <Typography variant="subtitle1" className="mr-3">
              Note (phone number, special request, etc.)
            </Typography>
            <TextField
              className="w-full pr-3"
              rows="3"
              multiline
              error={!!errors.note}
              helperText={errors.note?.message}
              {...register("note")}
            />
          </div>
        </Box>
      </Create>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"The request has been sent successfully"}
        </DialogTitle>
        <DialogContent>
          <hr />
          <DialogContentText id="alert-dialog-description">
            <div className="flex flex-col items-center">
              <Typography variant="h6" color="gray-500">
                Please wait for the system to confirm the request.
              </Typography>
              <Typography variant="caption" className="mt-2" color="gray-500">
                If the system does not respond within 5 minutes, please contact
              </Typography>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
