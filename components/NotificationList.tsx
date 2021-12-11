import { BoNotification } from "@src/types";

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
  // create a notification with message and badge read tailwind
  return (
    <div key={props.key} className="flex items-center mb-4">
      {/* <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </div> */}
      <div className="ml-3">
        <p className="text-sm leading-5 font-medium text-gray-900">
          {props.data.message}
        </p>
        <div className="flex text-sm leading-5 text-gray-500">
          <time className="mr-1" dateTime={props.data.created_at}>
            {props.data.created_at}
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
