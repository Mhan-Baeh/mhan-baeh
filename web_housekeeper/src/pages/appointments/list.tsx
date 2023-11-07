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
        field: "name",
        headerName: "Housekeeper name",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "phone",
        headerName: "Phone Number",
        type: "string",
        align: "center",
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
        minWidth: 150,
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
        minWidth: 150,
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
              <DeleteButton hideText recordItemId={row.appointment_id} />
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
            <Link
              className="flex no-underline p-2 shadow-md rounded-md text-sm text-white bg-blue-700"
              to="/hirings"
            >
              Create Appointment
            </Link>
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
