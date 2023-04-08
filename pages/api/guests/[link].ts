import prisma from "@src/utils/prisma";
import { es } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req;
  let { link } = query;
  link = link as string;
  if (req.method === "POST") {
    const data = JSON.parse(req.body);

    const event = await prisma.event.findFirst({
      where: {
        link,
      },
    });
    let user;
    try {
      user = await prisma.user.upsert({
        where: {
          name: data.name,
        },
        update: {},
        create: {
          name: data.name,
          password: data.id,
        },
      });
    } catch (e) {
      console.log(e);
      if (e.code === "P2002") {
        return res
          .status(400)
          .json({ message: "error", error: "User already exists" });
      }
      return res.status(400).json({ message: "error", error: e.message });
    }
    console.log(user);
    await prisma.guest.create({
      data: {
        name: data.name,
        response: data.response,
        eventId: event.id,
        userId: user.id,
      },
    });

    return res.status(201).json({ message: "ok" });
  } else if (req.method === "PUT") {
    const data = JSON.parse(req.body);
    await prisma.guest.update({
      where: {
        name: data.name,
      },
      data: {
        response: data.response,
      },
    });

    return res.status(200).json({ message: "ok" });
  }
}
