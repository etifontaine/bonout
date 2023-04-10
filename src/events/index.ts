import prisma from "@src/utils/prisma";
import { endOfDay, isSameDay, startOfDay } from "date-fns";

export async function getUserEvents(userId) {
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
        where: {
          startAt: {
            gte: startOfDay(new Date()),
          },
        },
        include: {
          guests: true,
        },
      },
    },
  });

  if (!events) {
    return null;
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
        start_at: event.startAt.toJSON(),
        end_at: event.endAt.toJSON(),
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
        start_at: event.startAt.toJSON(),
        end_at: event.endAt.toJSON(),
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
  return eventsClient;
}

export async function getEventByLink(link) {
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
    return null;
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
    start_at: event.startAt.toJSON(),
    end_at: event.endAt.toJSON(),
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

  return eventClient;
}
