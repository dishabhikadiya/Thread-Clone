import { Button, Modal } from "@shopify/polaris";
import React from "react";

const DeleteSub = ({ open, onClose, title, deleteSubHandle, handleDelete }) => {
  return (
    <div>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <p>Are you sure you want to delete this Todo ?</p>
          <br />
          <br />
          <Button variant="primary" tone="critical" onClick={deleteSubHandle}>
            Remove
          </Button>
          &nbsp;
          <Button onClick={handleDelete}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default DeleteSub;
