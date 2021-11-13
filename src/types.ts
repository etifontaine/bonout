export type BoEvent = {
  id?: string;
  title: string;
  description: string;
  user_id: string;
  address: string;
  start_at: string;
  end_at: string;
  main_asset?: string;
  link: string;
};

export type BoDB = {
  events: BoEvent[];
};
