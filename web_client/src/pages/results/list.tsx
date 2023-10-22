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

export const ResultList = () => {
  const { dataGridProps } = useDataGrid({ queryOptions: { retry: false } });

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.result_uuid} />
              <DeleteButton hideText recordItemId={row.result_uuid} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 100,
        sortable: false,
        filterable: false,
      },
      {
        field: "title",
        headerName: "Title",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "product_names",
        headerName: "Products Name",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
        renderCell: function render({ row }) {
          let product_names = row?.product_names?.join(", ");
          if (product_names?.length > 20) {
            product_names = product_names?.slice(0, 20) + "...";
          }
          return (
            <Typography variant="body1" gutterBottom>
              {product_names}
            </Typography>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 180,
        renderCell: function render({ row }) {
          let audio_status = row.audio_status;
          let detection_status = row.detection_status;

          if (
            audio_status === "IN_PROGRESS" &&
            detection_status === "IN_PROGRESS"
          ) {
            return (
              <Typography variant="body1" gutterBottom>
                IN_PROGRESS
              </Typography>
            );
          } else if (audio_status === "DONE" && detection_status === "DONE") {
            return (
              <Typography variant="body1" gutterBottom>
                DONE
              </Typography>
            );
          } else if (audio_status === "ERROR" || detection_status === "ERROR") {
            return (
              <Typography variant="body1" gutterBottom>
                ERROR
              </Typography>
            );
          } else {
            return (
              <Typography variant="body1" gutterBottom>
                IN_QUEUE
              </Typography>
            );
          }
        },
      },
      {
        field: "detection_score",
        headerName: "Detection Score",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        renderCell: function render({ row }) {
          console.log(row);
          let score = 0;
          row?.detection_score.forEach(
            (element: { avg_confidence: number }) => {
              if (element?.avg_confidence) {
                score += element?.avg_confidence;
              }
            }
          );
          return (
            <Typography variant="body1" gutterBottom>
              {score.toFixed(2)}
            </Typography>
          );
        },
      },
      {
        field: "audio_score",
        headerName: "Audio Score",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        renderCell: function render({ row }) {
          console.log(row);
          let score = 0;
          row?.audio_score.forEach((element: { score: number }) => {
            if (element?.score) {
              score += element?.score;
            }
          });
          return (
            <Typography variant="body1" gutterBottom>
              {score.toFixed(2)}
            </Typography>
          );
        },
      },
      {
        field: "detection_fps",
        headerName: "Detection FPS",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
      },
      {
        field: "audio_gpt_total_token_used",
        headerName: "Audio GPT Total Token Used",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 240,
      },
      {
        field: "audio_gpt_total_cost",
        headerName: "Audio GPT Total Cost",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "detection_error_log",
        headerName: "Detection Error Log",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "audio_error_log",
        headerName: "Audio Error Log",
        type: "string",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
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
    <List title={<Typography variant="h5">Video Checkings</Typography>}>
      <DataGrid
        {...dataGridProps}
        getRowId={(row) => row.result_uuid}
        columns={columns}
        autoHeight
      />
    </List>
  );
};
