import React, { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  List,
  Typography,
  Button,
  Show,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@pankod/refine-mui";
import { useShow } from "@pankod/refine-core";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";

type StatusEnum = "BOOKED" | "CLEANING" | "DONE" | "CANCELLED";

interface AddressDataType {
  address_id: string;
  customer_id: string;
  name: string;
  address: string;
  note: string;
  house_size: string;
}

interface housekeeperDataType {
  housekeeper_id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface customerDataType {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
}

interface jobDataType {
  job_id: string;
  job_name: string;
  job_rate: number;
}

interface AppointmentDataType {
  appointment_id: string;
  customer_id: string;
  housekeeper_id: string;
  address_id: string;
  start_date_time: string;
  end_date_time: string;
  hour: number;
  price: number;
  status: StatusEnum;
  note: string;
  to_do_list: string[];
  created_at: string;
  updated_at: string;
  address: AddressDataType;
  housekeeper: housekeeperDataType;
  customer: customerDataType;
  job: jobDataType[];
}
interface dataType {
  data: AppointmentDataType;
}

export const AppointmentShow: React.FC = () => {
  const {
    queryResult: { data, isLoading, isError },
  } = useShow<dataType>();

  const inputData: AppointmentDataType | undefined = useMemo(() => {
    if (!!data) {
      return data?.data.data;
    }
    return undefined;
  }, [data]);

  const [status, setStatus] = useState("BOOKED");
  const [allData, setallData] = useState<AppointmentDataType>();
  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setStatus(event.target.value);
  // };

  const handleStatusChange = async () => {
    const token = localStorage.getItem("auth_housekeeper");
    await axiosInstance.patch(
      `${REST_PUBLIC_URI}/appointment-api/http/appointments/${allData?.appointment_id}`,
      { status: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(`Status submitted: ${status}`);
  };

  useEffect(() => {
    setallData(inputData);
    // setStatus(inputData.status);
    if (!!inputData) {
      setStatus(inputData.status);
    } else {
      setStatus("BOOKED");
    }
    console.log(allData);
  }, [inputData]);

  // api CustomerAddress for get address
  // api Customer for get Customer name and phone
  // api HouseKeeper for housekeeper name
  // api Job for get each job name
  // api Appointment for post status

  return (
    <div className="p-5">
      <Show title={<Typography variant="h5">Edit Appointment</Typography>}>
        <div className="flex flex-col items-start gap-10">
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Customer Name:</div>
              <div className="flex">{allData?.customer?.name || ""}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Customer Phone:</div>
              <div className="flex">{allData?.customer?.phone || ""}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Name:</div>
              <div className="flex">{allData?.address?.name || ""}</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-2/3">
              <div className="flex">Address:</div>
              <div className="flex">{allData?.address?.address || ""}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Note:</div>
              <div className="flex">{allData?.address?.note || ""}</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Size:</div>
              <div className="flex">{allData?.address?.house_size || ""}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Start Time:</div>
              <div className="flex">{allData?.start_date_time || ""}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">End Time:</div>
              <div className="flex">{allData?.end_date_time || ""}</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Hour:</div>
              <div className="flex">{allData?.hour || 0}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Price:</div>
              <div className="flex">{allData?.price || 0}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">To Do List Note :</div>
              <div className="flex">{allData?.note || ""}</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex">To Do List:</div>
            <div className="flex flex-row justify-between w-full">
              {allData?.job?.map((row) => (
                <div key={row.job_id} className="flex flex-wrap w-1/3">
                  {row?.job_name || ""}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex">status :</div>
            {status !== "" && (
              <div className="flex">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  {allData?.status === "BOOKED" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                    >
                      <MenuItem selected value={"BOOKED"}>
                        BOOKED
                      </MenuItem>
                      <MenuItem value={"CLEANING"}>CLEANING</MenuItem>
                      <MenuItem value={"DONE"}>DONE</MenuItem>
                    </Select>
                  ) : allData?.status === "CLEANING" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                    >
                      <MenuItem value={"CLEANING"}>CLEANING</MenuItem>
                      <MenuItem value={"DONE"}>DONE</MenuItem>
                    </Select>
                  ) : allData?.status === "DONE" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                      disabled
                    >
                      <MenuItem value={"DONE"} selected>
                        DONE
                      </MenuItem>
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                      disabled
                    >
                      <MenuItem value={"CANCELLED"} selected>
                        CANCEL
                      </MenuItem>
                    </Select>
                  )}
                </FormControl>
                <div className="py-2 flex items-center">
                  {inputData?.status === "DONE" || status === "CANCELLED" ? (
                    <Button
                      onClick={handleStatusChange}
                      variant="contained"
                      disabled
                    >
                      OK
                    </Button>
                  ) : (
                    <Button onClick={handleStatusChange} variant="contained">
                      OK
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Show>
    </div>
  );
};
