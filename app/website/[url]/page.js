"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { ChromePicker } from 'react-color';
import NotificationUI from "@/components/NotificationUI";
import DeleteProjectDialog from "@/components/DeleteProjectDialog";
import { useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/libs/firebaseConfig';
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Stripe from "stripe";
import { ClipLoader } from "react-spinners";

const ValidWebsite = () => {
  const router = useRouter();
  const params = useParams();
  const url = params.url;

  const [websiteFound, setWebsiteFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWebsiteExists = async () => {
      setIsLoading(true);
      const websiteRef = doc(db, 'websites', params.url);
      const docSnap = await getDoc(websiteRef);

      if (docSnap.exists()) {
        console.log('Website found:', docSnap.data());
        setWebsiteFound(true);
      } else {
        console.log('Website not found.');
        setWebsiteFound(false);
      }
      setIsLoading(false);
    };

    checkWebsiteExists();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <ClipLoader color="#111" size={50} />
      </div>;
  }
  return (
    <div className="flex flex-col items-center justify-center ">
      {!websiteFound ? (
        <p className="flex justify-center items-center h-screen">Website not found :(</p>
      ) :
        <>
          <div className="bg-green-100 w-full py-10 lg:py-20 flex flex-col items-center">
            <i className="fas fa-shield-alt text-green-500 text-5xl mb-4"></i>
            <h1 className="text-3xl lg:text-[50px] font-bold text-green-600">{url} is verified</h1>
            <p className="text-lg text-green-600 mt-2 lg:mt-8">You just saw real user data!</p>
          </div>
          <div className="bg-gray-50 w-full py-10 flex flex-col items-center h-screen">
            <div className="max-w-4xl w-full px-4 ">
              <div className="flex items-center mb-4 justify-center">
                <i className="fas fa-check-circle text-green-500 text-2xl mr-2"></i>
                <h2 className="text-center text-xl lg:text-2xl font-bold">This website only shows real data</h2>
              </div>
              <p className="text-gray-600 mb-8 text-center">Data is collected directly from the payment provider, making it impossible to fake</p>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
                  {/* <i className="fas fa-shield-alt text-green-500 text-2xl mb-2"></i> */}
                  <h3 className="text-lg font-semibold">Step 1</h3>
                  <p className="text-gray-600 mt-2">Users connect their payment provider to the website</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
                  {/* <i className="fas fa-shield-alt text-green-500 text-2xl mb-2"></i> */}
                  <h3 className="text-lg font-semibold">Step 2</h3>
                  <p className="text-gray-600 mt-2">We pull data directly from payment providers</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
                  {/* <i className="fas fa-shield-alt text-green-500 text-2xl mb-2"></i> */}
                  <h3 className="text-lg font-semibold">Step 3</h3>
                  <p className="text-gray-600 mt-2">We display the data on the website</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8 text-center">We at <span className="font-semibold">convertpopup.co</span> prioritizes trust.</p>
              <div className="flex justify-center">
                <button onClick={() => router.push('/')}
                className="bg-[#02ad78] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#02ad77df] transition duration-300">
                  <i className="fas fa-arrow-right mr-2"></i> Get ConvertPopup too
                </button>
              </div>
              <div className="mt-8 text-gray-500 text-center">
                <p>Powered by<img className="inline-block" src="/stripe_long.webp" width={55} height={25} alt="Stripe" /></p>
              </div>
            </div>
          </div>
        </>}
    </div>
  )
}
export default ValidWebsite;
