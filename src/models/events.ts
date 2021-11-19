import { firestore } from "firebase-admin";
const { FieldValue } = firestore;
import db from "../db";
import {
  BoEvent,
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../types";

const COLLECTION_NAME = `${process.env.DB_ENV}_events`;

export async function getEvents(): Promise<BoEvent[]> {
  const eventsQuery = await db
    .collection(COLLECTION_NAME)
    .orderBy("start_at")
    .get();
  const events = eventsQuery.docs.map((x) => x.data() as BoEvent);

  return events || [];
}

export async function getEventByID(id: string): Promise<BoEvent | null> {
  const eventQuery = await db.collection(COLLECTION_NAME).doc(id).get();

  const eventData = eventQuery.data() as BoEvent;

  return eventData ? ({ ...eventData, id: eventQuery.id } as BoEvent) : null;
}

export async function getEventsByUserID(userID: string): Promise<BoEvent[]> {
  return db
    .collection(COLLECTION_NAME)
    .where("user_id", "==", userID)
    .get()
    .then((querySnapshot) => {
      const events = querySnapshot.docs.map(
        (x) => ({ ...x.data(), id: x.id } as BoEvent)
      );
      return events || [];
    });
}

export async function getEventByLink(link: string): Promise<BoEvent | null> {
  const eventsQuery = await db
    .collection(COLLECTION_NAME)
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
  const event = await db.collection(COLLECTION_NAME).add({
    ...payload,
    created_at: new Date().toISOString(),
  });

  const eventQuery = await event.get();

  return { ...eventQuery.data(), id: eventQuery.id } as BoEvent;
}

export async function deleteEventByID(id: string): Promise<void> {
  await db.collection(COLLECTION_NAME).doc(id).delete();
}

export async function createInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const eventRef = db.collection(COLLECTION_NAME).doc(eventID);

  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayUnion(payload),
  });

  return unionRes;
}

export async function deleteInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const eventRef = db.collection(COLLECTION_NAME).doc(eventID);

  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayRemove(payload),
  });

  return unionRes;
}
