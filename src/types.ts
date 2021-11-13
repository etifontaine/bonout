import admin from 'firebase-admin';

export type BoEvent = {
  id?: string;
  title: string;
  description: string;
  user_id: string;
  address: string;
  start_at: admin.firestore.Timestamp;
  end_at: admin.firestore.Timestamp;
  main_asset?: string;
  link: string;
};

export type BoDB = {
  events: BoEvent[];
};
