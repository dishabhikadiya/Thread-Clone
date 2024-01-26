import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import * as Yup from "yup";
import { Button, Spinner, TextField } from "@shopify/polaris";
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
import { useFormik } from "formik";
export const links = () => [{ rel: "stylesheet", href: pagecss }];
export const loader = async ({ request, params }) => {
  await authenticate.admin(request);
  try {
    const data = await prisma.todo.findMany({
      select: {
        todo: true,
        status: true,
        id: true,
        todolist: true,
      },
    });

    const totalCount = await prisma.todo.count();

    return json({ todos: data, totalCount });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const action = async ({ params, request }) => {
  const { admin } = await authenticate.admin(request);
  const body = await request.formData();
  const key = body.get("apiKey");
  const id = body.get("id");
  const requestedPage = parseInt(body.get("page")) || 1;
  const requestedPageSize = parseInt(body.get("pageSize")) || 5;
  const skip = (requestedPage - 1) * requestedPageSize;
  const take = requestedPageSize;
  if (request.method === "POST") {
    if (key === "get") {
      const searchTerm = body.get("search");
      const statusFilter = body.get("status");
      const sortBy = body.get("sortBy") || "todo";
      const sortOrder = body.get("sortOrder") || "asc";
      const whereCondition = {
        AND: [
          {
            OR: [
              {
                todo: {
                  contains: searchTerm,
                },
              },
              {
                todolist: {
                  some: {
                    subTodo: {
                      contains: searchTerm,
                    },
                  },
                },
              },
            ],
          },
          statusFilter
            ? {
                status: {
                  equals: statusFilter,
                },
              }
            : {},
        ],
      };

      const data = await prisma.todo.findMany({
        where: whereCondition,
        select: {
          id: true,
          todo: true,
          status: true,
          todolist: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
      });

      return json({
        todos: data,
        searchTerm,
        statusFilter,
        page: requestedPage,
        pageSize: requestedPageSize,
      });
    }
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
  const { page } = useParams();
  const [searchTerm, setSearchTerm] = useState(loaderdata?.searchTerm || "");
  const actionData = useActionData();
  const [data, setData] = useState(loaderdata);
  const [loading, setLoading] = useState(true);
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
  const [sortField, setSortField] = useState("todo");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
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
  const [totalPages, setTotalPages] = useState(1);
  const todos = loaderdata?.todos?.map((data) => data.id);
  const subId = todos?.todolist?.map((data) => data.id);
  const [id, setId] = useState(todos);
  const [subid, setSubId] = useState(subId);
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

  const handleSubmit = (values) => {
    submit(
      { todo: values.todoName, status: values.status },
      { method: "POST" }
    );
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
      {
        id: id,
        todo: updateTodo,
        status: value1,
        apiKey: "put",
      },
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
  const YourValidationSchema = Yup.object().shape({
    todoName: Yup.string().required("Todo name is required."),
    status: Yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      id: "",
      todoName: "",
      status: "",
    },
    validationSchema: YourValidationSchema,
    onSubmit: (values) => {
      submit(
        { todo: values.todoName, status: values.status },
        { method: "POST" }
      );

      handleSubmit(values);
    },
  });
  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    handleSearch();
  };

  const getSortIcon = (field) => {
    if (field === sortField) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  const handleSearch = () => {
    submit(
      {
        search: searchTerm,
        status: statusFilter,
        apiKey: "get",
        page: currentPage,
        pageSize,
        sortBy: sortField,
        sortOrder,
      },
      { method: "POST" }
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    submit(
      { search: searchTerm, apiKey: "get", page: newPage, pageSize },
      { method: "POST" }
    );
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      handlePageChange(newPage);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(data.totalCount / pageSize);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      handlePageChange(newPage);
    }
  };
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    submit(
      { search: searchTerm, status: status, apiKey: "get" },
      { method: "POST" }
    );
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          primary={currentPage === i}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (actionData) {
      setData((prevData) => ({ ...prevData, todos: actionData.todos }));
      setActive(false);
      setActivemodel(false);
      setActiveEdit(false);
      setDeleteSub(false);
      setOpenSub(false);
    }
    setLoading(false);
  }, [actionData, searchTerm, statusFilter, page]);
  useEffect(() => {
    handleSearch();
  }, [searchTerm, sortOrder, sortField]);
  useEffect(() => {
    if (data.totalCount && pageSize) {
      const calculatedTotalPages = Math.ceil(data.totalCount / pageSize);
      setTotalPages(calculatedTotalPages);
    }
  }, [data.totalCount, pageSize]);
  return (
    <div style={{ height: "200px" }}>
      {loading ? (
        <Spinner accessibilityLabel="Loading" size="large" color="teal" />
      ) : (
        <Page>
          <ui-title-bar title="Thread Clone"></ui-title-bar>
          <div className="button-container">
            <Button variant="primary" onClick={handleChange} size="slim">
              Generate List
            </Button>
            <div className="filter-buttons">
              <Button onClick={() => handleSortChange("todo")}>
                <span>Todo</span> {getSortIcon("todo")}
              </Button>
              <Button onClick={() => handleStatusFilter("complete")}>
                Complete
              </Button>
              <Button onClick={() => handleStatusFilter("in-progress")}>
                In Progress
              </Button>
              <Button onClick={() => handleStatusFilter("")}>All</Button>
            </div>
          </div>
          <br />
          <TextField
            label="Todo Search"
            onChange={(value) => setSearchTerm(value)}
            onBlur={handleSearch}
            value={searchTerm}
            style={{ marginRight: "10px" }}
          />
          <br />
          {data?.todos?.map((data, index) => [
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
          ,
        </Page>
      )}
      <Pagination
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        currentPage={currentPage}
        totalPages={Math.ceil(data.totalCount / pageSize)}
        renderPageNumbers={renderPageNumbers}
        handlePageChange={handlePageChange}
      />

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
          formik={formik}
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
          formik={formik}
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
