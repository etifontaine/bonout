import {
  DocumentSnapshot,
  FieldValue,
  Firestore,
  Query,
} from "firebase-admin/firestore";
import admin from "../firebase/admin";
import {
  BoEvent,
  BoInvitationResponse,
  BoInvitationValidResponse,
  BoNotification,
} from "../types";
import logger from "@src/logger";

const db = admin.firestore();

const COLLECTION_NAME_EVENTS = `${process.env.DB_ENV}_events`;
const COLLECTION_NAME_INVITATIONS = `${process.env.DB_ENV}_invitations`;
const COLLECTION_NAME_NOTIFICATIONS = `${process.env.DB_ENV}_notifications`;

export async function getEventByID(id: string): Promise<BoEvent | null> {
  const eventQuery = await db.collection(COLLECTION_NAME_EVENTS).doc(id).get();

  const eventData = eventQuery.data();

  return eventData ? ({ ...eventData, id: eventQuery.id } as BoEvent) : null;
}

export async function getEventsByUserID(userID: string): Promise<BoEvent[]> {
  return await db
    .collection(COLLECTION_NAME_EVENTS)
    .where("user_id", "==", userID)
    .where("end_at", ">=", new Date().getTime())
    .get()
    .then((querySnapshot) => {
      const events = querySnapshot.docs.map((x) => {
        const event = { ...x.data(), id: x.id } as BoEvent;
        // Do not send guests user_id to the client
        if (event.invitations) {
          event.invitations.forEach((invitation) => {
            delete invitation.user_id;
          });
        }
        return event;
      });
      return events || [];
    });
}

export async function getEventsFromUserInvitations(
  userID: string
): Promise<any> {
  // Fetch events where the user is invited
  return await db
    .collection(COLLECTION_NAME_INVITATIONS)
    .where("user_id", "==", userID)
    .get()
    .then(async (querySnapshot) => {
      const events = await Promise.all(
        querySnapshot.docs.map(async (x) => {
          const invitation = (await x.data()) as BoInvitationResponse;
          return await getEventByLink(invitation.link);
        })
      );
      return events;
    });
}

export async function getEventByLink(
  link: string,
  options?: { withUserIDs: boolean }
): Promise<BoEvent | null> {
  const eventsQuery = await db
    .collection(COLLECTION_NAME_EVENTS)
    .where("link", "==", link)
    .where("end_at", ">=", new Date().getTime())
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
    if (!options?.withUserIDs) {
      delete invitation.user_id;
    }
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

export async function updateEvent(event: BoEvent): Promise<void> {
  await db
    .collection(COLLECTION_NAME_EVENTS)
    .doc(event.id)
    .update({
      title: event.title,
      description: event.description,
      address: event.address,
      user_name: event.user_name,
      start_at: new Date(event.start_at).getTime(),
      end_at: new Date(event.end_at).getTime(),
    });
}

export async function isOrganizerOf(
  userID: string,
  eventID: string
): Promise<boolean> {
  const event = await getEventByID(eventID);

  return event?.user_id === userID;
}

export async function isUserComing(
  userID: string,
  eventID: string
): Promise<string | undefined> {
  const event = await getEventByID(eventID);

  if (!event?.invitations) return undefined;

  const userInvitation = event.invitations.find(
    (invitation) => invitation.user_id === userID
  );
  return userInvitation ? userInvitation.response : undefined;
}

export async function createInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const user_id = payload.user_id ? payload.user_id : "";
  if (user_id.length === 0) {
    throw new Error("user_id is undefined");
  }
  const eventRef = db.collection(COLLECTION_NAME_EVENTS).doc(eventID);
  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayUnion(payload),
  });

  db.collection(COLLECTION_NAME_INVITATIONS)
    .doc(`${user_id}_${eventID}`)
    .set(payload);

  return unionRes;
}

export async function updateInvitationResponse(
  eventID: BoEvent["id"],
  payload: BoInvitationResponse
) {
  const user_id = payload.user_id ? payload.user_id : "";
  if (user_id.length === 0) {
    throw new Error("user_id is undefined");
  }
  const eventRef = db.collection(COLLECTION_NAME_EVENTS).doc(eventID);
  const unionRes = await eventRef.update({
    invitations: FieldValue.arrayUnion(payload),
  });

  db.collection(COLLECTION_NAME_INVITATIONS)
    .doc(`${user_id}_${eventID}`)
    .update(payload);

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

  const userID = payload.user_id;
  if (userID) {
    const invitations_query = db
      .collection(COLLECTION_NAME_INVITATIONS)
      .doc(userID);
  }

  return eventRef;
}

export async function deletePastEvents() {
  const queryEvents = db
    .collection(COLLECTION_NAME_EVENTS)
    .where("end_at", "<", new Date().getTime())
    .limit(100);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, queryEvents, resolve).catch(reject);
  });
}

export async function deleteEvent(eventID: BoEvent["id"]): Promise<void> {
  return await db
    .collection(COLLECTION_NAME_EVENTS)
    .doc(eventID)
    .get()
    .then(async (doc) => {
      logger.info(`${eventID}-event will be deleted`);
      await deleteInvitationByEventDocumentSnapshot(db, doc);
      doc.ref.delete();
    });
}

async function deleteQueryBatch(db: Firestore, query: Query, resolve: any) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }
  logger.info(`${snapshot.size} events to delete`);

  // Delete documents in a batch
  const batchEvents = db.batch();
  snapshot.docs.forEach((doc) => {
    // Delete invitations linked to the event
    deleteInvitationByEventDocumentSnapshot(db, doc);
    batchEvents.delete(doc.ref);
  });
  await batchEvents.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function deleteInvitationByEventDocumentSnapshot(
  db: Firestore,
  doc: DocumentSnapshot
) {
  // Delete invitations linked to the event
  const docInvitation = doc.data() as BoEvent;
  return db
    .collection(COLLECTION_NAME_INVITATIONS)
    .where("link", "==", docInvitation.link)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
}

export function createNotification(notif: Omit<BoNotification, "id">) {
  const notifRef = db.collection(COLLECTION_NAME_NOTIFICATIONS).doc();
  return notifRef.set(notif);
}

export async function updateNotificationIsRead(p: {
  id: string;
  user_id: string;
}) {
  const notifRef = db.collection(COLLECTION_NAME_NOTIFICATIONS).doc(p.id);
  const notif = (await notifRef.get()).data() as BoNotification;
  if (notif && notif.organizer_id === p.user_id) {
    await notifRef.update({ isRead: true });
  }
}

export async function deleteNotification(id: string) {
  const notifRef = db.collection(COLLECTION_NAME_NOTIFICATIONS).doc(id);
  await notifRef.delete();
}

export async function getUserNotifications(user_id: string) {
  const notifs = await db
    .collection(COLLECTION_NAME_NOTIFICATIONS)
    .where("organizer_id", "==", user_id)
    .get();
  return notifs.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as BoNotification)
  );
}
