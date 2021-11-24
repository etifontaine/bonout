import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { getUserID } from "src/utils/user";

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-white-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-yellow-400 hover:text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <Link href={getUserID() ? '/home' : ''}>
                    <Image
                      alt="logo"
                      src="/images/logo.svg"
                      width="40"
                      height="40"
                      priority={true}
                    />
                  </Link>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <Link href="/home">
                      <a className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                        Mes événements
                      </a>
                    </Link>
                    <Link href="/events/create">
                      <a className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
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
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {getUserID() ? (
                <Disclosure.Button
                  as="a"
                  href="/home"
                  className="text-gray-600 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Mes événements
                </Disclosure.Button>
              ) : null}
              <Disclosure.Button
                as="a"
                href="/events/create"
                className="text-gray-600 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Créer un événement
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
