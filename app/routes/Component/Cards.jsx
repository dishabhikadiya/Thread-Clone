import {
  Badge,
  Button,
  Card,
  Collapsible,
  Divider,
  Tooltip,
} from "@shopify/polaris";
import React from "react";
import { EditMajor } from "@shopify/polaris-icons";
import { DeleteMajor } from "@shopify/polaris-icons";
import { CircleDownMajor } from "@shopify/polaris-icons";
import { CirclePlusMajor } from "@shopify/polaris-icons";
import { CircleUpMajor } from "@shopify/polaris-icons";
const Cards = ({
  data,
  index,
  openStates,
  handleToggle,
  handleChangeEdit,
  handleDelete,
  handleChangeModel,
  handleChangeDelete,
  setValue1,
  setUpdateTodo,
  setUpdateSubData,
  setUpdateSub,
  setSubId,
  handleOpenSub,
  setId,
}) => {
  return (
    <div>
      <Card key={index}>
        <div className="content">
          <p>{data?.todo}</p>
          <Badge
            tone={
              data?.status === "in-progress"
                ? "info"
                : data?.status === "complete"
                ? "success"
                : ""
            }
          >
            {data?.status}
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
          <Divider />
          <br />
          {data.todolist.map((subData, subIndex) => (
            <React.Fragment key={subIndex}>
              <div className="content">
                <span>{subData?.subTodo}</span>
                <Badge
                  tone={
                    subData?.status === "in-progress"
                      ? "info"
                      : subData?.status === "complete"
                      ? "success"
                      : ""
                  }
                >
                  {subData?.status}
                </Badge>
              </div>
              <div className="btn">
                <Button
                  icon={EditMajor}
                  variant="monochromePlain"
                  onClick={() => {
                    handleOpenSub();
                    setSubId(subData?.id);
                    setUpdateSub(subData?.subTodo);
                    setUpdateSubData(subData?.status);
                  }}
                ></Button>
                &nbsp; &nbsp;
                <Button
                  icon={DeleteMajor}
                  variant="monochromePlain"
                  onClick={() => {
                    handleDelete();
                    setSubId(subData?.id);
                  }}
                ></Button>
              </div>
            </React.Fragment>
          ))}
        </Collapsible>
      </Card>
    </div>
  );
};

export default Cards;
