import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'next-i18next';
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { getUserID } from "src/utils/user";
import LoginModal from "./LoginModal";
import { useRouter } from "next/router";

export default function Header() {
  const [user, setUser] = useState("");
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isUserIDVisible, setUserIDVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const router = useRouter()

  const { t } = useTranslation('common');

  useEffect(() => {
    const user = getUserID();
    if (user) {
      setUser(user);
    }
  }, []);

  const toggleUserID = (user: string) => {
    return (
      <div className="flex items-center">
        <span className="mr-1">{t('header.user_id')}:</span>
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
      <LoginModal
        isVisible={isLoginVisible}
        setLoginVisible={setLoginVisible}
      />
      <nav className="fixed flex items-center justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-secondary z-10 mb-40">
        <Link href={user.length > 0 ? "/home" : "/"}>
          <a>
            <Image
              alt="logo"
              src="/images/logo.svg"
              width="40"
              height="40"
              priority={true}
            />
          </a>
        </Link>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {user.length > 0 ? (
                <>
                  <div className="text-gray-600 px-3 py-2 mr-10 rounded-md font-small inline">
                    {toggleUserID(user)}
                  </div>
                  <Link href="/home">
                    <a className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                      {t('header.my_events')}
                    </a>
                  </Link>
                </>
              ) : (
                <button onClick={() => setLoginVisible(true)} className="mr-6">
                  {t('header.login')}
                </button>
              )}
              <Link href="/events/create">
                <a className="py-2 px-4 text-white bg-black rounded-3xl flex items-center">
                  <span>{t('header.create_event')}</span>
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
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    {t(`locale.${router.locale}`)}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
                        <Link href={`${router.route}`} locale="en">
                          <a className="text-gray-700 block px-4 py-2 text-sm">
                            {t(`locale.en`)}
                          </a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href={`${router.route}`} locale="fr">
                          <a className="text-gray-700 block px-4 py-2 text-sm">
                            {t(`locale.fr`)}
                          </a>
                        </Link>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

            </div>
          </div>
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
          <img src="/images/Cross.svg" alt="Menu icon" className="h-16 w-16" />
        </div>
        <ul className="font-montserrat flex flex-col mx-8 my-24 items-center text-xl">
          <li className="my-6">
            <Link href="/events/create">{t('header.create_event')}</Link>
          </li>
          {user.length > 0 ? (
            <>
              <li className="my-6">
                <Link href="/home">
                  <a>{t('header.my_events')}</a>
                </Link>
              </li>
              <li className="my-6">{toggleUserID(user)}</li>
            </>
          ) : (
            <button onClick={() => setLoginVisible(true)} className="mr-6">
              {t('header.login')}
            </button>
          )}
        </ul>
      </div>
    </>
  );
}
