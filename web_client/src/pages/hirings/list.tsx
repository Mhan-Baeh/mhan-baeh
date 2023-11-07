import { Box, Checkbox, Chip, Create, Input, ListItemText, TextField, TextareaAutosize } from "@pankod/refine-mui";

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

const schema = Yup.object().shape({
  appointment_id: Yup.string().nullable(),
  customer_id: Yup.string().required("This field is required"),
  housekeeper_id: Yup.string().required("This field is required"),
  address_id: Yup.string().required("This field is required"),
  start_date_time: Yup.date()
    .required("This field is required")
    .transform((value, originalValue) => {
      const parsedValue = new Date(originalValue);

      if (isNaN(parsedValue.getTime())) {
        throw new Yup.ValidationError("Invalid date format", originalValue);
      }

      return parsedValue;
    }),
  end_date_time: Yup.date()
    .required("This field is required")
    .transform((value, originalValue) => {
      const parsedValue = new Date(originalValue);

      if (isNaN(parsedValue.getTime())) {
        throw new Yup.ValidationError("Invalid date format", originalValue);
      }

      return parsedValue;
    }),
  hour: Yup.number()
    .required("This field is required")
    .transform((value, originalValue) => {
      const parsedValue = parseInt(originalValue);

      if (isNaN(parsedValue)) {
        throw new Yup.ValidationError("Invalid hour format", originalValue);
      }
      return parsedValue;
    }),
  price: Yup.number()
    .required("This field is required")
    .transform((value, originalValue) => {
      const parsedValue = parseFloat(originalValue);

      if (isNaN(parsedValue)) {
        throw new Yup.ValidationError("Invalid price format", originalValue);
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
  } = useForm<any, any, AppointmentFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      location: "",
      to_do_list: [],
      hour: 0,
    },
  });

  const handleLocChange = (event: SelectChangeEvent) => {
    setValue("location", event.target.value);
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
    setValue("to_do_list", jobs);
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
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  return (
    <Create>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <div className="ml-3 w-7/12">
          <div className="flex justify-between">
            <Typography variant="subtitle1" alignSelf="center" className="mr-3">
              Location
            </Typography>
            <FormControl sx={{ m: 1, width: 450 }}>
              <Select
                className="w-2/3"
                value={watch("location")}
                onChange={handleLocChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-between">
            <Typography variant="subtitle1" alignSelf="center" className="mr-3">
              To Do List
            </Typography>
            <FormControl sx={{ m: 1, width: 450 }}>
              <Select
                className="w-2/3"
                multiple
                value={watch("to_do_list")}
                onChange={handleJobsChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                placeholder="jobs"
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={watch("to_do_list").indexOf(name) > -1}
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="flex justify-end">
          <div className=" w-fit border-2 rounded-md bg-[#283DA0]">
            <Typography className="p-2" color={"white"}>
              Estimated time: {watch("hour")} hours
            </Typography>
          </div>
        </div>

        <div className="ml-3 py-4 w-full">
          <Typography variant="subtitle1" className="mr-3">
            Note (phone number, special request, etc.)
          </Typography>
          <TextField className="w-full pr-3" rows="3" multiline />
        </div>
      </Box>
    </Create>
  );
};
