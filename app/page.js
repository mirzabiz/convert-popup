'use client'
import { Suspense, useEffect, useState } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { auth, db } from '@/libs/firebaseConfig';
import { getRedirectResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Script from 'next/script';

export default function Home() {


  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);


  const checkUserAccess = async (currUser) => {
    if (!currUser) {
      setHasAccess(false);
      return;
    }

    const userDocRef = doc(db, "users", currUser.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists() && docSnap.data().hasAccess) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    }
  };
  
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          window.location.assign('/home')
        }
      })
      .catch((error) => {
        console.error('Redirect login error:', error);
      });

    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        console.log('user', user);
        setUser(user);
        await checkUserAccess(user);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);



  return (
    <>
      <Suspense>
        <div className='bg-[#02ad78] text-white text-center py-2 text-xs font-bold'>
          Limited Discount: 65% off for the next 49 orders
        </div>
        <Header user={user} landing />
      </Suspense>
      <main>
        <Script src='http://localhost:3000/api/script?projectId=Td38jHghYTDRmUOjNfdi' async defer/>
        <Hero />
        {/* <Problem /> */}
        <FeaturesAccordion />
        <Pricing user={user} hasAccess={hasAccess}/>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}