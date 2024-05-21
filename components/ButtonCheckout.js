"use client";

import { useState } from "react";
import apiClient from "@/libs/api";
import config from "@/config";
import LoginDialog from "./LoginDialog";


// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card. You can change that in the API route
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment


const ButtonCheckout = ({ priceId, mode = "subscription", user, hasAccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handlePayment = async () => {
    if (user) {
      if (hasAccess) {
        window.location.assign('/home');
      } else {
        setIsLoading(true);

        try {
          const res = await apiClient.post("/stripe/create-checkout", {
            priceId,
            mode,
            couponId: 'EWX0vwDF',
            uid: user.uid,
            successUrl: window.location.href,
            cancelUrl: window.location.href,
          });

          window.location.href = res.url;
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setIsDialogOpen(true);
    }
  };


  return (
    <>
      <button
        className="btn btn-primary btn-block group text-slate-800 text-[16px]"
        onClick={() => handlePayment()}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <svg data-v-e8d572f6="" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="icon mr-1" width="1.3em" height="1.3em" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8z" clipRule="evenodd"></path>
          </svg>
        )}
        Get {config?.appName}
      </button>
      <LoginDialog isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default ButtonCheckout;
