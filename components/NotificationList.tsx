import { BoNotification } from "@src/types";

export default function NotificationList(props: {
  data: Array<BoNotification>;
  onClick?: () => void;
}) {
  return (
    <div>
      {props.data.map((item) =>
        NotificationItem({ data: item, key: item.id, onClick: props.onClick })
      )}
    </div>
  );
}

export function NotificationItem(props: {
  data: BoNotification;
  key?: string;
  onClick?: () => void;
}) {
  const handleClick = () => {
   console.log("Handle click notif");
   
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
          className={`h-2 w-2 rounded-full ${props.data.isRead ? "bg-gray-500" : "bg-blue-500"
            }`}
        />
      </div>
      <div className="ml-3">
        <p className="text-sm leading-5 font-medium text-gray-900">
          {`${props.data.message.eventTitle}: ${props.data.message.responseUserName} a répondu ${props.data.message.response}`}
        </p>
      </div>
    </div>
  );
}
