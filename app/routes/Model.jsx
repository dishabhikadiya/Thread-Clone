import React from "react";
import {
  Modal,
  TextField,
  LegacyStack,
  RadioButton,
  Button,
  Frame,
} from "@shopify/polaris";
const Model = ({
  open,
  onClose,
  title,
  value,
  handleChange,
  handleStatus,
  handleSubmit,
  handleChangevalue,
  status,
}) => {
  return (
    <Frame>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <TextField
            label="Todo Name"
            value={value}
            onChange={handleChangevalue}
            autoComplete="off"
          />
          <br />
          <LegacyStack vertical>
            <RadioButton
              label="in-progress"
              checked={status === "in-progress"}
              id="in-progress"
              name="accounts"
              onChange={handleStatus}
            />
            <RadioButton
              label="complete"
              id="complete"
              name="accounts"
              checked={status === "complete"}
              onChange={handleStatus}
            />
          </LegacyStack>
          <br />
          <Button variant="primary" tone="success" onClick={handleSubmit}>
            Save
          </Button>
          &nbsp;
          <Button onClick={handleChange}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </Frame>
  );
};

export default Model;
