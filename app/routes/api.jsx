import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const Data = async () => {
  const searchTerm = body.get("search");
  const data = await prisma.todo.findMany({
    where: {
      todo: {
        contains: searchTerm,
      },
    },
    select: {
      id: true,
      todo: true,
      status: true,
      todolist: true,
    },
    skip,
    take,
  });
};
