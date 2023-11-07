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

import {Link} from "react-router-dom";

export const HouseKeeperList = () => {
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
        field: "email",
        headerName: "Email",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
      },
      {
        field: "password",
        headerName: "Password",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 100,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <DeleteButton hideText recordItemId={row.housekeeper_uuid} />
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
      <List title={
        <div className="flex justify-between items-center">
          <Typography variant="h5">Appointments</Typography>
          <Link className="flex no-underline p-2 shadow-md rounded-md text-sm text-white bg-blue-700" to="/registers">Register Housekeeper</Link>
        </div>
      }
      >
        <DataGrid
          {...dataGridProps}
          getRowId={(row) => row.housekeeper_uuid}
          columns={columns}
          autoHeight
        />
      </List>
    </div>
  );
};
