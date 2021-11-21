import { firestore } from "firebase-admin";
import { sortByDate } from "src/utils/array";
const { FieldValue } = firestore;
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
    .get()
    .then((querySnapshot) => {
      const events = querySnapshot.docs.map(
        (x) => ({ ...x.data(), id: x.id } as BoEvent)
      );
      return events || [];
    });

  const userEventsInvitations = await db
    .collection(COLLECTION_NAME_INVITATIONS)
    .doc(userID)
    .get()
    .then(async (res) => {
      const userInvitationsData = res.data();
      if (userInvitationsData?.invitations) {
        const event = await userInvitationsData.invitations.map(
          async (invitation: BoInvitationResponse) => {
            return await getEventByID(invitation.eventID);
          }
        );
        const userData = (await Promise.all(event)) as BoEvent[];
        return userData;
      } else {
        return [];
      }
    });

  const userData = await Promise.all([userEvents, userEventsInvitations]);

  return sortByDate(userData.flat(), "start_at");
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
  event.invitations?.map((invitation) => {
    comingGuestAmount +=
      invitation.response === BoInvitationValidResponse.YES ? 1 : 0;
    maybeComingGuestAmount +=
      invitation.response === BoInvitationValidResponse.MAYBE ? 1 : 0;
  });

  event.comingGuestAmount = comingGuestAmount;
  event.maybeComingGuestAmount = maybeComingGuestAmount;

  return event;
}

export async function createEvent(payload: BoEvent): Promise<BoEvent> {
  const event = await db.collection(COLLECTION_NAME_EVENTS).add({
    ...payload,
    created_at: new Date().toISOString(),
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

  if ((await userInvitationsRef.get()).exists) {
    await userInvitationsRef.update({
      invitations: FieldValue.arrayUnion({ ...payload, eventID }),
    });
  } else {
    await db
      .collection(COLLECTION_NAME_INVITATIONS)
      .doc(payload.user_id)
      .set({
        invitations: FieldValue.arrayUnion({ ...payload, eventID }),
      });
  }

  return unionRes;
}

export async function deleteInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const eventRef = db.collection(COLLECTION_NAME_EVENTS).doc(eventID);

  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayRemove(payload),
  });

  return unionRes;
}
