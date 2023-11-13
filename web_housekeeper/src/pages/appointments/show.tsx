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

type StatusEnum = "BOOKED" | "CLEANING" | "DONE";

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
}

export const AppointmentShow: React.FC = () => {
  const {
    queryResult: { data, isLoading, isError },
  } = useShow<AppointmentDataType>();
  const inputData: AppointmentDataType | undefined = useMemo(() => {
    if (!!data) {
      return data?.data;
    }
    return undefined;
  }, [data]);

  const [status, setStatus] = useState("");
  const [example, setExample] = useState<AppointmentDataType>();
  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setStatus(event.target.value);
  // };

  const handleSubmit = () => {
    alert(`Status submitted: ${status}`);
  };

  useEffect(() => {
    const example: AppointmentDataType = {
      appointment_id: "xxxx",
      customer_id: "xxxxx",
      housekeeper_id: "xxxx2",
      address_id: "xxxxxx1",
      start_date_time: "xxxx1",
      end_date_time: "xxxx1",
      hour: 1,
      price: 2,
      status: "BOOKED",
      note: "xxxx1",
      to_do_list: ["x1", "x2", "x3"],
    };
    setExample(example);
    setStatus(example.status);
  }, []);

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
              <div className="flex">xxxxxxxx</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Customer Phone:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Name:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-2/3">
              <div className="flex">Address:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Note:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Address Size:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Start Time:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">End Time:</div>
              <div className="flex">xxxxxxxx</div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Hour:</div>
              <div className="flex">{example?.hour || 0}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">Price:</div>
              <div className="flex">{example?.price || 0}</div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="flex">To Do List Note :</div>
              <div className="flex">{example?.note}</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex">To Do List:</div>
            <div className="flex flex-row justify-between w-full">
              {example?.to_do_list.map((row) => (
                <div key={row} className="flex flex-wrap w-1/3">
                  {row}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex">status :</div>
            {status !== "" && (
              <div className="flex">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  {example?.status === "BOOKED" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                    >
                      <MenuItem value={"CLEANING"}>CLEANING</MenuItem>
                      <MenuItem value={"DONE"}>DONE</MenuItem>
                    </Select>
                  ) : example?.status === "CLEANING" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                    >
                      <MenuItem value={"DONE"}>DONE</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      onChange={handleChange}
                      disabled
                    ></Select>
                  )}
                </FormControl>
                <div className="py-2 flex items-center">
                  <Button variant="contained">OK</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <form>
          <label>Status:</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={handleStatusChange}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </form> */}
      </Show>
    </div>
  );
};
