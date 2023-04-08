import React from "react";
import type { BoEvent } from "@src/types";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function EventItem({
  event,
  ...props
}: {
  event: BoEvent;
  onClick: () => void;
}) {
  function MiniCalandar({ date }: { date: string }) {
    return (
      <div className="bg-white overflow-hidden shadow-lg w-12 h-12 border-black border-2 border-solid text-right leading-none p-2">
        <div>{format(parseISO(date), "dd")}</div>
        <div className="">{format(parseISO(date), "LLL", { locale: fr })}</div>
      </div>
    );
  }

  return (
    <div
      className="bg-secondary overflow-hidden w-full cursor-pointer"
      {...props}
    >
      <div className="flex flex-col pt-4 pb-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold">{event.title}</div>
            {event.address ? (
              <div className="text-xs">{event.address}</div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <MiniCalandar date={event.start_at} />
          </div>
        </div>
      </div>
    </div>
  );
}
