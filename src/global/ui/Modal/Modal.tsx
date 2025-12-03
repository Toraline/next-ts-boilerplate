import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
export const Modal = ({ open, onClose, children }: ModalProps) => {
  return (
    <>
      <div className={`${open ? "visible " : "invisible"}`} onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
    </>
  );
};
