import Modal from "@components/Modal";
import { CalendarIcon } from "@heroicons/react/outline";
import { BoEvent } from "@src/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ICalendar,
  OutlookCalendar,
  GoogleCalendar,
  YahooCalendar,
} from "datebook";
import type { CalendarOptions } from "datebook";

interface props {
  event: BoEvent;
  onClose: () => void;
  isOpen: boolean;
}

export default function AddCalendarModal(props: props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);
  const services = [
    { name: "Google" },
    { name: "Outlook" },
    { name: "Yahoo" },
    { name: "Apple" },
    { name: "Autre" },
  ];

  const hanldeClick = (service: string) => {
    const config: CalendarOptions = {
      title: props.event.title,
      location: props.event.address,
      description: props.event.description,
      start: new Date(props.event.start_at),
      end: new Date(props.event.end_at),
    };
    if (service === "Google") {
      renderAndOpen(new GoogleCalendar(config));
    }
    if (service === "Outlook") {
      renderAndOpen(new OutlookCalendar(config));
    }
    if (service === "Yahoo") {
      renderAndOpen(new YahooCalendar(config));
    }
    if (service === "Apple" || service === "Autre") {
      const cal = new ICalendar(config);
      setIsOpen(false);
      cal.download();
    }

    function renderAndOpen(
      cal: GoogleCalendar | OutlookCalendar | YahooCalendar
    ) {
      const url = cal.render();
      setIsOpen(false);
      window.open(url, "_blank");
    }
  };

  return (
    <Modal
      content={{
        title: "Ajouter à mon calendrier",
        description: "Choisis ton app favorite !",
      }}
      icon={<CalendarIcon className="h-20 w-20" aria-hidden="true" />}
      isOpen={isOpen}
      onClose={props.onClose}
    >
      <br />
      <ul>
        {services.map(({ name }) => (
          <li
            className="flex  mb-4 border-b border-gray-200"
            onClick={() => hanldeClick(name)}
            key={name}
          >
            <span className="h-2">
              {name !== "Autre" ? (
                <Image
                  src={`/images/icon-${name.toLowerCase()}.svg`}
                  width={20}
                  height={20}
                  alt={name}
                />
              ) : (
                <CalendarIcon className="h-5 w-5" aria-hidden="true" />
              )}{" "}
            </span>
            <span className="ml-2">{name} Calendar</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
