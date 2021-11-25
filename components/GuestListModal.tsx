import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserGroupIcon } from "@heroicons/react/outline";
import { BoInvitationResponse } from "src/types";

interface IModal {
  isVisible: boolean;
  setGuestListVisible: any;
  guests: BoInvitationResponse[];
}

interface guestsGroup {
  yes: string[];
  no: string[];
  maybe: string[];
}

export default function GuestListModal({
  isVisible,
  setGuestListVisible,
  guests,
}: IModal) {
  const renderGuestsList = () => {
    const guestsGroup: guestsGroup = { yes: [], no: [], maybe: [] };
    guests.map((g) => {
      return guestsGroup[g.response].push(g.name);
    });

    return (
      <>
        <h4 className="text-l leading-8 font-medium text-gray-900 text-left">
          Oui
        </h4>
        {guestsGroup.yes.map((g) => {
          return <p>{g}</p>;
        })}
        <h4 className="text-l leading-8 font-medium text-gray-900 text-left mt-5">
          Peut-être
        </h4>
        {guestsGroup.maybe.map((g) => {
          return <p>{g}</p>;
        })}
        <h4 className="text-l leading-8 font-medium text-gray-900 text-left mt-5">
          Non
        </h4>
        {guestsGroup.no.map((g) => {
          return <p>{g}</p>;
        })}
      </>
    );
  };

  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg w-60	 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserGroupIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg text-center mb-10 leading-6 font-medium text-gray-900"
                    >
                      Invités
                    </Dialog.Title>
                    <Dialog.Description className="max-h-72 filter drop-shadow-lg overflow-y-auto">
                      {renderGuestsList()}
                    </Dialog.Description>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setGuestListVisible(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
