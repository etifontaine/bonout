import { Fragment, useState } from "react";
import Router from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { LockOpenIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
interface IModal {
  isVisible: boolean;
  setLoginVisible: any;
}
interface IModalForm {
  user_id: string;
}

export default function InvitationModal({
  isVisible,
  setLoginVisible,
}: IModal) {
  const [formContent, setFormContent] = useState<IModalForm>();

  const postInvitationResponse = () => {
    if (!formContent?.user_id) {
      toast.error("Vous devez renseigner un user_id");
      return;
    }

    localStorage.setItem("user_id", formContent.user_id);
    Router.push("/home");
  };

  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto"
        onClose={() => { }}
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <LockOpenIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Connexion
                    </Dialog.Title>
                    <form
                      className="bg-white pt-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        postInvitationResponse();
                      }}
                    >
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="user_id"
                        >
                          Renseignez votre user_id (pas de pseudo)
                        </label>
                        <input
                          autoFocus={true}
                          autoComplete="on"
                          value={formContent?.user_id}
                          onChange={(e) => {
                            setFormContent({ user_id: e.target.value });
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="user_id"
                          name="user_id"
                          type="text"
                          placeholder="user_id"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => postInvitationResponse()}
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setLoginVisible(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
