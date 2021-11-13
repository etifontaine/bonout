import { getDB } from "./db";
import { BoEvent } from "../types";

export async function getEvents(): Promise<BoEvent[]> {
  const db = await getDB();
  const events = db.events;
  return events || [];
}
