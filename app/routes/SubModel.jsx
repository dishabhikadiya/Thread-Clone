import {
  Modal,
  TextField,
  LegacyStack,
  RadioButton,
  Button,
} from "@shopify/polaris";

const SubModel = ({
  open,
  onClose,
  title,
  handleChangeModel,
  handlesudTodo,
  handleSubStatus,
  subStatus,
  handleChangetodo,
  subTodo,
}) => {
  return (
    <div>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <TextField
            label="SubTodo Name"
            value={subTodo}
            onChange={handleChangetodo}
            autoComplete="off"
          />
          <br />
          <LegacyStack vertical>
            <RadioButton
              label="in-progress"
              checked={subStatus === "in-progress"}
              id="in-progress"
              name="accounts"
              onChange={handleSubStatus}
            />
            <RadioButton
              label="complete"
              id="complete"
              name="accounts"
              checked={subStatus === "complete"}
              onChange={handleSubStatus}
            />
          </LegacyStack>
          <br />
          <Button variant="primary" tone="success" onClick={handlesudTodo}>
            Save
          </Button>
          &nbsp;
          <Button onClick={handleChangeModel}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default SubModel;
