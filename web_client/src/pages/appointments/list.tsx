import React from "react";
import {
  useDataGrid,
  DataGrid,
  GridColumns,
  List,
  DeleteButton,
  Typography,
} from "@pankod/refine-mui";

import { Link } from "react-router-dom";

const handleCancelAppointment = (id: string) => {
  alert("Cancel Appointment");
};

export const AppointmentList = () => {
  const { dataGridProps } = useDataGrid({ queryOptions: { retry: false } });

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "HousekeeperName",
        headerName: "Housekeeper Name",
        type: "number",
        align: "center",
        renderCell: function render({ row }) {
          return row.housekeeper.name;
        },
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "HousekeeperPhone",
        headerName: "Phone Number",
        type: "string",
        align: "center",
        renderCell: function render({ row }) {
          return row.housekeeper.phone;
        },
        headerAlign: "center",
        minWidth: 150,
      },
      {
        field: "hour",
        headerName: "Hour",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
      },
      {
        field: "address",
        headerName: "Address",
        type: "string",
        align: "center",
        renderCell: function render({ row }) {
          return row.address.address;
        },
        headerAlign: "center",
        minWidth: 300,
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
      },
      {
        field: "start_date_time",
        headerName: "Start",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        renderCell: function render({ value }) {
          const date = new Date(value);
          return date.toLocaleString();
        },
      },
      {
        field: "end_date_time",
        headerName: "End",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        renderCell: function render({ value }) {
          const date = new Date(value);
          return date.toLocaleString();
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              {row.status !== "CANCELLED" && row.status !== "DONE" && (
                <DeleteButton hideText recordItemId={row.appointment_id} />
              )}
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 100,
        sortable: false,
        filterable: false,
      },
    ],
    []
  );
  return (
    <div className="p-5">
      <List>
        <DataGrid
          {...dataGridProps}
          getRowId={(row) => row.appointment_id}
          columns={columns}
          autoHeight
        />
      </List>
    </div>
  );
};
