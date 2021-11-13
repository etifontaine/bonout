export type BoEvent = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  address: string;
  start_at: Date;
  end_at: Date;
  main_asset?: string;
  link: string;
};

export type BoDB = {
  events: BoEvent[];
};
