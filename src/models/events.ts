import db from '../db';
import { BoEvent } from "../types";


export async function getEvents(): Promise<BoEvent[]> {

  const eventsQuery = await db.collection('events').get()
  const events = eventsQuery.docs.map(x => x.data() as BoEvent)

  return events || []
}
