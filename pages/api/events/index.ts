import prisma from "@src/utils/prisma";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
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
        password: req.body.owner,
      },
    });
    if (!user) {
      return res.status(404).json({ message: `user not found.` });
    }

    const uid = new ShortUniqueId({ length: 10 });
    const eventLink = uid();

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: body.user_name,
          events: {
            create: {
              title: body.title,
              startAt: new Date(body.start_at),
              endAt: new Date(body.end_at),
              link: eventLink.toString(),
              description: body.description,
              address: body.address,
            },
          },
        },
      });
    } catch (error) {
      console.error("error", error);
      return res.status(400).json({ message: `event not created.` });
    }

    return res.status(201).json({ message: "ok" });
  } else if (req.method === "GET") {
    const { query } = req;
    const { owner } = query;
    const userId = owner as string;

    let events = await prisma.user.findFirst({
      where: {
        password: userId,
      },
      include: {
        guest: {
          include: {
            event: {
              include: {
                guests: true,
              },
            },
          },
        },
        events: {
          include: {
            guests: true,
          },
        },
      },
    });

    if (!events) {
      return res.status(200).json({ message: `events not found.` });
    }

    const guestEvents = events.guest.map((g) => {
      return g.event;
    });
    let eventsClient = { todayEvents: [], events: [] };
    const now = new Date();
    const startOfDayDate = startOfDay(now);
    const endOfDayDate = endOfDay(now);

    const allEvents = [...events.events, ...guestEvents];
    allEvents.forEach((event) => {
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
      if (isSameDay(event.startAt, startOfDayDate)) {
        eventsClient.todayEvents.push({
          title: event.title,
          start_at: event.startAt,
          end_at: event.endAt,
          link: event.link,
          description: event.description,
          address: event.address,
          guests: {
            all: event.guests.map((g) => {
              return { name: g.name };
            }),
            coming: guestComing,
            not_coming: guestNotComing,
            maybe: guestMaybe,
          },
        });
      }
      //event startAt is in the future
      else if (event.startAt > endOfDayDate) {
        eventsClient.events.push({
          title: event.title,
          start_at: event.startAt,
          end_at: event.endAt,
          link: event.link,
          description: event.description,
          address: event.address,
          guests: {
            all: event.guests.map((g) => {
              return { name: g.name };
            }),
            coming: guestComing,
            not_coming: guestNotComing,
            maybe: guestMaybe,
          },
        });
      }
    });
    // User with id exists
    return events
      ? res.status(200).json(eventsClient)
      : res.status(404).json({ message: `events not found.` });
  }
}
