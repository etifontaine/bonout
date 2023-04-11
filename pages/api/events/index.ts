import prisma from "@src/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import ShortUniqueId from "short-unique-id";

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const user = await prisma.user.findFirst({
      where: {
        password: body.user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: `user not found.` });
    }

    const uid = new ShortUniqueId({ length: 10 });
    const eventLink = uid();

    try {
      await prisma.event.create({
        data: {
          title: body.title,
          startAt: new Date(body.start_at),
          endAt: new Date(body.end_at),
          link: eventLink.toString(),
          description: body.description,
          address: body.address,
          userId: user.id,
        },
      });
      if (user.name !== body.user_name) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: body.user_name,
          },
        });
      }
    } catch (error) {
      console.error("error", error);
      return res.status(400).json({ message: `event not created.` });
    }

    return res.status(201).json({ message: "ok" });
  }
}
