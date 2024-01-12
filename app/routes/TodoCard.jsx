import React from "react";
import { Card, Badge, Button, Collapsible, Tooltip } from "@shopify/polaris";
import {
  CircleUpMajor,
  CircleDownMajor,
  CirclePlusMajor,
  EditMajor,
  DeleteMajor,
} from "@shopify/polaris-icons";
const TodoCard = ({
  data,
  index,
  openStates,
  handleToggle,
  handleChangeEdit,
  handleDelete,
  handleChangeModel,
}) => {
  return (
    <div>
      <Card key={index}>
        <div className="content">
          <p>{data.todo}</p>
          <Badge
            tone={
              data.status === "in-progress"
                ? "info"
                : data.status === "complete"
                ? "success"
                : ""
            }
          >
            {data.status}
          </Badge>
          <Button
            icon={EditMajor}
            variant="monochromePlain"
            onClick={() => {
              handleChangeEdit();
              setId(data.id);
              setUpdateTodo(data.todo);
              setValue1(data.status);
            }}
          ></Button>
        </div>
        <div className="btn">
          <Tooltip content="Add subtodo's">
            <Button
              onClick={() => {
                handleChangeModel(), setId(data.id);
              }}
              icon={CirclePlusMajor}
              variant="monochromePlain"
            ></Button>{" "}
            &nbsp;
          </Tooltip>
          <Tooltip content="see more">
            <Button
              onClick={() => handleToggle(index)}
              ariaExpanded={openStates[index]}
              ariaControls={`basic-collapsible-${index}`}
              icon={openStates[index] ? CircleUpMajor : CircleDownMajor}
              variant="monochromePlain"
            ></Button>{" "}
            &nbsp;
          </Tooltip>
          <Button
            icon={DeleteMajor}
            variant="monochromePlain"
            onClick={() => {
              handleChangeDelete(), setId(data.id);
            }}
          ></Button>
        </div>
        <Collapsible
          open={openStates[index]}
          id={`basic-collapsible-${index}`}
          transition={{
            duration: "500ms",
            timingFunction: "ease-in-out",
          }}
          expandOnPrint
        >
          {/* <Divider /> */}
          <br />
          {data?.todolist?.map((data) => [
            <div className="content">
              <span>{data?.subTodo}</span>
              <Badge
                tone={
                  data.status === "in-progress"
                    ? "info"
                    : data.status === "complete"
                    ? "success"
                    : ""
                }
              >
                {data.status}
              </Badge>
            </div>,
            <div className="btn">
              <Button
                icon={EditMajor}
                variant="monochromePlain"
                onClick={() => {
                  handleOpenSub();
                  setSubId(data.id);
                  setUpdateSub(data.subTodo);
                  setUpdateSubData(data.status);
                }}
              ></Button>
              &nbsp; &nbsp;
              <Button
                icon={DeleteMajor}
                variant="monochromePlain"
                onClick={() => {
                  handleDelete(), setSubId(data.id);
                }}
              ></Button>
            </div>,
          ])}
        </Collapsible>
      </Card>
      <br />
    </div>
  );
};

export default TodoCard;
