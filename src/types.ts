export type BoEvent = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  address: string;
  start_at: string;
  end_at: string;
  main_asset?: string;
  link: string;
  comingGuestAmount?: number;
  maybeComingGuestAmount?: number;
  notComingGuestAmount?: number;
  invitations: BoInvitationResponse[];
};

export type BoDB = {
  events: BoEvent[];
};

export enum BoInvitationValidResponse {
  YES = "yes",
  NO = "no",
  MAYBE = "maybe",
}

export type BoInvitationResponse = {
  name: string;
  link: string;
  eventID: string;
  user_id: string;
  response: BoInvitationValidResponse;
  created_at?: string;
};
