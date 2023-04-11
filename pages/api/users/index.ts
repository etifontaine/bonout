import prisma from "@src/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { query } = req;
    const { user_id } = query;
    const password = user_id as string;

    let user = await prisma.user.findFirst({
      where: {
        password,
      },
    });

    // if user does not exist, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          password,
          name: password,
        },
      });
    }

    // User with id exists
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: `user not found.` });
  }
}
