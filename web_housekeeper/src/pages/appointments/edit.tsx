import React, { useState } from "react";
import { DataGrid, List, Typography, Button } from "@pankod/refine-mui";

export const AppointmentEdit: React.FC = () => {
  const [status, setStatus] = useState("");

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  const handleSubmit = () => {
    alert(`Status submitted: ${status}`);
  };

  return (
    <div className="p-5">
      <List
        title={
          <div className="flex justify-between items-center">
            <Typography variant="h5">Edit Appointment</Typography>
          </div>
        }
      >
        <form>
          <label>Status:</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={handleStatusChange}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </List>
    </div>
  );
};
