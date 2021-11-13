import { getDB, writeDB } from "./db";
import { BoDB, BoEvent } from "../types";
import { v4 as uuid } from "uuid";

export async function getEvents(): Promise<BoEvent[]> {
  const db = await getDB();
  const events = db.events;
  return events || [];
}

export async function getEvent(
  id: string
): Promise<BoEvent | null> {
  const db = await getDB();
  const events = db.events;
  if (events.length === 0) return null;
  return events.find(event => event.id === id) || null;
}

export async function createEvent(payload: BoEvent) {
  const DB = await getDB();
  const payloadWithId = { ...payload, id: uuid() };
  const newDB: BoDB = {
    ...DB,
    events: [...DB.events, payloadWithId],
  };
  await writeDB(newDB);
}
