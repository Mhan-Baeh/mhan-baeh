import {
  Edit,
  Box,
  TextField,
  FormControl,
  MenuItem,
  Select,
  ImageList,
  ImageListItem,
  Show,
  padding,
  Button,
  Input,
} from "@pankod/refine-mui";
import { useForm } from "@pankod/refine-react-hook-form";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@pankod/refine-mui";

import { useEffect, useMemo, useState } from "react";
import { CustomerFormDataType } from "interfaces/customer";
import FormItem from "components/FormItem";

const schema = Yup.object({
  customer_id: Yup.string().nullable(),
  email: Yup.string().required("This field is required"),
  password: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
});

const RowShow = (
  id: string,
  address: string,
  name: string,
  note: string,
  size: string
) => {
  const handleButtonClick = () => {
    console.log(id);
  };

  return (
    <div
      className="flex flex-row justify-center items-center gap-2"
      style={{ color: "#142880" }}
    >
      <div className="flex w-4/12 justify-center break-all">{address}</div>
      <div className="flex w-2/12 justify-center break-all">{name}</div>
      <div className="flex w-2/12 justify-center break-all">
        {note !== "" ? note : "-"}
      </div>
      <div className="flex w-2/12 justify-center break-all">{size}</div>
      <div className="flex w-2/12 justify-center">
        <Button variant="contained" color="error" onClick={handleButtonClick}>
          delete
        </Button>
      </div>
    </div>
  );
};

interface CustomerAddressType {
  address_id: string;
  customer_id: string;
  name: string;
  address: string;
  note: string;
  house_size: string;
}

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
  const [rows, setRows] = useState<CustomerAddressType[]>([]);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");

  const saveButtonPropsHandler = () => {
    if (formLoading || loading) {
      return {
        ...saveButtonProps,
        disabled: true,
      };
    }
    return saveButtonProps;
  };

  const addRow = () => {
    setIsAdd(true);
    setNewAddress("");
    setNewName("");
    setNewNote("");
    setNewSize("");
  };

  const close = () => {
    setIsAdd(false);
  };

  const checkInput = () => {
    console.log(newAddress, newName, newNote, newSize);
  };

  useEffect(() => {
    const example: CustomerAddressType[] = [
      {
        address_id: "xxxxxx1",
        customer_id: "xxxxx1",
        address: "xxxx1",
        name: "xxxx1",
        note: "xxxx1",
        house_size: "xxxx1",
      },
      {
        address_id: "xxxxxx2",
        customer_id: "xxxxx2",
        address: "xxxx2",
        name: "xxxx2",
        note: "xxxx2",
        house_size: "xxxx2",
      },
    ];
    setRows(example);
  }, []);

  return (
    <div className="p-5 flex flex-col gap-5">
      <Edit
        goBack=""
        headerButtons={<></>}
        saveButtonProps={saveButtonPropsHandler()}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
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
            inputProps={{ maxLength: 16 }}
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
      <Show goBack="" title="Address INFO" headerButtons={<></>}>
        {isAdd ? (
          <div className="flex gap-5 justify-between">
            <Button variant="contained" color="error" onClick={close}>
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={checkInput}>
              Add
            </Button>
          </div>
        ) : (
          <Button variant="contained" onClick={addRow}>
            Add Row
          </Button>
        )}
        {isAdd && (
          <div className="flex flex-col justify-center items-center gap-5 flex-wrap mt-5 pt-5">
            <TextField
              type="text"
              label="Address"
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-center gap-5 w-full">
              <TextField
                type="text"
                label="Name"
                onChange={(e) => setNewName(e.target.value)}
                className="w-1/3"
              />
              <TextField
                type="text"
                label="Note"
                onChange={(e) => setNewNote(e.target.value)}
                className="w-1/3"
              />
              <TextField
                type="text"
                label="House Size"
                onChange={(e) => setNewSize(e.target.value)}
                className="w-1/3"
              />
            </div>
          </div>
        )}
        <div
          className="rounded-lg shadow-lg pb-5 mt-5"
          style={{ backgroundColor: "rgb(217, 238, 255)" }}
        >
          <div
            className="flex flex-row justify-center items-center gap-2 rounded-t-lg mb-5 py-3"
            style={{ color: "white", backgroundColor: "#142880" }}
          >
            <div className="flex text-2xl w-4/12 justify-center">Address</div>
            <div className="flex text-2xl w-2/12 justify-center">Name</div>
            <div className="flex text-2xl w-2/12 justify-center">Note</div>
            <div className="flex text-2xl w-2/12 justify-center">HouseSize</div>
            <div className="flex text-2xl w-2/12 justify-center"></div>
          </div>
          <div className="flex flex-col gap-5">
            {rows.map((row) =>
              RowShow(
                row.address_id,
                row.address,
                row.name,
                row.note,
                row.house_size
              )
            )}
          </div>
        </div>
      </Show>
    </div>
  );
};
