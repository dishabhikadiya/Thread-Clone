import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { Spinner } from "@shopify/polaris";
import { Page, Frame } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import pagecss from "../demo.css";
import prisma from "../db.server";
import Model from "./Model/Model";
import SubModel from "./SubModel/SubModel";
import Delete from "./Model/Delete";
import Update from "./Model/Update";
import DeleteSub from "./SubModel/DeleteSub";
import UpdateSub from "./SubModel/UpdateSub";
import Cards from "./Component/Cards";
import Pagination from "./Component/Pagination";
export const links = () => [{ rel: "stylesheet", href: pagecss }];
export const loader = async ({ request, params }) => {
  await authenticate.admin(request);
  const skip = params ? parseInt(params.id) : 0;
  const take = 4;
  const data = await prisma.todo.findMany({
    skip: skip,
    take: take,
    select: {
      todo: true,
      status: true,
      id: true,
      todolist: true,
    },
  });
  return json({ todos: data, skip, take });
};

export const action = async ({ params, request }) => {
  const { admin } = await authenticate.admin(request);
  const body = await request.formData();
  const key = body.get("apiKey");
  const id = body.get("id");
  if (request.method === "POST") {
    if (key === "update") {
      const updateSub = await prisma.todolist.update({
        where: { id: body.get("id") },
        data: { subTodo: body.get("subTodo"), status: body.get("status") },
      });
      return json({ updateSub });
    }
    const todo = body.get("todo");
    const status = body.get("status");
    const create = await prisma.todo.create({
      data: {
        todo: todo,
        status: status,
      },
    });
    return json({ create });
  }
  if (request.method === "PUT") {
    if (key === "put") {
      const update = await prisma.todo.update({
        where: { id: id },
        data: {
          todo: body.get("todo"),
          status: body.get("status"),
        },
      });
      return json({ update });
    }
    const data = body.get("subTodo");
    const subStatus = body.get("status");
    try {
      const subtodo = await prisma.todolist.create({
        data: {
          todoId: id,
          subTodo: data,
          status: subStatus,
        },
      });
      return json({ subtodo });
    } catch (error) {
      throw error;
    }
  }
  if (request.method === "DELETE") {
    if (key === "delete") {
      const subId = body.get("id");
      const deleteSub = await prisma.todolist.delete({
        where: {
          id: subId,
        },
      });
      return deleteSub;
    }
    try {
      await prisma.todo.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  return null;
};

export default function Index() {
  const loaderdata = useLoaderData();
  const actionData = useActionData();
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  const submit = useSubmit();
  const [active, setActive] = useState(false);
  const [activeDelete, setActiveDelete] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);
  const [updateTodo, setUpdateTodo] = useState();
  const [activeModel, setActivemodel] = useState(false);
  const [deleteSub, setDeleteSub] = useState(false);
  const [value1, setValue1] = useState();
  const [status, setStatus] = useState();
  const [updateSubData, setUpdateSubData] = useState();

  const [subStatus, setSubtatus] = useState();
  const handleChange1 = useCallback((_, newValue) => setValue1(newValue), []);
  const handleStatus = useCallback((_, newValue) => setStatus(newValue), []);
  const handleStatusData = useCallback(
    (_, newValue) => setUpdateSubData(newValue),
    []
  );
  const handleSubStatus = useCallback(
    (_, newValue) => setSubtatus(newValue),
    []
  );
  const todos = loaderdata?.todos?.map((data) => data.id);
  const subId = todos?.todolist?.map((data) => data.id);
  const [id, setId] = useState(todos);
  const [subid, setSubId] = useState(subId);
  const [skip, setSkip] = useState(loaderdata?.skip || 0);
  const [take, setTake] = useState(loaderdata?.take || 4);

  const [openStates, setOpenStates] = useState(
    loaderdata.todos.map(() => false)
  );

  const [value, setValue] = useState();
  const [subTodo, setsubTodo] = useState();
  const [updateSub, setUpdateSub] = useState();
  const [openSub, setOpenSub] = useState(false);
  const handleChange = useCallback(() => {
    setActive(!active);
  }, [active]);
  const handleChangeDelete = useCallback(() => {
    setActiveDelete(!activeDelete);
  }, [activeDelete]);
  const handleChangeModel = useCallback(() => {
    setActivemodel(!activeModel);
  }, [activeModel]);
  const handleDelete = useCallback(() => {
    setDeleteSub(!deleteSub);
  }, [deleteSub]);
  const handleChangeEdit = useCallback(() => {
    setActiveEdit(!activeEdit);
  }, [activeEdit]);
  const handleOpenSub = useCallback(() => {
    setOpenSub(!openSub);
  }, [openSub]);
  const handleToggle = useCallback((index) => {
    setOpenStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  }, []);
  const handleChangevalue = useCallback((newValue) => setValue(newValue), []);
  const handleChangetodo = useCallback((newValue) => setsubTodo(newValue), []);
  const handleChangeSub = useCallback((newValue) => setUpdateSub(newValue), []);
  const handleChangeUpdateTodo = useCallback(
    (newValue) => setUpdateTodo(newValue),
    []
  );

  const handleSubmit = () => {
    submit({ todo: value, status: status }, { method: "POST" });
    setValue("");
    setStatus("");
  };
  const handlesudTodo = () => {
    submit({ subTodo: subTodo, status: subStatus, id: id }, { method: "PUT" });
    setsubTodo("");
    setSubtatus("");
  };
  const handleTodoDelete = () => {
    submit({ id: id }, { method: "DELETE" });
    setActiveDelete(false);
  };
  const handleUpdate = () => {
    submit(
      { id: id, todo: updateTodo, status: value1, apiKey: "put" },
      { method: "PUT" }
    );
  };
  const deleteSubHandle = () => {
    submit({ id: subid, apiKey: "delete" }, { method: "DELETE" });
  };
  const handlesud = () => {
    submit(
      {
        id: subid,
        subTodo: updateSub,
        status: updateSubData,
        apiKey: "update",
      },
      { method: "POST" }
    );
  };
  const handleNextPage = () => {
    const newSkip = skip + take;
    setSkip(newSkip);
    Navigate(`/app/${skip}`);
  };

  const handlePrevPage = () => {
    const newSkip = Math.max(skip - take, 0);
    setSkip(newSkip);
    Navigate(`/app/${newSkip}`);
  };

  useEffect(() => {
    if (actionData) {
      setActive(false);
      setActivemodel(false);
      setActiveEdit(false);
      setDeleteSub(false);
      setOpenSub(false);
    }
    setLoading(false);
  }, [actionData]);
  return (
    <div style={{ height: "200px" }}>
      {loading ? (
        <Spinner accessibilityLabel="Loading" size="large" color="teal" />
      ) : (
        <Page>
          <ui-title-bar title="Thread Clone">
            <button variant="primary" onClick={handleChange}>
              Generate List
            </button>
          </ui-title-bar>
          {loaderdata.todos.map((data, index) => [
            <>
              <Cards
                data={data}
                key={index}
                handleChangeDelete={handleChangeDelete}
                handleChangeEdit={handleChangeEdit}
                handleChangeModel={handleChangeModel}
                handleDelete={handleDelete}
                handleOpenSub={handleOpenSub}
                openSub={openSub}
                handleToggle={handleToggle}
                index={index}
                openStates={openStates}
                setId={setId}
                setSubId={setSubId}
                setUpdateSub={setUpdateSub}
                setUpdateSubData={setUpdateSubData}
                setUpdateTodo={setUpdateTodo}
                setValue1={setValue1}
              />
            </>,
            <br />,
          ])}
          <Pagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            skip={skip}
            take={take}
          />
        </Page>
      )}
      <Frame>
        <Model
          open={active}
          onClose={handleChange}
          title="Update Name"
          value={value}
          status={status}
          handleChange={handleChangevalue}
          handleStatus={handleStatus}
          handleSubmit={handleSubmit}
          handleChangevalue={handleChangevalue}
        />
      </Frame>
      <Frame>
        <SubModel
          open={activeModel}
          onClose={handleChangeModel}
          title="Update Name"
          handleChangeModel={handleChangeModel}
          handlesudTodo={handlesudTodo}
          handleSubStatus={handleSubStatus}
          subStatus={subStatus}
          handleChangetodo={handleChangetodo}
          subTodo={subTodo}
        />
      </Frame>
      <Frame>
        <Delete
          open={activeDelete}
          onClose={handleChangeDelete}
          title="Delete"
          handleChangeDelete={handleChangeDelete}
          handleTodoDelete={handleTodoDelete}
        />
      </Frame>
      <Frame>
        <Update
          open={activeEdit}
          onClose={handleChangeEdit}
          title="Update Name"
          handleChange1={handleChange1}
          handleChangeEdit={handleChangeEdit}
          handleChangeUpdateTodo={handleChangeUpdateTodo}
          handleUpdate={handleUpdate}
          updateTodo={updateTodo}
          value1={value1}
        />
      </Frame>
      <Frame>
        <DeleteSub
          open={deleteSub}
          onClose={handleDelete}
          title="Delete"
          deleteSubHandle={deleteSubHandle}
          handleDelete={handleDelete}
        />
      </Frame>
      <Frame>
        <UpdateSub
          open={openSub}
          onClose={handleOpenSub}
          title="Update Name"
          handleChangeSub={handleChangeSub}
          handleOpenSub={handleOpenSub}
          handleStatusData={handleStatusData}
          handlesud={handlesud}
          updateSub={updateSub}
          updateSubData={updateSubData}
        />
      </Frame>
    </div>
  );
}
