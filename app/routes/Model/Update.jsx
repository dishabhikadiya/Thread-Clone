import {
  Modal,
  TextField,
  LegacyStack,
  RadioButton,
  Button,
} from "@shopify/polaris";
const Update = ({
  open,
  onClose,
  title,
  updateTodo,
  handleChangeUpdateTodo,
  value1,
  handleChange1,
  handleChangeEdit,
  handleUpdate,
}) => {
  return (
    <div>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <TextField
            label="Todo Name"
            value={updateTodo}
            onChange={handleChangeUpdateTodo}
            autoComplete="off"
          />
          <br />
          <LegacyStack vertical>
            <RadioButton
              label="in-progress"
              checked={value1 === "in-progress"}
              id="in-progress"
              name="accounts"
              onChange={handleChange1}
            />
            <RadioButton
              label="complete"
              id="complete"
              name="accounts"
              checked={value1 === "complete"}
              onChange={handleChange1}
            />
          </LegacyStack>
          <br />
          <Button variant="primary" tone="success" onClick={handleUpdate}>
            Save
          </Button>
          &nbsp;
          <Button onClick={handleChangeEdit}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default Update;
