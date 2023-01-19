import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { getUserID } from "src/utils/user";
import LoginModal from "./LoginModal";
import { useRouter } from "next/router";
import { BoNotification } from "@src/types";
import Modal from "./Modal";
import NotificationList from "./NotificationList";
import fetcher from "@src/utils/fetcher";

export default function Header() {
  const [user, setUser] = useState("");
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isUserIDVisible, setUserIDVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Array<BoNotification>>([]);
  const [openNotifModal, setNotifModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = getUserID();
    if (user) {
      setUser(user);
      getNotif(user);
      const intervalId = setInterval(() => getNotif(user), 60000);
      return () => clearInterval(intervalId);
    }
  }, []);

  const getNotif = (user: string) => {
    fetcher(`/api/users/${user}/notifications`, "GET").then((res) => {
      if (res.ok) {
        res.json().then((data: Array<BoNotification>) => {
          setNotifications(
            data.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          );
        });
      }
    });
  };

  const toggleUserID = (user: string) => {
    return (
      <div className="flex items-center">
        <span className="mr-1">Utilisateur:</span>
        <span>{isUserIDVisible ? user : "**********"}</span>
        <button
          onClick={() => setUserIDVisible(!isUserIDVisible)}
          aria-label="Toggle Identifiant"
        >
          {isUserIDVisible ? (
            <EyeOffIcon className="ml-2 block h-6 w-6" aria-hidden="true" />
          ) : (
            <EyeIcon className="ml-2 block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* <Modal
        isOpen={openNotifModal}
        onClose={() => setNotifModal(false)}
        content={{
          title: 't("notif.title")',
        }}
        icon={<EyeIcon className="h-6 w-6" aria-hidden="true" />}
      >
        <NotificationList
          data={notifications}
          onClick={() => setNotifModal(false)}
        />
      </Modal> */}
      <LoginModal
        isVisible={isLoginVisible}
        setLoginVisible={setLoginVisible}
      />
      <nav className="fixed flex items-center justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-secondary z-10 mb-40">
        <Link href={user.length > 0 ? "/home" : "/"}>
          <Image
            alt="logo"
            src="/images/logo.svg"
            width="40"
            height="40"
            priority={true}
          />
        </Link>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {user.length > 0 ? (
                <>
                  <div className="text-gray-600 px-3 py-2 mr-10 rounded-md font-small inline">
                    {toggleUserID(user)}
                  </div>
                  <Link className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium" href="/home">
                    Mes événements
                  </Link>
                </>
              ) : (
                <button onClick={() => setLoginVisible(true)} className="mr-6">
                  Se connecter
                </button>
              )}
              <Link legacyBehavior href="/events/create">
                <a className="py-2 px-4 text-white bg-black rounded-3xl flex items-center">
                  Créer un événement
                  <svg
                    className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
          {/* {user.length > 0 && (
            <span
              onClick={() => {
                if (user) getNotif(user);
                setNotifModal(true);
              }}
              className="text-gray-600 px-3 py-2 mr-10 rounded-md font-small inline-block relative cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-gray-700 fill-current"
                viewBox="0 0 20 20"
              >
                <path
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
              {notifications && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notifications.filter((e) => !e.isRead).length}
                </span>
              )}
            </span>
          )} */}
        </div>

        <div
          onClick={() => setShowMobileMenu(true)}
          id="showMenu"
          className="md:hidden"
        >
          <Image
            src="/images/Menu.svg"
            width="24"
            height="24"
            alt="Menu icon"
          />
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobileNav"
        className={`${showMobileMenu ? "block" : "hidden"
          } px-4 py-6 fixed top-0 left-0 h-full w-full bg-secondary z-20 animate-fade-in-down`}
      >
        <div
          onClick={() => setShowMobileMenu(false)}
          className="flex justify-end"
        >
          <Image
            src="/images/Cross.svg"
            alt="Menu icon"
            width="50"
            height="50"
            className="h-16 w-16"
          />
        </div>
        <ul className="font-montserrat flex flex-col mx-8 my-24 items-center text-xl">
          <li className="my-6">
            {/* <Link legacyBehavior href="/events/create">{t("header.create_event")}</Link> */}
          </li>
          {user.length > 0 ? (
            <>
              <li className="my-6">
                <Link href="/home">
                  Mes événements
                </Link>
              </li>
              <li className="my-6">{toggleUserID(user)}</li>
            </>
          ) : (
            <button onClick={() => setLoginVisible(true)} className="mr-6">
              {/* {t("header.login")} */}
            </button>
          )}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                {/* {t(`locale.${router.locale}`)} */}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    <Link legacyBehavior href={`${router.asPath}`} locale="en">
                      <a className="text-gray-700 block px-4 py-2 text-sm">
                        {/* {t(`locale.en`)} */}
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link legacyBehavior href={`${router.asPath}`} locale="fr">
                      <a className="text-gray-700 block px-4 py-2 text-sm">
                        {/* {t(`locale.fr`)} */}
                      </a>
                    </Link>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </ul>
      </div>
    </>
  );
}
