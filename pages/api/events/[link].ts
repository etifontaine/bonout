import prisma from "@src/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req;
  let { link } = query;
  link = link as string;
  if (req.method === "GET") {
    const event = await prisma.event.findFirst({
      where: {
        link,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        guests: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: `events not found.` });
    }
    const guestComing = event.guests
      .filter((g) => g.response === "yes")
      .map((g) => {
        return { name: g.name };
      });
    const guestNotComing = event.guests
      .filter((g) => g.response === "no")
      .map((g) => {
        return { name: g.name };
      });
    const guestMaybe = event.guests
      .filter((g) => g.response === "maybe")
      .map((g) => {
        return { name: g.name };
      });
    const eventClient = {
      title: event.title,
      description: event.description,
      link: event.link,
      start_at: event.startAt,
      end_at: event.endAt,
      address: event.address,
      user: {
        name: event.user.name,
      },
      guests: {
        all: event.guests.map((g) => {
          return { name: g.name };
        }),
        coming: guestComing,
        not_coming: guestNotComing,
        maybe: guestMaybe,
      },
    };

    return res.status(200).json(eventClient);
  } else if (req.method === "DELETE") {
    try {
      const event = await prisma.event.delete({
        where: {
          link,
        },
      });

      return res.status(200).json(event);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else if (req.method === "PUT") {
    const items = JSON.parse(req.body);
    await prisma.event.update({
      where: {
        link,
      },
      data: {
        title: items.name,
        startAt: new Date(items.startAt),
        endAt: new Date(items.endAt),
        address: items.address,
        description: items.description,
      },
    });

    return res.status(200).json({ message: "ok put" });
  }
}
