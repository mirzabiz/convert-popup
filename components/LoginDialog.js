// components/ConvertPopupDialog.js
import React from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import logo from '@/app/icon.png';
import config from '../config';
import { auth } from "@/libs/firebaseConfig";
import { useRouter } from 'next/navigation';

import { signInWithRedirect, GoogleAuthProvider,getRedirectResult } from "firebase/auth";

const LoginDialog = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleLogin = async () => {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
        } catch (error) {
          console.log(error)
        }
        
      };
  return (
    isOpen && (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-[10000] bg-black bg-opacity-60 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Panel className="px-[45px] py-[32px] bg-white rounded shadow">
            <Dialog.Title className="text-lg font-bold">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8 m-auto"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <div className="text-center mt-2 text-xl">ConvertPopup</div>
              <div className="font-normal text-sm text-center text-gray-500 mt-1">Popups that increase your conversion rate</div>
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-gray-500 text-xs">
              {/* Create an account or log in with an existing one to continue. */}
            </Dialog.Description>
            <div className="mt-2 cursor-pointer">
              <button
                onClick={handleLogin}
                className="mt-4 w-full inline-flex justify-center items-center py-2 
                px-4 border border-1 rounded-md shadow-sm text-sm 
                font-medium text-black hover:cursor-pointer hover:bg-gray-100"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google Sign-In"
                  className="mr-2 h-6 w-6 bg-white cursor-pointer"
                />
                Continue with Google
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  );
};

export default LoginDialog;
