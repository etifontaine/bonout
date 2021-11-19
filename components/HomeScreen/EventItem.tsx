import React from "react";
import type { BoEvent } from "../../src/types";

export default function EventItem({
  event,
  ...props
}: {
  event: BoEvent;
  onClick: () => void;
}) {
  return (
    <div className="bg-white overflow-hidden w-full cursor-pointer" {...props}>
      <div className="flex flex-col p-4">
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

function MiniCalandar({ date }: { date: string }) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][month];
  return (
    <div className="bg-white overflow-hidden shadow-lg w-12 h-12 border-blue-400 border-2 border-solid text-right leading-none p-2">
      <div>{day}</div>
      <div className="text-blue-400">{monthName}</div>
    </div>
  );
}
