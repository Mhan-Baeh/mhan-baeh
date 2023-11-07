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
  const { dataGridProps } = useDataGrid({
    queryOptions: { retry: false },
    hasPagination: false });

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "housekeeper_uuid",
        headerName: "Housekeeper Uuid",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        sortable: false,
        filterable: false,
      },
      {
        field: "name",
        headerName: "Housekeeper name",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        sortable: false,
        filterable: false,
      },
      {
        field: "phone",
        headerName: "Phone Number",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 180,
        sortable: false,
        filterable: false,
      },
      {
        field: "email",
        headerName: "Email",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
        sortable: false,
        filterable: false,
      },
      {
        field: "password",
        headerName: "Password",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 180,
        sortable: false,
        filterable: false,
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
        minWidth: 150,
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
          getRowId={(row) => row.housekeeper_uuid}
          columns={columns}
          autoHeight
        />
      </List>
    </div>
  );
};
