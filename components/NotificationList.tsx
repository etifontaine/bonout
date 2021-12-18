import { BoNotification } from "@src/types";
import { useTranslation } from "next-i18next";
import Router from "next/router";

export default function NotificationList(props: {
  data: Array<BoNotification>;
}) {
  return (
    <div>
      {props.data.map((item) => NotificationItem({ data: item, key: item.id }))}
    </div>
  );
}

export function NotificationItem(props: {
  data: BoNotification;
  key?: string;
}) {
  const { t } = useTranslation("common");
  const handleClick = () => {
    fetch("/api/notifications", {
      method: "PUT",
      body: JSON.stringify({
        id: props.data.id,
        user_id: props.data.organizer_id,
      }),
    });
    Router.push(`/events/details/${props.data.link}`);
  };
  // create a notification with message and badge read tailwind
  return (
    <div
      key={props.key}
      className="flex items-center mb-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div
          className={`h-2 w-2 rounded-full ${
            props.data.isRead ? "bg-gray-500" : "bg-blue-500"
          }`}
        />
      </div>
      <div className="ml-3">
        <p className="text-sm leading-5 font-medium text-gray-900">
          {t("notif.eventResponse", {
            name: props.data.message.responseUserName,
            response: t(`notif.response.${props.data.message.response}`),
            event: props.data.message.eventTitle,
          })}
        </p>
        <div className="flex text-sm leading-5 text-gray-500">
          <time className="mr-1" dateTime={props.data.created_at}>
            {t("notif.intlDateTime", {
              val: new Date(props.data.created_at),
              formatParams: {
                val: {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                },
              },
            })}
          </time>
          <span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
