import React from "react";
import {
  useDataGrid,
  DataGrid,
  GridColumns,
  EditButton,
  ShowButton,
  List,
  DeleteButton,
  Typography
} from "@pankod/refine-mui";
import { DescriptionJson } from "interfaces/product";

export const ProductList = () => {
  const { dataGridProps } = useDataGrid({ queryOptions: { retry: false } });

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.product_uuid} />
              <EditButton hideText recordItemId={row.product_uuid} />
              <DeleteButton hideText recordItemId={row.product_uuid} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 140,
        sortable: false,
        filterable: false,
      },
      {
        field: "product_name_en",
        headerName: "Product Name (EN)",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "product_name_th",
        headerName: "Product Name (TH)",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "category",
        headerName: "Category",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
      },
      {
        field: "product_description",
        headerName: "Product Description",
        align: "left",
        headerAlign: "center",
        minWidth: 300,
        sortable: false,
        filterable: false,
        renderCell: function render({ value }) {
          const description = value;
          return (
            <ul>
              {description
                .slice(0, 2)
                .map((item: DescriptionJson, index: number) => {
                  let topic = item.topic;
                  let description = item.description;

                  if (index === 1) {
                    return (
                      <li key={index}>
                        <strong>{topic} :</strong> {description}......
                      </li>
                    );
                  }
                  if (item.topic.length > 10) {
                    topic = item.topic.substring(0, 10) + "...";
                  }
                  if (item.description.length > 10) {
                    description = item.description.substring(0, 10) + "...";
                  }

                  return (
                    <li key={index}>
                      <strong>{topic} :</strong> {description}
                    </li>
                  );
                })}
            </ul>
          );
        },
      },
      {
        field: "created_at",
        headerName: "Created At",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
        renderCell: function render({ value }) {
          const date = new Date(value);
          return date.toLocaleString();
        },
      },
      {
        field: "created_by",
        headerName: "Created By",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
        renderCell: function render({ value }) {
          const date = new Date(value);
          return date.toLocaleString();
        },
      },
      {
        field: "updated_by",
        headerName: "Updated By",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
    ],
    []
  );

  return (
    <List title={<Typography variant="h5">Products</Typography>}>
      <DataGrid
        {...dataGridProps}
        getRowId={(row) => row.product_uuid}
        columns={columns}
        autoHeight
      />
    </List>
  );
};
