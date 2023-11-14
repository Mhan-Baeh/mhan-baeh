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
import { getEndpoint } from "endpoints";
import { parseJwt } from "utils";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";
import { useShow } from "@pankod/refine-core";

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
  const handleButtonClick = async () => {
    console.log(id);
    const url = getEndpoint("address", "DELETE");
    const { data } = await axiosInstance.delete(
      `${REST_PUBLIC_URI}/${url}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_customer")}`,
        },
      }
    );

    if (data) {
      alert("ok");
    }
    window.location.reload();
  
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
interface IBaseCustomerResponse {
  results: CustomerFormDataType;
}

interface IBaseAddressResponse {
  results: CustomerAddressType[];
}

interface dataType {
  data: CustomerFormDataType;
}

export const AccountShow: React.FC = () => {
  const {
    queryResult: { data, isLoading, isError },
  } = useShow<dataType>();

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchRow, setFetchRow] = useState<boolean>(false);
  const [fetchInfo, setFetchInfo] = useState<boolean>(false);

  const [rows, setRows] = useState<CustomerAddressType[]>([]);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const [newName, setNewName] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");

  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPassword, setCustomerPassword] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const uid = parseJwt(localStorage.getItem("auth_customer") || "")["uuid"];

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

  const getInfoByCustomerId = async (
    id: string
  ): Promise<IBaseCustomerResponse> => {
    const url = getEndpoint("customer", "GET");
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

  // handle action
  const handleInputAddress = async () => {
    if (newAddress === "" || newName === "" || newSize === "") {
      alert("Please fill all input in text input!");
      return;
    } else if (!/^\d+$/.test(newSize)) {
      alert("Please enter a valid number for Size!");
      return;
    } else {
      const newInputAddress = {
        name: newName,
        address: newAddress,
        note: newNote,
        house_size: Number(newSize),
      };
      const url = getEndpoint("customerAddress", "POST");
      const { data } = await axiosInstance.post(
        `${REST_PUBLIC_URI}/${url}/${uid}/addresses`,
        newInputAddress,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_customer")}`,
          },
        }
      );
      setFetchInfo(!fetchRow);
      alert("ok");
    }
  };

  const handleUpdateProfile = async () => {
    if (
      customerEmail === "" ||
      customerPhone === "" ||
      customerPassword === "" ||
      customerName === ""
    ) {
      alert("Please fill all input in text input!");
      return;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(customerEmail)
    ) {
      alert("Incorrect Email pattern!");
      return;
    } else {
      const newInputInfo = {
        email: customerEmail,
        password: customerPassword,
        phone: customerPhone,
        name: customerName,
      };
      const url = getEndpoint("customer", "PUT");
      const { data } = await axiosInstance.put(
        `${REST_PUBLIC_URI}/${url}/${uid}`,
        newInputInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_customer")}`,
          },
        }
      );
      setFetchRow(!fetchInfo);
      alert("Edit success!");
    }
  };

  // onChange Input for editting profile
  const onChangeCustomerInfo = (name: string, value: string) => {
    if (name === "Email") {
      setCustomerEmail(value);
    } else if (name === "Password") {
      setCustomerPassword(value);
    } else if (name === "Phone") {
      setCustomerPhone(value);
    } else {
      setCustomerName(value);
    }
  };

  // set Add Row
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

  // UseEffect
  useEffect(() => {
    getAddressByCustomerId(uid).then((res) => {
      console.log(res.results);
      setRows(res.results);
    });
    getInfoByCustomerId(uid).then((res) => {
      const info = res.results;
      setCustomerEmail(info.email);
      setCustomerPassword("");
      setCustomerPhone(info.phone);
      setCustomerName(info.name);
      setLoading(false);
    });
  }, [uid, fetchRow, fetchInfo]);

  return (
    <div className="p-5 flex flex-col gap-5">
      <Show
        title={<Typography variant="h5">Edit Customer</Typography>}
        goBack=""
        headerButtons={<></>}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <TextField
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="email"
            name="email"
            onChange={(e) => onChangeCustomerInfo("Email", e.target.value)}
            value={customerEmail}
            disabled={loading ? true : false}
          />
          <TextField
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="password"
            label="password"
            name="password"
            onChange={(e) => onChangeCustomerInfo("Password", e.target.value)}
            value={customerPassword}
            inputProps={{ maxLength: 16 }}
            disabled={loading ? true : false}
          />
          <TextField
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="phone"
            name="phone"
            onChange={(e) => onChangeCustomerInfo("Phone", e.target.value)}
            value={customerPhone}
            disabled={loading ? true : false}
          />
          <TextField
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="name"
            name="name"
            onChange={(e) => onChangeCustomerInfo("Name", e.target.value)}
            value={customerName}
            disabled={loading ? true : false}
          />
          <Button variant="contained" onClick={handleUpdateProfile}>
            Edit
          </Button>
        </Box>
      </Show>
      <Show goBack="" title="Address INFO" headerButtons={<></>}>
        {isAdd ? (
          <div className="flex gap-5 justify-between">
            <Button variant="contained" color="error" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleInputAddress}
            >
              Add
            </Button>
          </div>
        ) : (
          <Button variant="contained" onClick={addRow}>
            Add Address
          </Button>
        )}
        {isAdd && (
          <div className="flex flex-col justify-center items-center gap-5 flex-wrap mt-5 pt-5">
            <TextField
              required
              type="text"
              label="Address"
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-center gap-5 w-full">
              <TextField
                required
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
                required
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
