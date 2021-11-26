import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { EyeIcon, EyeOffIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { getUserID } from "src/utils/user";
import LoginModal from "./LoginModal";

export default function Header() {
  const [user, setUser] = useState("");
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isUserIDVisible, setUserIDVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const user = getUserID();
    if (user) {
      setUser(user);
    }
  }, []);

  const toggleUserID = (user: string) => {
    return (
      <div className="flex items-center">
        <span className="mr-1">user_id:</span>
        <span>{isUserIDVisible ? user : "**********"}</span>
        <button onClick={() => setUserIDVisible(!isUserIDVisible)}>
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
                  <p className="text-gray-600 px-3 py-2 mr-10 rounded-md font-small">
                    {toggleUserID(user)}
                  </p>
                  <Link href="/home">
                    <a className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                      Mes événements
                    </a>
                  </Link>
                </>
              ) : (
                <button onClick={() => setLoginVisible(true)} className="mr-6">
                  Connexion
                </button>
              )}
              <Link href="/events/create">
                <a className="py-2 px-4 text-white bg-black rounded-3xl flex items-center">
                  <span>Créer un événement</span>
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
        className={`${
          showMobileMenu ? "block" : "hidden"
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
            <Link href="/events/create">Créer un événement</Link>
          </li>
          {user.length > 0 ? (
            <>
              <li className="my-6">
                <Link href="/home">
                  <a>Mes événements</a>
                </Link>
              </li>
              <li className="my-6">{toggleUserID(user)}</li>
            </>
          ) : (
            <button onClick={() => setLoginVisible(true)} className="mr-6">
              Connexion
            </button>
          )}
        </ul>
      </div>
    </>
  );
}
