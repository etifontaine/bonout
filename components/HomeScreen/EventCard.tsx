import React from "react";
import { BoEvent, BoInvitationValidResponse } from "../../src/types";
import type { BoInvitationResponse } from "../../src/types";
import Router from "next/router";

export default function EventCard({ event, ...props }: { event: BoEvent }) {
  return (
    <div
      className="bg-white overflow-hidden shadow-lg w-full cursor-pointer"
      {...props}
      onClick={() => Router.push(`/events/details/${event.link}`)}
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold">{event.title}</div>
            {event.address ? (
              <div className="text-xs">{event.address}</div>
            ) : null}
            <div className="text-xs">
              {presenceSentences(event.invitations)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-blue-400">
              Dans {getHoursAndMinuteLeft(event.start_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getHoursAndMinuteLeft(date: string) {
  const jsDate = new Date(date);
  const now = new Date();
  const diff = jsDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  if (hours == 0) {
    return `${minutes} min`;
  }
  return `${hours}h${minutes}`;
}

function calcHowManyUsers(users: Array<BoInvitationResponse>) {
  return users.filter((user) => user.response === BoInvitationValidResponse.YES)
    .length;
}

function presenceSentences(users: Array<BoInvitationResponse>): string {
  if (!users || users.length === 0) {
    return "Personne n'a encore répondu";
  }
  const usersWhoAreComing = calcHowManyUsers(users);
  if (usersWhoAreComing === 0) {
    return "Personne n'est présent";
  }

  if (usersWhoAreComing === 1) {
    return "1 personne à prévu de venir";
  }
  if (usersWhoAreComing > 0) {
    return usersWhoAreComing + " personnes ont prévu de venir";
  }
  if (usersWhoAreComing === 0) {
    return "Personne n'est présent";
  }
  if (usersWhoAreComing === users.length) {
    return `Tout le monde est présent (${usersWhoAreComing})`;
  }
  return "";
}
