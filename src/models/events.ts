import { filterBy, sortByDate } from "../../src/utils/array";
import { FieldValue } from "firebase-admin/firestore";
import db from "../db";
import {
  BoEvent,
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../types";

const COLLECTION_NAME_EVENTS = `${process.env.DB_ENV}_events`;
const COLLECTION_NAME_INVITATIONS = `${process.env.DB_ENV}_invitations`;

export async function getEvents(): Promise<BoEvent[]> {
  const eventsQuery = await db
    .collection(COLLECTION_NAME_EVENTS)
    .orderBy("start_at")
    .get();
  const events = eventsQuery.docs.map((x) => x.data() as BoEvent);

  return events || [];
}

export async function getEventsCount(): Promise<number> {
  const eventsQuery = await db.collection(COLLECTION_NAME_EVENTS).get();

  return eventsQuery.size || 0;
}

export async function getEventByID(id: string): Promise<BoEvent | null> {
  const eventQuery = await db.collection(COLLECTION_NAME_EVENTS).doc(id).get();

  const eventData = eventQuery.data() as BoEvent;

  return eventData ? ({ ...eventData, id: eventQuery.id } as BoEvent) : null;
}

export async function getEventsByUserID(userID: string): Promise<BoEvent[]> {
  const userEvents = await db
    .collection(COLLECTION_NAME_EVENTS)
    .where("user_id", "==", userID)
    .where("start_at", ">=", new Date().getTime())
    .get()
    .then((querySnapshot) => {
      const events = querySnapshot.docs.map((x) => {
        const event = { ...x.data(), id: x.id } as BoEvent;
        if (event.invitations) {
          event.invitations.forEach((invitation) => {
            delete invitation.user_id;
          });
        }
        return event;
      });
      return events || [];
    });

  const userEventsInvitations = await db
    .collection(COLLECTION_NAME_INVITATIONS)
    .doc(userID)
    .get()
    .then(async (res) => {
      const userInvitationsData = res.data();
      if (userInvitationsData) {
        const event = Object.values(userInvitationsData).map(
          async (invitation: BoInvitationResponse) => {
            return await getEventByLink(invitation.link);
          }
        );
        const userData = (await Promise.all(event)) as BoEvent[];
        return userData;
      } else {
        return [];
      }
    });
  const userData = await Promise.all([userEvents, userEventsInvitations]);

  return filterBy(sortByDate(userData.flat(), "start_at"), "id").filter(
    ({ start_at }) => start_at >= new Date().getTime()
  );
}

export async function getEventByLink(link: string): Promise<BoEvent | null> {
  const eventsQuery = await db
    .collection(COLLECTION_NAME_EVENTS)
    .where("link", "==", link)
    .get();
  if (eventsQuery.docs.length === 0) {
    return null;
  }
  const event = eventsQuery.docs[0].data() as BoEvent;
  event.id = eventsQuery.docs[0].id;
  let comingGuestAmount = 0;
  let maybeComingGuestAmount = 0;
  let notComingGuestAmount = 0;
  event.invitations?.map((invitation) => {
    comingGuestAmount +=
      invitation.response === BoInvitationValidResponse.YES ? 1 : 0;
    maybeComingGuestAmount +=
      invitation.response === BoInvitationValidResponse.MAYBE ? 1 : 0;
    notComingGuestAmount +=
      invitation.response === BoInvitationValidResponse.NO ? 1 : 0;
    delete invitation.user_id;
  });

  event.comingGuestAmount = comingGuestAmount;
  event.maybeComingGuestAmount = maybeComingGuestAmount;
  event.notComingGuestAmount = notComingGuestAmount;

  return event;
}

export async function createEvent(payload: BoEvent): Promise<BoEvent> {
  const event = await db.collection(COLLECTION_NAME_EVENTS).add({
    ...payload,
    created_at: new Date().toISOString(),
    start_at: new Date(payload.start_at).getTime(),
    end_at: new Date(payload.end_at).getTime(),
  });

  const eventQuery = await event.get();

  return { ...eventQuery.data(), id: eventQuery.id } as BoEvent;
}

export async function deleteEventByID(id: string): Promise<void> {
  await db.collection(COLLECTION_NAME_EVENTS).doc(id).delete();
}

export async function createInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const eventRef = db.collection(COLLECTION_NAME_EVENTS).doc(eventID);
  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayUnion(payload),
  });

  // Check if user already have a key in the invitations table
  const userInvitationsRef = db
    .collection(COLLECTION_NAME_INVITATIONS)
    .doc(payload.user_id);

  if (userInvitationsRef) {
    await userInvitationsRef.set({ [eventID]: payload });
  } else {
    db.collection(COLLECTION_NAME_INVITATIONS)
      .doc(payload.user_id)
      .set({ [eventID]: payload });
  }

  return unionRes;
}

export async function deleteInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const eventRef = db.collection(COLLECTION_NAME_EVENTS).doc(eventID);

  if (eventRef) {
    const unionRes = await eventRef.update({
      invitations: FieldValue.arrayRemove(payload),
    });
  }

  return eventRef;
}
