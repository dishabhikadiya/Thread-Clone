import React from "react";
import {
  Modal,
  TextField,
  LegacyStack,
  RadioButton,
  Button,
  Frame,
  Form,
  Icon,
} from "@shopify/polaris";
import * as PolarisIcons from "@shopify/polaris-icons";

const Model = ({ open, onClose, title, formik }) => {
  return (
    <Frame>
      <Modal open={open} onClose={onClose} title={title}>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Section>
            <TextField
              label="Todo Name"
              name="todoName"
              value={formik?.values?.todoName}
              onChange={(value) => {
                formik.handleChange("todoName")(value);
              }}
              onBlur={formik.handleBlur}
              autoComplete="off"
              error={formik.touched.todoName && formik.errors.todoName}
            />
            <br />
            <LegacyStack vertical>
              <RadioButton
                label="in-progress"
                id="in-progress"
                name="status"
                checked={formik.values.status === "in-progress"}
                onChange={() => formik.setFieldValue("status", "in-progress")}
              />
              <RadioButton
                label="complete"
                id="complete"
                name="status"
                checked={formik.values.status === "complete"}
                onChange={() => formik.setFieldValue("status", "complete")}
              />
            </LegacyStack>
            {formik.touched.status && formik.errors.status ? (
              <div
                style={{
                  color: "var(--p-color-text-critical)",
                  marginTop: "0.25rem",
                }}
              >
                {formik.errors.status}
              </div>
            ) : null}
            <br />
            <Button variant="primary" tone="success" submit>
              Save
            </Button>
            &nbsp;
            <Button onClick={onClose}>Cancel</Button>
          </Modal.Section>
        </Form>
      </Modal>
    </Frame>
  );
};

export default Model;
