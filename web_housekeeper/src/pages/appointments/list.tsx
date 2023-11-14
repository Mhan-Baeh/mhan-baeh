import React from "react";
import {
  useDataGrid,
  DataGrid,
  GridColumns,
  ShowButton,
  List,
  DeleteButton,
  Typography,
} from "@pankod/refine-mui";

import { Link } from "react-router-dom";

export const AppointmentList = () => {
  const { dataGridProps } = useDataGrid({ queryOptions: { retry: false } });

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "housekeeperName",
        headerName: "Housekeeper name",
        type: "number",
        align: "center",
        headerAlign: "center",
        renderCell: function render({ row }) {
          return row.housekeeper.name;
        },
        minWidth: 200,
        sortable: false,
        filterable: false,
      },
      {
        field: "housekeeperPhone",
        headerName: "Phone Number",
        type: "string",
        align: "center",
        headerAlign: "center",
        renderCell: function render({ row }) {
          return row.housekeeper.phone;
        },
        minWidth: 150,
        sortable: false,
        filterable: false,
      },
      {
        field: "hour",
        headerName: "Hour",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
        sortable: false,
        filterable: false,
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
        sortable: false,
        filterable: false,
      },
      {
        field: "AddressLocation",
        headerName: "Address",
        type: "string",
        align: "center",
        headerAlign: "center",
        renderCell: function render({ row }) {
          return row.address.address;
        },
        minWidth: 300,
        sortable: false,
        filterable: false,
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
        sortable: false,
        filterable: false,
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
        sortable: false,
        filterable: false,
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
        sortable: false,
        filterable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.appointment_id} />
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
      <List
        title={
          <div className="flex justify-between items-center">
            <Typography variant="h5">Appointments</Typography>
          </div>
        }
      >
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
