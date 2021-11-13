import db from '../db';
import { BoEvent } from "../types";

const COLLECTION_NAME = 'events';

export async function getEvents(): Promise<BoEvent[]> {

  const eventsQuery = await db.collection(COLLECTION_NAME).orderBy('start_at').get()
  const events = eventsQuery.docs.map(x => x.data() as BoEvent)

  return events || []
}

export async function getEventByID(
  id: string
): Promise<BoEvent | null> {

  const eventQuery = await db.collection(COLLECTION_NAME).doc(id).get()

  return eventQuery.data() as BoEvent
}
export async function getEventByLink(
  link: string
): Promise<BoEvent | null> {

  const eventsQuery = await db.collection(COLLECTION_NAME).where('link', '==', link).get()
  const event = eventsQuery.docs.map(x => x.data() as BoEvent)

  return event[0]
}

export async function createEvent(payload: BoEvent): Promise<BoEvent> {
  const event = await db.collection(COLLECTION_NAME).add({
    ...payload,
    created_at: new Date().toISOString(),
  });

  const eventQuery = await event.get()

  return eventQuery.data() as BoEvent
}
