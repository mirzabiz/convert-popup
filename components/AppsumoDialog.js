import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { db } from '../libs/firebaseConfig'
import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
const AppsumoDialog = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');

  const [codes, setCodes] = useState([]);

  useEffect(() => {
    // Fetch the codes from the CSV file in the public folder
    const fetchCodes = async () => {
      const response = await fetch('/appsumo_codes.csv');
      const text = await response.text();
      const data = text.split('\n').map(code => code.trim());

      console.log('codes', data)
      setCodes(data);
    };
    fetchCodes();
  }, []);

  const handleRedeem = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("No user is signed in");
      return;
    }
    const trimmedCode = code.trim();

    if (trimmedCode === "") {
      toast.error("Code cannot be empty");
      return;
    }

    if (!codes.includes(code)) {
      toast.error("Invalid code");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        email: user.email,
        createdAt: serverTimestamp(),
        hasAccess: true,
        appsumoUser: true,
        planName: "Appsumo Lifetime Deal",
        price: 37
      }, { merge: true });

      toast.success("Code redeemed successfully");

      window.location.assign('/home');
    } catch (error) {
      console.error("Error redeeming code: ", error);
      toast.error("Error redeeming code");
    }
  };

  return (
    isOpen && (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-[10000] bg-black bg-opacity-60 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Panel className="px-6 py-4 bg-white rounded shadow">
            <Dialog.Title className="text-lg font-bold text-center">
              Redeem your Appsumo Code
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-500 text-center">
              Please enter your Appsumo code to redeem it.
            </Dialog.Description>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter your Appsumo code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleRedeem}
                className="w-full py-2 bg-[#02ad78] text-white rounded-md hover:bg-[#029a6b]"
              >
                Redeem Code
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  );
};

export default AppsumoDialog;
