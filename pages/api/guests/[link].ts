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
    let user = await prisma.user.findFirst({
      where: {
        password: data.id,
      },
    });
    if (user && user.name !== data.name) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: data.name,
        },
      });
    }

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            name: data.name,
            password: data.id,
          },
        });
      } catch (e) {
        if (e.code === "P2002") {
          return res
            .status(400)
            .json({ message: "error", error: "User already exists" });
        }
        return res.status(400).json({ message: "error", error: e.message });
      }
    }
    await prisma.guest.upsert({
      where: {
        // @ts-ignore
        guestNameEvent: {
          eventId: event.id,
          userId: user.id,
        },
      },
      update: {
        name: data.name,
        response: data.response,
      },
      create: {
        name: data.name,
        response: data.response,
        eventId: event.id,
        userId: user.id,
      },
    });

    return res.status(201).json({ message: "ok" });
  }
}
