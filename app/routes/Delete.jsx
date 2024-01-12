import { Modal, Button } from "@shopify/polaris";

const Delete = ({
  open,
  onClose,
  title,
  handleTodoDelete,
  handleChangeDelete,
}) => {
  return (
    <div>
      <Modal open={open} onClose={onClose} title={title}>
        <Modal.Section>
          <p>Are you sure you want to delete this Todo ?</p>
          <br />
          <br />
          <Button variant="primary" tone="critical" onClick={handleTodoDelete}>
            Remove
          </Button>
          &nbsp;
          <Button onClick={handleChangeDelete}>Cancal</Button>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default Delete;
