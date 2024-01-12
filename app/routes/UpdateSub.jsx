import {
  Modal,
  TextField,
  LegacyStack,
  RadioButton,
  Button,
} from "@shopify/polaris";

const UpdateSub = ({
  open,
  onClose,
  title,
  updateSub,
  handleChangeSub,
  updateSubData,
  handleStatusData,
  handlesud,
  handleOpenSub,
}) => {
  return (
    <div>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <TextField
            label="SubTodo Name"
            value={updateSub}
            onChange={handleChangeSub}
            autoComplete="off"
          />
          <br />
          <LegacyStack vertical>
            <RadioButton
              label="in-progress"
              checked={updateSubData === "in-progress"}
              id="in-progress"
              name="accounts"
              onChange={handleStatusData}
            />
            <RadioButton
              label="complete"
              id="complete"
              name="accounts"
              checked={updateSubData === "complete"}
              onChange={handleStatusData}
            />
          </LegacyStack>
          <br />
          <Button variant="primary" tone="success" onClick={handlesud}>
            Save
          </Button>
          &nbsp;
          <Button onClick={handleOpenSub}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default UpdateSub;
