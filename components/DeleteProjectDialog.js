import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore'; 
import { db } from '../libs/firebaseConfig';
import { useRouter } from 'next/navigation';

const DeleteProjectDialog = ({ projectId, isOpen, setIsOpen }) => {
    const router = useRouter();
    // Function to close the dialog
    const closeDialog = () => setIsOpen(false);
  
    // Function to handle the deletion of the project
    const handleDelete = async () => {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        closeDialog();
        router.push('/home')
      } catch (error) {
        alert("Failed to delete the project: " + error.message);
      }
    };
  
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeDialog}>
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
            </Transition.Child>
  
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="z-10 mx-auto max-w-md w-full bg-white p-6 rounded shadow-lg">
                <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
                <div className="mt-4">
                  <p>Are you sure you want to delete this project?</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={closeDialog}
                      className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };
export default DeleteProjectDialog;

  