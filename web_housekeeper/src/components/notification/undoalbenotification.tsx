import React from "react";

type UndoableNotificationType = {
  message: string;
  cancelMutation?: () => void;
  closeToast?: () => void;
};

export const UndoableNotification: React.FC<UndoableNotificationType> = ({
  closeToast,
  cancelMutation,
  message,
}) => {
  return (
    <div>
      <p>{message}</p>
      <button
        onClick={() => {
          cancelMutation?.();
          closeToast?.();
        }}
      >
        Undo
      </button>
    </div>
  );
};
